import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const PostActions = ({
  liked,
  setLiked,
  repeated,
  setRepeated,
  post,
  onCommentPress,
  variant = "default",
}) => {
  const isReel = variant === "reel";

  const VerticalButton = ({ icon, count, onPress, color, active, bg }) => (
    <TouchableOpacity onPress={onPress} className="items-center mb-6">
      <View
        className={`size-11 rounded-full flex-row items-center justify-center ${
          active ? bg || "bg-yellow-300" : "bg-zinc-200/30"
        }`}
      >
        <Feather name={icon} size={25} color={color ? color : "#fff"} />
      </View>
      <Text className="text-white mt-1 text-sm">{count}</Text>
    </TouchableOpacity>
  );

  if (isReel) {
    return (
      <View className="absolute right-4 top-1/2 -translate-y-1/2 items-center">
        <VerticalButton
          icon="smile"
          count={liked ? post.likes + 1 : post.likes}
          onPress={() => setLiked(!liked)}
          color={liked ? "#ca8a04" : "#fff"}
          active={liked}
        />
        <VerticalButton
          icon="message-circle"
          count={post.comments ?? ""}
          onPress={onCommentPress}
        />
        <VerticalButton
          icon="repeat"
          count={repeated ? post.repeats + 1 : post.repeats}
          onPress={() => setRepeated(!repeated)}
          color="#fff"
          bg="bg-primary"
          active={repeated}
        />
      </View>
    );
  }

  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => setLiked(!liked)}
          className={`flex-row items-center px-3 py-2 rounded-full ${
            liked ? "bg-yellow-100" : "bg-zinc-100"
          }`}
        >
          <Feather name="smile" size={20} color={liked ? "#ca8a04" : "#555"} />
          <Text
            className={`ml-2 text-base ${
              liked ? "text-yellow-600" : "text-zinc-700"
            }`}
          >
            {typeof post.likes === "number"
              ? (liked ? post.likes + 1 : post.likes).toLocaleString()
              : " "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCommentPress}
          className="flex-row items-center px-3 py-2 rounded-full bg-zinc-100"
        >
          <Feather name="message-circle" size={20} color="#555" />
          <Text className="ml-2 text-base text-zinc-700">
            {typeof post.comments === "number" ? post.comments : " "}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setRepeated(!repeated)}
        className={`flex-row items-center px-3 py-2 rounded-full ${
          repeated ? "bg-primary/20" : "bg-zinc-100"
        }`}
      >
        <Feather
          name="repeat"
          size={20}
          color={repeated ? "#5ba1d6" : "#555"}
        />
        <Text
          className={`ml-2 text-base ${
            repeated ? "text-primary" : "text-zinc-700"
          }`}
        >
          {typeof post.repeats === "number"
            ? repeated
              ? post.repeats + 1
              : post.repeats
            : " "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostActions;
