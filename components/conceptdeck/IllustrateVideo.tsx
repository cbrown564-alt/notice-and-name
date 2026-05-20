import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

interface IllustrateVideoProps {
  source: number;
  poster?: ImageSourcePropType;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function IllustrateVideo({
  source,
  poster,
  isActive,
  isMuted,
  onToggleMute,
}: IllustrateVideoProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = isMuted;
  });

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
      {poster ? (
        <Image
          source={poster}
          style={[styles.illustration, styles.posterFrame]}
          resizeMode="contain"
        />
      ) : null}
      <VideoView
        style={styles.illustration}
        player={player}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={false}
      />
      <TouchableOpacity
        style={styles.muteButton}
        onPress={onToggleMute}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel={isMuted ? 'Unmute illustration video' : 'Mute illustration video'}
      >
        <Ionicons
          name={isMuted ? 'volume-mute' : 'volume-high'}
          size={20}
          color={colors.text.primary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  illustration: {
    width: '100%',
    height: '100%',
  },
  posterFrame: {
    ...StyleSheet.absoluteFillObject,
  },
  muteButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },
});
