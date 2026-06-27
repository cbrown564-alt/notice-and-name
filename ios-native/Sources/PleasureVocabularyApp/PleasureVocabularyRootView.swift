import SwiftUI
import PleasureVocabularyCore

#if canImport(LocalAuthentication)
import LocalAuthentication
#endif

public struct PleasureVocabularyRootView: View {
    @StateObject private var model: PleasureVocabularyViewModel

    public init(model: PleasureVocabularyViewModel = PleasureVocabularyViewModel()) {
        _model = StateObject(wrappedValue: model)
    }

    public var body: some View {
        Group {
            if model.bundle.concepts.isEmpty {
                LoadErrorView(message: model.loadError)
            } else if !model.settings.completedOnboarding {
                OnboardingView(model: model)
            } else {
                LockGateView(model: model)
            }
        }
        .tint(AppColor.plum)
        .fullScreenAppBackground()
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

private struct LoadErrorView: View {
    let message: String?

    var body: some View {
        VStack(spacing: 18) {
            Image(systemName: "exclamationmark.lock")
                .font(.system(size: 34, weight: .semibold))
                .foregroundStyle(AppColor.blush)
            Text("Content unavailable")
                .font(AppFont.title)
            Text(message ?? "The local content bundle could not be opened.")
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
                .multilineTextAlignment(.center)
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
    @State private var isUnlocked = false

    var body: some View {
        if model.settings.appLockEnabled && !isUnlocked {
            LockScreen(isUnlocked: $isUnlocked)
        } else {
            MainTabView(model: model)
        }
    }
}

private struct LockScreen: View {
    @Binding var isUnlocked: Bool
    @State private var message = "Unlock your private vocabulary."

    var body: some View {
        VStack(spacing: 18) {
            Image(systemName: "lock.shield")
                .font(.system(size: 40, weight: .semibold))
                .foregroundStyle(AppColor.plum)
            Text("Locked")
                .font(AppFont.title)
            Text(message)
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
            Button {
                authenticate()
            } label: {
                Label("Unlock", systemImage: "faceid")
            }
            .buttonStyle(PrimaryButtonStyle())
            .frame(maxWidth: 360)
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
                        isUnlocked = true
                    } else {
                        message = authError?.localizedDescription ?? "Could not unlock."
                    }
                }
            }
        } else {
            NativeHaptics.selection()
            isUnlocked = true
        }
        #else
        isUnlocked = true
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
                    Text("Words you mark, note, or save will appear here.")
                        .font(AppFont.body)
                        .foregroundStyle(AppColor.secondaryInk)
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
    @State private var draftNote = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 10) {
                    Text(concept.name)
                        .font(AppFont.title)
                        .foregroundStyle(AppColor.ink)
                    Text(concept.definition)
                        .font(AppFont.body)
                        .foregroundStyle(AppColor.secondaryInk)
                    StatusPicker(status: model.status(for: concept.id)) { status in
                        model.setStatus(status, for: concept.id)
                    }
                }

                ForEach(concept.blocks) { block in
                    ContentBlockView(model: model, concept: concept, block: block)
                }

                QuietCard {
                    VStack(alignment: .leading, spacing: 10) {
                        Label("Field note", systemImage: "square.and.pencil")
                            .font(AppFont.section)
                        TextEditor(text: $draftNote)
                            .font(AppFont.body)
                            .frame(minHeight: 96)
                            .padding(8)
                            .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
                        Button {
                            model.addFieldNote(body: draftNote, conceptId: concept.id)
                            draftNote = ""
                        } label: {
                            Label("Save note", systemImage: "checkmark")
                        }
                        .buttonStyle(SecondaryButtonStyle())
                    }
                }

                PhraseTemplatesView(model: model, concept: concept)
                SavedStateView(model: model, concept: concept)
            }
            .padding(18)
        }
        .navigationTitle(concept.name)
        .compactNavigationTitle()
        .appScreenBackground()
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
                    Text("Private field notes will collect here.")
                        .font(AppFont.body)
                        .foregroundStyle(AppColor.secondaryInk)
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

private struct ContentBlockView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let block: ContentBlock

    var body: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 10) {
                Label(block.title, systemImage: symbolName)
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)
                Text(block.body)
                    .font(AppFont.body)
                    .foregroundStyle(AppColor.secondaryInk)
                if let media = model.media(withId: block.mediaId) {
                    MediaReferenceView(media: media)
                }
            }
        }
    }

    private var symbolName: String {
        switch block.type {
        case .recognize:
            return "eye"
        case .definition:
            return "textformat"
        case .mechanism:
            return "brain.head.profile"
        case .media:
            return "photo"
        case .reflection:
            return "pencil.and.scribble"
        case .phrase:
            return "quote.bubble"
        }
    }
}

private struct MediaReferenceView: View {
    let media: MediaItem
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: iconName)
                .foregroundStyle(AppColor.gold)
                .frame(width: 24)
            VStack(alignment: .leading, spacing: 4) {
                Text(media.caption ?? media.alt ?? "Media")
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.ink)
                Text(reduceMotion ? media.reducedMotionFallback : media.path)
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .lineLimit(2)
            }
        }
        .padding(10)
        .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
    }

    private var iconName: String {
        switch media.kind {
        case .image:
            return "photo"
        case .video:
            return reduceMotion ? "photo" : "play.rectangle"
        case .diagram:
            return "point.3.connected.trianglepath.dotted"
        }
    }
}

private struct PhraseTemplatesView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept

    var body: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 12) {
                Label("Phrase", systemImage: "quote.bubble")
                    .font(AppFont.section)
                ForEach(concept.phraseTemplates) { template in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(template.label)
                            .font(AppFont.cardTitle)
                        Text(template.body)
                            .font(AppFont.body)
                            .foregroundStyle(AppColor.secondaryInk)
                        Button {
                            model.savePhrase(template, conceptId: concept.id)
                        } label: {
                            Label("Save phrase", systemImage: "bookmark")
                        }
                        .buttonStyle(SecondaryButtonStyle())
                    }
                    .padding(.vertical, 6)
                }
            }
        }
    }
}

private struct SavedStateView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept

    var body: some View {
        let phrases = model.phrases(for: concept.id)
        let notes = model.notes(for: concept.id)

        if !phrases.isEmpty || !notes.isEmpty {
            QuietCard {
                VStack(alignment: .leading, spacing: 12) {
                    Label("Saved here", systemImage: "tray.full")
                        .font(AppFont.section)
                    ForEach(phrases) { phrase in
                        Text(phrase.body)
                            .font(AppFont.note)
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
                    }
                    ForEach(notes) { note in
                        Text(note.body)
                            .font(AppFont.note)
                            .foregroundStyle(AppColor.secondaryInk)
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
                    }
                }
            }
        }
    }
}

private struct StatusPicker: View {
    let status: ConceptStatus
    let onChange: (ConceptStatus) -> Void

    var body: some View {
        HStack {
            StatusPill(status: status)
            Spacer()
            Menu {
                ForEach(ConceptStatus.allCases, id: \.self) { item in
                    Button(item.displayName) {
                        onChange(item)
                    }
                }
            } label: {
                Label("Change status", systemImage: "slider.horizontal.3")
            }
            .font(AppFont.note)
        }
        .padding(12)
        .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 8))
        .overlay {
            RoundedRectangle(cornerRadius: 8)
                .stroke(AppColor.line, lineWidth: 1)
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
