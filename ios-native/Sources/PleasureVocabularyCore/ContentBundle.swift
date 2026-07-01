import Foundation

public struct ContentBundle: Codable, Equatable, Sendable {
    public let schemaVersion: Int
    public let bundleId: String
    public let contentVersion: String
    public let generatedAt: String
    public let concepts: [Concept]
    public let pathways: [Pathway]
    public let media: [MediaItem]
    public let explainers: [ResearchExplainer]

    public static let empty = ContentBundle(
        schemaVersion: 1,
        bundleId: "empty",
        contentVersion: "0.0.0",
        generatedAt: "1970-01-01T00:00:00Z",
        concepts: [],
        pathways: [],
        media: [],
        explainers: []
    )

    public init(
        schemaVersion: Int,
        bundleId: String,
        contentVersion: String,
        generatedAt: String,
        concepts: [Concept],
        pathways: [Pathway],
        media: [MediaItem],
        explainers: [ResearchExplainer] = []
    ) {
        self.schemaVersion = schemaVersion
        self.bundleId = bundleId
        self.contentVersion = contentVersion
        self.generatedAt = generatedAt
        self.concepts = concepts
        self.pathways = pathways
        self.media = media
        self.explainers = explainers
    }

    private enum CodingKeys: String, CodingKey {
        case schemaVersion
        case bundleId
        case contentVersion
        case generatedAt
        case concepts
        case pathways
        case media
        case explainers
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        schemaVersion = try container.decode(Int.self, forKey: .schemaVersion)
        bundleId = try container.decode(String.self, forKey: .bundleId)
        contentVersion = try container.decode(String.self, forKey: .contentVersion)
        generatedAt = try container.decode(String.self, forKey: .generatedAt)
        concepts = try container.decode([Concept].self, forKey: .concepts)
        pathways = try container.decode([Pathway].self, forKey: .pathways)
        media = try container.decode([MediaItem].self, forKey: .media)
        explainers = try container.decodeIfPresent([ResearchExplainer].self, forKey: .explainers) ?? []
    }
}

public struct Concept: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let name: String
    public let category: ConceptCategory
    public let reviewStatus: ContentReviewStatus
    public let definition: String
    public let summary: String
    public let blocks: [ContentBlock]
    public let relatedConceptIds: [String]
    public let phraseTemplates: [PhraseTemplate]
    public let citations: [Citation]
    public let mediaIds: [String]?
}

public enum ConceptCategory: String, Codable, Sendable {
    case technique
    case sensation
    case timing
    case psychological
    case anatomy
}

public enum ContentReviewStatus: String, Codable, Sendable {
    case draft
    case reviewed
    case approved
    case retired
}

public struct ContentBlock: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let type: ContentBlockType
    public let title: String
    public let body: String
    public let citationIds: [String]?
    public let mediaId: String?
    public let privateByDefault: Bool?
}

public enum ContentBlockType: String, Codable, Sendable {
    case recognize
    case definition
    case mechanism
    case media
    case reflection
    case phrase
}

public struct PhraseTemplate: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let label: String
    public let body: String
    public let tone: PhraseTone
    public let useCase: PhraseUseCase
}

public enum PhraseTone: String, Codable, Sendable {
    case soft
    case direct
    case curious
    case reassuring
}

public enum PhraseUseCase: String, Codable, Sendable {
    case selfUnderstanding = "self-understanding"
    case partnerRequest = "partner-request"
    case boundary
    case curiosity
    case reassurance
}

public struct Citation: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let label: String
    public let source: String
    public let note: String?
}

public struct Pathway: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let name: String
    public let summary: String
    public let intent: PathwayIntent
    public let conceptIds: [String]
}

public enum PathwayIntent: String, Codable, Sendable {
    case understandBody = "understand-body"
    case noticePatterns = "notice-patterns"
    case communicate
    case trySomething = "try-something"
    case returnToPresence = "return-to-presence"
}

public struct MediaItem: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let kind: MediaKind
    public let path: String
    public let alt: String?
    public let caption: String?
    public let reducedMotionFallback: String
}

public enum MediaKind: String, Codable, Sendable {
    case image
    case video
    case diagram
}

public struct ResearchExplainer: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let title: String
    public let subtitle: String
    public let icon: String
    public let heroImageId: String?
    public let readTime: String
    public let overview: String
    public let keyTakeaways: [String]
    public let sections: [ExplainerSection]
    public let misconceptions: [ExplainerMisconception]
    public let keySources: [ExplainerSource]
    public let relatedConceptIds: [String]
    public let relatedExplainerIds: [String]
}

public struct ExplainerSection: Codable, Equatable, Sendable, Identifiable {
    public var id: String { title }
    public let title: String
    public let contentBlocks: [ExplainerContentBlock]
    public let statistic: ExplainerStatistic?
}

public struct ExplainerContentBlock: Codable, Equatable, Sendable, Identifiable {
    public var id: String {
        switch type {
        case .text: return "text-\(body.hashValue)"
        case .quote: return "quote-\(body.hashValue)"
        case .callout: return "callout-\((title ?? body).hashValue)"
        }
    }

    public let type: ExplainerContentBlockType
    public let body: String
    public let title: String?
    public let attribution: String?
}

public enum ExplainerContentBlockType: String, Codable, Sendable {
    case text
    case quote
    case callout
}

public struct ExplainerStatistic: Codable, Equatable, Sendable {
    public let value: String
    public let label: String
    public let source: String
}

public struct ExplainerMisconception: Codable, Equatable, Sendable, Identifiable {
    public var id: String { myth }
    public let myth: String
    public let fact: String
}

public struct ExplainerSource: Codable, Equatable, Sendable, Identifiable {
    public var id: String { citation }
    public let citation: String
    public let finding: String
}

public struct ContentBundleUpdatePlan: Equatable, Sendable {
    public let fromBundleId: String
    public let toBundleId: String
    public let fromContentVersion: String
    public let toContentVersion: String
    public let schemaVersion: Int
    public let retainedConceptIds: [String]
    public let addedConceptIds: [String]
    public let removedConceptIds: [String]

    public var isSchemaCompatible: Bool {
        schemaVersion == ContentBundleValidator.supportedSchemaVersion
    }

    public init(from oldBundle: ContentBundle, to newBundle: ContentBundle) {
        let oldConceptIds = Set(oldBundle.concepts.map(\.id))
        let newConceptIds = Set(newBundle.concepts.map(\.id))

        self.fromBundleId = oldBundle.bundleId
        self.toBundleId = newBundle.bundleId
        self.fromContentVersion = oldBundle.contentVersion
        self.toContentVersion = newBundle.contentVersion
        self.schemaVersion = newBundle.schemaVersion
        self.retainedConceptIds = newConceptIds.intersection(oldConceptIds).sorted()
        self.addedConceptIds = newConceptIds.subtracting(oldConceptIds).sorted()
        self.removedConceptIds = oldConceptIds.subtracting(newConceptIds).sorted()
    }
}
