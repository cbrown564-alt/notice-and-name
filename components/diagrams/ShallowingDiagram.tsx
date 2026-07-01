import { colors } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    LinearGradient,
    Path,
    Rect,
    Skia,
    Turbulence,
    vec
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
    withSpring
} from 'react-native-reanimated';
import { DiagramFrame, useDiagramCanvasSize } from './DiagramFrame';
import { diagramColors, reduceMotionFrames } from './diagramConstants';
import { useDiagramStateAnnouncer } from './useDiagramKit';
import type { DiagramProps } from './types';

const CANAL_LENGTH = 280;
const ENTRANCE_X = 40;

export const ShallowingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.shallowing;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize();

    const probeX = useSharedValue(reduceMotion ? teachingFrame.probeX : ENTRANCE_X);
    const isInteracting = useSharedValue(0);
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : 'Neutral'
    );

    const announceState = useDiagramStateAnnouncer(!reduceMotion);

    const pan = Gesture.Pan()
        .enabled(!reduceMotion)
        .onStart(() => {
            isInteracting.value = withSpring(1);
        })
        .onUpdate((e) => {
            probeX.value = Math.max(0, Math.min(CANAL_LENGTH, e.x));
        })
        .onEnd(() => {
            isInteracting.value = withSpring(0);
        });

    const intensity = useDerivedValue(() => {
        return interpolate(
            probeX.value,
            [0, ENTRANCE_X, ENTRANCE_X + 50, CANAL_LENGTH],
            [0.5, 1.0, 0.2, 0.0],
            'clamp'
        );
    });

    const probeColor = useDerivedValue(() => {
        return interpolateColor(
            intensity.value,
            [0, 1],
            [diagramColors.passive, diagramColors.active]
        );
    });

    const topWall = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, 100);
        p.quadTo(ENTRANCE_X, 100, ENTRANCE_X + 50, 110);
        p.lineTo(CANAL_LENGTH, 110);
        return p;
    }, []);

    const bottomWall = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, 200);
        p.quadTo(ENTRANCE_X, 200, ENTRANCE_X + 50, 190);
        p.lineTo(CANAL_LENGTH, 190);
        return p;
    }, []);

    useAnimatedReaction(
        () => intensity.value,
        (curr, prev) => {
            if (curr === prev) return;
            let text = 'Deep Canal (Less Sensitive)';
            if (curr > 0.8) text = 'Introitus (High Sensitivity!)';
            else if (curr > 0.4) text = 'Mid-Vaginal (Pressure Only)';
            runOnJS(setFeedback)(text);
            if (curr > 0.8 || curr < 0.2) {
                runOnJS(announceState)(text);
            }
        }
    );

    return (
        <DiagramFrame
            accessibilityLabel={accessibilityLabel}
            feedback={feedback}
            hint={reduceMotion ? undefined : 'Drag horizontally to explore sensitivity'}
            reduceMotion={reduceMotion}
            gesture={pan}
        >
            <Canvas style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} color={colors.conceptCanvas} />

                <Group>
                    <Rect x={0} y={80} width={canvasWidth} height={140}>
                        <Turbulence freqX={0.8} freqY={0.8} octaves={4} seed={2} />
                        <LinearGradient
                            start={vec(ENTRANCE_X, 0)}
                            end={vec(CANAL_LENGTH / 2, 0)}
                            colors={[`${diagramColors.glow}80`, `${diagramColors.passive}14`]}
                        />
                    </Rect>

                    <Rect x={0} y={80} width={100} height={140} opacity={intensity}>
                        <LinearGradient
                            start={vec(0, 0)}
                            end={vec(100, 0)}
                            colors={[diagramColors.active, 'transparent']}
                        />
                        <BlurMask blur={20} style="normal" />
                    </Rect>
                </Group>

                <Group style="stroke" strokeWidth={4} color={diagramColors.passive}>
                    <Path path={topWall} />
                    <Path path={bottomWall} />
                </Group>

                <Group>
                    <Circle cx={probeX} cy={150} r={25} color={diagramColors.glow} opacity={0.4}>
                        <BlurMask blur={15} style="normal" />
                    </Circle>
                    <Circle cx={probeX} cy={150} r={12} color={probeColor} />
                    <Circle cx={probeX} cy={150} r={12} style="stroke" strokeWidth={2} color={colors.background.surface} />
                </Group>
            </Canvas>
        </DiagramFrame>
    );
};
