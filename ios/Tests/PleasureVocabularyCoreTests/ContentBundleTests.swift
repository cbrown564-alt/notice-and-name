import Foundation
import Testing
@testable import PleasureVocabularyCore

@Test func fullBundleLoadsAndValidates() throws {
    let bundle = try ContentBundleLoader.load(from: fullBundleURL())

    #expect(bundle.bundleId == "v2-full")
    #expect(bundle.concepts.count == 22)
    #expect(bundle.pathways.count == 5)
    #expect(bundle.explainers.count == 4)
    #expect(bundle.concepts.allSatisfy { $0.reviewStatus == .approved })

    let errors = ContentBundleValidator().validate(bundle)
    #expect(errors.isEmpty, Comment(rawValue: errors.joined(separator: "\n")))
}

@Test func everyConceptHasPhrasesAndCitations() throws {
    let bundle = try ContentBundleLoader.load(from: fullBundleURL())

    for concept in bundle.concepts {
        #expect(!concept.phraseTemplates.isEmpty, "\(concept.id) missing phrases")
        #expect(!concept.citations.isEmpty, "\(concept.id) missing citations")
        #expect(!concept.blocks.isEmpty, "\(concept.id) missing blocks")
    }
}

private func fullBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json")
}
