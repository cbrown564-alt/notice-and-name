import Foundation
import PleasureVocabularyCore

@MainActor
public final class AppLockCoordinator: ObservableObject {
    public enum State: Equatable, Sendable {
        case unlocked
        case locked
    }

    @Published public private(set) var state: State

    private var settings: AppSettings

    public init(settings: AppSettings) {
        self.settings = settings
        self.state = Self.initialState(for: settings)
    }

    public var isLocked: Bool {
        state == .locked
    }

    public func syncSettings(_ settings: AppSettings) {
        let wasEnabled = self.settings.completedOnboarding && self.settings.appLockEnabled
        self.settings = settings

        guard settings.completedOnboarding, settings.appLockEnabled else {
            state = .unlocked
            return
        }

        if !wasEnabled {
            state = .unlocked
        }
    }

    public func completeOnboarding(with settings: AppSettings) {
        self.settings = settings
        state = .unlocked
    }

    public func lockForBackgroundPrivacy() -> Bool {
        guard settings.completedOnboarding, settings.appLockEnabled else {
            state = .unlocked
            return false
        }
        state = .locked
        return true
    }

    public func unlockSucceeded() {
        state = .unlocked
    }

    public func unlockFailed() {
        state = .locked
    }

    private static func initialState(for settings: AppSettings) -> State {
        settings.completedOnboarding && settings.appLockEnabled ? .locked : .unlocked
    }
}
