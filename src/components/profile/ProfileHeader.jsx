import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Button from "../Button";
import Avatar from "../Avatar";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const ProfileHeader = ({ avatarUrl, totalPosts, user = "me" }) => {
  const navigation = useNavigation();

  const stats = useMemo(() => [
    { label: "Posts", value: totalPosts },
    { label: "Repeats", value: '1.2k' },
    { label: "Followers", value: "2.5k" },
    { label: "Following", value: "180" },
  ], [totalPosts]);

  return (
    <>
      <View className="flex-row p-4 items-center">
        <Avatar className="size-16" uri={avatarUrl} />
        <View className="flex-1 flex-row justify-around">
          {stats.map((stat) => (
            <View className="items-center" key={stat.label}>
              <Text className="font-bold text-base">{stat.value}</Text>
              <Text>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-4">
        <Text className="text-lg font-semibold">@yourusername</Text>

        {/* Bio Wrapper */}
        <View className="mt-2 space-y-1">
          <Text className="text-base text-gray-700">
            Traveler ✈️ | Dreamer 🌙 | Coffee Lover ☕️
          </Text>
          <Text className="text-base text-gray-700">
            Sharing stories from around the world 🌍
          </Text>
          <Text className="text-base text-gray-700">
            Capturing moments one photo at a time 📸
          </Text>
          <Text className="text-base text-gray-700">
            Passionate about culture, cuisine, and connection 💬
          </Text>
        </View>

        {/* Website */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://yourwebsite.com")}
          className="flex-row items-center mt-4"
        >
          <Feather name="link" size={16} color="gray" />
          <Text className="ml-2 text-primary">yourwebsite.com</Text>
        </TouchableOpacity>

        {/* Location */}
        <View className="flex-row items-center mt-2">
          <Feather name="map-pin" size={16} color="gray" />
          <Text className="ml-2 text-gray-700">Mumbai, India</Text>
        </View>
      </View>

      <View className="px-4 mt-3 mb-5">
        <Button
          onPress={() => user === "me" && navigation.navigate("EditProfile")}
          variant={user === "me" ? "secondary" : "primary"}
          title={user === "me" ? "Edit Profile" : "Follow"}
          className="!py-3 rounded-md"
          textClass="!text-base"
        />
      </View>
    </>
  );
};

// ✅ Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(ProfileHeader, (prev, next) => {
  return (
    prev.avatarUrl === next.avatarUrl &&
    prev.totalPosts === next.totalPosts &&
    prev.user === next.user
  );
});
