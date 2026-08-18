import Foundation

/// Explicit free-preview vs gated catalog boundary for the one-time full unlock.
///
/// Free without purchase:
/// - Concepts: `responsive-desire`, `angling`, `non-concordance`
/// - Research explainer: `mind-body` (verified present in the shipping v2 bundle;
///   complements non-concordance)
///
/// Lists still show titles and thumbs for gated items; opening gated content
/// presents the quiet unlock sheet rather than hiding the catalog.
public enum PreviewBoundary: Sendable {
    public static let productID = "com.noticeandname.app.fullunlock"

    /// StoreKit is source of truth at runtime; use this when the product has not loaded.
    public static let fallbackPriceDisplay = "£15"

    public static let freeConceptIDs: Set<String> = [
        "responsive-desire",
        "angling",
        "non-concordance"
    ]

    public static let freeExplainerID = "mind-body"

    public static func isFreeConcept(_ conceptID: String) -> Bool {
        freeConceptIDs.contains(conceptID)
    }

    public static func isFreeExplainer(_ explainerID: String) -> Bool {
        explainerID == freeExplainerID
    }

    public static func isGatedConcept(_ conceptID: String) -> Bool {
        !isFreeConcept(conceptID)
    }

    public static func isGatedExplainer(_ explainerID: String) -> Bool {
        !isFreeExplainer(explainerID)
    }

    public static func canAccessConcept(_ conceptID: String, isUnlocked: Bool) -> Bool {
        isUnlocked || isFreeConcept(conceptID)
    }

    public static func canAccessExplainer(_ explainerID: String, isUnlocked: Bool) -> Bool {
        isUnlocked || isFreeExplainer(explainerID)
    }
}
