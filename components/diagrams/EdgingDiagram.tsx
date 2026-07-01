import { colors } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Group,
    LinearGradient,
    Rect,
    RoundedRect,
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
const GLOW_CAP = 26;
const TANK = { x: 90, y: 40, width: 100, height: 220, radius: 8 };

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
            const delta = -e.translationY / TANK.height;
            intensity.value = Math.max(0, Math.min(1, startIntensity.value + delta));
        })
        .onEnd(() => {
            isReceding.value = 1;
            intensity.value = withSpring(0.08, { damping: 14, stiffness: 90 });
        });

    const fillHeight = useDerivedValue(() => intensity.value * TANK.height);
    const fillY = useDerivedValue(() => TANK.y + TANK.height - fillHeight.value);
    const thresholdY = TANK.y + TANK.height * (1 - THRESHOLD);

    const fillColor = useDerivedValue(() =>
        interpolateColor(
            intensity.value,
            [0, 0.5, THRESHOLD, 1],
            [diagramColors.passive, diagramColors.glow, diagramColors.active, diagramColors.active]
        )
    );

    const glowOpacity = useDerivedValue(() =>
        interpolate(intensity.value, [0.5, THRESHOLD, 1], [0, 0.45, 0.85], 'clamp')
    );

    useAnimatedReaction(
        () => ({ level: intensity.value, receding: isReceding.value }),
        (curr, prev) => {
            if (!prev || curr.level === prev.level && curr.receding === prev.receding) return;
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
            hint={reduceMotion ? undefined : 'Drag up to build intensity, release to recede'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <RoundedRect
                    x={TANK.x}
                    y={TANK.y}
                    width={TANK.width}
                    height={TANK.height}
                    r={TANK.radius}
                    style="stroke"
                    strokeWidth={2}
                    color={diagramColors.passive}
                />

                <Rect
                    x={TANK.x + 1}
                    y={thresholdY}
                    width={TANK.width - 2}
                    height={2}
                    color={diagramColors.active}
                />

                <Group>
                    <RoundedRect
                        x={TANK.x + 4}
                        y={fillY}
                        width={TANK.width - 8}
                        height={fillHeight}
                        r={6}
                        color={fillColor}
                    />
                    <RoundedRect
                        x={TANK.x + 4}
                        y={fillY}
                        width={TANK.width - 8}
                        height={GLOW_CAP}
                        r={6}
                        color={diagramColors.glow}
                        opacity={glowOpacity}
                    >
                        <BlurMask blur={12} style="normal" />
                    </RoundedRect>
                </Group>

                <Rect x={TANK.x + 4} y={fillY} width={TANK.width - 8} height={fillHeight} opacity={0.35}>
                    <LinearGradient
                        start={vec(TANK.x, TANK.y + TANK.height)}
                        end={vec(TANK.x, TANK.y)}
                        colors={['transparent', diagramColors.glow]}
                    />
                </Rect>
            </Canvas>
        </DiagramFrame>
    );
};
