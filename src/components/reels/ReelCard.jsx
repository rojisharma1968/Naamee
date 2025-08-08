import React, { useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import SmileImage from "../../../assets/images/smile.png";
import repeatImage from "../../../assets/images/repeat.png";
import PostMedia from "../posts/PostMedia";
import PostActions from "../posts/PostActions";
import Avatar from "../Avatar";
import Button from "../Button";
import ProgressBar from "../ProgressBar";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReelCard = ({ post, isViewable }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [interactions, setInteractions] = useState({
    liked: false,
    repeated: false,
  });

  const [isFollowing, setIsFollowing] = useState(false);

  const playerRef = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);

  const smileScale = useRef(new Animated.Value(0)).current;
  const smileOpacity = useRef(new Animated.Value(0)).current;
  const repeatScale = useRef(new Animated.Value(0)).current;
  const repeatOpacity = useRef(new Animated.Value(0)).current;

  const animateIcon = useCallback((scaleRef, opacityRef) => {
    scaleRef.setValue(0);
    opacityRef.setValue(1);
    Animated.parallel([
      Animated.timing(scaleRef, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityRef, {
        toValue: 0,
        duration: 700,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSingleTap = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleDoubleTap = useCallback(() => {
    setInteractions((prev) => {
      if (!prev.liked) {
        animateIcon(smileScale, smileOpacity);
        return { ...prev, liked: true };
      }
      animateIcon(smileScale, smileOpacity);
      return prev;
    });
  }, [animateIcon, smileScale, smileOpacity]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleCommentPress = () => {
    navigation.navigate("Comments", { post });
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(handleDoubleTap)();
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(handleSingleTap)();
    });

  const composedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <View style={{ height: SCREEN_HEIGHT, backgroundColor: "black" }}>
      <GestureDetector gesture={composedGesture}>
        <View style={{ flex: 1 }}>
          <PostMedia
            isViewable={isViewable}
            variant="reel"
            media={{ type: post.mediaType, url: post.mediaUrl }}
            setPlayer={(player) => {
              playerRef.current = player;
              setPlayerInstance(player);
            }}
          />
          {/* Smile Animation */}
          <Animated.Image
            source={SmileImage}
            style={[
              styles.animatedIcon,
              {
                width: 80,
                height: 80,
                transform: [
                  { translateX: -40 },
                  { translateY: -40 },
                  { scale: smileScale },
                ],
                opacity: smileOpacity,
              },
            ]}
            resizeMode="contain"
          />

          {/* Repeat Animation */}
          <Animated.Image
            source={repeatImage}
            style={[
              styles.animatedIcon,
              {
                width: 70,
                height: 70,
                transform: [
                  { translateX: -35 },
                  { translateY: -35 },
                  { scale: repeatScale },
                ],
                opacity: repeatOpacity,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      </GestureDetector>

      <PostActions
        post={post}
        liked={interactions.liked}
        repeated={interactions.repeated}
        setLiked={(val) =>
          setInteractions((prev) => {
            if (val && !prev.liked) animateIcon(smileScale, smileOpacity);
            return { ...prev, liked: val };
          })
        }
        setRepeated={(val) =>
          setInteractions((prev) => {
            if (val && !prev.repeated) animateIcon(repeatScale, repeatOpacity);
            return { ...prev, repeated: val };
          })
        }
        onCommentPress={handleCommentPress}
        variant="reel"
      />

      <BlurView
        intensity={15}
        tint="dark"
        className={`absolute bottom-0 left-0 right-0 ${insets.bottom > 0 ? "pt-0 pb-10" : "pt-0 pb-3"} w-full overflow-hidden`}
      >
        <ProgressBar
          player={playerInstance}
        />
        <SafeAreaView edges={["bottom"]} className="flex-col gap-y-2 px-5 mt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-3">
              <Avatar
                uri={post.user?.avatar}
                className="size-12 border-2 border-white/90 rounded-full"
              />
              <Text className="text-white font-bold text-lg">
                {post.user?.username || post.user?.name}
              </Text>
            </View>
            <Button
              onPress={handleFollowToggle}
              variant={isFollowing ? "secondary" : "primary"}
              className="!py-2"
              textClass="!text-base"
              title={isFollowing ? "Following" : "Follow"}
            />
          </View>
          {post.caption && (
            <Text className="text-white/90 text-sm font-medium leading-relaxed line-clamp-3 max-w-md">
              {post.caption}
            </Text>
          )}
        </SafeAreaView>
      </BlurView>
    </View>
  );
};

export default memo(ReelCard);

const styles = StyleSheet.create({
  animatedIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },
});
