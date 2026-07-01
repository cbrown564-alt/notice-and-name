import { colors } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    DashPathEffect,
    Path,
    Skia,
} from '@shopify/react-native-skia';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { DiagramFrame, useDiagramCanvasSize } from './DiagramFrame';
import { diagramColors, reduceMotionFrames } from './diagramConstants';
import { useDiagramStateAnnouncer, useHapticLatch } from './useDiagramKit';
import type { DiagramProps } from './types';

const THRESHOLD = 0.85;
/** Vertical drag range — same physics as prior builds. */
const DRAG_RANGE = 170;

/** Cubic rise segment (build → edge). Natural coords ~280×260. */
const RISE = {
    p0: { x: 42, y: 232 },
    p1: { x: 72, y: 198 },
    p2: { x: 188, y: 108 },
    p3: { x: 232, y: 68 },
};

/** Faint dashed hint after the crest — the drop edging avoids. */
const AFTER = {
    from: RISE.p3,
    c1: { x: 248, y: 72 },
    to: { x: 258, y: 98 },
};

type Pt = { x: number; y: number };

function cubicPoint(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    };
}

function cubicPointWorklet(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
    'worklet';
    return cubicPoint(t, p0, p1, p2, p3);
}

function makeRisePath() {
    const p = Skia.Path.Make();
    p.moveTo(RISE.p0.x, RISE.p0.y);
    p.cubicTo(RISE.p1.x, RISE.p1.y, RISE.p2.x, RISE.p2.y, RISE.p3.x, RISE.p3.y);
    return p;
}

function makeAfterPath() {
    const p = Skia.Path.Make();
    p.moveTo(AFTER.from.x, AFTER.from.y);
    p.quadTo(AFTER.c1.x, AFTER.c1.y, AFTER.to.x, AFTER.to.y);
    return p;
}

function feedbackForIntensity(value: number, receding: boolean) {
    if (receding) return 'Receding';
    if (value >= THRESHOLD) return 'At threshold';
    if (value >= 0.65) return 'Approaching edge';
    if (value >= 0.25) return 'Building';
    return 'Low intensity';
}

export const EdgingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.edging;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize();
    const risePath = React.useMemo(() => makeRisePath(), []);
    const afterPath = React.useMemo(() => makeAfterPath(), []);

    const intensity = useSharedValue(reduceMotion ? teachingFrame.intensity : 0.1);
    const startIntensity = useSharedValue(intensity.value);
    const isReceding = useSharedValue(0);
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : feedbackForIntensity(0.1, false)
    );

    const fireHaptic = useHapticLatch();
    const announceState = useDiagramStateAnnouncer(!reduceMotion);

    const pan = Gesture.Pan()
        .enabled(!reduceMotion)
        .onStart(() => {
            startIntensity.value = intensity.value;
            isReceding.value = 0;
        })
        .onUpdate((e) => {
            const delta = -e.translationY / DRAG_RANGE;
            intensity.value = Math.max(0, Math.min(1, startIntensity.value + delta));
        })
        .onEnd(() => {
            isReceding.value = 1;
            intensity.value = withSpring(0.08, { damping: 14, stiffness: 90 });
        });

    const activePath = useDerivedValue(() => {
        const p = risePath.copy();
        const end = Math.max(0.02, Math.min(1, intensity.value));
        p.trim(0, end, false);
        return p;
    });

    const orbX = useDerivedValue(() =>
        cubicPointWorklet(intensity.value, RISE.p0, RISE.p1, RISE.p2, RISE.p3).x
    );
    const orbY = useDerivedValue(() =>
        cubicPointWorklet(intensity.value, RISE.p0, RISE.p1, RISE.p2, RISE.p3).y
    );

    const thresholdPt = React.useMemo(
        () => cubicPoint(THRESHOLD, RISE.p0, RISE.p1, RISE.p2, RISE.p3),
        []
    );

    const traceWidth = useDerivedValue(() => interpolate(intensity.value, [0, THRESHOLD, 1], [3, 6, 8], 'clamp'));

    const glowOpacity = useDerivedValue(() =>
        interpolate(intensity.value, [0.3, THRESHOLD, 1], [0.12, 0.55, 0.9], 'clamp')
    );

    const orbRadius = useDerivedValue(() =>
        interpolate(intensity.value, [0, THRESHOLD, 1], [7, 11, 14], 'clamp')
    );

    useAnimatedReaction(
        () => ({ level: intensity.value, receding: isReceding.value }),
        (curr, prev) => {
            if (!prev || (curr.level === prev.level && curr.receding === prev.receding)) return;
            runOnJS(fireHaptic)(curr.level >= THRESHOLD && curr.receding === 0);
            const text = feedbackForIntensity(curr.level, curr.receding === 1);
            runOnJS(setFeedback)(text);
            if (curr.level >= THRESHOLD || curr.receding === 1) {
                runOnJS(announceState)(text);
            }
        }
    );

    return (
        <DiagramFrame
            accessibilityLabel={accessibilityLabel}
            feedback={feedback}
            hint={reduceMotion ? undefined : 'Drag up to climb toward the edge, release to recede'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                {/* Dashed path beyond threshold — retreat route, not taken */}
                <Path
                    path={afterPath}
                    style="stroke"
                    strokeWidth={1.5}
                    color={diagramColors.passive}
                    opacity={0.45}
                >
                    <DashPathEffect intervals={[6, 8]} />
                </Path>

                {/* Full rise curve — quiet etching */}
                <Path path={risePath} style="stroke" strokeWidth={2} color={diagramColors.passive} strokeCap="round" />

                {/* Active trace — bioluminescent climb */}
                <Path
                    path={activePath}
                    style="stroke"
                    strokeWidth={traceWidth}
                    color={diagramColors.active}
                    strokeCap="round"
                    opacity={glowOpacity}
                >
                    <BlurMask blur={8} style="normal" />
                </Path>
                <Path
                    path={activePath}
                    style="stroke"
                    strokeWidth={traceWidth}
                    color={diagramColors.glow}
                    strokeCap="round"
                    opacity={glowOpacity}
                />

                {/* Threshold marker at the crest */}
                <Circle cx={thresholdPt.x} cy={thresholdPt.y} r={16} color={diagramColors.active} opacity={0.2}>
                    <BlurMask blur={10} style="normal" />
                </Circle>
                <Circle
                    cx={thresholdPt.x}
                    cy={thresholdPt.y}
                    r={5}
                    color={diagramColors.active}
                    opacity={0.55}
                />

                {/* Traveler orb */}
                <Circle cx={orbX} cy={orbY} r={orbRadius} color={diagramColors.glow} opacity={glowOpacity}>
                    <BlurMask blur={14} style="normal" />
                </Circle>
                <Circle cx={orbX} cy={orbY} r={orbRadius} color={diagramColors.active} opacity={0.85} />

                {/* Origin ember */}
                <Circle cx={RISE.p0.x} cy={RISE.p0.y} r={6} color={diagramColors.passive} opacity={0.7} />
                <Circle cx={RISE.p0.x} cy={RISE.p0.y} r={14} color={colors.secondary[300]} opacity={0.25}>
                    <BlurMask blur={8} style="normal" />
                </Circle>
            </Canvas>
        </DiagramFrame>
    );
};
