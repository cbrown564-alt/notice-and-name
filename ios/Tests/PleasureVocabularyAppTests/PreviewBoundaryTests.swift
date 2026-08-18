import Foundation
import Testing
import PleasureVocabularyCore
@testable import PleasureVocabularyApp

@Test func previewBoundaryUsesPreferredFreeExplainerMindBody() {
    #expect(PreviewBoundary.freeExplainerID == "mind-body")
    #expect(PreviewBoundary.productID == "com.noticeandname.app.fullunlock")
    #expect(PreviewBoundary.fallbackPriceDisplay == "£15")
}

@Test func previewBoundaryMarksThreeConceptsFreeAndOthersGated() {
    #expect(PreviewBoundary.isFreeConcept("responsive-desire"))
    #expect(PreviewBoundary.isFreeConcept("angling"))
    #expect(PreviewBoundary.isFreeConcept("non-concordance"))
    #expect(PreviewBoundary.isGatedConcept("rocking"))
    #expect(PreviewBoundary.isGatedConcept("edging"))
    #expect(PreviewBoundary.freeConceptIDs.count == 3)
}

@Test func previewBoundaryAccessDependsOnUnlockFlag() {
    #expect(PreviewBoundary.canAccessConcept("angling", isUnlocked: false))
    #expect(PreviewBoundary.canAccessConcept("rocking", isUnlocked: false) == false)
    #expect(PreviewBoundary.canAccessConcept("rocking", isUnlocked: true))

    #expect(PreviewBoundary.canAccessExplainer("mind-body", isUnlocked: false))
    #expect(PreviewBoundary.canAccessExplainer("orgasm-gap", isUnlocked: false) == false)
    #expect(PreviewBoundary.canAccessExplainer("orgasm-gap", isUnlocked: true))
}

@Test func previewBoundaryIDsExistInShippingBundle() throws {
    let loaded = try ContentBundleLoader.load(from: shippingBundleURL())
    let conceptIDs = Set(loaded.concepts.map(\.id))
    let explainerIDs = Set(loaded.explainers.map(\.id))

    for id in PreviewBoundary.freeConceptIDs {
        #expect(conceptIDs.contains(id), "Missing free preview concept \(id)")
    }
    #expect(explainerIDs.contains(PreviewBoundary.freeExplainerID))
    #expect(loaded.concepts.count == 22)
    #expect(loaded.explainers.count == 4)
}

private func shippingBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json")
}
