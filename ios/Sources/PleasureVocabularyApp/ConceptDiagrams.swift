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
/// `path` is `native://diagram/<id>`. Anatomy + technique concepts are drawn
/// in-app (no image asset required for them). When Reduce Motion is off,
/// diagrams are user-driven with pan or tap gestures; when on, a static
/// teaching frame is shown. See `docs/INTERACTIVES.md`.
///
/// An unrecognised id falls back to the same framed placeholder used for
/// images/videos (`MediaPlaceholderCard`), so a new diagram id can ship before
/// its view exists without breaking the screen.
struct ConceptDiagramView: View {
    let diagramId: String
    let caption: String?

    /// Ids this view knows how to draw natively.
    static let knownDiagramIds: Set<String> = ["angling", "rocking", "shallowing", "pairing", "edging", "iceberg", "nerve-density", "cuv-complex", "internal-stimulation", "building", "plateauing", "pulsing", "spreading"]

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
        case "iceberg":
            labeled { ClitoralStructureDiagramView() }
        case "nerve-density":
            labeled { NerveDensityDiagramView() }
        case "cuv-complex":
            labeled { CUVComplexDiagramView() }
        case "internal-stimulation":
            labeled { InternalStimulationDiagramView() }
        case "building":
            labeled { BuildingDiagramView() }
        case "plateauing":
            labeled { PlateauingDiagramView() }
        case "pulsing":
            labeled { PulsingDiagramView() }
        case "spreading":
            labeled { SpreadingDiagramView() }
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


// MARK: - Clitoral Structure (iceberg)

/// Most of the clitoris is internal. Tap or drag vertically to peel layers:
/// glans → bulbs → crura (the “iceberg” below the surface).
private struct ClitoralStructureDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var reveal: Double = 0
    @State private var dragBase: Double = 0
    @State private var lastLayer = -1
    @State private var hasInteracted = false

    private let natural = CGSize(width: 280, height: 300)

    var body: some View {
        let level = reduceMotion ? 2.0 : reveal
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: 0, height: -70)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, reveal: level)
                }
                DiagramInsightChip(text: insightLabel(for: level))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(
                        text: "Drag or tap to explore",
                        visible: !hasInteracted && !reduceMotion
                    )
                    .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
            .onTapGesture {
                guard !reduceMotion else { return }
                if !hasInteracted { hasInteracted = true }
                let next = min(2, floor(reveal) + 1)
                withAnimation(.easeOut(duration: 0.28)) {
                    reveal = next == floor(reveal) && reveal >= 1.95 ? 0 : next
                }
                dragBase = reveal
                maybeHaptic(for: reveal)
            }
        }
        .onAppear {
            if reduceMotion {
                reveal = 2
                dragBase = 2
            }
        }
    }

    private func insightLabel(for level: Double) -> String {
        if level < 0.55 { return "Glans" }
        if level < 1.45 { return "Bulbs" }
        return "Crura"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                // Drag up peels deeper layers (iceberg below the waterline).
                let delta = -Double(value.translation.height) / 90
                reveal = min(2, max(0, dragBase + delta))
                maybeHaptic(for: reveal)
            }
            .onEnded { _ in
                let snapped = round(reveal)
                withAnimation(.easeOut(duration: 0.22)) {
                    reveal = snapped
                }
                dragBase = snapped
            }
    }

    private func maybeHaptic(for level: Double) {
        let layer = Int(round(level))
        if layer != lastLayer {
            lastLayer = layer
            if layer > 0 {
                NativeHaptics.impactLight()
            }
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, reveal: Double) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 140
        let waterY: CGFloat = 108

        // Soft waterline — external above, internal below
        var water = Path()
        water.move(to: CGPoint(x: 28, y: waterY))
        water.addQuadCurve(to: CGPoint(x: 252, y: waterY), control: CGPoint(x: cx, y: waterY - 6))
        context.stroke(
            water.applying(world),
            with: .color(AppColor.diagramPassive.opacity(0.55)),
            style: StrokeStyle(lineWidth: 1.5, lineCap: .round, dash: [4, 6])
        )

        let bulbsT = smoothstep(0.15, 1.0, reveal)
        let cruraT = smoothstep(1.05, 2.0, reveal)
        // Reduce Motion teaching frame: all layers soft-visible
        let bulbsOpacity = reduceMotion ? 0.55 : (0.15 + 0.85 * bulbsT)
        let cruraOpacity = reduceMotion ? 0.5 : (0.12 + 0.88 * cruraT)

        // Crura — deep legs of the iceberg
        var crura = Path()
        crura.move(to: CGPoint(x: cx - 8, y: 128))
        crura.addQuadCurve(to: CGPoint(x: cx - 62, y: 250), control: CGPoint(x: cx - 70, y: 168))
        crura.addQuadCurve(to: CGPoint(x: cx - 30, y: 210), control: CGPoint(x: cx - 34, y: 258))
        crura.addQuadCurve(to: CGPoint(x: cx - 6, y: 134), control: CGPoint(x: cx - 26, y: 168))
        crura.move(to: CGPoint(x: cx + 8, y: 128))
        crura.addQuadCurve(to: CGPoint(x: cx + 62, y: 250), control: CGPoint(x: cx + 70, y: 168))
        crura.addQuadCurve(to: CGPoint(x: cx + 30, y: 210), control: CGPoint(x: cx + 34, y: 258))
        crura.addQuadCurve(to: CGPoint(x: cx + 6, y: 134), control: CGPoint(x: cx + 26, y: 168))
        let cruraScreen = crura.applying(world)
        context.fill(cruraScreen, with: .color(AppColor.diagramPassive.opacity(0.35 * cruraOpacity)))
        context.stroke(
            cruraScreen,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, cruraT).opacity(cruraOpacity)),
            style: StrokeStyle(lineWidth: 2.25, lineCap: .round, lineJoin: .round)
        )
        if cruraT > 0.35 || reduceMotion {
            context.glowFill(cruraScreen, color: AppColor.diagramGlow, blur: 12, opacity: 0.22 * cruraOpacity)
        }

        // Bulbs — mid layer under the waterline
        var bulbs = Path()
        bulbs.addEllipse(in: CGRect(x: cx - 48, y: 118, width: 38, height: 52))
        bulbs.addEllipse(in: CGRect(x: cx + 10, y: 118, width: 38, height: 52))
        let bulbsScreen = bulbs.applying(world)
        context.fill(bulbsScreen, with: .color(AppColor.diagramPassive.opacity(0.4 * bulbsOpacity)))
        context.stroke(
            bulbsScreen,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, bulbsT).opacity(0.55 + 0.45 * bulbsOpacity)),
            style: StrokeStyle(lineWidth: 2, lineCap: .round)
        )
        if bulbsT > 0.3 || reduceMotion {
            context.glowFill(bulbsScreen, color: AppColor.diagramGlow, blur: 10, opacity: 0.28 * bulbsOpacity)
        }

        // Glans — always visible tip above waterline
        let glans = circlePath(cx: cx, cy: 78, r: 16).applying(world)
        let glansRing = circlePath(cx: cx, cy: 78, r: 24).applying(world)
        context.stroke(glansRing, with: .color(AppColor.diagramPassive.opacity(0.5)), style: StrokeStyle(lineWidth: 1.25))
        context.fill(glans, with: .color(AppColor.diagramActive.opacity(0.85)))
        context.glowFill(glans, color: AppColor.diagramGlow, blur: 8, opacity: 0.4)

        // Soft shaft bridge into internal structure
        var shaft = Path()
        shaft.move(to: CGPoint(x: cx, y: 92))
        shaft.addLine(to: CGPoint(x: cx, y: 122))
        context.stroke(
            shaft.applying(world),
            with: .color(AppColor.diagramPassive.opacity(0.65)),
            style: StrokeStyle(lineWidth: 3.5, lineCap: .round)
        )
    }
}

// MARK: - Nerve Density

/// Extreme nerve endings packed in a small glans area. Vertical drag zooms
/// into the tip; filaments multiply and brighten with density.
private struct NerveDensityDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var zoom: Double = 0.08
    @State private var dragBase: Double = 0.08
    @State private var denseHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 280, height: 280)

    var body: some View {
        let level = reduceMotion ? 0.92 : zoom
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: 0, height: -10)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, zoom: level)
                }
                DiagramInsightChip(text: level > 0.55 ? "Crowded endings" : "Sparse field")
                VStack {
                    Spacer()
                    DiagramAffordanceHint(
                        text: "Drag to explore",
                        visible: !hasInteracted && !reduceMotion
                    )
                    .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
        .onAppear {
            if reduceMotion {
                zoom = 0.92
                dragBase = 0.92
            }
        }
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 3)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                let delta = -Double(value.translation.height) / 160
                zoom = min(1, max(0, dragBase + delta))
                if zoom > 0.62 && !denseHaptic {
                    denseHaptic = true
                    NativeHaptics.impactLight()
                } else if zoom <= 0.62 {
                    denseHaptic = false
                }
            }
            .onEnded { _ in
                dragBase = zoom
            }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, zoom: Double) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 140
        let cy: CGFloat = 132
        let scale = 1.0 + 0.85 * zoom

        // Soft field oval (glans region)
        let fieldR: CGFloat = 54 / CGFloat(scale) + 18
        let field = circlePath(cx: cx, cy: cy, r: fieldR).applying(world)
        context.fill(field, with: .color(AppColor.diagramPassive.opacity(0.22 + 0.12 * zoom)))
        context.stroke(field, with: .color(AppColor.diagramPassive.opacity(0.7)), style: StrokeStyle(lineWidth: 1.75))

        // Filaments densify with zoom — deterministic radial pattern
        let count = 10 + Int(28 * zoom)
        let bright = 0.25 + 0.75 * zoom
        for i in 0..<count {
            let angle = Double(i) * (.pi * 2 / Double(count)) + zoom * 0.35
            let inner = 6.0 + 4.0 * (1 - zoom)
            let outer = Double(fieldR) * (0.55 + 0.4 * zoom)
            let wobble = sin(Double(i) * 1.7) * 4.0
            var filament = Path()
            let x0 = Double(cx) + cos(angle) * inner
            let y0 = Double(cy) + sin(angle) * inner
            let x1 = Double(cx) + cos(angle) * (outer + wobble)
            let y1 = Double(cy) + sin(angle) * (outer + wobble)
            filament.move(to: CGPoint(x: x0, y: y0))
            filament.addQuadCurve(
                to: CGPoint(x: x1, y: y1),
                control: CGPoint(
                    x: Double(cx) + cos(angle + 0.2) * (outer * 0.55),
                    y: Double(cy) + sin(angle + 0.2) * (outer * 0.55)
                )
            )
            let screen = filament.applying(world)
            context.glowStroke(
                screen,
                color: AppColor.diagramGlow,
                lineWidth: 2 + 2.5 * zoom,
                blur: 3 + 3 * zoom,
                opacity: 0.2 + 0.55 * bright
            )
            context.stroke(
                screen,
                with: .color(AppColor.diagramActive.opacity(0.35 + 0.55 * bright)),
                style: StrokeStyle(lineWidth: 1.25 + CGFloat(zoom), lineCap: .round)
            )
        }

        // Core tip
        let core = circlePath(cx: cx, cy: cy, r: 7 + CGFloat(4 * zoom)).applying(world)
        context.glowFill(core, color: AppColor.diagramGlow, blur: 8 + 6 * zoom, opacity: 0.35 + 0.4 * zoom)
        context.fill(core, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, 0.45 + 0.55 * zoom)))
        context.stroke(core, with: .color(AppColor.surface), style: StrokeStyle(lineWidth: 1.25))
    }
}

// MARK: - CUV Complex

/// Clitoris, urethra, and anterior wall as one integrated cluster — not a
/// magic spot. Three toggles; overlap glow strongest when all three are on.
private struct CUVComplexDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var clitoralOn = false
    @State private var urethralOn = false
    @State private var anteriorOn = false
    @State private var triadHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 300)

    var body: some View {
        let c = reduceMotion || clitoralOn
        let u = reduceMotion || urethralOn
        let a = reduceMotion || anteriorOn
        let activeCount = (c ? 1 : 0) + (u ? 1 : 0) + (a ? 1 : 0)
        DiagramSurface(
            height: 300,
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: 0, height: -8)
        ) {
            ZStack {
                Canvas { context, size in
                    draw(context, size: size, clitoral: c, urethral: u, anterior: a)
                }
                VStack(spacing: 0) {
                    DiagramInsightChip(text: insightLabel(count: activeCount))
                    if !reduceMotion {
                        HStack(spacing: 8) {
                            Button("Clitoral") { toggleClitoral() }
                                .buttonStyle(DiagramChipButtonStyle(active: clitoralOn))
                            Button("Urethral") { toggleUrethral() }
                                .buttonStyle(DiagramChipButtonStyle(active: urethralOn))
                            Button("Anterior") { toggleAnterior() }
                                .buttonStyle(DiagramChipButtonStyle(active: anteriorOn))
                        }
                        .padding(.top, 8)
                        Spacer()
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
                clitoralOn = true
                urethralOn = true
                anteriorOn = true
            }
        }
        .onChange(of: clitoralOn) { _, _ in checkTriadHaptic() }
        .onChange(of: urethralOn) { _, _ in checkTriadHaptic() }
        .onChange(of: anteriorOn) { _, _ in checkTriadHaptic() }
    }

    private func insightLabel(count: Int) -> String {
        if count >= 3 { return "One cluster" }
        if count >= 2 { return "Overlap" }
        if count == 1 { return "One channel" }
        return "Tap channels"
    }

    private func toggleClitoral() {
        if !hasInteracted { hasInteracted = true }
        clitoralOn.toggle()
    }
    private func toggleUrethral() {
        if !hasInteracted { hasInteracted = true }
        urethralOn.toggle()
    }
    private func toggleAnterior() {
        if !hasInteracted { hasInteracted = true }
        anteriorOn.toggle()
    }

    private func checkTriadHaptic() {
        let full = clitoralOn && urethralOn && anteriorOn
        if full && !triadHaptic {
            triadHaptic = true
            NativeHaptics.impactLight()
        } else if !full {
            triadHaptic = false
        }
    }

    private func draw(
        _ context: GraphicsContext,
        size: CGSize,
        clitoral: Bool,
        urethral: Bool,
        anterior: Bool
    ) {
        let world = worldTransform(in: size, natural: natural)
        let cT = clitoral ? 1.0 : 0.0
        let uT = urethral ? 1.0 : 0.0
        let aT = anterior ? 1.0 : 0.0
        let overlap = Double((clitoral ? 1 : 0) + (urethral ? 1 : 0) + (anterior ? 1 : 0))
        let cluster = smoothstep(1.2, 3.0, overlap)

        // Three soft overlapping ovals — abstract cluster, not literal anatomy
        let clitoralOval = Path(ellipseIn: CGRect(x: 98, y: 88, width: 78, height: 70)).applying(world)
        let urethralOval = Path(ellipseIn: CGRect(x: 118, y: 118, width: 64, height: 78)).applying(world)
        let anteriorOval = Path(ellipseIn: CGRect(x: 108, y: 148, width: 84, height: 72)).applying(world)

        context.fill(clitoralOval, with: .color(AppColor.diagramPassive.opacity(0.28 + 0.35 * cT)))
        context.fill(urethralOval, with: .color(AppColor.diagramPassive.opacity(0.25 + 0.35 * uT)))
        context.fill(anteriorOval, with: .color(AppColor.diagramPassive.opacity(0.25 + 0.35 * aT)))

        context.stroke(
            clitoralOval,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, cT).opacity(0.7 + 0.3 * cT)),
            style: StrokeStyle(lineWidth: 2)
        )
        context.stroke(
            urethralOval,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, uT).opacity(0.7 + 0.3 * uT)),
            style: StrokeStyle(lineWidth: 2)
        )
        context.stroke(
            anteriorOval,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, aT).opacity(0.7 + 0.3 * aT)),
            style: StrokeStyle(lineWidth: 2)
        )

        if cT > 0.5 { context.glowFill(clitoralOval, color: AppColor.diagramGlow, blur: 10, opacity: 0.28) }
        if uT > 0.5 { context.glowFill(urethralOval, color: AppColor.diagramGlow, blur: 10, opacity: 0.26) }
        if aT > 0.5 { context.glowFill(anteriorOval, color: AppColor.diagramGlow, blur: 10, opacity: 0.26) }

        // Overlap core — strongest when all three channels lit
        let core = circlePath(cx: 150, cy: 148, r: 28 + CGFloat(10 * cluster)).applying(world)
        context.glowFill(core, color: AppColor.diagramGlow, blur: 18 + 10 * cluster, opacity: 0.15 + 0.55 * cluster)
        context.glowFill(core, color: AppColor.diagramActive, blur: 8, opacity: 0.12 + 0.4 * cluster)
        if cluster > 0.55 {
            context.stroke(
                circlePath(cx: 150, cy: 148, r: 18).applying(world),
                with: .color(AppColor.diagramActive.opacity(0.55 + 0.35 * cluster)),
                style: StrokeStyle(lineWidth: 2)
            )
        }
    }
}

// MARK: - Internal Stimulation

/// Front-wall pressure reaches internal clitoral tissue — not deeper=better.
/// Drag tilts the contact path toward the anterior/internal bulbs vs deep/dull.
private struct InternalStimulationDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var angleDeg: Double = 8
    @State private var dragBaseAngle: Double = 8
    @State private var anteriorHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 240)
    private let pivot = CGPoint(x: 150, y: 132)

    var body: some View {
        let angle = reduceMotion ? -14.0 : angleDeg
        let anterior = smoothstep(2, 14, -angle)
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: 0, height: 24)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, angleDeg: angle, anterior: anterior)
                }
                DiagramInsightChip(text: anterior > 0.45 ? "Anterior path" : "Deep pressure")
                VStack {
                    Spacer()
                    DiagramAffordanceHint(
                        text: "Drag to explore",
                        visible: !hasInteracted && !reduceMotion
                    )
                    .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
        .onAppear {
            if reduceMotion {
                angleDeg = -14
                dragBaseAngle = -14
            }
        }
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 3)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                let delta = -Double(value.translation.height) / 4.2
                angleDeg = min(18, max(-18, dragBaseAngle + delta))
                let engaged = angleDeg < -9
                if engaged && !anteriorHaptic {
                    anteriorHaptic = true
                    NativeHaptics.impactLight()
                } else if !engaged {
                    anteriorHaptic = false
                }
            }
            .onEnded { _ in
                dragBaseAngle = angleDeg
            }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, angleDeg: Double, anterior: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Soft spine guide
        var spine = Path()
        spine.move(to: CGPoint(x: 150, y: 40))
        spine.addQuadCurve(to: CGPoint(x: 150, y: 118), control: CGPoint(x: 148, y: 86))
        context.stroke(
            spine.applying(world),
            with: .color(AppColor.diagramPassive.opacity(0.8)),
            style: StrokeStyle(lineWidth: 3.5, lineCap: .round)
        )

        // Pelvis bowl
        var pelvis = Path()
        pelvis.move(to: CGPoint(x: 88, y: 120))
        pelvis.addQuadCurve(to: CGPoint(x: 212, y: 120), control: CGPoint(x: 150, y: 110))
        pelvis.addQuadCurve(to: CGPoint(x: 196, y: 172), control: CGPoint(x: 218, y: 150))
        pelvis.addQuadCurve(to: CGPoint(x: 104, y: 172), control: CGPoint(x: 150, y: 200))
        pelvis.addQuadCurve(to: CGPoint(x: 88, y: 120), control: CGPoint(x: 82, y: 150))
        pelvis.closeSubpath()

        // Deep / posterior path (dull when anterior engaged)
        var deep = Path()
        deep.move(to: CGPoint(x: 150, y: 138))
        deep.addQuadCurve(to: CGPoint(x: 150, y: 188), control: CGPoint(x: 168, y: 164))

        // Anterior contact path toward internal bulbs
        var anteriorPath = Path()
        anteriorPath.move(to: CGPoint(x: 134, y: 140))
        anteriorPath.addQuadCurve(to: CGPoint(x: 118, y: 168), control: CGPoint(x: 112, y: 148))

        // Internal bulb markers (target tissue)
        let bulbL = circlePath(cx: 112, cy: 170, r: 10)
        let bulbR = circlePath(cx: 188, cy: 170, r: 10)

        let rotation = CGAffineTransform(translationX: pivot.x, y: pivot.y)
            .rotated(by: angleDeg * .pi / 180)
            .translatedBy(x: -pivot.x, y: -pivot.y)

        let pelvisScreen = pelvis.applying(rotation).applying(world)
        let deepScreen = deep.applying(rotation).applying(world)
        let anteriorScreen = anteriorPath.applying(rotation).applying(world)
        let bulbLScreen = bulbL.applying(rotation).applying(world)
        let bulbRScreen = bulbR.applying(rotation).applying(world)

        context.fill(pelvisScreen, with: .color(AppColor.surface))
        context.stroke(
            pelvisScreen,
            with: .color(AppColor.diagramPassive.opacity(0.9)),
            style: StrokeStyle(lineWidth: 2.25, lineCap: .round, lineJoin: .round)
        )

        // Deep path — fades as anterior engages
        let deepOpacity = 0.55 * (1 - 0.7 * anterior)
        context.stroke(
            deepScreen,
            with: .color(AppColor.diagramPassive.opacity(deepOpacity)),
            style: StrokeStyle(lineWidth: 5, lineCap: .round)
        )

        // Anterior path glow — the teaching insight
        context.stroke(
            anteriorScreen,
            with: .color(AppColor.diagramPassive),
            style: StrokeStyle(lineWidth: 5, lineCap: .round)
        )
        context.glowStroke(
            anteriorScreen,
            color: AppColor.diagramGlow,
            lineWidth: 10 + 10 * anterior,
            blur: 8 + 4 * anterior,
            opacity: 0.3 + 0.55 * anterior
        )
        context.glowStroke(
            anteriorScreen,
            color: AppColor.diagramActive,
            lineWidth: 4 + 5 * anterior,
            blur: 4,
            opacity: anterior
        )

        // Internal bulbs light when anterior path engages
        context.fill(bulbLScreen, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, anterior).opacity(0.55 + 0.4 * anterior)))
        context.fill(bulbRScreen, with: .color(AppColor.diagramPassive.opacity(0.35)))
        if anterior > 0.35 {
            context.glowFill(bulbLScreen, color: AppColor.diagramGlow, blur: 10, opacity: 0.35 + 0.4 * anterior)
        }

        let dot = circlePath(cx: pivot.x, cy: pivot.y, r: 4.5).applying(world)
        context.fill(dot, with: .color(AppColor.diagramPassive.opacity(0.55)))
        context.stroke(dot, with: .color(AppColor.surface), style: StrokeStyle(lineWidth: 1))
    }
}


// MARK: - Building

/// Arousal gathers gradually — hold fills a soft reservoir; release leaks
/// slightly. Insight: Gathering / Held / Easing.
private struct BuildingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var fill: Double = 0.1
    @State private var isHolding = false
    @State private var crossedHigh = false
    @State private var hasInteracted = false
    @State private var lastTick: Date?

    private let natural = CGSize(width: 280, height: 280)
    private let highMark = 0.7

    var body: some View {
        let level = reduceMotion ? 0.55 : fill
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: 0, height: 36)
        ) {
            ZStack(alignment: .top) {
                TimelineView(.animation(minimumInterval: 1.0 / 30.0, paused: reduceMotion)) { timeline in
                    Canvas { context, size in
                        draw(context, size: size, fill: level, holding: isHolding && !reduceMotion)
                    }
                    .onChange(of: timeline.date) { _, date in
                        advanceFill(to: date)
                    }
                }
                DiagramInsightChip(text: insightLabel(level: level, holding: isHolding && !reduceMotion))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Hold to gather", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: holdGesture))
        }
    }

    private func advanceFill(to date: Date) {
        guard !reduceMotion else { return }
        let dt: Double
        if let lastTick {
            dt = min(0.05, date.timeIntervalSince(lastTick))
        } else {
            dt = 1.0 / 30.0
        }
        lastTick = date
        if isHolding {
            fill = min(1, fill + dt * 0.42)
            if fill >= highMark && !crossedHigh {
                crossedHigh = true
                NativeHaptics.impactLight()
            }
        } else if hasInteracted {
            fill = max(0.06, fill - dt * 0.14)
            if fill < highMark - 0.05 { crossedHigh = false }
        }
    }

    private func insightLabel(level: Double, holding: Bool) -> String {
        if !holding && hasInteracted && !reduceMotion { return "Easing" }
        if holding && level >= highMark { return "Held" }
        return "Gathering"
    }

    private var holdGesture: some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { _ in
                if !hasInteracted { hasInteracted = true }
                isHolding = true
            }
            .onEnded { _ in
                isHolding = false
            }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, fill: Double, holding: Bool) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 140
        let top: CGFloat = 58
        let bottom: CGFloat = 228
        let width: CGFloat = 78

        var vessel = Path()
        vessel.addRoundedRect(
            in: CGRect(x: cx - width / 2, y: top, width: width, height: bottom - top),
            cornerSize: CGSize(width: width / 2, height: 36)
        )
        let vesselScreen = vessel.applying(world)
        context.stroke(vesselScreen, with: .color(AppColor.diagramPassive), style: StrokeStyle(lineWidth: 2.5))
        context.fill(vesselScreen, with: .color(AppColor.diagramPassive.opacity(0.12)))

        let innerInset: CGFloat = 6
        let innerTop = top + innerInset
        let innerBottom = bottom - innerInset
        let innerH = innerBottom - innerTop
        let fillH = CGFloat(fill) * innerH
        let fillRect = CGRect(
            x: cx - width / 2 + innerInset,
            y: innerBottom - fillH,
            width: width - innerInset * 2,
            height: max(0, fillH)
        )
        var fillPath = Path()
        fillPath.addRoundedRect(in: fillRect, cornerSize: CGSize(width: 28, height: 22))
        let fillScreen = fillPath.applying(world)
        let warmth = smoothstep(0.15, highMark, fill)
        context.fill(
            fillScreen,
            with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, 0.35 + 0.65 * warmth).opacity(0.55 + 0.3 * warmth))
        )
        context.glowFill(fillScreen, color: AppColor.diagramGlow, blur: 14, opacity: 0.2 + 0.45 * warmth)

        if fill > 0.08 {
            let y = innerBottom - fillH
            var meniscus = Path()
            meniscus.move(to: CGPoint(x: cx - width / 2 + innerInset + 4, y: y))
            meniscus.addQuadCurve(
                to: CGPoint(x: cx + width / 2 - innerInset - 4, y: y),
                control: CGPoint(x: cx, y: y - (holding ? 5 : 2))
            )
            context.stroke(
                meniscus.applying(world),
                with: .color(AppColor.surface.opacity(0.55 + 0.25 * warmth)),
                style: StrokeStyle(lineWidth: 2, lineCap: .round)
            )
        }

        let markY = innerBottom - CGFloat(highMark) * innerH
        var tick = Path()
        tick.move(to: CGPoint(x: cx + width / 2 + 8, y: markY))
        tick.addLine(to: CGPoint(x: cx + width / 2 + 22, y: markY))
        context.stroke(
            tick.applying(world),
            with: .color(AppColor.diagramActive.opacity(0.55)),
            style: StrokeStyle(lineWidth: 2, lineCap: .round)
        )

        let ember = circlePath(cx: cx, cy: bottom + 18, r: 10 + CGFloat(4 * warmth)).applying(world)
        context.glowFill(ember, color: AppColor.diagramGlow, blur: 10, opacity: 0.25 + 0.35 * warmth)
        context.fill(
            circlePath(cx: cx, cy: bottom + 18, r: 5).applying(world),
            with: .color(AppColor.diagramPassive.opacity(0.7))
        )
    }
}


// MARK: - Plateauing

/// Climb a rising curve, then walk a flat ridge — hover without climbing or
/// fading. Insight: Climbing / On the ridge / Sliding off.
private struct PlateauingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var progress: Double = 0.08
    @State private var dragBase: Double = 0.08
    @State private var gestureActive = false
    @State private var ridgeHaptic = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 260)
    private let ridgeStart = 0.48
    private let ridgeEnd = 0.82
    private let dragRange: Double = 210

    var body: some View {
        let t = reduceMotion ? 0.65 : progress
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: CGSize(width: -40, height: 20)
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, progress: t)
                }
                DiagramInsightChip(text: insightLabel(for: t))
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

    private func insightLabel(for t: Double) -> String {
        if t >= ridgeEnd { return "Sliding off" }
        if t >= ridgeStart { return "On the ridge" }
        return "Climbing"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 3)
            .onChanged { value in
                if !hasInteracted { hasInteracted = true }
                if !gestureActive {
                    gestureActive = true
                    dragBase = progress
                }
                let delta = Double(value.translation.width) / dragRange
                    - Double(value.translation.height) / (dragRange * 1.4)
                progress = min(1, max(0, dragBase + delta))
                let onRidge = progress >= ridgeStart && progress <= ridgeEnd
                if onRidge && !ridgeHaptic {
                    ridgeHaptic = true
                    NativeHaptics.impactLight()
                } else if !onRidge {
                    ridgeHaptic = false
                }
            }
            .onEnded { _ in
                gestureActive = false
                dragBase = progress
            }
    }

    /// Piecewise path: cubic climb → flat ridge → gentle slide.
    private func point(at t: Double) -> CGPoint {
        let t = min(1, max(0, t))
        if t <= ridgeStart {
            let u = t / ridgeStart
            let p0 = CGPoint(x: 36, y: 210)
            let p1 = CGPoint(x: 70, y: 178)
            let p2 = CGPoint(x: 118, y: 118)
            let p3 = CGPoint(x: 148, y: 96)
            return cubic(u, p0, p1, p2, p3)
        }
        if t <= ridgeEnd {
            let u = (t - ridgeStart) / (ridgeEnd - ridgeStart)
            let x = 148 + CGFloat(u) * 72
            return CGPoint(x: x, y: 96)
        }
        let u = (t - ridgeEnd) / (1 - ridgeEnd)
        let p0 = CGPoint(x: 220, y: 96)
        let p1 = CGPoint(x: 242, y: 104)
        let p2 = CGPoint(x: 258, y: 138)
        let p3 = CGPoint(x: 268, y: 168)
        return cubic(u, p0, p1, p2, p3)
    }

    private func cubic(_ t: Double, _ p0: CGPoint, _ p1: CGPoint, _ p2: CGPoint, _ p3: CGPoint) -> CGPoint {
        let u = 1 - t
        let tt = t * t
        let uu = u * u
        let x = uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x
        let y = uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y
        return CGPoint(x: x, y: y)
    }

    private func samples(steps: Int = 90) -> [CGPoint] {
        (0...steps).map { point(at: Double($0) / Double(steps)) }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, progress: Double) {
        let world = worldTransform(in: size, natural: natural)
        let pts = samples()
        let orb = point(at: progress)
        let onRidge = progress >= ridgeStart && progress <= ridgeEnd
        let ridgeAmt = onRidge ? 1.0 : 0.0

        // Soft under-fill to the traveler
        var fill = Path()
        fill.move(to: CGPoint(x: pts[0].x, y: 230))
        fill.addLine(to: pts[0])
        let idx = max(1, min(pts.count - 1, Int(progress * Double(pts.count - 1))))
        for i in 1...idx { fill.addLine(to: pts[i]) }
        fill.addLine(to: CGPoint(x: pts[idx].x, y: 230))
        fill.closeSubpath()
        context.fill(fill.applying(world), with: .color(AppColor.diagramGlow.opacity(0.14 + 0.18 * ridgeAmt)))

        // Full path
        var path = Path()
        path.move(to: pts[0])
        for pt in pts.dropFirst() { path.addLine(to: pt) }
        context.stroke(path.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

        // Active climb/ridge trace
        var trace = Path()
        trace.move(to: pts[0])
        for i in 1...idx { trace.addLine(to: pts[i]) }
        let near = smoothstep(0.2, ridgeStart, progress)
        context.glowStroke(trace.applying(world), color: AppColor.diagramActive,
                           lineWidth: 3.5 + 2 * ridgeAmt, blur: 7, opacity: 0.25 + 0.4 * near)
        context.stroke(trace.applying(world), with: .color(AppColor.diagramGlow.opacity(0.4 + 0.45 * near)),
                       style: StrokeStyle(lineWidth: 3.5 + 2 * ridgeAmt, lineCap: .round, lineJoin: .round))

        // Ridge band highlight
        let r0 = point(at: ridgeStart)
        let r1 = point(at: ridgeEnd)
        var ridge = Path()
        ridge.move(to: r0)
        ridge.addLine(to: r1)
        context.glowStroke(ridge.applying(world), color: AppColor.diagramGlow,
                           lineWidth: 10, blur: 8, opacity: 0.2 + 0.45 * ridgeAmt)
        context.stroke(ridge.applying(world), with: .color(AppColor.diagramActive.opacity(0.35 + 0.4 * ridgeAmt)),
                       style: StrokeStyle(lineWidth: 2.5, lineCap: .round))

        // Traveler
        let orbR: CGFloat = 6.5 + CGFloat(3 * ridgeAmt)
        let orbPath = circlePath(cx: orb.x, cy: orb.y, r: orbR).applying(world)
        context.glowFill(orbPath, color: AppColor.diagramGlow, blur: 12, opacity: 0.3 + 0.4 * ridgeAmt)
        context.fill(orbPath, with: .color(AppColor.diagramActive.opacity(0.9)))
        context.stroke(orbPath, with: .color(AppColor.surface.opacity(0.9)), style: StrokeStyle(lineWidth: 1))
    }
}


// MARK: - Pulsing

private struct DiagramPulseRing: Identifiable {
    let id = UUID()
    let born: Date
}

/// High-arousal throb as a calm pulse the user can feel/match. Tap emits
/// concentric rings (~0.8s expand/fade). Insight: Still / Pulse.
private struct PulsingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var rings: [DiagramPulseRing] = []
    @State private var hasInteracted = false
    @State private var now = Date()

    private let natural = CGSize(width: 280, height: 280)
    private let ringLife: TimeInterval = 0.8

    var body: some View {
        let active = !reduceMotion && rings.contains { now.timeIntervalSince($0.born) < ringLife }
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: .zero
        ) {
            ZStack(alignment: .top) {
                TimelineView(.animation(minimumInterval: 1.0 / 30.0, paused: reduceMotion)) { timeline in
                    Canvas { context, size in
                        if reduceMotion {
                            let frozenNow = Date()
                            let frozenBorn = frozenNow.addingTimeInterval(-ringLife * 0.45)
                            draw(context, size: size, rings: [DiagramPulseRing(born: frozenBorn)], now: frozenNow)
                        } else {
                            draw(context, size: size, rings: rings, now: timeline.date)
                        }
                    }
                    .onChange(of: timeline.date) { _, newValue in
                        now = newValue
                        rings.removeAll { newValue.timeIntervalSince($0.born) > ringLife }
                    }
                }
                DiagramInsightChip(text: (reduceMotion || active) ? "Pulse" : "Still")
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Tap to pulse", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .onTapGesture {
                guard !reduceMotion else { return }
                if !hasInteracted { hasInteracted = true }
                rings.append(DiagramPulseRing(born: Date()))
                NativeHaptics.impactLight()
            }
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, rings: [DiagramPulseRing], now: Date) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 140
        let cy: CGFloat = 148

        let core = circlePath(cx: cx, cy: cy, r: 16).applying(world)
        context.glowFill(core, color: AppColor.diagramGlow, blur: 14, opacity: 0.35)
        context.fill(core, with: .color(AppColor.diagramActive.opacity(0.82)))
        context.stroke(core, with: .color(AppColor.surface.opacity(0.85)), style: StrokeStyle(lineWidth: 1.2))

        let halo = circlePath(cx: cx, cy: cy, r: 34).applying(world)
        context.stroke(halo, with: .color(AppColor.diagramPassive.opacity(0.45)),
                       style: StrokeStyle(lineWidth: 1.5))

        for ring in rings {
            let age = now.timeIntervalSince(ring.born)
            let u = min(1, max(0, age / ringLife))
            let radius = 22 + CGFloat(u) * 88
            let opacity = (1 - u) * 0.7
            let ringPath = circlePath(cx: cx, cy: cy, r: radius).applying(world)
            context.glowStroke(ringPath, color: AppColor.diagramGlow, lineWidth: 5, blur: 6, opacity: opacity * 0.7)
            context.stroke(
                ringPath,
                with: .color(AppColor.diagramActive.opacity(opacity)),
                style: StrokeStyle(lineWidth: 2.2, lineCap: .round)
            )
        }
    }
}


// MARK: - Spreading

/// Pleasure radiates from a touch origin through a soft branching nerve tree.
/// Tap origin; ripples travel outward. Insight: Contact / Spreading.
private struct SpreadingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var wave: Double = 0
    @State private var animating = false
    @State private var hasInteracted = false

    private let natural = CGSize(width: 300, height: 280)

    /// Branch polylines in natural space, rooted near center.
    private var branches: [[CGPoint]] {
        [
            [CGPoint(x: 150, y: 150), CGPoint(x: 118, y: 112), CGPoint(x: 86, y: 78), CGPoint(x: 58, y: 54)],
            [CGPoint(x: 150, y: 150), CGPoint(x: 186, y: 118), CGPoint(x: 220, y: 88), CGPoint(x: 248, y: 62)],
            [CGPoint(x: 150, y: 150), CGPoint(x: 112, y: 168), CGPoint(x: 74, y: 196), CGPoint(x: 48, y: 228)],
            [CGPoint(x: 150, y: 150), CGPoint(x: 188, y: 172), CGPoint(x: 226, y: 204), CGPoint(x: 252, y: 234)],
            [CGPoint(x: 150, y: 150), CGPoint(x: 150, y: 108), CGPoint(x: 142, y: 68), CGPoint(x: 150, y: 38)],
            [CGPoint(x: 150, y: 150), CGPoint(x: 150, y: 188), CGPoint(x: 158, y: 228), CGPoint(x: 150, y: 258)],
            // Soft side forks
            [CGPoint(x: 118, y: 112), CGPoint(x: 96, y: 96), CGPoint(x: 72, y: 100)],
            [CGPoint(x: 186, y: 118), CGPoint(x: 206, y: 108), CGPoint(x: 228, y: 118)],
            [CGPoint(x: 112, y: 168), CGPoint(x: 90, y: 160), CGPoint(x: 68, y: 170)],
            [CGPoint(x: 188, y: 172), CGPoint(x: 210, y: 168), CGPoint(x: 232, y: 180)],
        ]
    }

    var body: some View {
        let level = reduceMotion ? 0.55 : wave
        DiagramSurface(
            idlePulse: !hasInteracted && !reduceMotion,
            pulseOffset: .zero
        ) {
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, wave: level)
                }
                DiagramInsightChip(text: insightLabel(level: level))
                VStack {
                    Spacer()
                    DiagramAffordanceHint(text: "Tap the origin", visible: !hasInteracted && !reduceMotion)
                        .padding(.bottom, 14)
                }
            }
            .contentShape(Rectangle())
            .onTapGesture {
                guard !reduceMotion else { return }
                if !hasInteracted { hasInteracted = true }
                NativeHaptics.impactLight()
                animating = true
                wave = 0
                withAnimation(.easeOut(duration: 1.15)) {
                    wave = 1
                }
            }
        }
    }

    private func insightLabel(level: Double) -> String {
        if level < 0.08 { return "Contact" }
        if level < 0.28 { return "Contact" }
        return "Spreading"
    }

    private func draw(_ context: GraphicsContext, size: CGSize, wave: Double) {
        let world = worldTransform(in: size, natural: natural)
        let origin = CGPoint(x: 150, y: 150)

        // Passive tree
        for branch in branches {
            var path = Path()
            path.move(to: branch[0])
            for pt in branch.dropFirst() { path.addLine(to: pt) }
            context.stroke(
                path.applying(world),
                with: .color(AppColor.diagramPassive.opacity(0.55)),
                style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round)
            )
        }

        // Active ripple — segments light as wave front reaches them
        for branch in branches {
            let lengths = branchLengths(branch)
            let total = lengths.last ?? 1
            var lit = Path()
            lit.move(to: branch[0])
            var traveled: CGFloat = 0
            for i in 1..<branch.count {
                let seg = lengths[i] - lengths[i - 1]
                let reach = CGFloat(wave) * (total + 36)
                if traveled + seg <= reach {
                    lit.addLine(to: branch[i])
                    traveled += seg
                } else {
                    let u = max(0, min(1, (reach - traveled) / max(seg, 0.001)))
                    let a = branch[i - 1]
                    let b = branch[i]
                    lit.addLine(to: CGPoint(x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u))
                    break
                }
            }
            let glow = smoothstep(0.05, 0.7, wave)
            context.glowStroke(lit.applying(world), color: AppColor.diagramActive,
                               lineWidth: 3.2, blur: 6, opacity: 0.25 + 0.45 * glow)
            context.stroke(
                lit.applying(world),
                with: .color(AppColor.diagramGlow.opacity(0.45 + 0.4 * glow)),
                style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round)
            )
        }

        // Soft concentric wash
        if wave > 0.02 {
            let r = 18 + CGFloat(wave) * 96
            let wash = circlePath(cx: origin.x, cy: origin.y, r: r).applying(world)
            context.glowStroke(wash, color: AppColor.diagramGlow, lineWidth: 4, blur: 8,
                               opacity: (1 - wave) * 0.45)
        }

        // Origin node
        let core = circlePath(cx: origin.x, cy: origin.y, r: 12).applying(world)
        context.glowFill(core, color: AppColor.diagramGlow, blur: 12, opacity: 0.35 + 0.35 * wave)
        context.fill(core, with: .color(AppColor.diagramActive.opacity(0.88)))
        context.stroke(core, with: .color(AppColor.surface.opacity(0.9)), style: StrokeStyle(lineWidth: 1.2))
    }

    private func branchLengths(_ pts: [CGPoint]) -> [CGFloat] {
        var lengths: [CGFloat] = [0]
        var sum: CGFloat = 0
        for i in 1..<pts.count {
            let dx = pts[i].x - pts[i - 1].x
            let dy = pts[i].y - pts[i - 1].y
            sum += sqrt(dx * dx + dy * dy)
            lengths.append(sum)
        }
        return lengths
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
