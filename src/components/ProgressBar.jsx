import { useEffect, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ProgressBar = ({ player, bottomOffset = 0 }) => {
  const progress = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastSeekTimeRef = useRef(0);
  const seekDebounceRef = useRef(null);
  const MIN_SEEK_INTERVAL = 150; // Increased slightly for smoother experience
  const thumbSize = 14;
  const initialBarHeight = 4;
  const activeBarHeight = 8;
  const containerHeight = 24;

  useEffect(() => {
    let frame;
    const update = () => {
      if (
        player?.duration > 0 &&
        player?.currentTime >= 0 &&
        !isDragging.value
      ) {
        progress.value = withTiming(player.currentTime / player.duration, {
          duration: 50, // Smooth progress updates
        });
      }
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [player]);

  const handleSeek = (p) => {
    if (player?.duration > 0) {
      const seekTime = Math.max(0, Math.min(p * player.duration, player.duration));
      try {
        player.currentTime = seekTime;
      } catch (error) {
        console.warn("Seek failed:", error);
      }
    }
  };

  const debounceSeek = (p) => {
    if (seekDebounceRef.current) {
      clearTimeout(seekDebounceRef.current);
    }
    seekDebounceRef.current = setTimeout(() => {
      handleSeek(p);
    }, MIN_SEEK_INTERVAL);
  };

  const gesture = Gesture.Pan()
    .hitSlop({ top: 30, bottom: 30, left: 30, right: 30 })
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const clamped = Math.min(Math.max(0, e.x), width);
      const newProgress = clamped / width;
      progress.value = newProgress;

      const now = Date.now();
      if (now - lastSeekTimeRef.current > MIN_SEEK_INTERVAL) {
        lastSeekTimeRef.current = now;
        runOnJS(debounceSeek)(newProgress);
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(handleSeek)(progress.value); // Final seek on drag end
    })
    .simultaneousWithExternalGesture();

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: width * Math.min(Math.max(progress.value, 0), 1),
  }));

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          width * Math.min(Math.max(progress.value, 0), 1) - thumbSize / 2,
      },
    ],
    opacity: withTiming(isDragging.value ? 1 : 0, { duration: 100 }),
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    height: withTiming(isDragging.value ? activeBarHeight : initialBarHeight, {
      duration: 100,
    }),
    top:
      (containerHeight - (isDragging.value ? activeBarHeight : initialBarHeight)) /
      2,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, { bottom: bottomOffset }]}>
        <Animated.View style={[styles.barBackground, animatedBarStyle]} />
        <Animated.View
          style={[styles.barFill, animatedBarStyle, animatedProgressStyle]}
        />
        <Animated.View style={[styles.thumb, animatedThumbStyle]} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 24,
    justifyContent: "center",
    position: "relative",
  },
  barBackground: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  barFill: {
    backgroundColor: "#fff",
    position: "absolute",
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    borderRadius: 7,
    top: (24 - 14) / 2,
  },
});

export default ProgressBar;