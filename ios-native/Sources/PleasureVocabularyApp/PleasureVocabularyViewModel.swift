import Foundation
import SwiftUI
import PleasureVocabularyCore

@MainActor
public final class PleasureVocabularyViewModel: ObservableObject {
    @Published public private(set) var bundle: ContentBundle = .empty
    @Published public private(set) var settings = AppSettings()
    @Published public private(set) var conceptStates: [String: UserConceptState] = [:]
    @Published public private(set) var fieldNotes: [FieldNote] = []
    @Published public private(set) var savedPhrases: [SavedPhrase] = []
    @Published public private(set) var pathwayProgress: [String: PathwayProgress] = [:]
    @Published public private(set) var loadError: String?
    @Published public var journalSearchText = ""
    @Published public var exportText: String?

    private var store: UserStore?

    public init(bundleURL: URL? = nil, store: UserStore? = nil) {
        do {
            let resolvedBundleURL = bundleURL ?? Bundle.module.url(forResource: "v2-full.bundle", withExtension: "json")
            guard let resolvedBundleURL else {
                throw CocoaError(.fileNoSuchFile)
            }

            let loadedBundle = try ContentBundleLoader.load(from: resolvedBundleURL)
            let liveStore = try store ?? UserStore(path: Self.databaseURL().path)
            self.bundle = loadedBundle
            self.store = liveStore
            try liveStore.recordInstalledContent(bundle: loadedBundle)
            try refresh()
        } catch {
            self.store = nil
            self.bundle = .empty
            self.loadError = error.localizedDescription
        }
    }

    public var todayConcept: Concept? {
        bundle.concepts.first { concept in
            let status = status(for: concept.id)
            return status == .unexplored || status == .explored || status == .curious
        } ?? bundle.concepts.first
    }

    public var vocabularyConcepts: [Concept] {
        let phraseConceptIds = Set(savedPhrases.map(\.conceptId))
        let noteConceptIds = Set(fieldNotes.compactMap(\.conceptId))
        return bundle.concepts.filter { concept in
            let state = conceptStates[concept.id]
            return state?.status != nil
                && state?.status != .unexplored
                || phraseConceptIds.contains(concept.id)
                || noteConceptIds.contains(concept.id)
        }
    }

    public var filteredFieldNotes: [FieldNote] {
        let query = journalSearchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return fieldNotes }
        return fieldNotes.filter { note in
            note.body.localizedCaseInsensitiveContains(query)
                || (note.conceptId?.localizedCaseInsensitiveContains(query) ?? false)
        }
    }

    public func concept(withId id: String) -> Concept? {
        bundle.concepts.first { $0.id == id }
    }

    public func media(withId id: String?) -> MediaItem? {
        guard let id else { return nil }
        return bundle.media.first { $0.id == id }
    }

    public func status(for conceptId: String) -> ConceptStatus {
        conceptStates[conceptId]?.status ?? .unexplored
    }

    public func phrases(for conceptId: String) -> [SavedPhrase] {
        savedPhrases.filter { $0.conceptId == conceptId }
    }

    public func notes(for conceptId: String) -> [FieldNote] {
        fieldNotes.filter { $0.conceptId == conceptId }
    }

    public func completeOnboarding(appLockEnabled: Bool) {
        do {
            try store?.acceptPrivacyPledge(appLockEnabled: appLockEnabled)
            NativeHaptics.success()
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func markOpened(_ conceptId: String) {
        do {
            try store?.markConceptOpened(conceptId)
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func setStatus(_ status: ConceptStatus, for conceptId: String) {
        do {
            try store?.setConceptStatus(status, for: conceptId)
            NativeHaptics.selection()
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func addFieldNote(body: String, conceptId: String?, pathwayId: String? = nil) {
        let trimmed = body.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        do {
            try store?.addFieldNote(FieldNote(conceptId: conceptId, pathwayId: pathwayId, body: trimmed))
            NativeHaptics.success()
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func savePhrase(_ template: PhraseTemplate, conceptId: String) {
        do {
            try store?.savePhrase(
                SavedPhrase(
                    conceptId: conceptId,
                    templateId: template.id,
                    body: template.body,
                    tone: template.tone
                )
            )
            NativeHaptics.success()
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func updatePathway(_ pathway: Pathway, currentConceptId: String?, completedConceptId: String? = nil) {
        do {
            var completed = pathwayProgress[pathway.id]?.completedConceptIds ?? []
            if let completedConceptId, !completed.contains(completedConceptId) {
                completed.append(completedConceptId)
            }
            try store?.updatePathwayProgress(
                PathwayProgress(
                    pathwayId: pathway.id,
                    currentConceptId: currentConceptId,
                    completedConceptIds: completed
                )
            )
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func setAppLockEnabled(_ enabled: Bool) {
        updateSettings { settings in
            settings.appLockEnabled = enabled
        }
    }

    public func setReduceSensitivePreviews(_ enabled: Bool) {
        updateSettings { settings in
            settings.reduceSensitivePreviews = enabled
        }
    }

    public func prepareExport() {
        do {
            guard let data = try store?.exportJSONData() else { return }
            exportText = String(decoding: data, as: UTF8.self)
            NativeHaptics.success()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func deleteAllData() {
        do {
            try store?.deleteAllData()
            exportText = nil
            NativeHaptics.warning()
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    public func clearError() {
        loadError = nil
    }

    private func updateSettings(_ transform: (inout AppSettings) -> Void) {
        do {
            var next = try store?.loadSettings() ?? settings
            transform(&next)
            try store?.saveSettings(next)
            try refresh()
        } catch {
            loadError = error.localizedDescription
        }
    }

    private func refresh() throws {
        guard let store else { return }
        settings = try store.loadSettings()
        conceptStates = Dictionary(uniqueKeysWithValues: try store.allConceptStates().map { ($0.conceptId, $0) })
        fieldNotes = try store.fieldNotes()
        savedPhrases = try store.savedPhrases()
        pathwayProgress = Dictionary(uniqueKeysWithValues: try store.pathwayProgress().map { ($0.pathwayId, $0) })
    }

    private static func databaseURL() throws -> URL {
        let base = try FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let directory = base.appendingPathComponent("PleasureVocabulary", isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        return directory.appendingPathComponent("v2.sqlite")
    }
}
