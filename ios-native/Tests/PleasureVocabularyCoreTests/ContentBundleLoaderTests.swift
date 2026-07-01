import Foundation
import Testing
@testable import PleasureVocabularyCore

@Test func loadsGoldenPathBundle() throws {
    let bundle = try ContentBundleLoader.load(from: goldenPathBundleURL())

    #expect(bundle.schemaVersion == 1)
    #expect(bundle.bundleId == "golden-path")
    #expect(bundle.concepts.count == 5)
    #expect(bundle.pathways.count == 2)
    #expect(bundle.media.count == 7)
    #expect(bundle.concepts.map(\.id).contains("responsive-desire"))
}

@Test func loadsFullV2Bundle() throws {
    let bundle = try ContentBundleLoader.load(from: fullBundleURL())

    #expect(bundle.schemaVersion == 1)
    #expect(bundle.bundleId == "v2-full")
    #expect(bundle.concepts.count == 22)
    #expect(bundle.pathways.count == 5)
    #expect(bundle.explainers.count == 4)
    #expect(bundle.concepts.map(\.id).contains("internal-stimulation"))
    #expect(bundle.explainers.map(\.id).contains("orgasm-gap"))
}

@Test func validatesGoldenPathBundleReferences() throws {
    let bundle = try ContentBundleLoader.load(from: goldenPathBundleURL())
    let errors = ContentBundleValidator().validate(bundle)

    #expect(errors.isEmpty, Comment(rawValue: errors.joined(separator: "\n")))
}

@Test func validatesFullV2BundleReferences() throws {
    let bundle = try ContentBundleLoader.load(from: fullBundleURL())
    let errors = ContentBundleValidator().validate(bundle)

    #expect(errors.isEmpty, Comment(rawValue: errors.joined(separator: "\n")))
}

@Test func plansContentBundleUpdatesByStableConceptIdentity() throws {
    let oldBundle = try ContentBundleLoader.load(from: goldenPathBundleURL())
    let newBundle = try ContentBundleLoader.load(from: fullBundleURL())

    let plan = ContentBundleUpdatePlan(from: oldBundle, to: newBundle)

    #expect(plan.isSchemaCompatible)
    #expect(plan.fromBundleId == "golden-path")
    #expect(plan.toBundleId == "v2-full")
    #expect(plan.retainedConceptIds.contains("responsive-desire"))
    #expect(plan.addedConceptIds.contains("internal-stimulation"))
    #expect(plan.removedConceptIds.isEmpty)
}

@Test func rejectsFutureContentSchemaUntilAMigrationExists() throws {
    let bundle = try ContentBundleLoader.load(from: goldenPathBundleURL())
    let futureBundle = ContentBundle(
        schemaVersion: ContentBundleValidator.supportedSchemaVersion + 1,
        bundleId: bundle.bundleId,
        contentVersion: bundle.contentVersion,
        generatedAt: bundle.generatedAt,
        concepts: bundle.concepts,
        pathways: bundle.pathways,
        media: bundle.media,
        explainers: bundle.explainers
    )

    let errors = ContentBundleValidator().validate(futureBundle)

    #expect(errors.contains("schemaVersion must be \(ContentBundleValidator.supportedSchemaVersion)"))
    #expect(ContentBundleUpdatePlan(from: bundle, to: futureBundle).isSchemaCompatible == false)
}

private func goldenPathBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("content/v2/bundles/golden-path.bundle.json")
}

private func fullBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("content/v2/bundles/v2-full.bundle.json")
}
