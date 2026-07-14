import Testing
import PleasureVocabularyCore
@testable import PleasureVocabularyApp

@MainActor
@Test func coldLaunchLocksWhenOnboardingCompletedAndAppLockEnabled() {
    let coordinator = AppLockCoordinator(
        settings: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )

    #expect(coordinator.isLocked)
}

@MainActor
@Test func onboardingCompletionStaysUnlockedUntilBackgroundPrivacyLock() {
    let coordinator = AppLockCoordinator(settings: AppSettings())

    coordinator.completeOnboarding(
        with: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )

    #expect(coordinator.isLocked == false)
    #expect(coordinator.lockForBackgroundPrivacy())
    #expect(coordinator.isLocked)
}

@MainActor
@Test func unlockAndDisableAppLockReleaseTheGate() {
    let coordinator = AppLockCoordinator(
        settings: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )

    coordinator.unlockSucceeded()
    #expect(coordinator.isLocked == false)

    _ = coordinator.lockForBackgroundPrivacy()
    coordinator.syncSettings(AppSettings(completedOnboarding: true, appLockEnabled: false))

    #expect(coordinator.isLocked == false)
}

@MainActor
@Test func exportPreviewShouldBeClearedWhenBackgroundLockEngages() {
    let coordinator = AppLockCoordinator(
        settings: AppSettings(completedOnboarding: true, appLockEnabled: true)
    )

    coordinator.unlockSucceeded()

    #expect(coordinator.lockForBackgroundPrivacy())
    #expect(coordinator.isLocked)
}
