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

private func fullBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("content/v2/bundles/v2-full.bundle.json")
}
