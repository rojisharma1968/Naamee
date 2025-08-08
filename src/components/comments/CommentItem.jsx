import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import Avatar from "../Avatar";
import { useRef, useState } from "react";

const CommentItem = ({ comment, onReport }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // For press-in/out opacity
  const reportAnim = useRef(new Animated.Value(0)).current; // For report button fade-in
  const [showReport, setShowReport] = useState(false);

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    setShowReport(true);
    Animated.timing(reportAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleReport = () => {
    onReport(comment);
    Animated.timing(reportAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowReport(false)); // Hide after animation
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="mx-3 my-1.5 bg-gray-100 rounded-xl"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        delayLongPress={300} // Optional: shorter long press
      >
        <View className="flex-row p-3 items-start">
          <Avatar
            uri={comment.image}
            className="w-10 h-10 rounded-full mr-2.5"
          />
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-base font-semibold text-black">
                {comment.username}
              </Text>
              <Text className="text-xs text-gray-400 font-medium">
                {comment.time}
              </Text>
            </View>
            <Text className="text-sm text-gray-800 leading-5">
              {(comment.text || "").split(/(\s+)/).map((part, index) => {
                if (part.startsWith("@")) {
                  return (
                    <Text key={index} style={{ color: "#5ba1d6" }}>
                      {part}
                    </Text>
                  );
                }
                if (part.startsWith("#")) {
                  return (
                    <Text key={index} style={{ color: "#5ba1d6" }}>
                      {part}
                    </Text>
                  );
                }
                return <Text key={index}>{part}</Text>;
              })}
            </Text>
            {showReport && (
              <Animated.View
                style={{
                  opacity: reportAnim,
                  transform: [
                    {
                      scale: reportAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                }}
                className="mt-2 flex-row justify-end"
              >
                <TouchableOpacity
                  onPress={handleReport}
                  className="bg-danger px-3 py-1.5 rounded-full flex-row items-center"
                >
                  <Feather name="flag" size={14} color="#ffffff" />
                  <Text className="ml-1 text-sm text-white font-medium">
                    Report
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CommentItem;