import Foundation
import GRDB

public final class UserStore: @unchecked Sendable {
    public static let currentSchemaVersion = 2
    public static let currentMigrationId = "v2_schema_metadata"

    private let dbQueue: DatabaseQueue

    public convenience init() throws {
        try self.init(databaseQueue: DatabaseQueue())
    }

    public convenience init(path: String) throws {
        try self.init(databaseQueue: DatabaseQueue(path: path))
    }

    init(databaseQueue: DatabaseQueue) throws {
        self.dbQueue = databaseQueue
        try migrator.migrate(databaseQueue)
        try ensureDefaultSettings()
    }

    public func recordInstalledContent(bundle: ContentBundle, installedAt: Date = Date()) throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO content_version (bundleId, contentVersion, installedAt)
                    VALUES (?, ?, ?)
                    ON CONFLICT(bundleId) DO UPDATE SET
                        contentVersion = excluded.contentVersion,
                        installedAt = excluded.installedAt
                    """,
                arguments: [bundle.bundleId, bundle.contentVersion, timestampValue(installedAt)]
            )
        }
    }

    public func loadSettings() throws -> AppSettings {
        try ensureDefaultSettings()
        return try dbQueue.read { db in
            guard let row = try Row.fetchOne(db, sql: "SELECT * FROM app_settings WHERE id = 'singleton'") else {
                return AppSettings()
            }
            return appSettings(from: row)
        }
    }

    public func saveSettings(_ settings: AppSettings) throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO app_settings (
                        id, completedOnboarding, privacyPledgeAcceptedAt, appLockEnabled,
                        notificationPrivacyEnabled, reduceSensitivePreviews
                    )
                    VALUES ('singleton', ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        completedOnboarding = excluded.completedOnboarding,
                        privacyPledgeAcceptedAt = excluded.privacyPledgeAcceptedAt,
                        appLockEnabled = excluded.appLockEnabled,
                        notificationPrivacyEnabled = excluded.notificationPrivacyEnabled,
                        reduceSensitivePreviews = excluded.reduceSensitivePreviews
                    """,
                arguments: [
                    settings.completedOnboarding,
                    timestamp(settings.privacyPledgeAcceptedAt),
                    settings.appLockEnabled,
                    settings.notificationPrivacyEnabled,
                    settings.reduceSensitivePreviews
                ]
            )
        }
    }

    public func acceptPrivacyPledge(appLockEnabled: Bool, acceptedAt: Date = Date()) throws {
        var settings = try loadSettings()
        settings.completedOnboarding = true
        settings.privacyPledgeAcceptedAt = acceptedAt
        settings.appLockEnabled = appLockEnabled
        try saveSettings(settings)
    }

    public func markConceptOpened(_ conceptId: String, openedAt: Date = Date()) throws {
        let current = try conceptState(for: conceptId)
        let nextStatus: ConceptStatus = current?.status == .unexplored || current == nil
            ? .explored
            : current?.status ?? .explored
        try upsertConceptState(
            UserConceptState(
                conceptId: conceptId,
                status: nextStatus,
                updatedAt: openedAt,
                lastOpenedAt: openedAt
            )
        )
    }

    public func setConceptStatus(_ status: ConceptStatus, for conceptId: String, updatedAt: Date = Date()) throws {
        let current = try conceptState(for: conceptId)
        try upsertConceptState(
            UserConceptState(
                conceptId: conceptId,
                status: status,
                updatedAt: updatedAt,
                lastOpenedAt: current?.lastOpenedAt
            )
        )
    }

    public func conceptState(for conceptId: String) throws -> UserConceptState? {
        try dbQueue.read { db in
            guard let row = try Row.fetchOne(
                db,
                sql: "SELECT * FROM concept_state WHERE conceptId = ?",
                arguments: [conceptId]
            ) else {
                return nil
            }
            return makeConceptState(from: row)
        }
    }

    public func allConceptStates() throws -> [UserConceptState] {
        try dbQueue.read { db in
            try Row.fetchAll(db, sql: "SELECT * FROM concept_state ORDER BY updatedAt DESC")
                .map(makeConceptState(from:))
        }
    }

    public func addFieldNote(_ note: FieldNote) throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO field_note (
                        id, conceptId, pathwayId, body, createdAt, updatedAt
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                arguments: [
                    note.id,
                    note.conceptId,
                    note.pathwayId,
                    note.body,
                    timestampValue(note.createdAt),
                    timestampValue(note.updatedAt)
                ]
            )
        }
    }

    public func fieldNotes(searchTerm: String? = nil) throws -> [FieldNote] {
        let trimmed = searchTerm?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        return try dbQueue.read { db in
            if trimmed.isEmpty {
                return try Row.fetchAll(db, sql: "SELECT * FROM field_note ORDER BY updatedAt DESC")
                    .map(fieldNote(from:))
            }

            return try Row.fetchAll(
                db,
                sql: """
                    SELECT * FROM field_note
                    WHERE body LIKE ? OR conceptId LIKE ?
                    ORDER BY updatedAt DESC
                    """,
                arguments: ["%\(trimmed)%", "%\(trimmed)%"]
            )
            .map(fieldNote(from:))
        }
    }

    public func savePhrase(_ phrase: SavedPhrase) throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO saved_phrase (
                        id, conceptId, templateId, body, tone, createdAt
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                arguments: [
                    phrase.id,
                    phrase.conceptId,
                    phrase.templateId,
                    phrase.body,
                    phrase.tone.rawValue,
                    timestampValue(phrase.createdAt)
                ]
            )
        }
    }

    public func savedPhrases(conceptId: String? = nil) throws -> [SavedPhrase] {
        try dbQueue.read { db in
            if let conceptId {
                return try Row.fetchAll(
                    db,
                    sql: "SELECT * FROM saved_phrase WHERE conceptId = ? ORDER BY createdAt DESC",
                    arguments: [conceptId]
                )
                .map(savedPhrase(from:))
            }

            return try Row.fetchAll(db, sql: "SELECT * FROM saved_phrase ORDER BY createdAt DESC")
                .map(savedPhrase(from:))
        }
    }

    public func updatePathwayProgress(_ progress: PathwayProgress) throws {
        let completedJSON = try encodeStringArray(progress.completedConceptIds)
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO pathway_progress (
                        pathwayId, currentConceptId, completedConceptIds, updatedAt
                    )
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(pathwayId) DO UPDATE SET
                        currentConceptId = excluded.currentConceptId,
                        completedConceptIds = excluded.completedConceptIds,
                        updatedAt = excluded.updatedAt
                    """,
                arguments: [
                    progress.pathwayId,
                    progress.currentConceptId,
                    completedJSON,
                    timestampValue(progress.updatedAt)
                ]
            )
        }
    }

    public func pathwayProgress() throws -> [PathwayProgress] {
        try dbQueue.read { db in
            try Row.fetchAll(db, sql: "SELECT * FROM pathway_progress ORDER BY updatedAt DESC")
                .map(pathwayProgress(from:))
        }
    }

    public func contentVersions() throws -> [InstalledContentVersion] {
        try dbQueue.read { db in
            try Row.fetchAll(db, sql: "SELECT * FROM content_version ORDER BY installedAt DESC")
                .map(contentVersion(from:))
        }
    }

    public func schemaInfo() throws -> StoreSchemaInfo {
        try dbQueue.read { db in
            guard let row = try Row.fetchOne(db, sql: "SELECT * FROM app_metadata WHERE key = 'schema'") else {
                return StoreSchemaInfo(
                    schemaVersion: Self.currentSchemaVersion,
                    lastMigrationId: Self.currentMigrationId,
                    migratedAt: Date(timeIntervalSince1970: 0)
                )
            }
            return makeSchemaInfo(from: row)
        }
    }

    public func exportData(exportedAt: Date = Date()) throws -> UserDataExport {
        try UserDataExport(
            exportedAt: exportedAt,
            settings: loadSettings(),
            conceptStates: allConceptStates(),
            fieldNotes: fieldNotes(),
            savedPhrases: savedPhrases(),
            pathwayProgress: pathwayProgress(),
            contentVersions: contentVersions()
        )
    }

    public func exportJSONData(exportedAt: Date = Date()) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        return try encoder.encode(exportData(exportedAt: exportedAt))
    }

    public func deleteAllData() throws {
        try dbQueue.write { db in
            try db.execute(sql: "DELETE FROM concept_state")
            try db.execute(sql: "DELETE FROM field_note")
            try db.execute(sql: "DELETE FROM saved_phrase")
            try db.execute(sql: "DELETE FROM pathway_progress")
            try db.execute(sql: "DELETE FROM content_version")
            try db.execute(sql: "DELETE FROM app_settings")
        }
        try ensureDefaultSettings()
    }

    private func upsertConceptState(_ state: UserConceptState) throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT INTO concept_state (
                        conceptId, status, updatedAt, lastOpenedAt
                    )
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(conceptId) DO UPDATE SET
                        status = excluded.status,
                        updatedAt = excluded.updatedAt,
                        lastOpenedAt = COALESCE(excluded.lastOpenedAt, concept_state.lastOpenedAt)
                    """,
                arguments: [
                    state.conceptId,
                    state.status.rawValue,
                    timestampValue(state.updatedAt),
                    timestamp(state.lastOpenedAt)
                ]
            )
        }
    }

    private func ensureDefaultSettings() throws {
        try dbQueue.write { db in
            try db.execute(
                sql: """
                    INSERT OR IGNORE INTO app_settings (
                        id, completedOnboarding, privacyPledgeAcceptedAt, appLockEnabled,
                        notificationPrivacyEnabled, reduceSensitivePreviews
                    )
                    VALUES ('singleton', 0, NULL, 0, 1, 1)
                    """
            )
        }
    }
}

private let v1UserStateMigrationId = "v1_user_state"
private let v2SchemaMetadataMigrationId = "v2_schema_metadata"

private var migrator: DatabaseMigrator {
    var migrator = DatabaseMigrator()

    migrator.registerMigration(v1UserStateMigrationId) { db in
        try db.create(table: "concept_state", ifNotExists: true) { table in
            table.column("conceptId", .text).primaryKey()
            table.column("status", .text).notNull()
            table.column("updatedAt", .double).notNull()
            table.column("lastOpenedAt", .double)
        }

        try db.create(table: "field_note", ifNotExists: true) { table in
            table.column("id", .text).primaryKey()
            table.column("conceptId", .text)
            table.column("pathwayId", .text)
            table.column("body", .text).notNull()
            table.column("createdAt", .double).notNull()
            table.column("updatedAt", .double).notNull()
        }
        try db.create(index: "field_note_concept_idx", on: "field_note", columns: ["conceptId"])

        try db.create(table: "saved_phrase", ifNotExists: true) { table in
            table.column("id", .text).primaryKey()
            table.column("conceptId", .text).notNull()
            table.column("templateId", .text)
            table.column("body", .text).notNull()
            table.column("tone", .text).notNull()
            table.column("createdAt", .double).notNull()
        }
        try db.create(index: "saved_phrase_concept_idx", on: "saved_phrase", columns: ["conceptId"])

        try db.create(table: "pathway_progress", ifNotExists: true) { table in
            table.column("pathwayId", .text).primaryKey()
            table.column("currentConceptId", .text)
            table.column("completedConceptIds", .text).notNull()
            table.column("updatedAt", .double).notNull()
        }

        try db.create(table: "app_settings", ifNotExists: true) { table in
            table.column("id", .text).primaryKey()
            table.column("completedOnboarding", .boolean).notNull()
            table.column("privacyPledgeAcceptedAt", .double)
            table.column("appLockEnabled", .boolean).notNull()
            table.column("notificationPrivacyEnabled", .boolean).notNull()
            table.column("reduceSensitivePreviews", .boolean).notNull()
        }

        try db.create(table: "content_version", ifNotExists: true) { table in
            table.column("bundleId", .text).primaryKey()
            table.column("contentVersion", .text).notNull()
            table.column("installedAt", .double).notNull()
        }
    }

    migrator.registerMigration(v2SchemaMetadataMigrationId) { db in
        try db.create(table: "app_metadata", ifNotExists: true) { table in
            table.column("key", .text).primaryKey()
            table.column("schemaVersion", .integer).notNull()
            table.column("lastMigrationId", .text).notNull()
            table.column("migratedAt", .double).notNull()
        }

        try db.execute(
            sql: """
                INSERT INTO app_metadata (key, schemaVersion, lastMigrationId, migratedAt)
                VALUES ('schema', ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    schemaVersion = excluded.schemaVersion,
                    lastMigrationId = excluded.lastMigrationId,
                    migratedAt = excluded.migratedAt
                """,
            arguments: [
                UserStore.currentSchemaVersion,
                UserStore.currentMigrationId,
                Date().timeIntervalSince1970
            ]
        )
    }

    return migrator
}

private func appSettings(from row: Row) -> AppSettings {
    AppSettings(
        completedOnboarding: row["completedOnboarding"],
        privacyPledgeAcceptedAt: date(row["privacyPledgeAcceptedAt"]),
        appLockEnabled: row["appLockEnabled"],
        notificationPrivacyEnabled: row["notificationPrivacyEnabled"],
        reduceSensitivePreviews: row["reduceSensitivePreviews"]
    )
}

private func makeConceptState(from row: Row) -> UserConceptState {
    UserConceptState(
        conceptId: row["conceptId"],
        status: ConceptStatus(rawValue: row["status"]) ?? .unexplored,
        updatedAt: date(row["updatedAt"]) ?? Date(timeIntervalSince1970: 0),
        lastOpenedAt: date(row["lastOpenedAt"])
    )
}

private func fieldNote(from row: Row) -> FieldNote {
    FieldNote(
        id: row["id"],
        conceptId: row["conceptId"],
        pathwayId: row["pathwayId"],
        body: row["body"],
        createdAt: date(row["createdAt"]) ?? Date(timeIntervalSince1970: 0),
        updatedAt: date(row["updatedAt"]) ?? Date(timeIntervalSince1970: 0)
    )
}

private func savedPhrase(from row: Row) -> SavedPhrase {
    SavedPhrase(
        id: row["id"],
        conceptId: row["conceptId"],
        templateId: row["templateId"],
        body: row["body"],
        tone: PhraseTone(rawValue: row["tone"]) ?? .soft,
        createdAt: date(row["createdAt"]) ?? Date(timeIntervalSince1970: 0)
    )
}

private func pathwayProgress(from row: Row) -> PathwayProgress {
    PathwayProgress(
        pathwayId: row["pathwayId"],
        currentConceptId: row["currentConceptId"],
        completedConceptIds: decodeStringArray(row["completedConceptIds"]),
        updatedAt: date(row["updatedAt"]) ?? Date(timeIntervalSince1970: 0)
    )
}

private func contentVersion(from row: Row) -> InstalledContentVersion {
    InstalledContentVersion(
        bundleId: row["bundleId"],
        contentVersion: row["contentVersion"],
        installedAt: date(row["installedAt"]) ?? Date(timeIntervalSince1970: 0)
    )
}

private func makeSchemaInfo(from row: Row) -> StoreSchemaInfo {
    StoreSchemaInfo(
        schemaVersion: row["schemaVersion"],
        lastMigrationId: row["lastMigrationId"],
        migratedAt: date(row["migratedAt"]) ?? Date(timeIntervalSince1970: 0)
    )
}

private func timestamp(_ date: Date?) -> Double? {
    date?.timeIntervalSince1970
}

private func timestampValue(_ date: Date) -> Double {
    date.timeIntervalSince1970
}

private func date(_ timestamp: Double?) -> Date? {
    guard let timestamp else { return nil }
    return Date(timeIntervalSince1970: timestamp)
}

private func encodeStringArray(_ values: [String]) throws -> String {
    let data = try JSONEncoder().encode(values)
    return String(decoding: data, as: UTF8.self)
}

private func decodeStringArray(_ value: String?) -> [String] {
    guard
        let value,
        let data = value.data(using: .utf8),
        let decoded = try? JSONDecoder().decode([String].self, from: data)
    else {
        return []
    }
    return decoded
}
