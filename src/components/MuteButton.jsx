import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const MuteButton = ({ variant = "default", toggleMute, isMuted }) => {
  const muteTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(toggleMute)();
    });

  return (
    <GestureDetector gesture={muteTapGesture}>
      <Pressable
        className={`${variant === "reel" ? "right-4 bottom-48" : "bottom-5 right-5"} absolute z-20 bg-black/60 p-2 rounded-full`}
      >
        <Feather
          name={isMuted ? "volume-x" : "volume-2"}
          size={24}
          color="#fff"
        />
      </Pressable>
    </GestureDetector>
  );
};

export default MuteButton;