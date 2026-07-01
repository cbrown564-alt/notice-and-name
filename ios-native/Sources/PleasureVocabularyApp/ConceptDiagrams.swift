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
/// `path` is `native://diagram/<id>`. These four concepts are drawn in-app
/// (no image asset ships for them). When Reduce Motion is off, diagrams are
/// user-driven (pan/tap) to match React Native; when on, a static teaching
/// frame is shown. See `docs/pipelines/INTERACTIVE_DIAGRAMS_PLAN.md` Phase 0.
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
/// React Native twin: `components/diagrams/DiagramFrame.tsx`.
private struct DiagramSurface<Content: View>: View {
    var height: CGFloat = 300
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
            .clipShape(RoundedRectangle(cornerRadius: 8))
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

    private let natural = CGSize(width: 300, height: 220)
    private let pivot = CGPoint(x: 150, y: 130)

    var body: some View {
        DiagramSurface {
            let angle = reduceMotion ? -15.0 : angleDeg
            let glow = smoothstep(4, 12, -angle)
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, angleDeg: angle, glow: glow)
                }
                Text(angle < -5 ? "Posterior tilt" : (angle > 5 ? "Anterior tilt" : "Neutral"))
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .padding(.top, 12)
                    .accessibilityHidden(true)
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
                let delta = -Double(value.translation.height) / 5
                angleDeg = min(20, max(-20, dragBaseAngle + delta))
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

        var spine = Path()
        spine.move(to: CGPoint(x: 150, y: 40))
        spine.addQuadCurve(to: CGPoint(x: 150, y: 130), control: CGPoint(x: 150, y: 100))
        context.stroke(spine.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))

        var pelvis = Path()
        pelvis.move(to: CGPoint(x: 90, y: 130))
        pelvis.addQuadCurve(to: CGPoint(x: 210, y: 130), control: CGPoint(x: 150, y: 200))
        pelvis.addLine(to: CGPoint(x: 200, y: 130))
        pelvis.addQuadCurve(to: CGPoint(x: 100, y: 130), control: CGPoint(x: 150, y: 180))
        pelvis.closeSubpath()

        var contact = Path()
        contact.move(to: CGPoint(x: 130, y: 150))
        contact.addQuadCurve(to: CGPoint(x: 170, y: 150), control: CGPoint(x: 150, y: 170))

        let rotation = CGAffineTransform(translationX: pivot.x, y: pivot.y)
            .rotated(by: angleDeg * .pi / 180)
            .translatedBy(x: -pivot.x, y: -pivot.y)

        let pelvisScreen = pelvis.applying(rotation).applying(world)
        let contactScreen = contact.applying(rotation).applying(world)

        context.fill(pelvisScreen, with: .color(AppColor.surface))
        context.stroke(pelvisScreen, with: .color(AppColor.diagramPassive.opacity(0.85)),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

        context.stroke(contactScreen, with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
        context.glowStroke(contactScreen, color: AppColor.diagramActive,
                           lineWidth: 4 + 5 * glow, blur: 5, opacity: glow)

        let dot = circlePath(cx: pivot.x, cy: pivot.y, r: 4).applying(world)
        context.fill(dot, with: .color(AppColor.diagramPassive.opacity(0.5)))
    }
}

// MARK: - Rocking

/// Compression and friction at the pubic mound. Drag the partner wedge toward
/// the contact point; warmth builds at high contact.
private struct RockingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var partnerOffset = CGSize(width: -60, height: -40)
    @State private var dragBaseOffset = CGSize(width: -60, height: -40)
    @State private var contactHaptic = false

    private let natural = CGSize(width: 300, height: 220)
    private let pubic = CGPoint(x: 140, y: 150)

    var body: some View {
        DiagramSurface {
            let intensity = contactIntensity(at: partnerOffset)
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, partnerOffset: partnerOffset, intensity: intensity)
                }
                Text(intensity > 0.6 ? "Contact" : (intensity > 0.1 ? "Near" : "No contact"))
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .padding(.top, 12)
                    .accessibilityHidden(true)
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

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 2)
            .onChanged { value in
                partnerOffset = CGSize(
                    width: dragBaseOffset.width + value.translation.width,
                    height: dragBaseOffset.height + value.translation.height
                )
                let intensity = contactIntensity(at: partnerOffset)
                if intensity > 0.8 && !contactHaptic {
                    contactHaptic = true
                    NativeHaptics.impactLight()
                } else if intensity <= 0.8 {
                    contactHaptic = false
                }
            }
            .onEnded { _ in
                dragBaseOffset = partnerOffset
            }
    }

    private func contactIntensity(at offset: CGSize) -> Double {
        let dx = offset.width
        let dy = offset.height
        let distance = sqrt(dx * dx + dy * dy)
        return min(1, max(0, 1 - distance / 60))
    }

    private func draw(_ context: GraphicsContext, size: CGSize, partnerOffset: CGSize, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        var pelvis = Path()
        pelvis.move(to: CGPoint(x: pubic.x + 40, y: 90))
        pelvis.addQuadCurve(to: pubic, control: CGPoint(x: pubic.x, y: 130))
        pelvis.addLine(to: CGPoint(x: pubic.x + 20, y: pubic.y + 40))
        context.stroke(pelvis.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))

        let heat = circlePath(cx: pubic.x, cy: pubic.y, r: 26).applying(world)
        context.glowFill(heat, color: AppColor.diagramGlow, blur: 8 + 12 * intensity, opacity: 0.6 * intensity)

        let mound = circlePath(cx: pubic.x, cy: pubic.y, r: 8).applying(world)
        context.fill(mound, with: .color(AppColor.diagramPassive))

        let tip = CGPoint(x: pubic.x + partnerOffset.width, y: pubic.y + partnerOffset.height)
        var wedge = Path()
        wedge.move(to: CGPoint(x: 0, y: -28))
        wedge.addLine(to: CGPoint(x: 26, y: -28))
        wedge.addQuadCurve(to: CGPoint(x: 0, y: 0), control: CGPoint(x: 26, y: 0))
        wedge.addLine(to: CGPoint(x: -26, y: -28))
        wedge.closeSubpath()
        let wedgeScreen = wedge
            .applying(CGAffineTransform(translationX: tip.x, y: tip.y))
            .applying(world)
        context.fill(wedgeScreen, with: .color(AppColor.diagramActive.opacity(0.55 + 0.35 * intensity)))

        let tipDot = circlePath(cx: tip.x, cy: tip.y, r: 4).applying(world)
        context.fill(tipDot, with: .color(AppColor.surface))
    }
}

// MARK: - Shallowing

/// Shallow vs deep. Drag horizontally along the canal; glow peaks at the
/// nerve-rich entrance (introitus).
private struct ShallowingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var probeX: CGFloat = 50
    @State private var dragBaseX: CGFloat = 50

    private let natural = CGSize(width: 280, height: 240)
    private let entranceX: CGFloat = 50
    private let canalY: CGFloat = 150
    private let canalLength: CGFloat = 240

    var body: some View {
        DiagramSurface {
            GeometryReader { geo in
                let intensity = probeIntensity(at: probeX)
                ZStack(alignment: .top) {
                    Canvas { context, size in
                        draw(context, size: size, probeX: probeX, intensity: intensity)
                    }
                    Text(intensity > 0.5 ? "Shallow · sensitive" : "Deep · pressure")
                        .font(AppFont.label)
                        .foregroundStyle(AppColor.secondaryInk)
                        .padding(.top, 12)
                        .accessibilityHidden(true)
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
                let scale = natural.width / max(1, size.width)
                let x = dragBaseX + value.translation.width * scale
                probeX = min(canalLength, max(0, x))
            }
            .onEnded { _ in
                dragBaseX = probeX
            }
    }

    private func probeIntensity(at x: CGFloat) -> Double {
        smoothstep(170, Double(entranceX), Double(x))
    }

    private func draw(_ context: GraphicsContext, size: CGSize, probeX: CGFloat, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        let zone = circlePath(cx: entranceX + 10, cy: canalY, r: 48).applying(world)
        context.glowFill(zone, color: AppColor.diagramGlow, blur: 22, opacity: 0.30)

        var top = Path()
        top.move(to: CGPoint(x: 0, y: 100))
        top.addQuadCurve(to: CGPoint(x: entranceX + 50, y: 112), control: CGPoint(x: entranceX, y: 100))
        top.addLine(to: CGPoint(x: 280, y: 112))
        var bottom = Path()
        bottom.move(to: CGPoint(x: 0, y: 200))
        bottom.addQuadCurve(to: CGPoint(x: entranceX + 50, y: 188), control: CGPoint(x: entranceX, y: 200))
        bottom.addLine(to: CGPoint(x: 280, y: 188))
        context.stroke(top.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
        context.stroke(bottom.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))

        let aura = circlePath(cx: probeX, cy: canalY, r: 24).applying(world)
        context.glowFill(aura, color: AppColor.diagramGlow, blur: 14, opacity: 0.45 * intensity)

        let core = circlePath(cx: probeX, cy: canalY, r: 12).applying(world)
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

    private let natural = CGSize(width: 300, height: 300)

    var body: some View {
        DiagramSurface(height: 300) {
            let paired = reduceMotion ? 1.0 : (externalOn && internalOn ? 1.0 : 0.0)
            ZStack {
                Canvas { context, size in
                    draw(
                        context,
                        size: size,
                        externalOn: reduceMotion || externalOn,
                        internalOn: reduceMotion || internalOn,
                        paired: paired
                    )
                }
                if !reduceMotion {
                    VStack {
                        Button("External · glans") { toggleExternal() }
                            .buttonStyle(DiagramChipButtonStyle())
                            .padding(.top, 10)
                        Spacer()
                        Button("Internal · crura") { toggleInternal() }
                            .buttonStyle(DiagramChipButtonStyle())
                            .padding(.bottom, 14)
                    }
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .accessibilityHidden(true)
                } else {
                    VStack {
                        Text("External · glans").padding(.top, 10)
                        Spacer()
                        Text("Internal · crura").padding(.bottom, 14)
                    }
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .accessibilityHidden(true)
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

    private func toggleExternal() {
        externalOn.toggle()
    }

    private func toggleInternal() {
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
        canal.move(to: CGPoint(x: cx - 22, y: 140))
        canal.addLine(to: CGPoint(x: cx - 18, y: 250))
        canal.addQuadCurve(to: CGPoint(x: cx + 18, y: 250), control: CGPoint(x: cx, y: 264))
        canal.addLine(to: CGPoint(x: cx + 22, y: 140))
        let canalScreen = canal.applying(world)
        context.fill(canalScreen, with: .color(AppColor.diagramPassive.opacity(0.4)))
        context.stroke(canalScreen, with: .color(AppColor.diagramPassive), style: StrokeStyle(lineWidth: 2))

        var legs = Path()
        legs.move(to: CGPoint(x: cx - 10, y: 110))
        legs.addQuadCurve(to: CGPoint(x: cx - 50, y: 230), control: CGPoint(x: cx - 60, y: 150))
        legs.addQuadCurve(to: CGPoint(x: cx - 30, y: 190), control: CGPoint(x: cx - 30, y: 236))
        legs.addQuadCurve(to: CGPoint(x: cx - 10, y: 116), control: CGPoint(x: cx - 30, y: 150))
        legs.move(to: CGPoint(x: cx + 10, y: 110))
        legs.addQuadCurve(to: CGPoint(x: cx + 50, y: 230), control: CGPoint(x: cx + 60, y: 150))
        legs.addQuadCurve(to: CGPoint(x: cx + 30, y: 190), control: CGPoint(x: cx + 30, y: 236))
        legs.addQuadCurve(to: CGPoint(x: cx + 10, y: 116), control: CGPoint(x: cx + 30, y: 150))
        let legsScreen = legs.applying(world)
        context.fill(legsScreen, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, internalT).opacity(0.65)))

        let glans = circlePath(cx: cx, cy: 92, r: 16).applying(world)
        context.fill(glans, with: .color(blend(AppColor.diagramPassive, AppColor.diagramActive, externalT)))

        let bridge = circlePath(cx: cx, cy: 108, r: 34).applying(world)
        context.glowFill(bridge, color: AppColor.diagramGlow, blur: 24, opacity: 0.5 * paired)
        context.glowFill(glans, color: AppColor.diagramGlow, blur: 8, opacity: 0.5 * paired)
    }
}

private struct DiagramChipButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.white.opacity(configuration.isPressed ? 0.65 : 0.85), in: Capsule())
    }
}

// MARK: - Edging

/// Arousal curve — climb the rising path toward the crest, release to recede.
private struct EdgingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var intensity: Double = 0.1
    @State private var dragBase: Double = 0.1
    @State private var isReceding = false
    @State private var thresholdHaptic = false
    @State private var gestureActive = false

    private let natural = CGSize(width: 280, height: 260)
    private let threshold = 0.85
    private let dragRange: Double = 170
    private let riseP0 = CGPoint(x: 42, y: 232)
    private let riseP1 = CGPoint(x: 72, y: 198)
    private let riseP2 = CGPoint(x: 188, y: 108)
    private let riseP3 = CGPoint(x: 232, y: 68)

    var body: some View {
        DiagramSurface {
            let level = reduceMotion ? 0.8 : intensity
            ZStack(alignment: .top) {
                Canvas { context, size in
                    draw(context, size: size, intensity: level)
                }
                Text(feedbackLabel(for: level, receding: isReceding && !reduceMotion))
                    .font(AppFont.label)
                    .foregroundStyle(AppColor.secondaryInk)
                    .padding(.top, 12)
                    .accessibilityHidden(true)
            }
            .contentShape(Rectangle())
            .modifier(DiagramDragModifier(enabled: !reduceMotion, gesture: dragGesture))
        }
    }

    private func feedbackLabel(for level: Double, receding: Bool) -> String {
        if receding { return "Receding" }
        if level >= threshold { return "At threshold" }
        if level >= 0.65 { return "Approaching edge" }
        if level >= 0.25 { return "Building" }
        return "Low intensity"
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
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
                withAnimation(.spring(response: 0.7, dampingFraction: 0.82)) {
                    intensity = 0.08
                }
                dragBase = 0.08
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

    private func riseSamples(steps: Int = 64) -> [CGPoint] {
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

        // Dashed hint after crest
        var after = Path()
        after.move(to: riseP3)
        after.addQuadCurve(to: CGPoint(x: 258, y: 98), control: CGPoint(x: 248, y: 72))
        context.stroke(after.applying(world), with: .color(AppColor.diagramPassive.opacity(0.45)),
                       style: StrokeStyle(lineWidth: 1.5, lineCap: .round, dash: [6, 8]))

        // Full rise curve
        var rise = Path()
        rise.move(to: samples[0])
        for pt in samples.dropFirst() { rise.addLine(to: pt) }
        context.stroke(rise.applying(world), with: .color(AppColor.diagramPassive),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

        // Active trace
        let trace = partialPath(from: samples, progress: max(0.02, intensity))
        let traceOpacity = smoothstep(0.3, threshold, intensity) * 0.9
        let traceWidth = 3 + 5 * smoothstep(0, threshold, intensity)
        context.glowStroke(trace.applying(world), color: AppColor.diagramActive,
                           lineWidth: traceWidth, blur: 8, opacity: traceOpacity)
        context.stroke(trace.applying(world), with: .color(AppColor.diagramGlow.opacity(traceOpacity)),
                       style: StrokeStyle(lineWidth: traceWidth, lineCap: .round, lineJoin: .round))

        // Threshold marker
        let marker = circlePath(cx: thresholdPt.x, cy: thresholdPt.y, r: 16).applying(world)
        context.glowFill(marker, color: AppColor.diagramActive, blur: 10, opacity: 0.2)
        let markerCore = circlePath(cx: thresholdPt.x, cy: thresholdPt.y, r: 5).applying(world)
        context.fill(markerCore, with: .color(AppColor.diagramActive.opacity(0.55)))

        // Traveler orb
        let orbR = 7 + 7 * smoothstep(0, threshold, intensity)
        let orbGlow = circlePath(cx: orb.x, cy: orb.y, r: orbR).applying(world)
        context.glowFill(orbGlow, color: AppColor.diagramGlow, blur: 14, opacity: traceOpacity)
        context.fill(orbGlow, with: .color(AppColor.diagramActive.opacity(0.85)))

        // Origin ember
        let origin = circlePath(cx: riseP0.x, cy: riseP0.y, r: 14).applying(world)
        context.glowFill(origin, color: AppColor.moss, blur: 8, opacity: 0.25)
        context.fill(circlePath(cx: riseP0.x, cy: riseP0.y, r: 6).applying(world),
                       with: .color(AppColor.diagramPassive.opacity(0.7)))
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
