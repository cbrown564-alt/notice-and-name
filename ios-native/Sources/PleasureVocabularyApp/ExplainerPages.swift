import SwiftUI
import PleasureVocabularyCore

#if canImport(UIKit)
import UIKit
#endif

enum ExplainerMedia {
    static func heroImage(for media: MediaItem?) -> Image? {
        guard let media, media.kind == .image else { return nil }
        let filename = (media.path as NSString).lastPathComponent
        let basename = (filename as NSString).deletingPathExtension
        guard let url = Bundle.module.url(
            forResource: basename,
            withExtension: "png",
            subdirectory: "media/explainers"
        ) else {
            return nil
        }
        #if canImport(UIKit)
        guard let uiImage = UIImage(contentsOfFile: url.path) else { return nil }
        return Image(uiImage: uiImage)
        #else
        return nil
        #endif
    }
}

struct ExplainerSummaryRow: View {
    let explainer: ResearchExplainer
    let heroMedia: MediaItem?

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            heroThumbnail
                .frame(width: 72, height: 72)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(AppColor.line.opacity(0.8), lineWidth: 1)
                }

            VStack(alignment: .leading, spacing: 6) {
                Text(explainer.title)
                    .font(AppFont.cardTitle)
                    .foregroundStyle(AppColor.ink)
                Text(explainer.subtitle)
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.secondaryInk)
                    .fixedSize(horizontal: false, vertical: true)
                Label(explainer.readTime, systemImage: "clock")
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
            }
        }
        .padding(.vertical, 6)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(explainer.title). \(explainer.subtitle). \(explainer.readTime)")
    }

    @ViewBuilder
    private var heroThumbnail: some View {
        if let image = ExplainerMedia.heroImage(for: heroMedia) {
            image
                .resizable()
                .scaledToFill()
        } else {
            ZStack {
                AppColor.moss.opacity(0.12)
                Image(systemName: explainer.icon)
                    .font(.title2)
                    .foregroundStyle(AppColor.moss)
            }
        }
    }
}

struct ExplainerDetailView: View {
    @ObservedObject var model: PleasureVocabularyViewModel
    let explainer: ResearchExplainer

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                heroHeader
                overviewSection
                takeawaysSection

                ForEach(explainer.sections) { section in
                    sectionBlock(section)
                }

                if !explainer.misconceptions.isEmpty {
                    misconceptionsSection
                }

                if !explainer.keySources.isEmpty {
                    sourcesSection
                }

                if !explainer.relatedConceptIds.isEmpty {
                    relatedConceptsSection
                }
            }
            .padding(18)
        }
        .navigationTitle(explainer.title)
        .compactNavigationTitle()
        .appScreenBackground()
    }

    private var heroHeader: some View {
        VStack(alignment: .leading, spacing: 14) {
            if let heroMedia = model.media(withId: explainer.heroImageId),
               let image = ExplainerMedia.heroImage(for: heroMedia) {
                image
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity)
                    .frame(height: 180)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }

            Text(explainer.subtitle)
                .font(AppFont.section)
                .foregroundStyle(AppColor.plum)

            Label(explainer.readTime, systemImage: "clock")
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
        }
    }

    private var overviewSection: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Overview")
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)
                Text(explainer.overview)
                    .font(AppFont.body)
                    .foregroundStyle(AppColor.secondaryInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var takeawaysSection: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 12) {
                Text("Key Takeaways")
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)
                ForEach(Array(explainer.keyTakeaways.enumerated()), id: \.offset) { _, takeaway in
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(AppColor.moss)
                            .font(.footnote)
                            .padding(.top, 2)
                        Text(takeaway)
                            .font(AppFont.body)
                            .foregroundStyle(AppColor.ink)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private func sectionBlock(_ section: ExplainerSection) -> some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 14) {
                Text(section.title)
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)

                ForEach(Array(section.contentBlocks.enumerated()), id: \.offset) { _, block in
                    contentBlockView(block)
                }

                if let statistic = section.statistic {
                    statisticView(statistic)
                }
            }
        }
    }

    @ViewBuilder
    private func contentBlockView(_ block: ExplainerContentBlock) -> some View {
        switch block.type {
        case .text:
            Text(block.body)
                .font(AppFont.body)
                .foregroundStyle(AppColor.secondaryInk)
                .fixedSize(horizontal: false, vertical: true)
        case .quote:
            VStack(alignment: .leading, spacing: 8) {
                Text("“\(block.body)”")
                    .font(AppFont.body)
                    .italic()
                    .foregroundStyle(AppColor.plum)
                    .fixedSize(horizontal: false, vertical: true)
                if let attribution = block.attribution, !attribution.isEmpty {
                    Text("— \(attribution)")
                        .font(AppFont.label)
                        .foregroundStyle(AppColor.secondaryInk)
                }
            }
            .padding(.vertical, 4)
        case .callout:
            VStack(alignment: .leading, spacing: 8) {
                if let title = block.title, !title.isEmpty {
                    Text(title)
                        .font(AppFont.cardTitle)
                        .foregroundStyle(AppColor.gold)
                }
                Text(block.body)
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.ink)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppColor.gold.opacity(0.12), in: RoundedRectangle(cornerRadius: 8))
        }
    }

    private func statisticView(_ statistic: ExplainerStatistic) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(statistic.value)
                .font(AppFont.title)
                .foregroundStyle(AppColor.plum)
            Text(statistic.label)
                .font(AppFont.body)
                .foregroundStyle(AppColor.ink)
            Text(statistic.source)
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColor.plum.opacity(0.08), in: RoundedRectangle(cornerRadius: 8))
    }

    private var misconceptionsSection: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 14) {
                Text("Myth vs Fact")
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)

                ForEach(explainer.misconceptions) { item in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(item.myth)
                            .font(AppFont.cardTitle)
                            .foregroundStyle(AppColor.blush)
                        Text(item.fact)
                            .font(AppFont.body)
                            .foregroundStyle(AppColor.secondaryInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
    }

    private var sourcesSection: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 14) {
                Text("Sources")
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)

                ForEach(explainer.keySources) { source in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(source.citation)
                            .font(AppFont.cardTitle)
                            .foregroundStyle(AppColor.ink)
                        Text(source.finding)
                            .font(AppFont.note)
                            .foregroundStyle(AppColor.secondaryInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private var relatedConceptsSection: some View {
        QuietCard {
            VStack(alignment: .leading, spacing: 12) {
                Text("Related Words")
                    .font(AppFont.section)
                    .foregroundStyle(AppColor.ink)

                ForEach(explainer.relatedConceptIds, id: \.self) { conceptId in
                    if let concept = model.concept(withId: conceptId) {
                        NavigationLink {
                            ConceptPagesView(model: model, concept: concept)
                                .navigationTitle(concept.name)
                                .compactNavigationTitle()
                                .onAppear {
                                    model.markOpened(concept.id)
                                }
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(concept.name)
                                        .font(AppFont.cardTitle)
                                        .foregroundStyle(AppColor.ink)
                                    Text(concept.definition)
                                        .font(AppFont.note)
                                        .foregroundStyle(AppColor.secondaryInk)
                                        .lineLimit(2)
                                }
                                Spacer(minLength: 8)
                                Image(systemName: "chevron.right")
                                    .font(.caption.weight(.semibold))
                                    .foregroundStyle(AppColor.secondaryInk)
                            }
                        }
                    }
                }
            }
        }
    }
}
