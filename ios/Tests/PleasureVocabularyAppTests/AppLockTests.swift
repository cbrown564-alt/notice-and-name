import Testing
import PleasureVocabularyCore
@testable import PleasureVocabularyApp

@MainActor
@Test func appLockEngagesAfterOnboardingWhenEnabled() {
    let coordinator = AppLockCoordinator(
        settings: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )
    #expect(coordinator.isLocked)
}

@MainActor
@Test func backgroundPrivacyRelocksAndUnlockClears() {
    let coordinator = AppLockCoordinator(settings: AppSettings())
    coordinator.completeOnboarding(
        with: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )
    #expect(coordinator.isLocked == false)
    #expect(coordinator.lockForBackgroundPrivacy())
    #expect(coordinator.isLocked)

    coordinator.unlockSucceeded()
    #expect(coordinator.isLocked == false)
}
