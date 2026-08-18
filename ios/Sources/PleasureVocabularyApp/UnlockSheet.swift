import SwiftUI

/// Quiet Soft Intimate unlock sheet — not a shouty paywall.
struct UnlockSheet: View {
    @ObservedObject var unlock: FullUnlockStore
    var onDismiss: () -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Open the full vocabulary")
                            .font(AppFont.title)
                            .foregroundStyle(AppColor.ink)
                            .fixedSize(horizontal: false, vertical: true)
                        Text("One purchase unlocks every concept and research explainer. No subscription, no account — notes stay on this device.")
                            .font(AppFont.body)
                            .foregroundStyle(AppColor.secondaryInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(.top, 8)

                    QuietCard {
                        VStack(alignment: .leading, spacing: 10) {
                            Label("All 22 concepts and pathways", systemImage: "text.book.closed")
                            Label("Every research explainer", systemImage: "sparkle.magnifyingglass")
                            Label("Private notes and phrases across the library", systemImage: "lock.doc")
                        }
                        .font(AppFont.note)
                        .foregroundStyle(AppColor.ink)
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text(unlock.displayPrice)
                            .font(.system(.title2, design: .serif, weight: .semibold))
                            .foregroundStyle(AppColor.ink)
                        Text("One-time unlock. StoreKit sets the live price; £15 is the intended list price.")
                            .font(AppFont.label)
                            .foregroundStyle(AppColor.secondaryInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }

                    if let message = unlock.lastErrorMessage {
                        Text(message)
                            .font(AppFont.note)
                            .foregroundStyle(AppColor.blush)
                            .fixedSize(horizontal: false, vertical: true)
                    }

                    VStack(spacing: 10) {
                        Button {
                            Task {
                                let unlocked = await unlock.purchase()
                                if unlocked {
                                    onDismiss()
                                }
                            }
                        } label: {
                            if unlock.isBusy {
                                ProgressView()
                                    .tint(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                            } else {
                                Label("Unlock", systemImage: "lock.open")
                            }
                        }
                        .buttonStyle(PrimaryButtonStyle())
                        .disabled(unlock.isBusy || unlock.isUnlocked)
                        .accessibilityHint("Purchases the full library unlock once.")

                        Button {
                            Task {
                                let unlocked = await unlock.restorePurchases()
                                if unlocked {
                                    onDismiss()
                                }
                            }
                        } label: {
                            Text("Restore Purchases")
                        }
                        .buttonStyle(SecondaryButtonStyle())
                        .disabled(unlock.isBusy)
                        .accessibilityHint("Restores a previous unlock for this Apple ID.")
                    }
                }
                .padding(.horizontal, 18)
                .padding(.bottom, 28)
            }
            .compactNavigationTitle()
            .appScreenBackground()
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Not now") {
                        onDismiss()
                    }
                    .foregroundStyle(AppColor.secondaryInk)
                }
            }
        }
        .fullScreenAppBackground()
    }
}

/// Shared presentation state for gated opens from Explore / Today / pathways.
@MainActor
final class UnlockPresenter: ObservableObject {
    @Published var isPresented = false
}
