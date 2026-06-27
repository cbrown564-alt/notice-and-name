import SwiftUI
import PleasureVocabularyCore

#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

// MARK: - Entry point

/// Renders one of the app's native vector diagrams for a `MediaItem` whose
/// `path` is `native://diagram/<id>`. These four concepts are drawn in-app
/// (no image asset ships for them). The drawing is parameterised by a calm,
/// slow looping animation that is fully disabled when Reduce Motion is on.
///
/// An unrecognised id falls back to the same framed placeholder used for
/// images/videos (`MediaPlaceholderCard`), so a new diagram id can ship before
/// its view exists without breaking the screen.
struct ConceptDiagramView: View {
    let diagramId: String
    let caption: String?

    /// Ids this view knows how to draw natively.
    static let knownDiagramIds: Set<String> = ["angling", "rocking", "shallowing", "pairing"]

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

// MARK: - Diagram plumbing

/// Calm surface every diagram is drawn on: rounded canvas tile with a soft
/// border, matching the placeholder aesthetic.
private struct DiagramSurface<Content: View>: View {
    var height: CGFloat = 240
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

/// A quiet, slow 0...1 oscillation derived from wall-clock time, used to gently
/// animate the diagrams when motion is enabled.
private func oscPhase(_ date: Date, period: Double) -> Double {
    let t = date.timeIntervalSinceReferenceDate
    return (sin(2 * .pi * t / period) + 1) / 2
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

/// Pelvis tilt redirecting pressure along the anterior wall. A static spine and
/// pivot; the pelvis bowl rotates and a "contact zone" arc glows as the pelvis
/// reaches a posterior tilt (the sweet spot).
private struct AnglingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let natural = CGSize(width: 300, height: 220)
    private let pivot = CGPoint(x: 150, y: 130)

    var body: some View {
        DiagramSurface {
            if reduceMotion {
                content(phase: 1) // representative "sweet spot" pose
            } else {
                TimelineView(.animation) { timeline in
                    content(phase: oscPhase(timeline.date, period: 5))
                }
            }
        }
    }

    private func content(phase: Double) -> some View {
        // phase 0 -> near neutral, phase 1 -> posterior tilt (tuck).
        let angleDeg = -2 - 13 * phase            // 0° area -> ~ -15°
        let glow = smoothstep(4, 12, -angleDeg)   // brightens toward the tuck
        return ZStack(alignment: .top) {
            Canvas { context, size in
                draw(context, size: size, angleDeg: angleDeg, glow: glow)
            }
            Text(glow > 0.5 ? "Posterior tilt" : "Neutral")
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
                .padding(.top, 12)
                .accessibilityHidden(true)
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, angleDeg: Double, glow: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Spine (static).
        var spine = Path()
        spine.move(to: CGPoint(x: 150, y: 40))
        spine.addQuadCurve(to: CGPoint(x: 150, y: 130), control: CGPoint(x: 150, y: 100))
        context.stroke(spine.applying(world), with: .color(AppColor.line),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))

        // Pelvis bowl (rotates around the pivot).
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
        context.stroke(pelvisScreen, with: .color(AppColor.secondaryInk.opacity(0.5)),
                       style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

        // Contact zone: quiet base + accent glow at the sweet spot.
        context.stroke(contactScreen, with: .color(AppColor.line),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
        context.glowStroke(contactScreen, color: AppColor.blush,
                           lineWidth: 4 + 5 * glow, blur: 5, opacity: glow)

        // Pivot point.
        let dot = circlePath(cx: pivot.x, cy: pivot.y, r: 4).applying(world)
        context.fill(dot, with: .color(AppColor.plum.opacity(0.4)))
    }
}

// MARK: - Rocking

/// Compression and friction at the pubic mound. A static receiver pelvis with a
/// contact point; a partner "wedge" gently rocks toward and away from that
/// point while warmth builds at the contact.
private struct RockingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let natural = CGSize(width: 300, height: 220)
    private let pubic = CGPoint(x: 140, y: 150)

    var body: some View {
        DiagramSurface {
            if reduceMotion {
                content(phase: 1) // full contact
            } else {
                TimelineView(.animation) { timeline in
                    content(phase: oscPhase(timeline.date, period: 3.6))
                }
            }
        }
    }

    private func content(phase: Double) -> some View {
        let intensity = phase // 0 = apart, 1 = grinding contact
        return ZStack(alignment: .top) {
            Canvas { context, size in
                draw(context, size: size, intensity: intensity)
            }
            Text(intensity > 0.6 ? "Contact" : "Approach")
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
                .padding(.top, 12)
                .accessibilityHidden(true)
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Receiver pelvis (static side-view schematic).
        var pelvis = Path()
        pelvis.move(to: CGPoint(x: pubic.x + 40, y: 90))
        pelvis.addQuadCurve(to: pubic, control: CGPoint(x: pubic.x, y: 130))
        pelvis.addLine(to: CGPoint(x: pubic.x + 20, y: pubic.y + 40))
        context.stroke(pelvis.applying(world), with: .color(AppColor.line),
                       style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))

        // Warmth at the contact point.
        let heat = circlePath(cx: pubic.x, cy: pubic.y, r: 26).applying(world)
        context.glowFill(heat, color: AppColor.blush, blur: 8 + 12 * intensity, opacity: 0.6 * intensity)

        // Pubic mound marker.
        let mound = circlePath(cx: pubic.x, cy: pubic.y, r: 8).applying(world)
        context.fill(mound, with: .color(AppColor.secondaryInk.opacity(0.6)))

        // Partner wedge approaching from the upper-left; tip sits at `tip`.
        let approach = CGPoint(x: -34 * (1 - intensity) - 6,
                               y: -22 * (1 - intensity) - 4)
        let tip = CGPoint(x: pubic.x + approach.x, y: pubic.y + approach.y)
        var wedge = Path()
        wedge.move(to: CGPoint(x: 0, y: -28))
        wedge.addLine(to: CGPoint(x: 26, y: -28))
        wedge.addQuadCurve(to: CGPoint(x: 0, y: 0), control: CGPoint(x: 26, y: 0))
        wedge.addLine(to: CGPoint(x: -26, y: -28))
        wedge.closeSubpath()
        let wedgeScreen = wedge
            .applying(CGAffineTransform(translationX: tip.x, y: tip.y))
            .applying(world)
        let wedgeColor = AppColor.plum.opacity(0.55 + 0.35 * intensity)
        context.fill(wedgeScreen, with: .color(wedgeColor))

        // Contact tip indicator.
        let tipDot = circlePath(cx: tip.x, cy: tip.y, r: 4)
            .applying(world)
        context.fill(tipDot, with: .color(AppColor.surface))
    }
}

// MARK: - Shallowing

/// Shallow vs deep. Nerve-rich tissue is concentrated at the entrance
/// (introitus); a probe travels the canal and its glow fades as it goes deep,
/// reinforcing that the first inch carries the sensitivity.
private struct ShallowingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let natural = CGSize(width: 280, height: 240)
    private let entranceX: CGFloat = 50
    private let canalY: CGFloat = 150

    var body: some View {
        DiagramSurface {
            if reduceMotion {
                content(phase: 0) // probe parked at the sensitive entrance
            } else {
                TimelineView(.animation) { timeline in
                    content(phase: oscPhase(timeline.date, period: 6))
                }
            }
        }
    }

    private func content(phase: Double) -> some View {
        // phase 0 -> entrance (shallow), phase 1 -> deep.
        let probeX = entranceX + (240 - entranceX) * CGFloat(phase)
        let intensity = smoothstep(170, Double(entranceX), Double(probeX)) // high near entrance
        return ZStack(alignment: .top) {
            Canvas { context, size in
                draw(context, size: size, probeX: probeX, intensity: intensity)
            }
            Text(intensity > 0.5 ? "Shallow · sensitive" : "Deep · pressure")
                .font(AppFont.label)
                .foregroundStyle(AppColor.secondaryInk)
                .padding(.top, 12)
                .accessibilityHidden(true)
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, probeX: CGFloat, intensity: Double) {
        let world = worldTransform(in: size, natural: natural)

        // Soft nerve-rich emphasis at the entrance / first inch.
        let zone = circlePath(cx: entranceX + 10, cy: canalY, r: 48).applying(world)
        context.glowFill(zone, color: AppColor.blush, blur: 22, opacity: 0.30)

        // Canal walls.
        var top = Path()
        top.move(to: CGPoint(x: 0, y: 100))
        top.addQuadCurve(to: CGPoint(x: entranceX + 50, y: 112), control: CGPoint(x: entranceX, y: 100))
        top.addLine(to: CGPoint(x: 280, y: 112))
        var bottom = Path()
        bottom.move(to: CGPoint(x: 0, y: 200))
        bottom.addQuadCurve(to: CGPoint(x: entranceX + 50, y: 188), control: CGPoint(x: entranceX, y: 200))
        bottom.addLine(to: CGPoint(x: 280, y: 188))
        context.stroke(top.applying(world), with: .color(AppColor.line),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))
        context.stroke(bottom.applying(world), with: .color(AppColor.line),
                       style: StrokeStyle(lineWidth: 4, lineCap: .round))

        // Depth labels at the extremes (quiet axis cue).
        drawTinyLabel(context, "shallow", at: CGPoint(x: entranceX + 6, y: 224), world: world)
        drawTinyLabel(context, "deep", at: CGPoint(x: 250, y: 224), world: world)

        // Probe + aura, colour warming toward the entrance.
        let aura = circlePath(cx: probeX, cy: canalY, r: 24).applying(world)
        context.glowFill(aura, color: AppColor.blush, blur: 14, opacity: 0.45 * intensity)

        let core = circlePath(cx: probeX, cy: canalY, r: 12).applying(world)
        let coreColor = blend(AppColor.line, AppColor.blush, intensity)
        context.fill(core, with: .color(coreColor))
        context.stroke(core, with: .color(AppColor.surface), style: StrokeStyle(lineWidth: 2))
    }

    private func drawTinyLabel(_ context: GraphicsContext, _ string: String, at point: CGPoint, world: CGAffineTransform) {
        var resolved = context.resolve(Text(string).font(AppFont.label))
        resolved.shading = .color(AppColor.secondaryInk.opacity(0.7))
        context.draw(resolved, at: point.applying(world), anchor: .center)
    }
}

// MARK: - Pairing

/// Two stimulation routes combined: the clitoral glans (external) and the
/// crura/canal (internal). When both are "active" a soft bridge glow appears
/// between them — the pairing bonus. Both pulse gently in sync.
private struct PairingDiagramView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let natural = CGSize(width: 300, height: 300)

    var body: some View {
        DiagramSurface(height: 260) {
            if reduceMotion {
                content(phase: 1) // both active, bridge present
            } else {
                TimelineView(.animation) { timeline in
                    content(phase: oscPhase(timeline.date, period: 4.5))
                }
            }
        }
    }

    private func content(phase: Double) -> some View {
        // Both routes share one gentle activation pulse.
        let activation = 0.45 + 0.55 * phase
        let paired = smoothstep(0.55, 0.85, activation)
        return ZStack {
            Canvas { context, size in
                draw(context, size: size, activation: activation, paired: paired)
            }
            VStack {
                Text("External · glans")
                    .padding(.top, 10)
                Spacer()
                Text("Internal · crura")
                    .padding(.bottom, 14)
            }
            .font(AppFont.label)
            .foregroundStyle(AppColor.secondaryInk)
            .accessibilityHidden(true)
        }
    }

    private func draw(_ context: GraphicsContext, size: CGSize, activation: Double, paired: Double) {
        let world = worldTransform(in: size, natural: natural)
        let cx: CGFloat = 150

        // Canal (context tube).
        var canal = Path()
        canal.move(to: CGPoint(x: cx - 22, y: 140))
        canal.addLine(to: CGPoint(x: cx - 18, y: 250))
        canal.addQuadCurve(to: CGPoint(x: cx + 18, y: 250), control: CGPoint(x: cx, y: 264))
        canal.addLine(to: CGPoint(x: cx + 22, y: 140))
        let canalScreen = canal.applying(world)
        context.fill(canalScreen, with: .color(AppColor.line.opacity(0.4)))
        context.stroke(canalScreen, with: .color(AppColor.line), style: StrokeStyle(lineWidth: 2))

        // Crura / legs (internal) — a wishbone around the canal.
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
        context.fill(legsScreen, with: .color(blend(AppColor.line, AppColor.plum, activation).opacity(0.65)))

        // Glans (external) button.
        let glans = circlePath(cx: cx, cy: 92, r: 16).applying(world)
        context.fill(glans, with: .color(blend(AppColor.line, AppColor.blush, activation)))

        // Bridge glow — the pairing bonus, only meaningful when both are active.
        let bridge = circlePath(cx: cx, cy: 108, r: 34).applying(world)
        context.glowFill(bridge, color: AppColor.gold, blur: 24, opacity: 0.5 * paired)
        context.glowFill(glans, color: AppColor.blush, blur: 8, opacity: 0.5 * paired)
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
