import SwiftUI
import PleasureVocabularyCore

#if os(iOS)
import UIKit
#endif

public enum AppTheme {
    @MainActor
    public static func configure() {
        #if os(iOS)
        let canvas = UIColor(red: 0.98, green: 0.96, blue: 0.93, alpha: 1)
        let surface = UIColor(red: 1.00, green: 0.99, blue: 0.97, alpha: 1)
        let ink = UIColor(red: 0.13, green: 0.11, blue: 0.10, alpha: 1)
        let line = UIColor(red: 0.86, green: 0.80, blue: 0.74, alpha: 1)

        let navigationBar = UINavigationBarAppearance()
        navigationBar.configureWithOpaqueBackground()
        navigationBar.backgroundColor = canvas
        navigationBar.shadowColor = line
        navigationBar.titleTextAttributes = [.foregroundColor: ink]
        navigationBar.largeTitleTextAttributes = [.foregroundColor: ink]

        let navigationBarProxy = UINavigationBar.appearance()
        navigationBarProxy.standardAppearance = navigationBar
        navigationBarProxy.scrollEdgeAppearance = navigationBar
        navigationBarProxy.compactAppearance = navigationBar
        navigationBarProxy.tintColor = UIColor(red: 0.34, green: 0.22, blue: 0.32, alpha: 1)

        let tabBar = UITabBarAppearance()
        tabBar.configureWithOpaqueBackground()
        tabBar.backgroundColor = surface
        tabBar.shadowColor = line

        let tabBarProxy = UITabBar.appearance()
        tabBarProxy.standardAppearance = tabBar
        tabBarProxy.scrollEdgeAppearance = tabBar
        tabBarProxy.tintColor = UIColor(red: 0.34, green: 0.22, blue: 0.32, alpha: 1)
        tabBarProxy.unselectedItemTintColor = UIColor(red: 0.39, green: 0.35, blue: 0.32, alpha: 1)

        UITableView.appearance().backgroundColor = canvas
        UITableViewCell.appearance().backgroundColor = surface
        #endif
    }
}

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

    /// Native diagram tokens from STYLE_BIBLE §4.
    public static let diagramPassive = Color(red: 220 / 255, green: 216 / 255, blue: 211 / 255)
    public static let diagramActive = Color(red: 232 / 255, green: 96 / 255, blue: 60 / 255)
    public static let diagramGlow = Color(red: 1, green: 197 / 255, blue: 181 / 255)
    public static let diagramDetachment = Color(red: 122 / 255, green: 122 / 255, blue: 1)
}

extension AppColor {
    /// Soft per-block-type accent used for ambient tints and accent bars on the
    /// concept-detail screen, so scrolling has gentle chromatic rhythm. Kept
    /// within the existing calm palette — applied at low opacity by callers.
    static func blockAccent(for type: ContentBlockType) -> Color {
        switch type {
        case .recognize:
            return blush
        case .definition:
            return plum
        case .mechanism:
            return moss
        case .media:
            return gold
        case .reflection:
            return secondaryInk
        case .phrase:
            return gold
        }
    }
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
    @MainActor
    public static func selection() {
        #if os(iOS)
        UISelectionFeedbackGenerator().selectionChanged()
        #endif
    }

    @MainActor
    public static func success() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        #endif
    }

    @MainActor
    public static func warning() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        #endif
    }

    @MainActor
    public static func impactLight() {
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
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

    func fullScreenAppBackground() -> some View {
        frame(maxWidth: .infinity, maxHeight: .infinity)
            .appScreenBackground()
    }

    func appLightChrome() -> some View {
        preferredColorScheme(.light)
    }

    func appListScreen() -> some View {
        let styled = listStyle(.plain)
            .environment(\.colorScheme, .light)
            .scrollContentBackground(.hidden)
            .background(AppColor.canvas)
        #if os(iOS)
        return styled
            .toolbarBackground(AppColor.canvas, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
        #else
        return styled
        #endif
    }

    /// Scroll-based tab roots (Today, Settings) with no system list chrome.
    func appTabScreen() -> some View {
        compactNavigationTitle()
            .environment(\.colorScheme, .light)
            .appScreenBackground()
    }

    /// Tab roots use in-content headers with explicit ink colors instead of large
    /// navigation titles, which do not reliably inherit the app light palette.
    func appTabListScreen() -> some View {
        compactNavigationTitle()
            .appListScreen()
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
