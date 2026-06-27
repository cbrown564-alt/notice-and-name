import SwiftUI

#if os(iOS)
import UIKit
#endif

public enum AppColor {
    public static let canvas = Color(red: 0.98, green: 0.96, blue: 0.93)
    public static let surface = Color(red: 1.00, green: 0.99, blue: 0.97)
    public static let ink = Color(red: 0.13, green: 0.11, blue: 0.10)
    public static let secondaryInk = Color(red: 0.39, green: 0.35, blue: 0.32)
    public static let blush = Color(red: 0.77, green: 0.36, blue: 0.38)
    public static let plum = Color(red: 0.34, green: 0.22, blue: 0.32)
    public static let moss = Color(red: 0.34, green: 0.43, blue: 0.35)
    public static let gold = Color(red: 0.82, green: 0.61, blue: 0.35)
    public static let line = Color(red: 0.86, green: 0.80, blue: 0.74)
}

public enum AppFont {
    public static let title = Font.system(.largeTitle, design: .serif, weight: .semibold)
    public static let section = Font.system(.title3, design: .serif, weight: .semibold)
    public static let cardTitle = Font.system(.headline, design: .rounded, weight: .semibold)
    public static let body = Font.system(.body, design: .default)
    public static let note = Font.system(.callout, design: .default)
    public static let label = Font.system(.caption, design: .rounded, weight: .semibold)
}

public enum NativeHaptics {
    public static func selection() {
        #if os(iOS)
        UISelectionFeedbackGenerator().selectionChanged()
        #endif
    }

    public static func success() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        #endif
    }

    public static func warning() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        #endif
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppFont.cardTitle)
            .foregroundStyle(Color.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .padding(.horizontal, 18)
            .background(AppColor.plum.opacity(configuration.isPressed ? 0.82 : 1), in: RoundedRectangle(cornerRadius: 8))
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppFont.cardTitle)
            .foregroundStyle(AppColor.plum)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 13)
            .padding(.horizontal, 18)
            .background(AppColor.surface.opacity(configuration.isPressed ? 0.76 : 1), in: RoundedRectangle(cornerRadius: 8))
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .stroke(AppColor.line, lineWidth: 1)
            }
    }
}

struct QuietCard<Content: View>: View {
    private let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(16)
            .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 8))
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .stroke(AppColor.line.opacity(0.8), lineWidth: 1)
            }
    }
}

extension View {
    func appScreenBackground() -> some View {
        background(AppColor.canvas.ignoresSafeArea())
    }

    @ViewBuilder
    func compactNavigationTitle() -> some View {
        #if os(iOS)
        navigationBarTitleDisplayMode(.inline)
        #else
        self
        #endif
    }
}
