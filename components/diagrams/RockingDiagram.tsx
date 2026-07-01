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

const RECEIVER_PUBIC_X = 140;
const RECEIVER_PUBIC_Y = 160;

export const RockingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.rocking;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize();

    const partnerX = useSharedValue(
        reduceMotion ? RECEIVER_PUBIC_X : RECEIVER_PUBIC_X - 60
    );
    const partnerY = useSharedValue(
        reduceMotion ? RECEIVER_PUBIC_Y : RECEIVER_PUBIC_Y - 40
    );
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : 'Neutral'
    );

    const fireHaptic = useHapticLatch();
    const announceState = useDiagramStateAnnouncer(!reduceMotion);

    const pan = Gesture.Pan()
        .enabled(!reduceMotion)
        .onChange((e) => {
            partnerX.value += e.changeX;
            partnerY.value += e.changeY;
        });

    const distance = useDerivedValue(() => {
        const dx = partnerX.value - RECEIVER_PUBIC_X;
        const dy = partnerY.value - RECEIVER_PUBIC_Y;
        return Math.sqrt(dx * dx + dy * dy);
    });

    const intensity = useDerivedValue(() => {
        return interpolate(distance.value, [0, 60], [1, 0], 'clamp');
    });

    const heatColor = useDerivedValue(() => {
        return interpolateColor(
            intensity.value,
            [0, 0.5, 1],
            [diagramColors.passive, diagramColors.glow, diagramColors.active]
        );
    });

    const glowRadius = useDerivedValue(() => {
        return interpolate(intensity.value, [0, 1], [5, 25]);
    });

    useAnimatedReaction(
        () => intensity.value,
        (curr, prev) => {
            if (curr === prev || curr === null) return;
            runOnJS(fireHaptic)(curr > 0.8);
            let text = 'No Contact';
            if (curr > 0.8) text = 'Grinding (High Contact)';
            else if (curr > 0.4) text = 'Touching';
            else if (curr > 0.1) text = 'Near';
            runOnJS(setFeedback)(text);
            if (curr > 0.8) {
                runOnJS(announceState)(text);
            }
        }
    );

    const receiverPelvis = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(RECEIVER_PUBIC_X + 40, 100);
        p.quadTo(RECEIVER_PUBIC_X, 140, RECEIVER_PUBIC_X, RECEIVER_PUBIC_Y);
        p.lineTo(RECEIVER_PUBIC_X + 20, RECEIVER_PUBIC_Y + 40);
        return p;
    }, []);

    const partnerBonePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, -30);
        p.lineTo(30, -30);
        p.quadTo(30, 0, 0, 0);
        p.lineTo(-30, -30);
        p.close();
        return p;
    }, []);

    const partnerTransform = useDerivedValue(() => {
        return [{ translateX: partnerX.value }, { translateY: partnerY.value }];
    });

    return (
        <DiagramFrame
            accessibilityLabel={accessibilityLabel}
            feedback={feedback}
            hint={reduceMotion ? undefined : 'Drag the wedge to grind against the circle'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <Group style="stroke" strokeWidth={6} color={diagramColors.passive} strokeCap="round">
                    <Path path={receiverPelvis} />
                </Group>
                <Circle cx={RECEIVER_PUBIC_X} cy={RECEIVER_PUBIC_Y} r={8} color={diagramColors.passive} />

                <Circle cx={RECEIVER_PUBIC_X} cy={RECEIVER_PUBIC_Y} r={30} color={heatColor} opacity={intensity}>
                    <BlurMask blur={glowRadius} style="normal" />
                </Circle>

                <Group origin={{ x: 0, y: 0 }} transform={partnerTransform}>
                    <Path path={partnerBonePath} color={diagramColors.active} />
                    <Circle cx={0} cy={0} r={5} color={colors.background.surface} />
                </Group>
            </Canvas>
        </DiagramFrame>
    );
};
