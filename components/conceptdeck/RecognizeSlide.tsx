import { Text } from '@/components/ui/Typography';
import { colors, spacing } from '@/constants/theme';
import { Concept, ConceptSlide } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface RecognizeSlideProps {
    item: ConceptSlide;
    concept: Concept;
}

export const RecognizeSlide = ({ item, concept }: RecognizeSlideProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Category Label */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Text
                        variant="label"
                        color={colors.text.tertiary}
                        align="center"
                        style={styles.labelSpacing}
                    >
                        {concept.category.toUpperCase()}
                    </Text>
                </Animated.View>

                {/* Concept Name */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text variant="h1" align="center" style={styles.titleSpacing}>
                        {concept.name}
                    </Text>
                </Animated.View>

                {/* The Question/Prompt */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.questionContainer}>
                    <Text variant="deckPrompt" align="center">
                        {item.content}
                    </Text>
                </Animated.View>

                {/* Swipe Hint */}
                <Animated.View entering={FadeInDown.delay(800).duration(1000)} style={styles.footer}>
                    <Text variant="caption" color={colors.text.tertiary}>Swipe to learn</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: 100, // Space for progress bar
        paddingBottom: 60,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelSpacing: {
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    titleSpacing: {
        marginBottom: spacing['2xl'],
    },
    questionContainer: {
        marginBottom: spacing['2xl'],
        paddingHorizontal: spacing.md,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xs,
        opacity: 0.6,
    }
});
