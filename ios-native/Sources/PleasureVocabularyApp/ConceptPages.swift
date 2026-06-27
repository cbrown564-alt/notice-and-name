import SwiftUI
import PleasureVocabularyCore

// MARK: - Page model

/// The kind of idea a single page presents. Pages compose from a concept's
/// content blocks (plus a synthesized cover), one big idea per screen.
enum ConceptPageKind {
    case cover
    case recognize
    case name        // the `definition` block — "the word"
    case see         // the `media` block — illustration or native diagram
    case understand  // the `mechanism` block — research + citations
    case reflect     // the `reflection` block + private note + resonance
    case keep        // a phrase to carry away
}

/// One page in a concept's contemplative descent.
struct ConceptPage: Identifiable {
    let id: String
    let kind: ConceptPageKind
    let block: ContentBlock?

    /// The ambient accent for this idea — used as a soft full-screen wash so
    /// moving to a new hue signals moving to a new kind of thought.
    var accent: Color {
        switch kind {
        case .cover:      return AppColor.gold
        case .recognize:  return AppColor.blush
        case .name:       return AppColor.plum
        case .see:        return AppColor.gold
        case .understand: return AppColor.moss
        case .reflect:    return AppColor.secondaryInk
        case .keep:       return AppColor.gold
        }
    }

    /// Short name used by the on-demand index and VoiceOver.
    var indexLabel: String {
        switch kind {
        case .cover:      return "Cover"
        case .recognize:  return "Recognize"
        case .name:       return "Name"
        case .see:        return "See"
        case .understand: return "Understand"
        case .reflect:    return "Reflect"
        case .keep:       return "Keep"
        }
    }

    /// Builds the page list for a concept: a cover, then a page per block in
    /// authored order. Unmapped block types are skipped.
    static func pages(for concept: Concept) -> [ConceptPage] {
        var pages: [ConceptPage] = [ConceptPage(id: "cover", kind: .cover, block: nil)]
        for block in concept.blocks {
            let kind: ConceptPageKind?
            switch block.type {
            case .recognize:  kind = .recognize
            case .definition: kind = .name
            case .media:      kind = .see
            case .mechanism:  kind = .understand
            case .reflection: kind = .reflect
            case .phrase:     kind = .keep
            }
            if let kind {
                pages.append(ConceptPage(id: block.id, kind: kind, block: block))
            }
        }
        return pages
    }
}

// MARK: - Paged container

/// The concept-detail experience: a vertical descent through one idea at a
/// time, with an ambient color wash, an "arrival breath" as each page settles,
/// and a soft haptic per settle. Degrades to a continuous scroll at large
/// Dynamic Type sizes so nothing clips, and collapses all motion under Reduce
/// Motion.
struct ConceptPagesView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @State private var currentPageID: String?
    @State private var showIndex = false

    private var pages: [ConceptPage] { ConceptPage.pages(for: concept) }

    var body: some View {
        ZStack {
            ambientWash
            if dynamicTypeSize.isAccessibilitySize {
                accessibleScroll
            } else {
                pagedScroll
            }
        }
        // The orientation layer: a faint dot column that expands, on demand,
        // into a named index. Hidden at accessibility text sizes (which use the
        // continuous scroll).
        .overlay(alignment: .trailing) {
            if !dynamicTypeSize.isAccessibilitySize && !showIndex {
                dotColumn.padding(.trailing, 6)
            }
        }
        .overlay {
            if showIndex { indexSheet }
        }
        .onAppear {
            if currentPageID == nil { currentPageID = pages.first?.id }
        }
        .onChange(of: currentPageID) { _, _ in
            NativeHaptics.selection()
        }
    }

    // A quiet position cue: one mark per idea, the current one emphasized in its
    // accent. Tapping reveals the named index.
    private var dotColumn: some View {
        Button {
            withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.2)) { showIndex = true }
        } label: {
            VStack(spacing: 7) {
                ForEach(pages) { page in
                    let current = page.id == currentPageID
                    Capsule()
                        .fill(current ? page.accent : AppColor.secondaryInk.opacity(0.3))
                        .frame(width: current ? 6 : 5, height: current ? 14 : 5)
                }
            }
            .padding(10)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Show the concept's index")
    }

    // The on-demand named index. Tap an idea to descend straight to it.
    private var indexSheet: some View {
        ZStack(alignment: .trailing) {
            Color.black.opacity(0.06)
                .ignoresSafeArea()
                .onTapGesture { withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.2)) { showIndex = false } }
            VStack(alignment: .leading, spacing: 0) {
                ForEach(pages) { page in
                    let current = page.id == currentPageID
                    Button {
                        withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.45)) {
                            currentPageID = page.id
                        }
                        withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.2)) { showIndex = false }
                    } label: {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(page.accent)
                                .frame(width: 6, height: 6)
                                .opacity(current ? 1 : 0.35)
                            Text(page.indexLabel)
                                .font(AppFont.note)
                                .foregroundStyle(current ? AppColor.ink : AppColor.secondaryInk)
                            Spacer(minLength: 0)
                        }
                        .padding(.vertical, 9)
                        .padding(.horizontal, 16)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.vertical, 8)
            .frame(minWidth: 168, alignment: .leading)
            .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 16))
            .overlay {
                RoundedRectangle(cornerRadius: 16).stroke(AppColor.line, lineWidth: 1)
            }
            .shadow(color: .black.opacity(0.10), radius: 14, y: 5)
            .padding(.trailing, 14)
            .transition(reduceMotion ? .opacity : .move(edge: .trailing).combined(with: .opacity))
        }
    }

    // The full-screen paging descent (default).
    private var pagedScroll: some View {
        // Capture the main-actor value locally so the @Sendable scrollTransition
        // closure references a plain Bool, not the actor-isolated environment.
        let animate = !reduceMotion
        return ScrollView(.vertical) {
            LazyVStack(spacing: 0) {
                ForEach(pages) { page in
                    ConceptPageView(model: model, concept: concept, page: page, layout: .page)
                        .containerRelativeFrame(.vertical)
                        .scrollTransition { content, phase in
                            content
                                .opacity(animate ? (phase.isIdentity ? 1 : 0.12) : 1)
                                .scaleEffect(animate ? (phase.isIdentity ? 1 : 0.97) : 1)
                                .offset(y: animate ? phase.value * -18 : 0)
                        }
                        .id(page.id)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.paging)
        .scrollPosition(id: $currentPageID)
        .scrollIndicators(.hidden)
    }

    // A calm continuous fallback for accessibility text sizes (no forced snap,
    // so a single idea can exceed the screen without clipping).
    private var accessibleScroll: some View {
        ScrollView(.vertical) {
            VStack(spacing: 32) {
                ForEach(pages) { page in
                    ConceptPageView(model: model, concept: concept, page: page, layout: .flow)
                }
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 28)
        }
    }

    private var accentColor: Color {
        (pages.first { $0.id == currentPageID } ?? pages.first)?.accent ?? AppColor.canvas
    }

    private var ambientWash: some View {
        ZStack {
            AppColor.canvas
            accentColor.opacity(0.12)
        }
        .ignoresSafeArea()
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.55), value: currentPageID)
    }
}

// MARK: - Page dispatch + scaffold

/// Renders a single page's content for the chosen layout.
struct ConceptPageView: View {
    enum Layout { case page, flow }

    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let page: ConceptPage
    let layout: Layout

    var body: some View {
        if case .cover = page.kind {
            // The cover is a full-bleed mood image, so it bypasses the padded scaffold.
            CoverPageBody(concept: concept, layout: layout)
        } else {
            PageScaffold(layout: layout) {
                switch page.kind {
                case .cover:      EmptyView()
                case .recognize:  RecognizePageBody(page: page)
                case .name:       NamePageBody(concept: concept, page: page)
                case .see:        SeePageBody(model: model, concept: concept, page: page)
                case .understand: UnderstandPageBody(concept: concept, page: page)
                case .reflect:    ReflectPageBody(model: model, concept: concept, page: page)
                case .keep:       KeepPageBody(model: model, concept: concept, page: page)
                }
            }
        }
    }
}

/// Centers a page's content in the full screen (paged) or lets it flow
/// naturally (accessibility scroll). Consistent leading alignment and margins.
private struct PageScaffold<Content: View>: View {
    let layout: ConceptPageView.Layout
    @ViewBuilder var content: Content

    var body: some View {
        let stack = VStack(alignment: .leading, spacing: 20) { content }
        switch layout {
        case .page:
            stack
                .padding(.horizontal, 30)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                // Reserve bottom space so content settles a touch above true center
                // rather than marooned in the middle of a large screen.
                .padding(.bottom, 72)
        case .flow:
            stack
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

/// A small uppercase, letter-spaced label that names the kind of idea.
private struct PageLabel: View {
    let text: String
    let accent: Color

    var body: some View {
        Text(text.uppercased())
            .font(AppFont.label)
            .tracking(2)
            .foregroundStyle(accent)
            .accessibilityAddTraits(.isHeader)
    }
}

// MARK: - Page bodies

/// The cover is an atmospheric "mood" image that opens the concept without
/// naming it (the name is given its own page). Full-bleed in the paged layout.
private struct CoverPageBody: View {
    let concept: Concept
    let layout: ConceptPageView.Layout

    var body: some View {
        if layout == .page {
            fullBleed
        } else {
            flow
        }
    }

    private var fullBleed: some View {
        ZStack(alignment: .bottomLeading) {
            Group {
                if let image = BundledMedia.thumbnail(forConceptId: concept.id) {
                    image.resizable().scaledToFill()
                } else {
                    AppColor.canvas
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()

            // Soft bottom scrim so the label and hint stay legible over the art.
            LinearGradient(
                colors: [AppColor.canvas.opacity(0.0), AppColor.canvas.opacity(0.85)],
                startPoint: .center,
                endPoint: .bottom
            )

            VStack(alignment: .leading, spacing: 12) {
                Text(concept.category.displayName.uppercased())
                    .font(AppFont.label)
                    .tracking(2)
                    .foregroundStyle(AppColor.secondaryInk)
                SwipeHint()
            }
            .padding(.horizontal, 30)
            .padding(.bottom, 40)
        }
        .clipped()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(concept.name), \(concept.category.displayName)")
    }

    private var flow: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let image = BundledMedia.thumbnail(forConceptId: concept.id) {
                image
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            Text(concept.category.displayName.uppercased())
                .font(AppFont.label)
                .tracking(2)
                .foregroundStyle(AppColor.secondaryInk)
        }
    }
}

private struct RecognizePageBody: View {
    let page: ConceptPage

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            PageLabel(text: "Recognize", accent: page.accent)
            Text(page.block?.body ?? "")
                .font(.system(.title, design: .serif).italic())
                .foregroundStyle(AppColor.ink)
                .lineSpacing(7)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

private struct NamePageBody: View {
    let concept: Concept
    let page: ConceptPage

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            PageLabel(text: page.block?.title.isEmpty == false ? page.block!.title : "The word", accent: page.accent)
            Text(concept.name)
                .font(.system(.title, design: .serif, weight: .semibold))
                .foregroundStyle(AppColor.ink)
                .fixedSize(horizontal: false, vertical: true)
            Text(page.block?.body ?? concept.definition)
                .font(.system(.title3, design: .serif))
                .foregroundStyle(AppColor.secondaryInk)
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)
            CitationsView(concept: concept, block: page.block)
        }
    }
}

private struct SeePageBody: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let page: ConceptPage
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            PageLabel(text: page.block?.title.isEmpty == false ? page.block!.title : "See", accent: page.accent)
            mediaView
        }
    }

    // The pivotal "see how it works" moment: the demonstration video where one
    // ships and motion is allowed, otherwise the native diagram, otherwise the
    // mechanism illustration.
    @ViewBuilder
    private var mediaView: some View {
        let media = model.media(withId: page.block?.mediaId)
        if !reduceMotion, let videoURL = BundledMedia.videoURL(forConceptId: concept.id) {
            ConceptVideoView(url: videoURL, caption: media?.caption ?? media?.alt)
        } else if let media, media.kind == .diagram,
                  let id = ConceptDiagramView.diagramId(fromNativePath: media.path) {
            ConceptDiagramView(diagramId: id, caption: media.caption ?? media.alt)
        } else if let media, media.kind == .image {
            IllustrationCard(media: media)
        } else {
            MediaPlaceholderCard(systemImage: "photo", text: media?.caption ?? media?.alt ?? "Illustration")
        }
    }
}

private struct UnderstandPageBody: View {
    let concept: Concept
    let page: ConceptPage

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            PageLabel(text: page.block?.title.isEmpty == false ? page.block!.title : "Understand", accent: page.accent)
            Text(page.block?.body ?? "")
                .font(.system(.title2, design: .serif))
                .foregroundStyle(AppColor.ink)
                .lineSpacing(6)
                .fixedSize(horizontal: false, vertical: true)
            CitationsView(concept: concept, block: page.block)
        }
    }
}

private struct ReflectPageBody: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let page: ConceptPage

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            PageLabel(text: "Reflect", accent: page.accent)
            Text(page.block?.body ?? "")
                .font(.system(.title2, design: .serif).italic())
                .foregroundStyle(AppColor.ink)
                .lineSpacing(6)
                .fixedSize(horizontal: false, vertical: true)
            ResonanceControl(model: model, concept: concept)
            NoteComposer(model: model, concept: concept)
        }
    }
}

private struct KeepPageBody: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let page: ConceptPage

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            PageLabel(text: "Keep", accent: page.accent)
            if let body = page.block?.body, !body.isEmpty {
                Text(body)
                    .font(.system(.title3, design: .serif))
                    .foregroundStyle(AppColor.ink)
                    .lineSpacing(3)
                    .fixedSize(horizontal: false, vertical: true)
            }
            ForEach(concept.phraseTemplates) { template in
                PhraseKeepCard(model: model, concept: concept, template: template)
            }
        }
    }
}

// MARK: - Shared page pieces

/// Quietly surfaces a block's citations as `label — source`, never the id.
private struct CitationsView: View {
    let concept: Concept
    let block: ContentBlock?

    private var citations: [Citation] {
        guard let ids = block?.citationIds, !ids.isEmpty else { return [] }
        return ids.compactMap { id in concept.citations.first { $0.id == id } }
    }

    var body: some View {
        if !citations.isEmpty {
            VStack(alignment: .leading, spacing: 6) {
                ForEach(citations) { citation in
                    Text("\(citation.label) — \(citation.source)")
                        .font(AppFont.label)
                        .foregroundStyle(AppColor.secondaryInk)
                        .fixedSize(horizontal: false, vertical: true)
                        .accessibilityLabel("Source: \(citation.label), \(citation.source)")
                }
            }
            .padding(.top, 4)
        }
    }
}

/// A single quiet "this resonates" gesture. Tapping sets the concept's status
/// to `resonates` (with a warm haptic and a small bloom); tapping again releases
/// it back to `explored`. Other statuses live elsewhere, not as a forced fork.
private struct ResonanceControl: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var bloom = false

    private var isResonant: Bool { model.status(for: concept.id) == .resonates }

    var body: some View {
        Button {
            if isResonant {
                model.setStatus(.explored, for: concept.id)
            } else {
                model.setStatus(.resonates, for: concept.id)
                NativeHaptics.success()
                if !reduceMotion {
                    bloom = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { bloom = false }
                }
            }
        } label: {
            HStack(spacing: 10) {
                Image(systemName: isResonant ? "heart.fill" : "heart")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundStyle(isResonant ? AppColor.blush : AppColor.secondaryInk)
                    .scaleEffect(bloom ? 1.25 : 1)
                    .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.5), value: bloom)
                Text(isResonant ? "This resonates" : "Does this resonate?")
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.ink)
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 14)
            .background(
                (isResonant ? AppColor.blush : AppColor.line).opacity(isResonant ? 0.12 : 0.18),
                in: Capsule()
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel(isResonant ? "Marked as resonates. Tap to release." : "Mark this concept as resonates.")
    }
}

/// A frictionless private note: tap to write a line for yourself, save quietly.
private struct NoteComposer: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    @State private var draft = ""
    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            TextField("Keep a line for yourself…", text: $draft, axis: .vertical)
                .font(AppFont.body)
                .lineLimit(1...4)
                .focused($focused)
                .padding(12)
                .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 10))
                .overlay {
                    RoundedRectangle(cornerRadius: 10).stroke(AppColor.line, lineWidth: 1)
                }
            if !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                Button {
                    model.addFieldNote(body: draft, conceptId: concept.id)
                    draft = ""
                    focused = false
                    NativeHaptics.success()
                } label: {
                    Label("Save note", systemImage: "checkmark")
                        .font(AppFont.note)
                }
                .buttonStyle(.plain)
                .foregroundStyle(AppColor.plum)
            }
        }
    }
}

/// A phrase to carry away, with a quiet save that reflects its saved state.
private struct PhraseKeepCard: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let concept: Concept
    let template: PhraseTemplate

    private var isSaved: Bool {
        model.phrases(for: concept.id).contains { $0.body == template.body }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(template.body)
                .font(.system(.body, design: .serif))
                .foregroundStyle(AppColor.ink)
                .fixedSize(horizontal: false, vertical: true)
            Button {
                if !isSaved {
                    model.savePhrase(template, conceptId: concept.id)
                    NativeHaptics.success()
                }
            } label: {
                Label(isSaved ? "Kept" : "Keep this phrase",
                      systemImage: isSaved ? "bookmark.fill" : "bookmark")
                    .font(AppFont.note)
                    .foregroundStyle(isSaved ? AppColor.gold : AppColor.plum)
            }
            .buttonStyle(.plain)
            .disabled(isSaved)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppColor.gold.opacity(0.07), in: RoundedRectangle(cornerRadius: 12))
    }
}

/// A gentle "swipe up" affordance shown only on the cover.
private struct SwipeHint: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var lift = false

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "chevron.up")
                .font(.system(size: 13, weight: .semibold))
                .offset(y: reduceMotion ? 0 : (lift ? -3 : 0))
                .animation(reduceMotion ? nil : .easeInOut(duration: 1.1).repeatForever(autoreverses: true), value: lift)
            Text("Swipe up to begin")
                .font(AppFont.label)
        }
        .foregroundStyle(AppColor.secondaryInk)
        .onAppear { lift = true }
        .accessibilityHidden(true)
    }
}
