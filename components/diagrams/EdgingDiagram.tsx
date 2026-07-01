import { colors } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    LinearGradient,
    Path,
    RadialGradient,
    Skia,
    Turbulence,
    vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
    interpolate,
    interpolateColor,
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
const INTERIOR = { top: 68, bottom: 238, cx: 140, height: 170 };

function feedbackForIntensity(value: number, receding: boolean) {
    if (receding) return 'Receding';
    if (value >= THRESHOLD) return 'At threshold';
    if (value >= 0.65) return 'Approaching edge';
    if (value >= 0.25) return 'Building';
    return 'Low intensity';
}

function makeVesselPath() {
    const p = Skia.Path.Make();
    p.moveTo(84, 226);
    p.cubicTo(78, 168, 86, 98, 108, 74);
    p.quadTo(INTERIOR.cx, 54, 172, 74);
    p.cubicTo(194, 98, 202, 168, 196, 226);
    p.quadTo(INTERIOR.cx, 246, 84, 226);
    p.close();
    return p;
}

function makeThresholdArcPath(y: number) {
    const p = Skia.Path.Make();
    p.moveTo(98, y);
    p.quadTo(INTERIOR.cx, y - 6, 182, y);
    return p;
}

function makeMeniscusPath(fillY: number, intensity: number) {
    const p = Skia.Path.Make();
    const dip = 4 + intensity * 6;
    p.moveTo(92, fillY);
    p.quadTo(INTERIOR.cx, fillY - dip, 188, fillY);
    p.lineTo(188, INTERIOR.bottom);
    p.quadTo(INTERIOR.cx, INTERIOR.bottom + 8, 92, INTERIOR.bottom);
    p.close();
    return p;
}

export const EdgingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.edging;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize();
    const vesselPath = React.useMemo(() => makeVesselPath(), []);
    const thresholdArc = React.useMemo(
        () => makeThresholdArcPath(INTERIOR.bottom - INTERIOR.height * THRESHOLD),
        []
    );

    const intensity = useSharedValue(reduceMotion ? teachingFrame.intensity : 0.12);
    const startIntensity = useSharedValue(intensity.value);
    const isReceding = useSharedValue(0);
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : feedbackForIntensity(0.12, false)
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
            const delta = -e.translationY / INTERIOR.height;
            intensity.value = Math.max(0, Math.min(1, startIntensity.value + delta));
        })
        .onEnd(() => {
            isReceding.value = 1;
            intensity.value = withSpring(0.08, { damping: 14, stiffness: 90 });
        });

    const fillY = useDerivedValue(
        () => INTERIOR.bottom - intensity.value * INTERIOR.height
    );

    const meniscusPath = useDerivedValue(() =>
        makeMeniscusPath(fillY.value, intensity.value)
    );

    const shimmerPath = useDerivedValue(() => {
        const y = fillY.value;
        const p = Skia.Path.Make();
        p.moveTo(96, y);
        p.quadTo(INTERIOR.cx, y - 8, 184, y);
        return p;
    });

    const glowOpacity = useDerivedValue(() =>
        interpolate(intensity.value, [0.35, THRESHOLD, 1], [0.08, 0.55, 0.95], 'clamp')
    );

    const bloomRadius = useDerivedValue(() =>
        interpolate(intensity.value, [0, THRESHOLD, 1], [18, 36, 52], 'clamp')
    );

    const thresholdArcOpacity = useDerivedValue(() =>
        interpolate(intensity.value, [0.5, THRESHOLD], [0.15, 0.75], 'clamp')
    );

    const surfaceColor = useDerivedValue(() =>
        interpolateColor(
            intensity.value,
            [0, 0.45, THRESHOLD, 1],
            [
                `${diagramColors.passive}55`,
                diagramColors.glow,
                diagramColors.active,
                colors.primary[300],
            ]
        )
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
            hint={reduceMotion ? undefined : 'Drag up to build warmth, release to let it recede'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <Circle cx={INTERIOR.cx} cy={INTERIOR.bottom - 20} r={48} opacity={0.35}>
                    <RadialGradient
                        c={vec(INTERIOR.cx, INTERIOR.bottom - 20)}
                        r={48}
                        colors={[`${colors.secondary[200]}44`, 'transparent']}
                    />
                </Circle>

                <Group clip={vesselPath}>
                    <Path path={meniscusPath} color={surfaceColor}>
                        <LinearGradient
                            start={vec(INTERIOR.cx, INTERIOR.bottom)}
                            end={vec(INTERIOR.cx, INTERIOR.top)}
                            colors={[
                                `${colors.secondary[300]}55`,
                                diagramColors.glow,
                                diagramColors.active,
                            ]}
                        />
                        <Turbulence freqX={0.65} freqY={0.9} octaves={3} seed={4} />
                    </Path>

                    <Path
                        path={shimmerPath}
                        style="stroke"
                        strokeWidth={6}
                        color={diagramColors.glow}
                        opacity={glowOpacity}
                    >
                        <BlurMask blur={10} style="normal" />
                    </Path>
                </Group>

                <Path
                    path={thresholdArc}
                    style="stroke"
                    strokeWidth={3}
                    color={diagramColors.active}
                    opacity={0.35}
                >
                    <BlurMask blur={6} style="normal" />
                </Path>
                <Path
                    path={thresholdArc}
                    style="stroke"
                    strokeWidth={1.5}
                    color={diagramColors.glow}
                    opacity={thresholdArcOpacity}
                />

                <Circle
                    cx={INTERIOR.cx}
                    cy={fillY}
                    r={bloomRadius}
                    color={diagramColors.glow}
                    opacity={glowOpacity}
                >
                    <BlurMask blur={22} style="normal" />
                </Circle>

                <Path path={vesselPath} style="stroke" strokeWidth={1.5} color={diagramColors.passive} />
                <Path
                    path={vesselPath}
                    style="stroke"
                    strokeWidth={0.5}
                    color={colors.neutral[100]}
                    opacity={0.6}
                />
            </Canvas>
        </DiagramFrame>
    );
};
