import { colors } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    Path,
    Skia
} from '@shopify/react-native-skia';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated';
import { DiagramFrame, useDiagramCanvasSize } from './DiagramFrame';
import { diagramColors, reduceMotionFrames } from './diagramConstants';
import { useDiagramStateAnnouncer, useHapticLatch } from './useDiagramKit';
import type { DiagramProps } from './types';

export const AnglingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.angling;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize();

    const angle = useSharedValue(reduceMotion ? teachingFrame.angle : 0);
    const startAngle = useSharedValue(reduceMotion ? teachingFrame.angle : 0);
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : 'Neutral'
    );

    const fireHaptic = useHapticLatch();
    const announceState = useDiagramStateAnnouncer(!reduceMotion);

    const pan = Gesture.Pan()
        .enabled(!reduceMotion)
        .onStart(() => {
            startAngle.value = angle.value;
        })
        .onUpdate((e) => {
            const delta = -e.translationY / 5;
            angle.value = Math.max(-20, Math.min(20, startAngle.value + delta));
        });

    const groupTransform = useDerivedValue(() => {
        return [{ rotate: angle.value * (Math.PI / 180) }];
    });

    const glowColor = useDerivedValue(() => {
        return interpolateColor(
            angle.value,
            [-20, -10, 0, 20],
            [diagramColors.active, diagramColors.active, diagramColors.passive, diagramColors.passive]
        );
    });

    const glowOpacity = useDerivedValue(() => {
        return interpolate(angle.value, [-15, 0], [1, 0], 'clamp');
    });

    const strokeWidth = useDerivedValue(() => {
        return interpolate(angle.value, [-15, 0], [8, 4], 'clamp');
    });

    useAnimatedReaction(
        () => angle.value,
        (curr, prev) => {
            if (curr === prev) return;
            runOnJS(fireHaptic)(curr < -10);
            let text = 'Neutral';
            if (curr > 5) text = 'Anterior Tilt (Arch)';
            if (curr < -5) text = 'Posterior Tilt (Tuck)';
            runOnJS(setFeedback)(text);
            if (curr < -5 || curr > 5) {
                runOnJS(announceState)(text);
            }
        }
    );

    const spinePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(150, 40);
        p.quadTo(150, 100, 150, 130);
        return p;
    }, []);

    const pelvisPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(90, 130);
        p.quadTo(150, 200, 210, 130);
        p.lineTo(200, 130);
        p.quadTo(150, 180, 100, 130);
        p.close();
        return p;
    }, []);

    const contactZonePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(130, 150);
        p.quadTo(150, 170, 170, 150);
        return p;
    }, []);

    const PIVOT_X = 150;
    const PIVOT_Y = 130;

    return (
        <DiagramFrame
            accessibilityLabel={accessibilityLabel}
            feedback={feedback}
            hint={reduceMotion ? undefined : 'Drag up/down to tilt'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <Path path={spinePath} style="stroke" strokeWidth={4} color={diagramColors.passive} strokeCap="round" />

                <Group origin={{ x: PIVOT_X, y: PIVOT_Y }} transform={groupTransform}>
                    <Path path={pelvisPath} color={colors.neutral[100]} />
                    <Path path={pelvisPath} style="stroke" strokeWidth={2} color={diagramColors.passive} />
                    <Path path={contactZonePath} style="stroke" strokeWidth={4} color={diagramColors.passive} strokeCap="round" />
                    <Path
                        path={contactZonePath}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        color={glowColor}
                        strokeCap="round"
                        opacity={glowOpacity}
                    >
                        <BlurMask blur={4} style="normal" />
                    </Path>
                </Group>

                <Circle cx={PIVOT_X} cy={PIVOT_Y} r={4} color={diagramColors.passive} opacity={0.5} />
            </Canvas>
        </DiagramFrame>
    );
};
