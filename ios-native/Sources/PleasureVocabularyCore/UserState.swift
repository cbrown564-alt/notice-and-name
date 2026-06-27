import Foundation

public enum ConceptStatus: String, Codable, CaseIterable, Equatable, Sendable {
    case unexplored
    case explored
    case resonates
    case curious
    case tried
    case notForMe

    public var displayName: String {
        switch self {
        case .unexplored:
            return "Unexplored"
        case .explored:
            return "Explored"
        case .resonates:
            return "Resonates"
        case .curious:
            return "Curious"
        case .tried:
            return "Tried"
        case .notForMe:
            return "Not for me"
        }
    }
}

public struct UserConceptState: Codable, Equatable, Identifiable, Sendable {
    public var id: String { conceptId }

    public let conceptId: String
    public var status: ConceptStatus
    public var updatedAt: Date
    public var lastOpenedAt: Date?

    public init(
        conceptId: String,
        status: ConceptStatus = .unexplored,
        updatedAt: Date = Date(),
        lastOpenedAt: Date? = nil
    ) {
        self.conceptId = conceptId
        self.status = status
        self.updatedAt = updatedAt
        self.lastOpenedAt = lastOpenedAt
    }
}

public struct FieldNote: Codable, Equatable, Identifiable, Sendable {
    public let id: String
    public var conceptId: String?
    public var pathwayId: String?
    public var body: String
    public var createdAt: Date
    public var updatedAt: Date

    public init(
        id: String = UUID().uuidString,
        conceptId: String? = nil,
        pathwayId: String? = nil,
        body: String,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.conceptId = conceptId
        self.pathwayId = pathwayId
        self.body = body
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

public struct SavedPhrase: Codable, Equatable, Identifiable, Sendable {
    public let id: String
    public let conceptId: String
    public let templateId: String?
    public var body: String
    public var tone: PhraseTone
    public let createdAt: Date

    public init(
        id: String = UUID().uuidString,
        conceptId: String,
        templateId: String? = nil,
        body: String,
        tone: PhraseTone,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.conceptId = conceptId
        self.templateId = templateId
        self.body = body
        self.tone = tone
        self.createdAt = createdAt
    }
}

public struct PathwayProgress: Codable, Equatable, Identifiable, Sendable {
    public var id: String { pathwayId }

    public let pathwayId: String
    public var currentConceptId: String?
    public var completedConceptIds: [String]
    public var updatedAt: Date

    public init(
        pathwayId: String,
        currentConceptId: String? = nil,
        completedConceptIds: [String] = [],
        updatedAt: Date = Date()
    ) {
        self.pathwayId = pathwayId
        self.currentConceptId = currentConceptId
        self.completedConceptIds = completedConceptIds
        self.updatedAt = updatedAt
    }
}

public struct AppSettings: Codable, Equatable, Sendable {
    public var completedOnboarding: Bool
    public var privacyPledgeAcceptedAt: Date?
    public var appLockEnabled: Bool
    public var notificationPrivacyEnabled: Bool
    public var reduceSensitivePreviews: Bool

    public init(
        completedOnboarding: Bool = false,
        privacyPledgeAcceptedAt: Date? = nil,
        appLockEnabled: Bool = false,
        notificationPrivacyEnabled: Bool = true,
        reduceSensitivePreviews: Bool = true
    ) {
        self.completedOnboarding = completedOnboarding
        self.privacyPledgeAcceptedAt = privacyPledgeAcceptedAt
        self.appLockEnabled = appLockEnabled
        self.notificationPrivacyEnabled = notificationPrivacyEnabled
        self.reduceSensitivePreviews = reduceSensitivePreviews
    }
}

public struct InstalledContentVersion: Codable, Equatable, Identifiable, Sendable {
    public var id: String { bundleId }

    public let bundleId: String
    public let contentVersion: String
    public let installedAt: Date

    public init(bundleId: String, contentVersion: String, installedAt: Date = Date()) {
        self.bundleId = bundleId
        self.contentVersion = contentVersion
        self.installedAt = installedAt
    }
}

public struct UserDataExport: Codable, Equatable, Sendable {
    public let exportedAt: Date
    public let settings: AppSettings
    public let conceptStates: [UserConceptState]
    public let fieldNotes: [FieldNote]
    public let savedPhrases: [SavedPhrase]
    public let pathwayProgress: [PathwayProgress]
    public let contentVersions: [InstalledContentVersion]

    public init(
        exportedAt: Date = Date(),
        settings: AppSettings,
        conceptStates: [UserConceptState],
        fieldNotes: [FieldNote],
        savedPhrases: [SavedPhrase],
        pathwayProgress: [PathwayProgress],
        contentVersions: [InstalledContentVersion]
    ) {
        self.exportedAt = exportedAt
        self.settings = settings
        self.conceptStates = conceptStates
        self.fieldNotes = fieldNotes
        self.savedPhrases = savedPhrases
        self.pathwayProgress = pathwayProgress
        self.contentVersions = contentVersions
    }
}

public struct StoreSchemaInfo: Codable, Equatable, Sendable {
    public let schemaVersion: Int
    public let lastMigrationId: String
    public let migratedAt: Date

    public init(schemaVersion: Int, lastMigrationId: String, migratedAt: Date = Date()) {
        self.schemaVersion = schemaVersion
        self.lastMigrationId = lastMigrationId
        self.migratedAt = migratedAt
    }
}
