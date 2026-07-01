import { colors, textStyles } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    Path,
    Skia
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { DiagramFrame, useDiagramCanvasSize } from './DiagramFrame';
import { diagramColors, reduceMotionFrames } from './diagramConstants';
import { useDiagramStateAnnouncer, useHapticLatch } from './useDiagramKit';
import type { DiagramProps } from './types';

export const PairingDiagram = ({ accessibilityLabel, reduceMotion = false }: DiagramProps) => {
    const teachingFrame = reduceMotionFrames.pairing;
    const { canvasWidth, canvasHeight } = useDiagramCanvasSize(350);

    const externalActive = useSharedValue(reduceMotion ? teachingFrame.externalActive : 0);
    const internalActive = useSharedValue(reduceMotion ? teachingFrame.internalActive : 0);
    const [feedback, setFeedback] = React.useState(
        reduceMotion ? teachingFrame.feedback : 'Tap to activate'
    );

    const fireHaptic = useHapticLatch();
    const announceState = useDiagramStateAnnouncer(!reduceMotion);

    const isPaired = useDerivedValue(() => {
        return externalActive.value > 0.5 && internalActive.value > 0.5 ? 1 : 0;
    });

    const glansColor = useDerivedValue(() => {
        return interpolateColor(
            externalActive.value,
            [0, 1],
            [diagramColors.passive, diagramColors.active]
        );
    });

    const legsColor = useDerivedValue(() => {
        return interpolateColor(
            internalActive.value,
            [0, 1],
            [diagramColors.passive, diagramColors.active]
        );
    });

    const connectionOpacity = useDerivedValue(() => {
        return withSpring(isPaired.value);
    });

    useAnimatedReaction(
        () => isPaired.value,
        (curr, prev) => {
            if (curr === prev) return;
            runOnJS(fireHaptic)(curr > 0.5);
            const text = curr > 0.5 ? 'Paired' : 'Tap to activate';
            runOnJS(setFeedback)(text);
            if (curr > 0.5) {
                runOnJS(announceState)('Paired');
            }
        }
    );

    const canalPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = canvasWidth / 2;
        p.moveTo(CX - 25, 120);
        p.lineTo(CX - 20, 300);
        p.quadTo(CX, 310, CX + 20, 300);
        p.lineTo(CX + 25, 120);
        return p;
    }, [canvasWidth]);

    const glansPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = canvasWidth / 2;
        p.addOval({ x: CX - 15, y: 60, width: 30, height: 30 });
        return p;
    }, [canvasWidth]);

    const legsPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = canvasWidth / 2;
        p.moveTo(CX - 10, 80);
        p.quadTo(CX - 60, 120, CX - 50, 250);
        p.quadTo(CX - 30, 260, CX - 30, 200);
        p.quadTo(CX - 30, 120, CX - 10, 90);
        p.moveTo(CX + 10, 80);
        p.quadTo(CX + 60, 120, CX + 50, 250);
        p.quadTo(CX + 30, 260, CX + 30, 200);
        p.quadTo(CX + 30, 120, CX + 10, 90);
        return p;
    }, [canvasWidth]);

    const toggleExternal = () => {
        if (reduceMotion) return;
        externalActive.value = withSpring(externalActive.value === 0 ? 1 : 0);
    };
    const toggleInternal = () => {
        if (reduceMotion) return;
        internalActive.value = withSpring(internalActive.value === 0 ? 1 : 0);
    };

    return (
        <DiagramFrame
            accessibilityLabel={accessibilityLabel}
            feedback={feedback}
            hint={
                reduceMotion
                    ? undefined
                    : 'Tap the labels to activate stimulation types.\nSee how they connect.'
            }
            height={350}
            reduceMotion={reduceMotion}
        >
            <View style={{ flex: 1, width: canvasWidth, height: canvasHeight }}>
                <Canvas style={{ flex: 1 }}>
                    <Path path={canalPath} color={colors.neutral[200]} />
                    <Path path={canalPath} style="stroke" strokeWidth={2} color={diagramColors.passive} />

                    <Group>
                        <Path path={legsPath} color={legsColor} />
                        <Path path={legsPath} color={diagramColors.glow} opacity={connectionOpacity}>
                            <BlurMask blur={10} style="normal" />
                        </Path>
                    </Group>

                    <Group>
                        <Path path={glansPath} color={glansColor} />
                        <Path path={glansPath} color={diagramColors.glow} opacity={externalActive} style="stroke" strokeWidth={2}>
                            <BlurMask blur={4} style="normal" />
                        </Path>
                    </Group>

                    <Circle cx={canvasWidth / 2} cy={90} r={40} color={diagramColors.active} opacity={connectionOpacity}>
                        <BlurMask blur={30} style="normal" />
                    </Circle>
                </Canvas>

                {!reduceMotion ? (
                    <View style={[StyleSheet.absoluteFill, styles.controls]} accessibilityElementsHidden importantForAccessibility="no">
                        <TouchableOpacity onPress={toggleExternal} style={styles.chip}>
                            <Text style={[textStyles.label, styles.chipText]}>External (Glans)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleInternal} style={[styles.chip, styles.chipBottom]}>
                            <Text style={[textStyles.label, styles.chipText]}>Internal (Canal)</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </DiagramFrame>
    );
};

const styles = StyleSheet.create({
    controls: {
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    chip: {
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 20,
    },
    chipBottom: {
        marginBottom: 40,
    },
    chipText: {
        color: colors.text.accent,
    },
});
