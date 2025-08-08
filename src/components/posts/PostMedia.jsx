import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import MuteButton from "../MuteButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height: screenHeight } = Dimensions.get("window");

const PostMedia = ({ media, variant = "default", isViewable = false, setPlayer }) => {
  const insets = useSafeAreaInsets();
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const playerRef = useRef(null);

  if (!media?.type || !media?.url) return null;

  const player = useVideoPlayer(media.url, (p) => {
    playerRef.current = p;
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (player && setPlayer) {
      setPlayer(player);
    }
  }, [player, setPlayer]);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player?.playing ?? false,
  });

  useEffect(() => {
    const currentPlayer = playerRef.current;
    let isMounted = true;

    const handlePlayback = async () => {
      if (!currentPlayer || !isMounted) return;
      try {
        if (isViewable) {
          await currentPlayer.play();
          if (isMounted) setIsLoading(false);
        } else if (currentPlayer.playing) {
          await currentPlayer.pause();
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };

    handlePlayback();

    return () => {
      isMounted = false;
    };
  }, [isViewable]);

  useEffect(() => {
    const currentPlayer = playerRef.current;
    if (currentPlayer) {
      currentPlayer.muted = isMuted;
      if (!isMuted && hasUserInteracted && isViewable) {
        currentPlayer.play();
      }
    }
  }, [isMuted, hasUserInteracted, isViewable]);

  useEffect(() => {
    if (isPlaying) setIsLoading(false);
  }, [isPlaying]);

  const toggleMute = () => {
    setHasUserInteracted(true);
    setIsMuted((prev) => !prev);
  };

  const finalHeight = useMemo(() => {
    if (variant === "reel") return screenHeight;
    const maxHeight = 450;
    const adjusted = screenHeight > 677 ? screenHeight - 390 : screenHeight - 310;
    return Math.min(adjusted, maxHeight);
  }, [variant, insets.bottom]);

  const commonStyle = {
    width,
    height: finalHeight,
    backgroundColor: "#000",
  };

  if (media.type === "video") {
    return (
      <View style={[styles.container, commonStyle]}>
        <VideoView
          style={commonStyle}
          player={player}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen
          allowsPictureInPicture
          onPlaying={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {isLoading && (
          <View
            style={variant === "reel" ? styles.reelLoader : styles.defaultLoader}
          >
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}

        <MuteButton
          variant={variant}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: media.url }}
      style={commonStyle}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  reelLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  defaultLoader: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});

export default React.memo(PostMedia, (prevProps, nextProps) => {
  return (
    prevProps.media?.url === nextProps.media?.url &&
    prevProps.media?.type === nextProps.media?.type &&
    prevProps.isViewable === nextProps.isViewable &&
    prevProps.variant === nextProps.variant
  );
});
