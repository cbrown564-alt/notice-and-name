import { ResonanceRitual } from '@/components/ui/ResonanceRitual';
import { PulseHeart } from '@/components/ui/PulseHeart';
import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { ConceptSlide, ConceptStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { useWindowDimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ReflectSlideProps {
    item: ConceptSlide;
    onFinish: () => void;
    onSetStatus: (status: ConceptStatus) => Promise<void>;
    currentStatus: ConceptStatus;
    savingStatus: ConceptStatus | null;
}

export const ReflectSlide = ({ onFinish, onSetStatus, currentStatus, savingStatus }: ReflectSlideProps) => {
    const { width } = useWindowDimensions();
    const [showBurst, setShowBurst] = useState(false);

    const finishDeck = useCallback(() => {
        setShowBurst(false);
        // Gentle pause after ritual before returning
        setTimeout(() => {
            onFinish();
        }, 400);
    }, [onFinish]);

    const handleSelect = async (status: ConceptStatus) => {
        // Haptic feedback on selection
        if (status === 'resonates') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (status === 'curious') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const savePromise = onSetStatus(status);

        if (status === 'resonates') {
            await savePromise;
            setShowBurst(true);
            return;
        }

        await Promise.all([
            savePromise,
            new Promise((resolve) => setTimeout(resolve, 300)),
        ]);
        onFinish();
    };

    const statusOptions: { status: ConceptStatus; label: string; helper: string }[] = [
        { status: 'resonates', label: 'Resonates', helper: 'This lands for me' },
        { status: 'curious', label: 'Curious to explore', helper: 'I want to try this' },
        { status: 'not_for_me', label: 'Not interested', helper: 'Skip this one' },
    ];

    return (
        <View style={[styles.containerBase, { width }]}>
            <ResonanceRitual visible={showBurst} onComplete={finishDeck} />

            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text variant="h2" align="center" style={styles.title}>
                        How does this land for you?
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.cardsContainer}>
                    {statusOptions.map((option) => {
                        const isSelected = currentStatus === option.status;

                        return (
                            <TouchableOpacity
                                key={option.status}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected,
                                ]}
                                onPress={() => handleSelect(option.status)}
                                disabled={savingStatus !== null || showBurst}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={{ marginRight: spacing.sm }}>
                                        {option.status === 'resonates' ? (
                                            <PulseHeart
                                                active={isSelected}
                                                size={24}
                                                color={isSelected ? colors.primary[500] : colors.text.tertiary}
                                            />
                                        ) : (
                                            <Ionicons
                                                name={option.status === 'curious' ? 'bulb-outline' : 'close-circle-outline'}
                                                size={24}
                                                color={isSelected ? colors.primary[500] : colors.text.tertiary}
                                            />
                                        )}
                                    </View>
                                    <Text
                                        variant="bodyBold"
                                        color={isSelected ? colors.primary[700] : colors.text.primary}
                                    >
                                        {option.label}
                                    </Text>
                                    {isSelected && option.status !== 'resonates' && (
                                        <View style={{ marginLeft: 'auto' }}>
                                            <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBase: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 60,
    },
    title: {
        marginBottom: spacing['3xl'],
        color: colors.text.primary,
    },
    cardsContainer: {
        gap: spacing.lg,
        width: '100%',
        marginBottom: spacing['3xl'],
    },
    card: {
        backgroundColor: colors.background.surface,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardSelected: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
});
