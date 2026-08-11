import SwiftUI
import PleasureVocabularyCore

#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

#if canImport(AVFoundation)
import AVFoundation
#endif

// MARK: - Entry point

/// Renders one of the app's native vector diagrams for a `MediaItem` whose
/// `path` is `native://diagram/<id>`. These five concepts are drawn in-app
/// (no image asset ships for them). When Reduce Motion is off, diagrams are
/// user-driven with pan or tap gestures; when on, a static teaching
/// frame is shown. See `docs/INTERACTIVES.md`.
///
/// An unrecognised id falls back to the same framed placeholder used for
/// images/videos (`MediaPlaceholderCard`), so a new diagram id can ship before
/// its view exists without breaking the screen.
struct ConceptDiagramView: View {
    let diagramId: String
    let caption: String?

    /// Ids this view knows how to draw natively.
    static let knownDiagramIds: Set<String> = ["angling", "rocking", "shallowing", "pairing", "edging"]

    /// Returns the diagram id for a `native://diagram/<id>` path, or `nil` for
    /// any other path (so non-native diagrams keep the framed placeholder).
    static func diagramId(fromNativePath path: String) -> String? {
        let prefix = "native://diagram/"
        guard path.hasPrefix(prefix) else { return nil }
        let id = String(path.dropFirst(prefix.count))
        return id.isEmpty ? nil : id
    }

    private var accessibilityText: String {
        caption ?? "Diagram"
    }

    var body: some View {
        switch diagramId {
        case "angling":
            labeled { AnglingDiagramView() }
        case "rocking":
            labeled { RockingDiagramView() }
        case "shallowing":
            labeled { ShallowingDiagramView() }
        case "pairing":
            labeled { PairingDiagramView() }
        case "edging":
            labeled { EdgingDiagramView() }
        default:
            // Unknown id: reuse the shared framed placeholder.
            MediaPlaceholderCard(
                systemImage: "point.3.connected.trianglepath.dotted",
                text: caption ?? "Diagram"
            )
        }
    }

    /// Wraps a diagram drawing with its caption beneath and collapses the whole
    /// thing into a single accessibility image so the looping animation never
    /// spams VoiceOver.
    @ViewBuilder
    private func labeled<Diagram: View>(@ViewBuilder _ diagram: () -> Diagram) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            diagram()
                .accessibilityElement()
                .accessibilityLabel(accessibilityText)
                .accessibilityAddTraits(.isImage)
            if let caption, !caption.isEmpty {
                Text(caption)
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.secondaryInk)
                    .fixedSize(horizontal: false, vertical: true)
                    // The caption is already carried by the image's a11y label.
                    .accessibilityHidden(true)
            }
        }
    }
}

// MARK: - Shared framed placeholder

/// The tasteful framed placeholder (rounded rect, canvas fill + line border,
/// SF Symbol, caption) used for images, videos, and unrecognised diagrams.
/// Never surfaces `path` / `reducedMotionFallback`.
struct MediaPlaceholderCard: View {
    let systemImage: String
    let text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(AppColor.canvas)
                .frame(maxWidth: .infinity)
                .frame(height: 132)
                .overlay {
                    Image(systemName: systemImage)
                        .font(.system(size: 28, weight: .regular))
                        .foregroundStyle(AppColor.gold)
                        .accessibilityHidden(true)
                }
                .overlay {
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(AppColor.line, lineWidth: 1)
                }
            Text(text)
                .font(AppFont.note)
                .foregroundStyle(AppColor.secondaryInk)
                .fixedSize(horizontal: false, vertical: true)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(text)
    }
}

// MARK: - Bundled illustration

/// Resolves and loads the real illustration that ships in the app bundle for an
/// image-kind `MediaItem`. The bundle's `path` (e.g.
/// `assets/images/concepts/illustrations/angling.png`) is only used to derive the
/// file's basename; the actual file is read from `media/illustrations` inside the
/// module bundle. The internal path itself is never shown to the reader.
enum BundledMedia {
    static func image(for media: MediaItem) -> Image? {
        guard media.kind == .image, let url = imageURL(for: media) else { return nil }
        return image(at: url)
    }

    /// The abstract "mood" thumbnail that opens a concept (the cover). Keyed by
    /// concept id (`media/thumbnails/<id>.png`).
    static func thumbnail(forConceptId id: String) -> Image? {
        guard let url = Bundle.module.url(forResource: id, withExtension: "png", subdirectory: "media/thumbnails") else { return nil }
        return image(at: url)
    }

    /// The short demonstration video for a concept's "See" moment, if one ships
    /// (`media/videos/<id>.mp4`). Only ~6 concepts have one.
    static func videoURL(forConceptId id: String) -> URL? {
        Bundle.module.url(forResource: id, withExtension: "mp4", subdirectory: "media/videos")
    }

    private static func image(at url: URL) -> Image? {
        #if canImport(UIKit)
        guard let platform = UIImage(contentsOfFile: url.path) else { return nil }
        return Image(uiImage: platform)
        #elseif canImport(AppKit)
        guard let platform = NSImage(contentsOf: url) else { return nil }
        return Image(nsImage: platform)
        #else
        return nil
        #endif
    }

    private static func imageURL(for media: MediaItem) -> URL? {
        let file = (media.path as NSString).lastPathComponent
        let name = (file as NSString).deletingPathExtension
        let ext = (file as NSString).pathExtension
        guard !name.isEmpty, !ext.isEmpty else { return nil }
        return Bundle.module.url(
            forResource: name,
            withExtension: ext,
            subdirectory: "media/illustrations"
        )
    }
}

/// Renders the real bundled illustration in a calm framed tile with its caption
/// beneath. Falls back to the framed placeholder if the asset cannot be loaded,
/// so a missing or unbundled image never breaks the screen and never leaks a path.
struct IllustrationCard: View {
    let media: MediaItem

    var body: some View {
        if let image = BundledMedia.image(for: media) {
            VStack(alignment: .leading, spacing: 8) {
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: .infinity)
                    .frame(maxHeight: 260)
                    .background(AppColor.canvas)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .overlay {
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(AppColor.line, lineWidth: 1)
                    }
                    .accessibilityHidden(true)
                Text(caption)
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.secondaryInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(caption)
            .accessibilityAddTraits(.isImage)
        } else {
            MediaPlaceholderCard(systemImage: "photo", text: caption)
        }
    }

    // Human-readable only: never the internal path.
    private var caption: String {
        media.caption ?? media.alt ?? "Illustration"
    }
}

// MARK: - Looping video

/// A calm, muted, seamlessly looping demonstration video for a concept's "See"
/// page. Autoplays when shown, no controls, to stay restful. Callers only use
/// this when Reduce Motion is off; otherwise a diagram or illustration is shown.
struct ConceptVideoView: View {
    let url: URL
    let caption: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            #if canImport(UIKit)
            LoopingVideoView(url: url)
                .frame(maxWidth: .infinity)
                .frame(height: 260)
                .background(AppColor.canvas)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay {
                    RoundedRectangle(cornerRadius: 8).stroke(AppColor.line, lineWidth: 1)
                }
                .accessibilityHidden(true)
            #else
            MediaPlaceholderCard(systemImage: "play.rectangle", text: caption ?? "Video")
            #endif
            if let caption {
                Text(caption)
                    .font(AppFont.note)
                    .foregroundStyle(AppColor.secondaryInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(caption ?? "Demonstration video")
        .accessibilityAddTraits(.isImage)
    }
}

#if canImport(UIKit)
private struct LoopingVideoView: UIViewRepresentable {
    let url: URL
    func makeUIView(context: Context) -> LoopingPlayerUIView { LoopingPlayerUIView(url: url) }
    func updateUIView(_ uiView: LoopingPlayerUIView, context: Context) {}
    static func dismantleUIView(_ uiView: LoopingPlayerUIView, coordinator: ()) { uiView.stop() }
}

private final class LoopingPlayerUIView: UIView {
    private let queuePlayer = AVQueuePlayer()
    private var looper: AVPlayerLooper?
    private let playerLayer = AVPlayerLayer()

    init(url: URL) {
        super.init(frame: .zero)
        let item = AVPlayerItem(url: url)
        looper = AVPlayerLooper(player: queuePlayer, templateItem: item)
        queuePlayer.isMuted = true
        playerLayer.player = queuePlayer
        playerLayer.videoGravity = .resizeAspect
        layer.addSublayer(playerLayer)
        queuePlayer.play()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    func stop() { queuePlayer.pause() }

    override func layoutSubviews() {
        super.layoutSubviews()
        playerLayer.frame = bounds
    }
}
#endif

// MARK: - Diagram plumbing

/// Shared diagram frame: concept canvas, 1px border, ~300pt height.
/// Optional idle pulse sits in chrome (not burned into Canvas art) and only
/// runs when Reduce Motion is off and the caller still wants a first-paint cue.
private struct DiagramSurface<Content: View>: View {
    var height: CGFloat = 300
    var idlePulse: Bool = false
    var pulseOffset: CGSize = .zero
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .background(AppColor.canvas, in: RoundedRectangle(cornerRadius: 8))
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .stroke(AppColor.line, lineWidth: 1)
            }
            .overlay {
                if idlePulse && !reduceMotion {
                    DiagramIdlePulse()
                        .offset(pulseOffset)
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

/// Consistent top overlay for insight feedback across diagrams.
private struct DiagramInsightChip: View {
    let text: String

    var body: some View {
        Text(text)
            .font(AppFont.label)
            .foregroundStyle(AppColor.secondaryInk)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(AppColor.surface.opacity(0.92), in: Capsule())
            .overlay {
                Capsule().stroke(AppColor.line.opacity(0.55), lineWidth: 1)
            }
            .padding(.top, 12)
            .accessibilityHidden(true)
    }
}

/// First-paint affordance chrome — fades after the first drag/tap.
private struct DiagramAffordanceHint: View {
    let text: String
    let visible: Bool

    var body: some View {
        Text(text)
            .font(AppFont.label)
            .foregroundStyle(AppColor.secondaryInk.opacity(0.9))
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(AppColor.surface.opacity(0.94), in: Capsule())
            .overlay {
                Capsule().stroke(AppColor.line.opacity(0.5), lineWidth: 1)
            }
            .opacity(visible ? 1 : 0)
            .animation(.easeOut(duration: 0.4), value: visible)
            .allowsHitTesting(false)
            .accessibilityHidden(true)
    }
}

/// Very subtle breath on the active control region before first interaction.
private struct DiagramIdlePulse: View {
    @State private var expanded = false

    var body: some View {
        Circle()
            .stroke(AppColor.diagramActive.opacity(expanded ? 0.18 : 0.06), lineWidth: 1.5)
            .frame(width: expanded ? 54 : 40, height: expanded ? 54 : 40)
            .animation(.easeInOut(duration: 1.35).repeatForever(autoreverses: true), value: expanded)
            .onAppear { expanded = true }
            .allowsHitTesting(false)
            .accessibilityHidden(true)
    }
}

/// Maps the diagram's natural coordinate space into the canvas, centred and
/// aspect-fit. Stroke widths stay in screen points (not scaled).
private func worldTransform(in size: CGSize, natural: CGSize) -> CGAffineTransform {
    let s = min(size.width / natural.width, size.height / natural.height)
    let tx = (size.width - natural.width * s) / 2
    let ty = (size.height - natural.height * s) / 2
    return CGAffineTransform(translationX: tx, y: ty).scaledBy(x: s, y: s)
}

private func smoothstep(_ edge0: Double, _ edge1: Double, _ x: Double) -> Double {
    let t = min(1, max(0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

private struct DiagramDragModifier<G: Gesture>: ViewModifier {
    let enabled: Bool
    let gesture: G
    func body(content: Content) -> some View {
        if enabled {
            content.gesture(gesture)
        } else {
            content
        }
    }
}

private func circlePath(cx: CGFloat, cy: CGFloat, r: CGFloat) -> Path {
    Path(ellipseIn: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2))
}

private extension GraphicsContext {
    /// Draws a soft accent glow by stroking a blurred copy of `path`.
    func glowStroke(_ path: Path, color: Color, lineWidth: CGFloat, blur: CGFloat, opacity: Double) {
        guard opacity > 0.001 else { return }
        drawLayer { layer in
            layer.addFilter(.blur(radius: blur))
            layer.opacity = opacity
            layer.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
        }
    }

    func glowFill(_ path: Path, color: Color, blur: CGFloat, opacity: Double) {
        guard opacity > 0.001 else { return }
        drawLayer { layer in
            layer.addFilter(.blur(radius: blur))
            layer.opacity = opacity
            layer.fill(path, with: .color(color))
        }
    }
}

// MARK: - Angling

/// Pelvis tilt redirecting pressure along the anterior wall. Drag vertically to
/// tilt; glow intensifies at posterior tuck (sweet spot).
private struct AnglingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var angleDeg: Double = 0
    @State private var dragBaseAngle: Double = 0
    @State private var sweetSpotHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 220)
    private let pivot = CGPoint(x: 150, y: 128)

    var body: some View {
        let angle = reduceMotion ? -15.0 : angleDeg
        let glow = smoothstep(2, 14, -angle)
        DiagramSurface(idlePulse: !hasInteracted && !reduceMotion, pulseOffset: CGSize(width: 0, height: 28)) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, angleDeg: angle, glow: glow)
                }
                DiagramInsightChip(text: insightLabel(for: angle))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Drag to explore", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
    }

    private func insightLabel(for angle: Double) -> String {
        if angle < -5 { return "Posterior tilt" }
        if angle > 5 { return "Anterior tilt" }
        return "Neutral"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 3)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                // Slightly snappier vertical mapping; soft clamp.
                let delta = -Double(value.translation.height) / 4.2
                angleDeg = min(18, max(-18, dragBaseAngle + delta))
                let inSweetSpot = angleDeg < -10
                if inSweetSpot && !sweetSpotHaptic {
                    sweetSpotHaptic = true
                    NativeHaptics.impactLight()
                } else if !inSweetSpot {
                    sweetSpotHaptic = false
                }
            }
            .onEnded { _ in
                dragBaseAngle = angleDeg
            }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, angleDeg: Double, glow: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Soft torso / spine guide
        var spine = Path()
        spine.move(to: CGPoint(x: 150, y: 36))
        spine.addQuadCurve(to: CGPoint(x: 150, y: 120), control: CGPoint(x: 148, y: 86))
        context.stroke(spine.applying(world), with: .color(AppColor.diagramPassive.opacity(0.85)),
                       style: StrokeStyle(lineWidth: 3.5, lineCap: .round))

        // Clearer pelvis bowl
        var pelvis = Path()
        pelvis.move(to: CGPoint(x: 86, y: 118))
        pelvis.addQuadCurve(to: CGPoint(x: 214, y: 118), control: CGPoint(x: 150, y: 108))
        pelvis.addQuadCurve(to: CGPoint(x: 198, y: 168), control: CGPoint(x: 220, y: 148))
        pelvis.addQuadCurve(to: CGPoint(x: 102, y: 168), control: CGPoint(x: 150, y: 198))
        pelvis.addQuadCurve(to: CGPoint(x: 86, y: 118), control: CGPoint(x: 80, y: 148))
        pelvis.closeSubpath()

        // Anterior contact path — the teaching curve along the front wall
        var contact = Path()
        contact.move(to: CGPoint(x: 128, y: 142))
        contact.addQuadCurve(to: CGPoint(x: 172, y: 142), control: CGPoint(x: 150, y: 168))

        // Secondary inner path for readability at sweet spot
        var inner = Path()
        inner.move(to: CGPoint(x: 136, y: 148))
        inner.addQuadCurve(to: CGPoint(x: 164, y: 148), control: CGPoint(x: 150, y: 162))

        let rotation = CGAffineTransform(translationX: pivot.x, y: pivot.y)
            .rotated(by: angleDeg * .pi / 180)
            .translatedBy(x: -pivot.x, y: -pivot.y)

        let pelvisScreen = pelvis.applying(rotation).applying(world)
        let contactScreen = contact.applying(rotation).applying(world)
        let innerScreen = inner.applying(rotation).applying(world)

        context.fill(pelvisScreen, with: .color(AppColor.surface))
        context.stroke(pelvisScreen, with: .color(AppColor.diagramPassive.opacity(0.9)),
                       style: StrokeStyle(lineWidth: 2.25, lineCap: .round, lineJoin: .round))

        // Passive contact underlay
        context.stroke(contactScreen, with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 5, lineCap: .round))
        // Active glow — strongest on posterior tuck
        context.glowStroke(contactScreen, color: AppColor.diagramGlow,
                           lineWidth: 10 + 10 * glow, blur: 8 + 4 * glow, opacity: 0.35 + 0.55 * glow)
        context.glowStroke(contactScreen, color: AppColor.diagramActive,
                           lineWidth: 4 + 6 * glow, blur: 4, opacity: glow)
        context.stroke(innerScreen, with: .color(AppColor.diagramActive.opacity(0.25 + 0.65 * glow)),
                       style: StrokeStyle(lineWidth: 2.5, lineCap: .round))

        let dot = circlePath(cx: pivot.x, cy: pivot.y, r: 4.5).applying(world)
        context.fill(dot, with: .color(AppColor.diagramPassive.opacity(0.55)))
        context.stroke(dot, with: .color(AppColor.surface), style: StrokeStyle(lineWidth: 1))
    }
}

// MARK: - Rocking

/// Compression and friction at the pubic mound. Drag the partner wedge toward
/// the contact point; warmth builds at high contact.
private struct RockingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var partnerOffset = CGSize(width: -58, height: -38)
    @State private var dragBaseOffset = CGSize(width: -58, height: -38)
    @State private var contactHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 220)
    private let pubic = CGPoint(x: 142, y: 148)

    var body: some View {
        let offset = reduceMotion ? CGSize.zero : partnerOffset
        let intensity = contactIntensity(at: offset)
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: -36, height: -8)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, partnerOffset: offset, intensity: intensity)
                }
                DiagramInsightChip(text: insightLabel(for: intensity))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Drag to explore", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
        .onAppear {
            if reduceMotion {
                partnerOffset = .zero
                dragBaseOffset = .zero
            }
        }
    }

    private func insightLabel(for intensity: Double) -> String {
        if intensity > 0.62 { return "Contact" }
        if intensity > 0.18 { return "Near" }
        return "No contact"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 2)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                partnerOffset = CGSize(
                    width: dragBaseOffset.width + value.translation.width,
                    height: dragBaseOffset.height + value.translation.height
                )
                let intensity = contactIntensity(at: partnerOffset)
                if intensity > 0.78 && !contactHaptic {
                    contactHaptic = true
                    NativeHaptics.impactLight()
                } else if intensity <= 0.78 {
                    contactHaptic = false
                }
            }
            .onEnded { _ in
                dragBaseOffset = partnerOffset
            }
    }

    private func contactIntensity(at offset: CGSize) -> Double {
        let distance = sqrt(offset.width * offset.width + offset.height * offset.height)
        return min(1, max(0, 1 - distance / 54))
    }

    private func draw(_ context: GraphicsContext, size: CGSize, partnerOffset: CGSize, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Soft pelvis silhouette into the pubic mound
        var pelvis = Path()
        pelvis.move(to: CGPoint(x: pubic.x + 48, y: 78))
        pelvis.addQuadCurve(to: CGPoint(x: pubic.x + 8, y: pubic.y - 8), control: CGPoint(x: pubic.x + 18, y: 110))
        pelvis.addQuadCurve(to: CGPoint(x: pubic.x + 28, y: pubic.y + 42), control: CGPoint(x: pubic.x - 6, y: pubic.y + 28))
        context.stroke(pelvis.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 5.5, lineCap: .round, lineJoin: .round))

        // Readable pubic mound (soft oval)
        let moundOuter = Path(ellipseIn: CGRect(x: pubic.x - 18, y: pubic.y - 14, width: 36, height: 28)).applying(world)
        context.fill(moundOuter, with: .color(AppColor.diagramPassive.opacity(0.35)))
        context.stroke(moundOuter, with: .color(AppColor.diagramPassive.opacity(0.8)),
                       style: StrokeStyle(lineWidth: 1.5))

        // Heat — unmistakable at contact
        let heat = circlePath(cx: pubic.x, cy: pubic.y, r: 30).applying(world)
        context.glowFill(heat, color: AppColor.diagramGlow, blur: 10 + 16 * intensity, opacity: 0.25 + 0.7 * intensity)
        context.glowFill(circlePath(cx: pubic.x, cy: pubic.y, r: 14).applying(world),
                         color: AppColor.diagramActive, blur: 6, opacity: 0.15 + 0.55 * intensity)

        let mound = circlePath(cx: pubic.x, cy: pubic.y, r: 7).applying(world)
        context.fill(mound, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, intensity * 0.7)))

        // Partner wedge — clearer silhouette with tip marker
        let tip = CGPoint(x: pubic.x + partnerOffset.width, y: pubic.y + partnerOffset.height)
        var wedge = Path()
        wedge.move(to: CGPoint(x: 0, y: 0))
        wedge.addLine(to: CGPoint(x: 30, y: -34))
        wedge.addQuadCurve(to: CGPoint(x: -30, y: -34), control: CGPoint(x: 0, y: -22))
        wedge.closeSubpath()
        let wedgeScreen = wedge
            .applying(CGAffineTransform(translationX: tip.x, y: tip.y))
            .applying(world)
        context.fill(wedgeScreen, with: .color(AppColor.diagramActive.opacity(0.5 + 0.4 * intensity)))
        context.stroke(wedgeScreen, with: .color(AppColor.diagramActive.opacity(0.85)),
                       style: StrokeStyle(lineWidth: 1.5, lineJoin: .round))

        let tipDot = circlePath(cx: tip.x, cy: tip.y, r: 4.5).applying(world)
        context.fill(tipDot, with: .color(AppColor.surface))
        context.stroke(tipDot, with: .color(AppColor.diagramActive), style: StrokeStyle(lineWidth: 1.25))
    }
}

// MARK: - Shallowing

/// Shallow vs deep. Drag horizontally along the canal; glow peaks at the
/// nerve-rich entrance (introitus).
private struct ShallowingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var probeX: CGFloat = 50
    @State private var dragBaseX: CGFloat = 50
    @State private var entranceHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 280, height: 240)
    private let entranceX: CGFloat = 52
    private let canalY: CGFloat = 150
    private let canalLength: CGFloat = 240

    var body: some View {
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: -70, height: 18)
        ) {
            GeometryReader { geo in
                let x = reduceMotion ? entranceX : probeX
                let intensity = probeIntensity(at: x)
                ZStack(alignment: .top) {
                    Canvas { context, size in
                        draw(context, size: size, probeX: x, intensity: intensity)
                    }
                    DiagramInsightChip(text: intensity > 0.55 ? "Shallow · sensitive" : "Deep · pressure")
                    VStack {
                        Spacer()
                        DiagramAffordanceHint(text: "Drag to explore", visible: !hasInteracted && !reduceMotion)
                            .padding(.bottom, 14)
                    }
                }
                .contentShape(Rectangle())
                .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture(in: geo.size)))
            }
        }
        .onAppear {
            if reduceMotion {
                probeX = entranceX
                dragBaseX = entranceX
            }
        }
    }

    private func dragGesture(in size: CGSize) -> some Gesture {
        DragGesture(minimumDistance: 2)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                let scale = natural.width / max(1, size.width)
                let x = dragBaseX + value.translation.width * scale
                probeX = min(canalLength, max(0, x))
                let intensity = probeIntensity(at: probeX)
                if intensity > 0.72 && !entranceHaptic {
                    entranceHaptic = true
                    NativeHaptics.impactLight()
                } else if intensity <= 0.72 {
                    entranceHaptic = false
                }
            }
            .onEnded { _ in
                dragBaseX = probeX
            }
    }

    private func probeIntensity(at x: CGFloat) -> Double {
        // Peak near entrance; falls off toward deep.
        smoothstep(190, Double(entranceX), Double(x))
    }

    private func draw(_ context: GraphicsContext, size: CGSize, probeX: CGFloat, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Depth axis — subtle ticks so shallow vs deep reads immediately
        for i in 0..<5 {
            let tx = entranceX + CGFloat(i) * 42
            let tick = Path { p in
                p.move(to: CGPoint(x: tx, y: canalY - 46))
                p.addLine(to: CGPoint(x: tx, y: canalY - 38))
            }.applying(world)
            context.stroke(tick, with: .color(AppColor.diagramPassive.opacity(0.55)),
                           style: StrokeStyle(lineWidth: 1.5, lineCap: .round))
        }
        var axis = Path()
        axis.move(to: CGPoint(x: entranceX, y: canalY - 42))
        axis.addLine(to: CGPoint(x: canalLength - 8, y: canalY - 42))
        context.stroke(axis.applying(world), with: .color(AppColor.diagramPassive.opacity(0.4)),
                       style: StrokeStyle(lineWidth: 1, lineCap: .round))

        // Entrance sensitivity halo — always faintly present, peaks with probe
        let zone = circlePath(cx: entranceX + 12, cy: canalY, r: 50).applying(world)
        context.glowFill(zone, color: AppColor.diagramGlow, blur: 20, opacity: 0.22 + 0.35 * intensity)

        var top = Path()
        top.move(to: CGPoint(x: 8, y: 102))
        top.addQuadCurve(to: CGPoint(x: entranceX + 46, y: 114), control: CGPoint(x: entranceX, y: 100))
        top.addLine(to: CGPoint(x: 276, y: 114))
        var bottom = Path()
        bottom.move(to: CGPoint(x: 8, y: 198))
        bottom.addQuadCurve(to: CGPoint(x: entranceX + 46, y: 186), control: CGPoint(x: entranceX, y: 200))
        bottom.addLine(to: CGPoint(x: 276, y: 186))
        context.stroke(top.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
        context.stroke(bottom.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))

        // Entrance ring — obvious peak vs deep
        let ring = circlePath(cx: entranceX + 10, cy: canalY, r: 22).applying(world)
        context.stroke(ring, with: .color(AppColor.diagramActive.opacity(0.2 + 0.65 * intensity)),
                       style: StrokeStyle(lineWidth: 2 + 2 * intensity))

        let aura = circlePath(cx: probeX, cy: canalY, r: 26).applying(world)
        context.glowFill(aura, color: AppColor.diagramGlow, blur: 12 + 6 * intensity, opacity: 0.2 + 0.55 * intensity)

        let core = circlePath(cx: probeX, cy: canalY, r: 11).applying(world)
        let coreColor = blend(AppColor.diagramPassive, AppColor.diagramActive, intensity)
        context.fill(core, with: .color(coreColor))
        context.stroke(core, with: .color(AppColor.surface), style: StrokeStyle(lineWidth: 2))
    }
}

// MARK: - Pairing

/// Two stimulation routes combined: tap external (glans) and internal (crura).
/// When both are active a soft bridge glow appears — the pairing bonus.
private struct PairingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var externalOn = false
    @State private var internalOn = false
    @State private var pairedHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 300)

    var body: some View {
        let ext = reduceMotion || externalOn
        let inn = reduceMotion || internalOn
        let paired = (ext && inn) ? 1.0 : 0.0
        DiagramSurface(height: 300, idlePulse: !hasInteracted && !reduceMotion, pulseOffset: CGSize(width: 0, height: -40)) {
            ZStack {
                Canvas { context, size in
                    draw(context, size: size, externalOn: ext, internalOn: inn, paired: paired)
                }
                VStack(spacing: 0) {
                    DiagramInsightChip(text: insightLabel(externalActive: ext, internalActive: inn))
                    if !reduceMotion {
                        Button("External · glans") { toggleExternal() }
                            .buttonStyle(DiagramChipButtonStyle(active: externalOn))
                            .padding(.top, 6)
                        Spacer()
                        Button("Internal · crura") { toggleInternal() }
                            .buttonStyle(DiagramChipButtonStyle(active: internalOn))
                            .padding(.bottom, 14)
                    } else {
                        Spacer()
                    }
                }
                if !reduceMotion {
                    DiagramAffordanceHint(text: "Tap to explore", visible: !hasInteracted)
                }
            }
        }
        .onAppear {
            if reduceMotion {
                externalOn = true
                internalOn = true
            }
        }
        .onChange(of: externalOn) { _, _ in checkPairingHaptic() }
        .onChange(of: internalOn) { _, _ in checkPairingHaptic() }
    }

    private func insightLabel(externalActive: Bool, internalActive: Bool) -> String {
        if externalActive && internalActive { return "Paired" }
        if externalActive { return "External only" }
        if internalActive { return "Internal only" }
        return "Tap both routes"
    }

    private func toggleExternal() {
        if !hasInteracted { hasInteracted = true }
        externalOn.toggle()
    }

    private func toggleInternal() {
        if !hasInteracted { hasInteracted = true }
        internalOn.toggle()
    }

    private func checkPairingHaptic() {
        let isPaired = externalOn && internalOn
        if isPaired && !pairedHaptic {
            pairedHaptic = true
            NativeHaptics.impactLight()
        } else if !isPaired {
            pairedHaptic = false
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, externalOn: Bool, internalOn: Bool, paired: Double) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 150
        let externalT = externalOn ? 1.0 : 0.0
        let internalT = internalOn ? 1.0 : 0.0

        var canal = Path()
        canal.move(to: CGPoint(x: cx - 24, y: 138))
        canal.addLine(to: CGPoint(x: cx - 18, y: 248))
        canal.addQuadCurve(to: CGPoint(x: cx + 18, y: 248), control: CGPoint(x: cx, y: 262))
        canal.addLine(to: CGPoint(x: cx + 24, y: 138))
        let canalScreen = canal.applying(world)
        context.fill(canalScreen, with: .color(AppColor.diagramPassive.opacity(0.35)))
        context.stroke(canalScreen, with: .color(AppColor.diagramPassive), style: StrokeStyle(lineWidth: 2))

        // Internal legs / crura — clearer nodes
        var legs = Path()
        legs.move(to: CGPoint(x: cx - 10, y: 112))
        legs.addQuadCurve(to: CGPoint(x: cx - 54, y: 228), control: CGPoint(x: cx - 62, y: 152))
        legs.addQuadCurve(to: CGPoint(x: cx - 28, y: 188), control: CGPoint(x: cx - 30, y: 236))
        legs.addQuadCurve(to: CGPoint(x: cx - 10, y: 118), control: CGPoint(x: cx - 28, y: 152))
        legs.move(to: CGPoint(x: cx + 10, y: 112))
        legs.addQuadCurve(to: CGPoint(x: cx + 54, y: 228), control: CGPoint(x: cx + 62, y: 152))
        legs.addQuadCurve(to: CGPoint(x: cx + 28, y: 188), control: CGPoint(x: cx + 30, y: 236))
        legs.addQuadCurve(to: CGPoint(x: cx + 10, y: 118), control: CGPoint(x: cx + 28, y: 152))
        let legsScreen = legs.applying(world)
        context.fill(legsScreen, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, internalT).opacity(0.7)))
        if internalOn {
            context.glowFill(legsScreen, color: AppColor.diagramGlow, blur: 10, opacity: 0.35)
        }

        // External glans node with ring for tap clarity
        let glans = circlePath(cx: cx, cy: 90, r: 18).applying(world)
        let glansRing = circlePath(cx: cx, cy: 90, r: 26).applying(world)
        context.stroke(glansRing, with: .color(AppColor.diagramPassive.opacity(0.55 + 0.35 * externalT)),
                       style: StrokeStyle(lineWidth: 1.5))
        context.fill(glans, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, externalT)))
        if externalOn {
            context.glowFill(glans, color: AppColor.diagramGlow, blur: 10, opacity: 0.45)
        }

        // Bridge glow — the pairing insight
        let bridge = circlePath(cx: cx, cy: 112, r: 40).applying(world)
        context.glowFill(bridge, color: AppColor.diagramGlow, blur: 26, opacity: 0.62 * paired)
        context.glowFill(glans, color: AppColor.diagramActive, blur: 8, opacity: 0.35 * paired)
        if paired > 0.5 {
            var link = Path()
            link.move(to: CGPoint(x: cx, y: 102))
            link.addQuadCurve(to: CGPoint(x: cx - 22, y: 150), control: CGPoint(x: cx - 28, y: 120))
            link.move(to: CGPoint(x: cx, y: 102))
            link.addQuadCurve(to: CGPoint(x: cx + 22, y: 150), control: CGPoint(x: cx + 28, y: 120))
            context.glowStroke(link.applying(world), color: AppColor.diagramActive,
                               lineWidth: 3, blur: 5, opacity: 0.55)
        }
    }
}

private struct DiagramChipButtonStyle: ButtonStyle {
    var active: Bool = false

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                (active ? AppColor.diagramGlow.opacity(0.45) : Color.white.opacity(configuration.isPressed ? 0.65 : 0.85)),
                in: Capsule()
            )
            .overlay {
                Capsule().stroke(AppColor.line.opacity(active ? 0.8 : 0.45), lineWidth: 1)
            }
    }
}

// MARK: - Edging

/// Arousal curve — climb the rising path toward the crest, release to recede.
private struct EdgingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var intensity: Double = 0.12
    @State private var dragBase: Double = 0.12
    @State private var isReceding = false
    @State private var thresholdHaptic = false
    @State private var gestureActive = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 280, height: 260)
    private let threshold = 0.85
    private let dragRange: Double = 155
    private let riseP0 = CGPoint(x: 40, y: 228)
    private let riseP1 = CGPoint(x: 78, y: 196)
    private let riseP2 = CGPoint(x: 176, y: 112)
    private let riseP3 = CGPoint(x: 228, y: 72)

    var body: some View {
        let level = reduceMotion ? 0.8 : intensity
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: -20, height: 50)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, intensity: level)
                }
                DiagramInsightChip(text: feedbackLabel(for: level, receding: isReceding && !reduceMotion))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Drag to explore", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
    }

    private func feedbackLabel(for level: Double, receding: Bool) -> String {
        if receding { return "Easing back" }
        if level >= threshold { return "Near the edge" }
        if level >= 0.28 { return "Rising" }
        return "Rising"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 3)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                if !gestureActive {
                    gestureActive = true
                    dragBase = intensity
                }
                isReceding = false
                let delta = -Double(value.translation.height) / dragRange
                intensity = min(1, max(0, dragBase + delta))
                if intensity >= threshold && !thresholdHaptic {
                    thresholdHaptic = true
                    NativeHaptics.impactLight()
                } else if intensity < threshold {
                    thresholdHaptic = false
                }
            }
            .onEnded { _ in
                gestureActive = false
                isReceding = true
                withAnimation(.spring(response: 0.78, dampingFraction: 0.78)) {
                    intensity = 0.1
                }
                dragBase = 0.1
            }
    }

    private func cubicPoint(_ t: Double) -> CGPoint {
        let u = 1 - t
        let tt = t * t
        let uu = u * u
        let x = uu * u * riseP0.x + 3 * uu * t * riseP1.x + 3 * u * tt * riseP2.x + tt * t * riseP3.x
        let y = uu * u * riseP0.y + 3 * uu * t * riseP1.y + 3 * u * tt * riseP2.y + tt * t * riseP3.y
        return CGPoint(x: x, y: y)
    }

    private func riseSamples(steps: Int = 72) -> [CGPoint] {
        (0...steps).map { cubicPoint(Double($0) / Double(steps)) }
    }

    private func partialPath(from samples: [CGPoint], progress: Double) -> Path {
        let idx = max(1, min(samples.count - 1, Int(progress * Double(samples.count - 1))))
        var p = Path()
        p.move(to: samples[0])
        for i in 1...idx { p.addLine(to: samples[i]) }
        return p
    }

    private func draw(_ context: GraphicsContext, size: CGSize, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)
        let samples = riseSamples()
        let thresholdPt = cubicPoint(threshold)
        let orb = cubicPoint(intensity)

        // Soft under-fill along the climb (elegant throttle feel)
        var fill = Path()
        fill.move(to: CGPoint(x: riseP0.x, y: 240))
        fill.addLine(to: samples[0])
        let fillIdx = max(1, min(samples.count - 1, Int(intensity * Double(samples.count - 1))))
        for i in 1...fillIdx { fill.addLine(to: samples[i]) }
        fill.addLine(to: CGPoint(x: samples[fillIdx].x, y: 240))
        fill.closeSubpath()
        context.fill(fill.applying(world), with: .color(AppColor.diagramGlow.opacity(0.18 + 0.22 * intensity)))

        // Dashed hint after crest
        var after = Path()
        after.move(to: riseP3)
        after.addQuadCurve(to: CGPoint(x: 256, y: 102), control: CGPoint(x: 246, y: 74))
        context.stroke(after.applying(world), with: .color(AppColor.diagramPassive.opacity(0.4)),
                       style: StrokeStyle(lineWidth: 1.5, lineCap: .round, dash: [5, 7]))

        // Full rise curve
        var rise = Path()
        rise.move(to: samples[0])
        for pt in samples.dropFirst() { rise.addLine(to: pt) }
        context.stroke(rise.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

        // Active trace
        let trace = partialPath(from: samples, progress: max(0.02, intensity))
        let near = smoothstep(0.45, threshold, intensity)
        let traceWidth = 3 + 4.5 * near
        context.glowStroke(trace.applying(world), color: AppColor.diagramActive,
                           lineWidth: traceWidth, blur: 7, opacity: 0.25 + 0.55 * near)
        context.stroke(trace.applying(world), with: .color(AppColor.diagramGlow.opacity(0.35 + 0.5 * near)),
                       style: StrokeStyle(lineWidth: traceWidth, lineCap: .round, lineJoin: .round))

        // Coral threshold line (not alarm red) — short tick across the curve
        var threshLine = Path()
        threshLine.move(to: CGPoint(x: thresholdPt.x - 22, y: thresholdPt.y))
        threshLine.addLine(to: CGPoint(x: thresholdPt.x + 22, y: thresholdPt.y))
        context.stroke(threshLine.applying(world), with: .color(AppColor.diagramActive.opacity(0.7)),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round))
        let marker = circlePath(cx: thresholdPt.x, cy: thresholdPt.y, r: 14).applying(world)
        context.glowFill(marker, color: AppColor.diagramGlow, blur: 10, opacity: 0.35)
        let markerCore = circlePath(cx: thresholdPt.x, cy: thresholdPt.y, r: 4.5).applying(world)
        context.fill(markerCore, with: .color(AppColor.diagramActive.opacity(0.75)))

        // Traveler orb
        let orbR = 6.5 + 6 * near
        let orbGlow = circlePath(cx: orb.x, cy: orb.y, r: orbR).applying(world)
        context.glowFill(orbGlow, color: AppColor.diagramGlow, blur: 12, opacity: 0.3 + 0.5 * near)
        context.fill(orbGlow, with: .color(AppColor.diagramActive.opacity(0.88)))
        context.stroke(orbGlow, with: .color(AppColor.surface.opacity(0.9)), style: StrokeStyle(lineWidth: 1))

        // Origin ember
        let origin = circlePath(cx: riseP0.x, cy: riseP0.y, r: 12).applying(world)
        context.glowFill(origin, color: AppColor.moss, blur: 7, opacity: 0.22)
        context.fill(circlePath(cx: riseP0.x, cy: riseP0.y, r: 5.5).applying(world),
                       with: .color(AppColor.diagramPassive.opacity(0.75)))
    }
}

// MARK: - Colour helpers

/// Linear blend between two app colours (component-wise) for warming accents.
private func blend(_ a: Color, _ b: Color, _ t: Double) -> Color {
    let t = min(1, max(0, t))
    let ca = a.rgbaComponents
    let cb = b.rgbaComponents
    return Color(
        red: ca.r + (cb.r - ca.r) * t,
        green: ca.g + (cb.g - ca.g) * t,
        blue: ca.b + (cb.b - ca.b) * t,
        opacity: ca.a + (cb.a - ca.a) * t
    )
}

private extension Color {
    /// Resolves to sRGB components for interpolation. Falls back gracefully.
    var rgbaComponents: (r: Double, g: Double, b: Double, a: Double) {
        #if canImport(UIKit)
        let resolved = UIColor(self)
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        resolved.getRed(&r, green: &g, blue: &b, alpha: &a)
        return (Double(r), Double(g), Double(b), Double(a))
        #else
        let resolved = NSColor(self).usingColorSpace(.sRGB) ?? NSColor(self)
        return (Double(resolved.redComponent), Double(resolved.greenComponent),
                Double(resolved.blueComponent), Double(resolved.alphaComponent))
        #endif
    }
}
