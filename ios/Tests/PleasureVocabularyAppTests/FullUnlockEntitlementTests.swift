import Foundation
import Testing
import PleasureVocabularyCore
@testable import PleasureVocabularyApp

@MainActor
@Test func fakeEntitlementStartsLockedWithFallbackPrice() {
    let fake = FakeFullUnlockEntitlement()
    #expect(fake.isUnlocked == false)
    #expect(fake.displayPrice == PreviewBoundary.fallbackPriceDisplay)
}

@MainActor
@Test func fakeEntitlementPurchaseUnlocksLibrary() async {
    let fake = FakeFullUnlockEntitlement(isUnlocked: false)
    let didUnlock = await fake.purchase()
    #expect(didUnlock)
    #expect(fake.isUnlocked)
    #expect(fake.purchaseCallCount == 1)
    #expect(fake.lastErrorMessage == nil)
}

@MainActor
@Test func fakeEntitlementRestoreUnlocksLibrary() async {
    let fake = FakeFullUnlockEntitlement(isUnlocked: false)
    let didUnlock = await fake.restorePurchases()
    #expect(didUnlock)
    #expect(fake.isUnlocked)
    #expect(fake.restoreCallCount == 1)
}

@MainActor
@Test func fakeEntitlementFailedPurchaseStaysLocked() async {
    let fake = FakeFullUnlockEntitlement(isUnlocked: false, purchaseSucceeds: false)
    let didUnlock = await fake.purchase()
    #expect(didUnlock == false)
    #expect(fake.isUnlocked == false)
    #expect(fake.lastErrorMessage != nil)
}

@MainActor
@Test func viewModelGatesConceptsUsingInjectedUnlockFlag() throws {
    let locked = PleasureVocabularyViewModel(
        bundleURL: shippingBundleURL(),
        store: try UserStore(path: temporaryDatabasePath()),
        isLibraryUnlocked: false
    )
    #expect(locked.loadError == nil)
    #expect(locked.canOpenConcept("responsive-desire"))
    #expect(locked.canOpenConcept("angling"))
    #expect(locked.canOpenConcept("non-concordance"))
    #expect(locked.canOpenConcept("rocking") == false)
    #expect(locked.canOpenExplainer("mind-body"))
    #expect(locked.canOpenExplainer("anatomy-101") == false)
    #expect(locked.isConceptGated("rocking"))
    #expect(locked.isExplainerGated("orgasm-gap"))

    let unlocked = PleasureVocabularyViewModel(
        bundleURL: shippingBundleURL(),
        store: try UserStore(path: temporaryDatabasePath()),
        isLibraryUnlocked: true
    )
    #expect(unlocked.canOpenConcept("rocking"))
    #expect(unlocked.canOpenExplainer("orgasm-gap"))
    #expect(unlocked.isConceptGated("rocking") == false)
}

@MainActor
@Test func viewModelTodayPrefersAccessiblePreviewWhenLocked() throws {
    let model = PleasureVocabularyViewModel(
        bundleURL: shippingBundleURL(),
        store: try UserStore(path: temporaryDatabasePath()),
        isLibraryUnlocked: false
    )
    let today = try #require(model.todayConcept)
    #expect(PreviewBoundary.isFreeConcept(today.id))
}

private func shippingBundleURL() -> URL {
    URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json")
}

private func temporaryDatabasePath() -> String {
    FileManager.default.temporaryDirectory
        .appendingPathComponent("notice-unlock-\(UUID().uuidString).sqlite")
        .path
}
