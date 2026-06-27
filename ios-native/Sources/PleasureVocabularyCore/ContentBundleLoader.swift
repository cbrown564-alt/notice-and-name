import Foundation

public enum ContentBundleLoader {
    public static func load(from url: URL) throws -> ContentBundle {
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        return try decoder.decode(ContentBundle.self, from: data)
    }
}

public struct ContentBundleValidator {
    public static let supportedSchemaVersion = 1

    public init() {}

    public func validate(_ bundle: ContentBundle) -> [String] {
        var errors: [String] = []

        if bundle.schemaVersion != Self.supportedSchemaVersion {
            errors.append("schemaVersion must be \(Self.supportedSchemaVersion)")
        }
        if bundle.concepts.isEmpty {
            errors.append("concepts must not be empty")
        }

        let conceptIds = Set(bundle.concepts.map(\.id))
        let mediaIds = Set(bundle.media.map(\.id))

        appendDuplicateErrors(bundle.concepts.map(\.id), label: "concept", to: &errors)
        appendDuplicateErrors(bundle.pathways.map(\.id), label: "pathway", to: &errors)
        appendDuplicateErrors(bundle.media.map(\.id), label: "media", to: &errors)

        for concept in bundle.concepts {
            if concept.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                errors.append("\(concept.id).name must not be empty")
            }
            if concept.blocks.isEmpty {
                errors.append("\(concept.id).blocks must not be empty")
            }

            appendDuplicateErrors(concept.blocks.map(\.id), label: "\(concept.id) block", to: &errors)
            appendDuplicateErrors(concept.phraseTemplates.map(\.id), label: "\(concept.id) phrase", to: &errors)
            appendDuplicateErrors(concept.citations.map(\.id), label: "\(concept.id) citation", to: &errors)

            let citationIds = Set(concept.citations.map(\.id))

            for relatedId in concept.relatedConceptIds where !conceptIds.contains(relatedId) {
                errors.append("\(concept.id).relatedConceptIds references missing concept: \(relatedId)")
            }

            for mediaId in concept.mediaIds ?? [] where !mediaIds.contains(mediaId) {
                errors.append("\(concept.id).mediaIds references missing media: \(mediaId)")
            }

            for block in concept.blocks {
                if let mediaId = block.mediaId, !mediaIds.contains(mediaId) {
                    errors.append("\(concept.id).\(block.id).mediaId references missing media: \(mediaId)")
                }
                for citationId in block.citationIds ?? [] where !citationIds.contains(citationId) {
                    errors.append("\(concept.id).\(block.id).citationIds references missing citation: \(citationId)")
                }
            }
        }

        for pathway in bundle.pathways {
            if pathway.conceptIds.isEmpty {
                errors.append("\(pathway.id).conceptIds must not be empty")
            }
            for conceptId in pathway.conceptIds where !conceptIds.contains(conceptId) {
                errors.append("\(pathway.id).conceptIds references missing concept: \(conceptId)")
            }
        }

        return errors
    }

    private func appendDuplicateErrors(_ ids: [String], label: String, to errors: inout [String]) {
        var seen: Set<String> = []
        for id in ids {
            if seen.contains(id) {
                errors.append("Duplicate \(label) id: \(id)")
            }
            seen.insert(id)
        }
    }
}
