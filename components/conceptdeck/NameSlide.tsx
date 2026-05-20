import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { Concept, ConceptSlide } from '@/types';
import React from 'react';
import { useWindowDimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

interface NameSlideProps {
    item: ConceptSlide;
    concept: Concept;
}

export const NameSlide = ({ item, concept }: NameSlideProps) => {
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.containerBase, { width }]}>
            <View style={styles.content}>

                {/* Icon */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconContainer}>
                    <Image
                        source={require('@/assets/images/ui/slide-name.png')}
                        style={styles.icon}
                    />
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <Text
                        variant="h2"
                        align="center"
                        color={colors.primary[800]}
                        style={styles.titleSpacing}
                    >
                        {item.title || 'The Word'}
                    </Text>
                </Animated.View>

                {/* Definition Body */}
                <Animated.View entering={FadeIn.delay(500).duration(800)} style={styles.bodyContainer}>
                    <Text variant="deckLead" align="center">
                        {item.content}
                    </Text>
                </Animated.View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBase: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: 100,
        paddingBottom: 60,
        backgroundColor: colors.primary[50], // Light Blush background
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        // tintColor removed to prevent coloring background
    },
    titleSpacing: {
        marginBottom: spacing.xl,
    },
    bodyContainer: {
        maxWidth: '90%',
        padding: spacing.lg,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: borderRadius.lg,
    },
});
