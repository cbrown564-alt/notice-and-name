import SwiftUI
import PleasureVocabularyCore

#if canImport(LocalAuthentication)
import LocalAuthentication
#endif

public struct PleasureVocabularyRootView: View {
    @StateObject private var model: PleasureVocabularyViewModel
    @StateObject private var lockCoordinator: AppLockCoordinator
    @Environment(\.scenePhase) private var scenePhase

    public init(model: PleasureVocabularyViewModel = PleasureVocabularyViewModel()) {
        _model = StateObject(wrappedValue: model)
        _lockCoordinator = StateObject(wrappedValue: AppLockCoordinator(settings: model.settings))
    }

    public var body: some View {
        Group {
            if model.bundle.concepts.isEmpty {
                UnavailableStateView(
                    symbol: "exclamationmark.lock",
                    title: "Content unavailable",
                    message: model.loadError ?? "The local content bundle could not be opened."
                )
            } else if !model.settings.completedOnboarding {
                OnboardingView(model: model)
            } else {
                LockGateView(model: model, coordinator: lockCoordinator)
            }
        }
        .tint(AppColor.plum)
        .fullScreenAppBackground()
        .onChange(of: model.settings) { _, settings in
            lockCoordinator.syncSettings(settings)
        }
        .onChange(of: scenePhase) { _, phase in
            guard phase == .background || phase == .inactive else { return }
            if lockCoordinator.lockForBackgroundPrivacy() {
                model.clearExportPreview()
            }
        }
        .alert("Something needs attention", isPresented: errorBinding) {
            Button("OK") {
                model.clearError()
            }
        } message: {
            Text(model.loadError ?? "")
        }
    }

    private var errorBinding: Binding<Bool> {
        Binding(
            get: { model.loadError != nil && !model.bundle.concepts.isEmpty },
            set: { if !$0 { model.clearError() } }
        )
    }
}

public struct PleasureVocabularyNativeApp: App {
    public init() {}

    public var body: some Scene {
        WindowGroup {
            PleasureVocabularyRootView()
        }
    }
}

private struct UnavailableStateView: View {
    let symbol: String
    let title: String
    let message: String?

    var body: some View {
        VStack(spacing: 18) {
            Image(systemName: symbol)
                .font(.system(size: 34, weight: .semibold))
                .foregroundStyle(AppColor.blush)
                .accessibilityHidden(true)
            Text(title)
                .font(AppFont.title)
                .foregroundStyle(AppColor.ink)
                .multilineTextAlignment(.center)
            Text(message ?? "The local content bundle could not be opened.")
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(28)
        .fullScreenAppBackground()
    }
}

private struct OnboardingView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    @State private var appLockEnabled = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Pleasure Vocabulary")
                            .font(AppFont.title)
                            .foregroundStyle(AppColor.ink)
                            .fixedSize(horizontal: false, vertical: true)
                        Text("A private place to name what fits, what does not, and what you may want to say later.")
                            .font(AppFont.note)
                            .foregroundStyle(AppColor.secondaryInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(.top, 8)

                    QuietCard {
                        VStack(alignment: .leading, spacing: 10) {
                            PrivacyRow(symbol: "wifi.slash", text: "No account or sync")
                            PrivacyRow(symbol: "lock.doc", text: "Field notes stay on this device")
                            PrivacyRow(symbol: "square.and.arrow.down", text: "Export and delete are always available")
                        }
                    }

                    Toggle(isOn: $appLockEnabled) {
                        Label("Offer app lock", systemImage: "lock")
                    }
                    .font(AppFont.cardTitle)
                    .tint(AppColor.plum)
                    .padding(.vertical, 2)
                }
                .padding(.horizontal, 18)
                .padding(.top, 10)
                .padding(.bottom, 96)
            }
            .compactNavigationTitle()
            .appScreenBackground()
            .safeAreaInset(edge: .bottom) {
                Button {
                    model.completeOnboarding(appLockEnabled: appLockEnabled)
                } label: {
                    Label("Accept privacy pledge", systemImage: "checkmark.seal")
                }
                .buttonStyle(PrimaryButtonStyle())
                .padding(.horizontal, 18)
                .padding(.top, 10)
                .padding(.bottom, 12)
                .background(AppColor.canvas)
            }
        }
        .fullScreenAppBackground()
    }
}

private struct PrivacyRow: View {
    let symbol: String
    let text: String

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Image(systemName: symbol)
                .font(.system(.title3, weight: .medium))
                .frame(width: 26)
                .foregroundStyle(AppColor.plum)
            Text(text)
                .font(AppFont.note)
                .foregroundStyle(AppColor.ink)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

private struct LockGateView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    @ObservedObject var coordinator: AppLockCoordinator

    var body: some View {
        if coordinator.isLocked {
            LockScreen(coordinator: coordinator)
        } else {
            MainTabView(model: model)
        }
    }
}

private struct LockScreen: View {
    @ObservedObject var coordinator: AppLockCoordinator
    @State private var message = "Unlock your private vocabulary."

    var body: some View {
        VStack(spacing: 18) {
            Image(systemName: "lock.shield")
                .font(.system(size: 40, weight: .semibold))
                .foregroundStyle(AppColor.plum)
                .accessibilityHidden(true)
            Text("Locked")
                .font(AppFont.title)
            Text(message)
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
            Button {
                authenticate()
            } label: {
                Label("Unlock", systemImage: "faceid")
            }
            .buttonStyle(PrimaryButtonStyle())
            .frame(maxWidth: 360)
            .accessibilityHint("Uses the device passcode or biometric authentication.")
        }
        .padding(28)
        .fullScreenAppBackground()
    }

    private func authenticate() {
        #if canImport(LocalAuthentication)
        let context = LAContext()
        var error: NSError?
        if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Unlock Pleasure Vocabulary") { success, authError in
                Task { @MainActor in
                    if success {
                        NativeHaptics.success()
                        coordinator.unlockSucceeded()
                    } else {
                        coordinator.unlockFailed()
                        message = authError?.localizedDescription ?? "Could not unlock."
                    }
                }
            }
        } else {
            NativeHaptics.selection()
            coordinator.unlockSucceeded()
        }
        #else
        coordinator.unlockSucceeded()
        #endif
    }
}

private struct MainTabView: View {
    @ObservedObject var model: PleasureVocabularyViewModel

    var body: some View {
        TabView {
            TodayView(model: model)
                .tabItem { Label("Today", systemImage: "sun.max") }
            VocabularyView(model: model)
                .tabItem { Label("Vocabulary", systemImage: "text.book.closed") }
            ExploreView(model: model)
                .tabItem { Label("Explore", systemImage: "sparkle.magnifyingglass") }
            JournalView(model: model)
                .tabItem { Label("Journal", systemImage: "note.text") }
            SettingsView(model: model)
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .appScreenBackground()
    }
}

private struct TodayView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    HeaderBlock(title: "Today", subtitle: "One word, one note, one phrase.")

                    if let concept = model.todayConcept {
                        QuietCard {
                            VStack(alignment: .leading, spacing: 14) {
                                StatusPill(status: model.status(for: concept.id))
                                Text(concept.name)
                                    .font(AppFont.title)
                                    .foregroundStyle(AppColor.ink)
                                Text(concept.summary)
                                    .font(AppFont.body)
                                    .foregroundStyle(AppColor.secondaryInk)
                                NavigationLink {
                                    ConceptDetailView(model: model, concept: concept)
                                } label: {
                                    Label("Open word", systemImage: "arrow.right.circle")
                                }
                                .buttonStyle(PrimaryButtonStyle())
                            }
                        }
                        .animation(reduceMotion ? nil : .snappy, value: model.status(for: concept.id))
                    }

                    QuietCard {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Saved so far")
                                .font(AppFont.section)
                            HStack(spacing: 12) {
                                MetricTile(value: "\(model.vocabularyConcepts.count)", label: "words")
                                MetricTile(value: "\(model.fieldNotes.count)", label: "notes")
                                MetricTile(value: "\(model.savedPhrases.count)", label: "phrases")
                            }
                        }
                    }
                }
                .padding(18)
            }
            .compactNavigationTitle()
            .appScreenBackground()
        }
    }
}

private struct VocabularyView: View {
    @ObservedObject var model: PleasureVocabularyViewModel

    var body: some View {
        NavigationStack {
            List {
                if model.vocabularyConcepts.isEmpty {
                    InlineEmptyStateView(
                        symbol: "text.book.closed",
                        title: "No saved words yet",
                        message: "Words you mark, note, or save will appear here."
                    )
                        .listRowBackground(AppColor.canvas)
                } else {
                    ForEach(model.vocabularyConcepts) { concept in
                        NavigationLink {
                            ConceptDetailView(model: model, concept: concept)
                        } label: {
                            ConceptSummaryRow(model: model, concept: concept)
                        }
                    }
                    .listRowBackground(AppColor.surface)
                }
            }
            .scrollContentBackground(.hidden)
            .background(AppColor.canvas)
            .navigationTitle("Vocabulary")
        }
    }
}

private struct ExploreView: View {
    @ObservedObject var model: PleasureVocabularyViewModel

    var body: some View {
        NavigationStack {
            List {
                Section("Pathways") {
                    ForEach(model.bundle.pathways) { pathway in
                        NavigationLink {
                            PathwayDetailView(model: model, pathway: pathway)
                        } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                Text(pathway.name)
                                    .font(AppFont.cardTitle)
                                Text(pathway.summary)
                                    .font(AppFont.note)
                                    .foregroundStyle(AppColor.secondaryInk)
                            }
                            .padding(.vertical, 6)
                        }
                    }
                }

                Section("Concept Library") {
                    ForEach(model.bundle.concepts) { concept in
                        NavigationLink {
                            ConceptDetailView(model: model, concept: concept)
                        } label: {
                            ConceptSummaryRow(model: model, concept: concept)
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(AppColor.canvas)
            .navigationTitle("Explore")
        }
    }
}

private struct PathwayDetailView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let pathway: Pathway

    var body: some View {
        List {
            Section {
                Text(pathway.summary)
                    .font(AppFont.body)
                    .foregroundStyle(AppColor.secondaryInk)
            }

            Section("Words") {
                ForEach(pathway.conceptIds, id: \.self) { conceptId in
                    if let concept = model.concept(withId: conceptId) {
                        NavigationLink {
                            ConceptDetailView(model: model, concept: concept)
                                .onAppear {
                                    model.updatePathway(pathway, currentConceptId: concept.id)
                                }
                                .onDisappear {
                                    model.updatePathway(pathway, currentConceptId: concept.id, completedConceptId: concept.id)
                                }
                        } label: {
                            ConceptSummaryRow(model: model, concept: concept)
                        }
                    }
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(AppColor.canvas)
        .navigationTitle(pathway.name)
    }
}

private struct ConceptDetailView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept

    var body: some View {
        ConceptPagesView(model: model, concept: concept)
            .navigationTitle(concept.name)
            .compactNavigationTitle()
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        ForEach(ConceptStatus.allCases, id: \.self) { item in
                            Button {
                                model.setStatus(item, for: concept.id)
                            } label: {
                                if model.status(for: concept.id) == item {
                                    Label(item.displayName, systemImage: "checkmark")
                                } else {
                                    Text(item.displayName)
                                }
                            }
                        }
                    } label: {
                        Label("Change status", systemImage: "slider.horizontal.3")
                    }
                }
            }
            .onAppear {
                model.markOpened(concept.id)
            }
    }
}

private struct JournalView: View {
    @ObservedObject var model: PleasureVocabularyViewModel

    var body: some View {
        NavigationStack {
            List {
                Section {
                    TextField("Search notes", text: $model.journalSearchText)
                        .textFieldStyle(.roundedBorder)
                }
                .listRowBackground(AppColor.canvas)

                if model.filteredFieldNotes.isEmpty {
                    InlineEmptyStateView(
                        symbol: model.journalSearchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "note.text" : "magnifyingglass",
                        title: model.journalSearchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "No field notes yet" : "No matching notes",
                        message: model.journalSearchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "Private field notes will collect here." : "Try a different word or clear the search."
                    )
                        .listRowBackground(AppColor.canvas)
                } else {
                    ForEach(model.filteredFieldNotes) { note in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(model.concept(withId: note.conceptId ?? "")?.name ?? "Unlinked note")
                                .font(AppFont.label)
                                .foregroundStyle(AppColor.moss)
                            Text(note.body)
                                .font(AppFont.body)
                            Text(note.updatedAt, style: .date)
                                .font(AppFont.label)
                                .foregroundStyle(AppColor.secondaryInk)
                        }
                        .padding(.vertical, 6)
                        .listRowBackground(AppColor.surface)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(AppColor.canvas)
            .navigationTitle("Journal")
        }
    }
}

private struct SettingsView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    @State private var confirmDelete = false

    var body: some View {
        NavigationStack {
            List {
                Section("Privacy") {
                    Toggle(isOn: Binding(
                        get: { model.settings.appLockEnabled },
                        set: { model.setAppLockEnabled($0) }
                    )) {
                        Label("App lock", systemImage: "lock")
                    }
                    Toggle(isOn: Binding(
                        get: { model.settings.reduceSensitivePreviews },
                        set: { model.setReduceSensitivePreviews($0) }
                    )) {
                        Label("Reduced previews", systemImage: "eye.slash")
                    }
                }

                Section("Data") {
                    Button {
                        model.prepareExport()
                    } label: {
                        Label("Export local data", systemImage: "square.and.arrow.down")
                    }
                    Button(role: .destructive) {
                        confirmDelete = true
                    } label: {
                        Label("Delete all local data", systemImage: "trash")
                    }
                }

                if model.exportText != nil {
                    Section("Export") {
                        TextEditor(text: Binding(
                            get: { model.exportText ?? "" },
                            set: { _ in }
                        ))
                        .font(.system(.footnote, design: .monospaced))
                        .frame(minHeight: 220)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(AppColor.canvas)
            .navigationTitle("Settings")
            .confirmationDialog("Delete all local data?", isPresented: $confirmDelete, titleVisibility: .visible) {
                Button("Delete all data", role: .destructive) {
                    model.deleteAllData()
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }
}

private struct StatusPill: View {
    let status: ConceptStatus

    var body: some View {
        Label(status.displayName, systemImage: symbol)
            .font(AppFont.label)
            .foregroundStyle(color)
            .padding(.vertical, 6)
            .padding(.horizontal, 9)
            .background(color.opacity(0.12), in: Capsule())
    }

    private var symbol: String {
        switch status {
        case .unexplored:
            return "circle"
        case .explored:
            return "checkmark.circle"
        case .resonates:
            return "heart"
        case .curious:
            return "sparkle"
        case .tried:
            return "hand.thumbsup"
        case .notForMe:
            return "minus.circle"
        }
    }

    private var color: Color {
        switch status {
        case .unexplored:
            return AppColor.secondaryInk
        case .explored:
            return AppColor.moss
        case .resonates:
            return AppColor.blush
        case .curious:
            return AppColor.gold
        case .tried:
            return AppColor.plum
        case .notForMe:
            return AppColor.secondaryInk
        }
    }
}

private struct ConceptSummaryRow: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            HStack(alignment: .firstTextBaseline) {
                Text(concept.name)
                    .font(AppFont.cardTitle)
                Spacer()
                StatusPill(status: model.status(for: concept.id))
            }
            Text(concept.summary)
                .font(AppFont.note)
                .foregroundStyle(AppColor.secondaryInk)
                .lineLimit(3)
        }
        .padding(.vertical, 6)
    }
}

private struct HeaderBlock: View {
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(AppFont.title)
                .foregroundStyle(AppColor.ink)
            Text(subtitle)
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
        }
    }
}

private struct MetricTile: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 3) {
            Text(value)
                .font(.system(.title2, design: .serif, weight: .semibold))
            Text(label)
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
    }
}

private struct InlineEmptyStateView: View {
    let symbol: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: symbol)
                .font(.system(.title2, weight: .semibold))
                .foregroundStyle(AppColor.plum)
                .accessibilityHidden(true)
            Text(title)
                .font(AppFont.cardTitle)
                .foregroundStyle(AppColor.ink)
                .multilineTextAlignment(.center)
            Text(message)
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .accessibilityElement(children: .combine)
    }
}

extension ConceptCategory {
    /// User-facing, capitalized label shown in the concept-detail header zone.
    var displayName: String {
        switch self {
        case .technique:
            return "Technique"
        case .sensation:
            return "Sensation"
        case .timing:
            return "Timing"
        case .psychological:
            return "Psychological"
        case .anatomy:
            return "Anatomy"
        }
    }
}
