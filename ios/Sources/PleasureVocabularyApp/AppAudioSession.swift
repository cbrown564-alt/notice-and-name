import Foundation
import AVFoundation

/// Configures the shared AVAudioSession for intentional voice playback.
///
/// Choice: `.playback` when the user taps play for VO/narration so audio continues
/// with the silent switch off and ducks politely under other apps as needed.
/// SFX rides the same session once VO has activated it; we never autoplay on appear.
@MainActor
enum AppAudioSession {
    private static var didConfigure = false

    static func activateForPlayback() {
        #if os(iOS)
        guard !didConfigure else {
            try? AVAudioSession.sharedInstance().setActive(true)
            return
        }
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
            try session.setActive(true)
            didConfigure = true
        } catch {
            // Playback may still work with the system default session.
        }
        #endif
    }
}
