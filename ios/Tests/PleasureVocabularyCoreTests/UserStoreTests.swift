import Foundation
import Testing
@testable import PleasureVocabularyCore

@Test func onboardingAndAppLockPersist() throws {
    let store = try UserStore()
    let acceptedAt = Date(timeIntervalSince1970: 1_800)

    try store.acceptPrivacyPledge(appLockEnabled: true, acceptedAt: acceptedAt)
    let settings = try store.loadSettings()

    #expect(settings.completedOnboarding)
    #expect(settings.appLockEnabled)
    #expect(settings.privacyPledgeAcceptedAt == acceptedAt)
}

@Test func conceptNotesPhrasesExportAndDelete() throws {
    let store = try UserStore()
    let now = Date(timeIntervalSince1970: 2_000)

    try store.markConceptOpened("responsive-desire", openedAt: now)
    try store.setConceptStatus(.resonates, for: "responsive-desire", updatedAt: now)
    try store.addFieldNote(
        FieldNote(
            id: "note-1",
            conceptId: "responsive-desire",
            body: "Warmth helps desire arrive.",
            createdAt: now,
            updatedAt: now
        )
    )
    try store.savePhrase(
        SavedPhrase(
            id: "phrase-1",
            conceptId: "responsive-desire",
            templateId: "tpl-1",
            body: "Desire often arrives after we begin.",
            tone: .soft,
            createdAt: now
        )
    )

    #expect(try store.conceptState(for: "responsive-desire")?.status == .resonates)
    #expect(try store.fieldNotes().count == 1)
    #expect(try store.savedPhrases().count == 1)

    let exportData = try store.exportJSONData(exportedAt: now)
    #expect(!exportData.isEmpty)

    try store.deleteAllData()
    #expect(try store.fieldNotes().isEmpty)
    #expect(try store.savedPhrases().isEmpty)
    #expect(try store.allConceptStates().isEmpty)
    #expect(try store.loadSettings().completedOnboarding == false)
}
