import Foundation

public struct ContentBundle: Codable, Equatable, Sendable {
    public let schemaVersion: Int
    public let bundleId: String
    public let contentVersion: String
    public let generatedAt: String
    public let concepts: [Concept]
    public let pathways: [Pathway]
    public let media: [MediaItem]

    public static let empty = ContentBundle(
        schemaVersion: 1,
        bundleId: "empty",
        contentVersion: "0.0.0",
        generatedAt: "1970-01-01T00:00:00Z",
        concepts: [],
        pathways: [],
        media: []
    )

    public init(
        schemaVersion: Int,
        bundleId: String,
        contentVersion: String,
        generatedAt: String,
        concepts: [Concept],
        pathways: [Pathway],
        media: [MediaItem]
    ) {
        self.schemaVersion = schemaVersion
        self.bundleId = bundleId
        self.contentVersion = contentVersion
        self.generatedAt = generatedAt
        self.concepts = concepts
        self.pathways = pathways
        self.media = media
    }
}

public struct Concept: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let name: String
    public let category: ConceptCategory
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
}

public enum PhraseTone: String, Codable, Sendable {
    case soft
    case direct
    case curious
    case reassuring
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
    public let conceptIds: [String]
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
