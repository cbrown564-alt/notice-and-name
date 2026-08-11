import Foundation

/// Resolves bundled Notice & Name audio URLs from `Resources/media/audio`.
/// Missing assets return `nil` — UI should hide play controls when absent.
public enum SoundCatalog {
    public static func phrase(id: String) -> URL? {
        url(resource: id, subdirectory: "media/audio/phrases")
    }

    public static func noticeMoment(conceptId: String) -> URL? {
        url(resource: conceptId, subdirectory: "media/audio/notice-moments")
    }

    public static func onboardingFull() -> URL? {
        url(resource: "00-full", subdirectory: "media/audio/onboarding")
    }

    public static func onboardingBeat(_ name: String) -> URL? {
        url(resource: name, subdirectory: "media/audio/onboarding")
    }

    /// Sorted explainer narration beats for an explainer id (`anatomy-101`, …).
    public static func explainerBeats(explainerId: String) -> [URL] {
        let prefix = explainerId + "-beat-"
        let urls = Bundle.module.urls(
            forResourcesWithExtension: "mp3",
            subdirectory: "media/audio/explainers"
        ) ?? []
        return urls
            .filter { $0.deletingPathExtension().lastPathComponent.hasPrefix(prefix) }
            .sorted {
                $0.deletingPathExtension().lastPathComponent
                    < $1.deletingPathExtension().lastPathComponent
            }
    }

    /// Soft UI SFX. Pass the effect name without version (`keep`, `notice-start`).
    public static func sfx(_ name: String) -> URL? {
        let resource = name.hasSuffix("-v1") || name.hasSuffix("-v2") ? name : name + "-v1"
        return url(resource: resource, subdirectory: "media/audio/sfx")
    }

    private static func url(resource: String, subdirectory: String) -> URL? {
        Bundle.module.url(forResource: resource, withExtension: "mp3", subdirectory: subdirectory)
    }
}
