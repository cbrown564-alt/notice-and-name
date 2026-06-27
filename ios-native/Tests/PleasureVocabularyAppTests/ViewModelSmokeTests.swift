import Foundation
import Testing
import PleasureVocabularyCore
@testable import PleasureVocabularyApp

@MainActor
@Test func coreScreensCanBeConstructedFromLoadedModel() throws {
    let model = PleasureVocabularyViewModel(
        bundleURL: fullBundleURL(),
        store: try UserStore()
    )

    model.completeOnboarding(appLockEnabled: false)
    let rootView = PleasureVocabularyRootView(model: model)

    #expect(model.bundle.concepts.isEmpty == false)
    #expect(model.todayConcept != nil)
    #expect(String(describing: type(of: rootView)) == "PleasureVocabularyRootView")
}

@MainActor
@Test func exportPreviewCanBeClearedBeforePrivacyLockPresentation() throws {
    let model = PleasureVocabularyViewModel(
        bundleURL: fullBundleURL(),
        store: try UserStore()
    )

    model.completeOnboarding(appLockEnabled: true)
    model.prepareExport()
    #expect(model.exportText?.isEmpty == false)

    model.clearExportPreview()
    #expect(model.exportText == nil)
}

private func fullBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("content/v2/bundles/v2-full.bundle.json")
}
