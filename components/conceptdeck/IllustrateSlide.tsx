import { IllustrateVideo } from '@/components/conceptdeck/IllustrateVideo';
import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { ConceptSlide, DiagramType } from '@/types';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, useWindowDimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AnglingDiagram } from '../diagrams/AnglingDiagram';
import { PairingDiagram } from '../diagrams/PairingDiagram';
import { RockingDiagram } from '../diagrams/RockingDiagram';
import { ShallowingDiagram } from '../diagrams/ShallowingDiagram';

interface IllustrateSlideProps {
    item: ConceptSlide;
    isActive?: boolean;
    diagramType?: DiagramType;
}

export const IllustrateSlide = ({ item, isActive = false, diagramType }: IllustrateSlideProps) => {
    const { width } = useWindowDimensions();
    const [isMuted, setIsMuted] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
        const subscription = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            setReduceMotion
        );
        return () => subscription.remove();
    }, []);

    const renderContent = () => {
        const diagramLabel = item.illustrationCaption ?? 'Interactive diagram';
        const diagramProps = { accessibilityLabel: diagramLabel, reduceMotion };

        if (diagramType === 'angling') {
            return (
                <View style={styles.diagramContainer}>
                    <AnglingDiagram {...diagramProps} />
                </View>
            );
        }
        if (diagramType === 'shallowing') {
            return (
                <View style={styles.diagramContainer}>
                    <ShallowingDiagram {...diagramProps} />
                </View>
            );
        }
        if (diagramType === 'rocking') {
            return (
                <View style={styles.diagramContainer}>
                    <RockingDiagram {...diagramProps} />
                </View>
            );
        }
        if (diagramType === 'pairing') {
            return (
                <View style={styles.diagramContainer}>
                    <PairingDiagram {...diagramProps} />
                </View>
            );
        }

        if (item.illustrationVideo) {
            if (reduceMotion && item.illustrationAsset) {
                return (
                    <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                        <Image
                            source={item.illustrationAsset}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                    </Animated.View>
                );
            }

            return (
                <IllustrateVideo
                    source={item.illustrationVideo}
                    poster={item.illustrationAsset}
                    isActive={isActive}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                />
            );
        }

        const hasInteractiveContent = diagramType && diagramType !== 'none';
        const hasVideo = !!item.illustrationVideo;

        if (item.illustrationAsset && !hasInteractiveContent && !hasVideo) {
            return (
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                    <Image
                        source={item.illustrationAsset}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </Animated.View>
            );
        }

        return null;
    };

    return (
        <View style={[styles.containerBase, { width }]}>
            <View style={styles.content}>
                {renderContent()}

                {item.illustrationCaption && (
                    <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.captionContainer}>
                        <Text
                            variant="caption"
                            align="center"
                            color={colors.text.tertiary}
                            style={styles.caption}
                        >
                            {item.illustrationCaption}
                        </Text>
                    </Animated.View>
                )}

                {item.content && (
                    <Animated.View entering={FadeIn.delay(600).duration(600)} style={styles.textContainer}>
                        <Text align="center" variant="body">
                            {item.content}
                        </Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBase: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 80,
        paddingBottom: 60,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        width: '100%',
        aspectRatio: 1,
        maxHeight: '60%',
        marginBottom: spacing.xl,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: colors.conceptCanvas,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        ...shadows.sm,
    },
    diagramContainer: {
        width: '100%',
        marginBottom: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    captionContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: '92%',
    },
    caption: {
        fontStyle: 'italic',
    },
    textContainer: {
        paddingHorizontal: spacing.md,
        maxWidth: '92%',
    },
});
