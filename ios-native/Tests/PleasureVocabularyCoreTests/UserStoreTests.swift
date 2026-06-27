import Foundation
import Testing
@testable import PleasureVocabularyCore

@Test func privacyPledgePersistsLocalSettings() throws {
    let store = try UserStore()
    let acceptedAt = Date(timeIntervalSince1970: 1_800)

    try store.acceptPrivacyPledge(appLockEnabled: true, acceptedAt: acceptedAt)
    let settings = try store.loadSettings()

    #expect(settings.completedOnboarding)
    #expect(settings.appLockEnabled)
    #expect(settings.notificationPrivacyEnabled)
    #expect(settings.reduceSensitivePreviews)
    #expect(settings.privacyPledgeAcceptedAt == acceptedAt)
}

@Test func conceptStateNotesAndPhrasesRoundTrip() throws {
    let store = try UserStore()
    let openedAt = Date(timeIntervalSince1970: 2_000)
    let updatedAt = Date(timeIntervalSince1970: 2_400)

    try store.markConceptOpened("responsive-desire", openedAt: openedAt)
    try store.setConceptStatus(.resonates, for: "responsive-desire", updatedAt: updatedAt)
    try store.addFieldNote(
        FieldNote(
            id: "note-1",
            conceptId: "responsive-desire",
            body: "Warmth and low pressure help desire arrive.",
            createdAt: openedAt,
            updatedAt: updatedAt
        )
    )
    try store.savePhrase(
        SavedPhrase(
            id: "phrase-1",
            conceptId: "responsive-desire",
            templateId: "responsive-desire-soft-share",
            body: "Desire often arrives after we begin.",
            tone: .soft,
            createdAt: updatedAt
        )
    )

    let loadedState = try store.conceptState(for: "responsive-desire")
    let state = try #require(loadedState)
    #expect(state.status == .resonates)
    #expect(state.lastOpenedAt == openedAt)

    let notes = try store.fieldNotes(searchTerm: "warmth")
    #expect(notes.map(\.id) == ["note-1"])

    let phrases = try store.savedPhrases(conceptId: "responsive-desire")
    #expect(phrases.map(\.id) == ["phrase-1"])
}

@Test func pathwayProgressAndContentVersionAreExported() throws {
    let store = try UserStore()
    let bundle = try ContentBundleLoader.load(from: fullBundleURL())
    let installedAt = Date(timeIntervalSince1970: 3_000)

    try store.recordInstalledContent(bundle: bundle, installedAt: installedAt)
    try store.updatePathwayProgress(
        PathwayProgress(
            pathwayId: "partner-communication",
            currentConceptId: "warmup-window",
            completedConceptIds: ["responsive-desire"],
            updatedAt: installedAt
        )
    )

    let export = try store.exportData(exportedAt: installedAt)

    #expect(export.contentVersions.first?.bundleId == "v2-full")
    #expect(export.pathwayProgress.first?.completedConceptIds == ["responsive-desire"])
    #expect(try store.exportJSONData(exportedAt: installedAt).isEmpty == false)
}

@Test func deleteAllDataKeepsDefaultPrivacySettings() throws {
    let store = try UserStore()

    try store.acceptPrivacyPledge(appLockEnabled: true)
    try store.setConceptStatus(.curious, for: "angling")
    try store.addFieldNote(FieldNote(id: "note-1", conceptId: "angling", body: "Try a pillow."))
    try store.savePhrase(SavedPhrase(id: "phrase-1", conceptId: "angling", body: "Can we adjust?", tone: .direct))

    try store.deleteAllData()

    #expect(try store.allConceptStates().isEmpty)
    #expect(try store.fieldNotes().isEmpty)
    #expect(try store.savedPhrases().isEmpty)

    let settings = try store.loadSettings()
    #expect(settings.completedOnboarding == false)
    #expect(settings.appLockEnabled == false)
    #expect(settings.notificationPrivacyEnabled)
}

@Test func schemaMetadataIsVersioned() throws {
    let store = try UserStore()

    let schemaInfo = try store.schemaInfo()

    #expect(schemaInfo.schemaVersion == UserStore.currentSchemaVersion)
    #expect(schemaInfo.lastMigrationId == UserStore.currentMigrationId)
}

@Test func localStateSurvivesDatabaseReopen() throws {
    let path = temporaryDatabasePath()
    let openedAt = Date(timeIntervalSince1970: 4_000)
    let updatedAt = Date(timeIntervalSince1970: 4_200)

    do {
        let store = try UserStore(path: path)
        try store.acceptPrivacyPledge(appLockEnabled: true, acceptedAt: openedAt)
        try store.markConceptOpened("spreading", openedAt: openedAt)
        try store.setConceptStatus(.tried, for: "spreading", updatedAt: updatedAt)
        try store.addFieldNote(
            FieldNote(
                id: "note-reopen",
                conceptId: "spreading",
                body: "A broader map helped.",
                createdAt: openedAt,
                updatedAt: updatedAt
            )
        )
        try store.savePhrase(
            SavedPhrase(
                id: "phrase-reopen",
                conceptId: "spreading",
                body: "Could we slow down and broaden the touch?",
                tone: .soft,
                createdAt: updatedAt
            )
        )
    }

    let reopened = try UserStore(path: path)
    let settings = try reopened.loadSettings()
    let loadedState = try reopened.conceptState(for: "spreading")
    let state = try #require(loadedState)

    #expect(settings.completedOnboarding)
    #expect(settings.appLockEnabled)
    #expect(state.status == .tried)
    #expect(state.lastOpenedAt == openedAt)
    #expect(try reopened.fieldNotes(searchTerm: "broader").map(\.id) == ["note-reopen"])
    #expect(try reopened.savedPhrases(conceptId: "spreading").map(\.id) == ["phrase-reopen"])
    #expect(try reopened.schemaInfo().schemaVersion == UserStore.currentSchemaVersion)
}

@Test func contentVersionUpdateDoesNotDeleteLocalConceptState() throws {
    let store = try UserStore()
    let original = try ContentBundleLoader.load(from: fullBundleURL())
    let updated = ContentBundle(
        schemaVersion: original.schemaVersion,
        bundleId: original.bundleId,
        contentVersion: "2.1.0",
        generatedAt: "2026-06-27T00:00:00Z",
        concepts: Array(original.concepts.dropLast()),
        pathways: original.pathways,
        media: original.media
    )

    try store.setConceptStatus(.resonates, for: "responsive-desire")
    try store.recordInstalledContent(bundle: original, installedAt: Date(timeIntervalSince1970: 5_000))
    try store.recordInstalledContent(bundle: updated, installedAt: Date(timeIntervalSince1970: 5_500))

    let loadedState = try store.conceptState(for: "responsive-desire")
    let state = try #require(loadedState)
    #expect(state.status == .resonates)
    #expect(try store.contentVersions().first?.contentVersion == "2.1.0")
}

@Test func localStoreOperationsStayWithinPerformanceBudget() throws {
    let store = try UserStore()
    let start = ContinuousClock.now

    for index in 0..<100 {
        try store.setConceptStatus(.curious, for: "concept-\(index)")
        try store.addFieldNote(
            FieldNote(
                id: "perf-note-\(index)",
                conceptId: "concept-\(index)",
                body: "Performance note \(index)."
            )
        )
    }

    _ = try store.exportJSONData()
    let elapsed = start.duration(to: .now)

    #expect(elapsed < .seconds(2), "100 writes plus export should stay below the local database budget.")
}

private func fullBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("content/v2/bundles/v2-full.bundle.json")
}

private func temporaryDatabasePath() -> String {
    URL(fileURLWithPath: NSTemporaryDirectory())
        .appendingPathComponent("pleasure-vocabulary-\(UUID().uuidString).sqlite")
        .path
}
