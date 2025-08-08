import { View, Text, Image, Pressable } from "react-native";
import Avatar from "../Avatar";
import { useNavigation } from "@react-navigation/native";
import MediaRenderer from "../MediaRenderer";

const NotificationItem = ({ type, user, target, time, comment }) => {
  const navigation = useNavigation();
  const formattedDate = new Date(time).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let message = "";
  if (type === "smile") {
    message = `${user.name} smiled on ${target?.label}.`;
  } else if (type === "repeat") {
    message = `${user.name} repeated ${target?.label}.`;
  } else if (type === "comment") {
    message = `${user.name} commented on ${target?.label}: "${comment}"`;
  } else if (type === "follow") {
    message = `${user.name} started following you.`;
  }

  return (
    <View className="bg-white mx-4 mb-3 rounded-xl flex-row items-start p-4">
      {/* User avatar */}
      <Pressable onPress={() => navigation.navigate("UsersProfile")}>
        <Avatar uri={user.avatar} className="size-12 mr-3" />
      </Pressable>

      {/* Content */}
      <View className="flex-1">
        <Text
          className="text-[15px] text-gray-800 leading-[1.2]"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {message}
        </Text>
        <Text className="text-sm text-zinc-600 mt-1">{formattedDate}</Text>
      </View>

      {/* Thumbnail if available */}
      {target?.thumbnail && (
        <Pressable onPress={() => navigation.navigate("Comments")}>
          <MediaRenderer
            mediaType={target.mediaType}
            uri={target.thumbnail}
            className="size-12 rounded-md overflow-hidden ml-3"
          />
        </Pressable>
      )}
    </View>
  );
};

export default NotificationItem;
