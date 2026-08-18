import Foundation
import Combine

#if canImport(StoreKit)
import StoreKit
#endif

// MARK: - Injectable entitlement surface

/// Purchase / restore / entitlement for the single non-consumable full unlock.
/// Inject a fake in unit tests so CI never talks to live StoreKit or the network.
@MainActor
public protocol FullUnlockEntitling: AnyObject {
    var isUnlocked: Bool { get }
    var displayPrice: String { get }
    var isBusy: Bool { get }
    var lastErrorMessage: String? { get }

    func refresh() async
    func purchase() async -> Bool
    func restorePurchases() async -> Bool
}

public enum FullUnlockError: Error, Equatable, Sendable {
    case productUnavailable
    case verificationFailed
}

// MARK: - Fake (tests / previews)

@MainActor
public final class FakeFullUnlockEntitlement: ObservableObject, FullUnlockEntitling {
    @Published public private(set) var isUnlocked: Bool
    @Published public var displayPrice: String
    @Published public private(set) var isBusy = false
    @Published public private(set) var lastErrorMessage: String?

    public var purchaseSucceeds: Bool
    public var restoreSucceeds: Bool
    public private(set) var purchaseCallCount = 0
    public private(set) var restoreCallCount = 0
    public private(set) var refreshCallCount = 0

    public init(
        isUnlocked: Bool = false,
        displayPrice: String = PreviewBoundary.fallbackPriceDisplay,
        purchaseSucceeds: Bool = true,
        restoreSucceeds: Bool = true
    ) {
        self.isUnlocked = isUnlocked
        self.displayPrice = displayPrice
        self.purchaseSucceeds = purchaseSucceeds
        self.restoreSucceeds = restoreSucceeds
    }

    public func setUnlocked(_ unlocked: Bool) {
        isUnlocked = unlocked
    }

    public func refresh() async {
        refreshCallCount += 1
    }

    public func purchase() async -> Bool {
        purchaseCallCount += 1
        isBusy = true
        defer { isBusy = false }
        guard purchaseSucceeds else {
            lastErrorMessage = "Purchase did not complete."
            return false
        }
        isUnlocked = true
        lastErrorMessage = nil
        return true
    }

    public func restorePurchases() async -> Bool {
        restoreCallCount += 1
        isBusy = true
        defer { isBusy = false }
        guard restoreSucceeds else {
            lastErrorMessage = "Nothing to restore."
            return false
        }
        isUnlocked = true
        lastErrorMessage = nil
        return true
    }
}

// MARK: - StoreKit 2 store

@MainActor
public final class FullUnlockStore: ObservableObject, FullUnlockEntitling {
    @Published public private(set) var isUnlocked = false
    @Published public private(set) var displayPrice = PreviewBoundary.fallbackPriceDisplay
    @Published public private(set) var isBusy = false
    @Published public private(set) var lastErrorMessage: String?

    #if canImport(StoreKit)
    private var product: Product?
    nonisolated(unsafe) private var updatesTask: Task<Void, Never>?
    #endif

    public init() {}

    deinit {
        #if canImport(StoreKit)
        updatesTask?.cancel()
        #endif
    }

    public func start() async {
        #if canImport(StoreKit)
        updatesTask?.cancel()
        updatesTask = Task { [weak self] in
            for await update in Transaction.updates {
                await self?.handle(transactionUpdate: update)
            }
        }
        #endif
        await refresh()
    }

    public func refresh() async {
        #if canImport(StoreKit)
        await loadProduct()
        isUnlocked = await currentEntitlementIsActive()
        #else
        // Package platforms always include StoreKit; keep a safe fallback for odd hosts.
        displayPrice = PreviewBoundary.fallbackPriceDisplay
        #endif
    }

    /// Returns `true` when the library is unlocked after this call.
    @discardableResult
    public func purchase() async -> Bool {
        isBusy = true
        lastErrorMessage = nil
        defer { isBusy = false }

        #if canImport(StoreKit)
        do {
            if product == nil {
                await loadProduct()
            }
            guard let product else {
                lastErrorMessage = "The unlock is not available right now."
                throw FullUnlockError.productUnavailable
            }

            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try Self.verified(verification)
                await transaction.finish()
                isUnlocked = true
                AppAudioPlayer.shared.playUnlockSFX()
                NativeHaptics.success()
                return true
            case .userCancelled:
                return isUnlocked
            case .pending:
                lastErrorMessage = "This purchase is pending approval."
                return isUnlocked
            @unknown default:
                return isUnlocked
            }
        } catch {
            lastErrorMessage = "Purchase could not be completed."
            return isUnlocked
        }
        #else
        lastErrorMessage = "Purchases are unavailable on this platform."
        return false
        #endif
    }

    /// Syncs with the App Store and refreshes entitlement. Always available (never paywalled).
    @discardableResult
    public func restorePurchases() async -> Bool {
        isBusy = true
        lastErrorMessage = nil
        defer { isBusy = false }

        #if canImport(StoreKit)
        do {
            try await AppStore.sync()
            isUnlocked = await currentEntitlementIsActive()
            if !isUnlocked {
                lastErrorMessage = "No previous unlock found for this Apple ID."
            } else {
                NativeHaptics.success()
            }
            return isUnlocked
        } catch {
            lastErrorMessage = "Restore could not be completed."
            return isUnlocked
        }
        #else
        lastErrorMessage = "Purchases are unavailable on this platform."
        return false
        #endif
    }

    #if canImport(StoreKit)
    private func loadProduct() async {
        do {
            let products = try await Product.products(for: [PreviewBoundary.productID])
            product = products.first { $0.id == PreviewBoundary.productID }
            if let product {
                displayPrice = product.displayPrice
            } else {
                displayPrice = PreviewBoundary.fallbackPriceDisplay
            }
        } catch {
            product = nil
            displayPrice = PreviewBoundary.fallbackPriceDisplay
        }
    }

    private func currentEntitlementIsActive() async -> Bool {
        for await entitlement in Transaction.currentEntitlements {
            guard let transaction = try? Self.verified(entitlement) else { continue }
            guard transaction.productID == PreviewBoundary.productID else { continue }
            if transaction.revocationDate == nil {
                return true
            }
        }
        return false
    }

    private func handle(transactionUpdate: VerificationResult<Transaction>) async {
        guard let transaction = try? Self.verified(transactionUpdate) else { return }
        guard transaction.productID == PreviewBoundary.productID else { return }
        await transaction.finish()
        isUnlocked = transaction.revocationDate == nil
    }

    private static func verified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw FullUnlockError.verificationFailed
        case .verified(let value):
            return value
        }
    }
    #endif
}
