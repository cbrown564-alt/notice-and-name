import Foundation
import AVFoundation
import Combine

/// Shared voice + SFX player. Voice playlists and single URLs share one player;
/// SFX uses a second `AVAudioPlayer` so soft UI sounds do not cancel narration.
@MainActor
public final class AppAudioPlayer: NSObject, ObservableObject {
    public static let shared = AppAudioPlayer()

    @Published public private(set) var isPlaying = false

    public var isPaused: Bool {
        guard let voicePlayer else { return false }
        return !voicePlayer.isPlaying && voicePlayer.currentTime > 0
    }
    @Published public var soundEffectsEnabled = true
    @Published public var voiceGuidanceEnabled = true

    private var voicePlayer: AVAudioPlayer?
    private var sfxPlayer: AVAudioPlayer?
    private var playlist: [URL] = []
    private var playlistIndex = 0

    private override init() {
        super.init()
    }

    public func play(_ url: URL) {
        guard voiceGuidanceEnabled else { return }
        stopVoice()
        playlist = []
        playlistIndex = 0
        startVoice(url)
    }

    public func playPlaylist(_ urls: [URL]) {
        guard voiceGuidanceEnabled else { return }
        stopVoice()
        playlist = urls
        playlistIndex = 0
        guard let first = urls.first else { return }
        startVoice(first)
    }

    public func stop() {
        stopVoice()
    }

    public func togglePlayPause() {
        guard let voicePlayer else { return }
        if voicePlayer.isPlaying {
            voicePlayer.pause()
            isPlaying = false
        } else {
            AppAudioSession.activateForPlayback()
            voicePlayer.play()
            isPlaying = true
        }
    }

    public func playSFX(_ name: String) {
        guard soundEffectsEnabled, let url = SoundCatalog.sfx(name) else { return }
        playSFX(url: url)
    }

    public func playSFX(url: URL) {
        guard soundEffectsEnabled else { return }
        AppAudioSession.activateForPlayback()
        do {
            let player = try AVAudioPlayer(contentsOf: url)
            player.prepareToPlay()
            sfxPlayer = player
            player.play()
        } catch {
            // Soft failure — SFX is optional polish.
        }
    }

    /// Soft unlock chime used after a successful StoreKit full-library purchase.
    public func playUnlockSFX() {
        playSFX("unlock")
    }

    private func startVoice(_ url: URL) {
        AppAudioSession.activateForPlayback()
        do {
            let player = try AVAudioPlayer(contentsOf: url)
            player.delegate = self
            player.prepareToPlay()
            voicePlayer = player
            isPlaying = player.play()
        } catch {
            isPlaying = false
        }
    }

    private func stopVoice() {
        voicePlayer?.stop()
        voicePlayer = nil
        playlist = []
        playlistIndex = 0
        isPlaying = false
    }

    private func advancePlaylist() {
        playlistIndex += 1
        guard playlistIndex < playlist.count else {
            stopVoice()
            return
        }
        startVoice(playlist[playlistIndex])
    }
}

extension AppAudioPlayer: AVAudioPlayerDelegate {
    nonisolated public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        Task { @MainActor in
            self.handleVoiceFinished()
        }
    }

    private func handleVoiceFinished() {
        if !playlist.isEmpty {
            advancePlaylist()
        } else {
            isPlaying = false
            voicePlayer = nil
        }
    }
}
