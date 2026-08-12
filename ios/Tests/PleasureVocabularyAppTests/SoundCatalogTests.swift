import Foundation
import Testing
@testable import PleasureVocabularyApp

@Test func soundCatalogResolvesKnownPhraseAndNoticeMoment() {
    let phrase = SoundCatalog.phrase(id: "angling-self-understanding")
    let notice = SoundCatalog.noticeMoment(conceptId: "angling")

    #expect(phrase != nil)
    #expect(notice != nil)
    #expect(phrase?.pathExtension == "mp3")
    #expect(notice?.pathExtension == "mp3")
}

@Test func soundCatalogMissingIdsReturnNil() {
    #expect(SoundCatalog.phrase(id: "definitely-missing-phrase-id") == nil)
    #expect(SoundCatalog.noticeMoment(conceptId: "definitely-missing-concept") == nil)
    #expect(SoundCatalog.sfx("not-a-real-effect") == nil)
}

@Test func soundCatalogResolvesOnboardingFull() {
    #expect(SoundCatalog.onboardingFull() != nil)
}
