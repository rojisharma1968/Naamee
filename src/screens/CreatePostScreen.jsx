import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, FontAwesome5, FontAwesome6, Ionicons} from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import CustomModal from "../components/CustomModal";
import ToggleSelector from "../components/ToggleSelector";
import { VideoView, useVideoPlayer } from "expo-video";

const CreatePostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedLocation } = route.params || {};
  const CAPTION_LIMIT = 200;
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [videoUri, setVideoUri] = useState(route.params?.videoUri || null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [showTwitter, setShowTwitter] = useState(false);
  const [showFacebook, setShowFacebook] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [postVisibility, setPostVisibility] = useState("following");
  const [selectedHashtagType, setSelectedHashtagType] = useState(null);
  const [hashtagValues, setHashtagValues] = useState({
    mood: "",
    wearing: "",
    listening: "",
    watching: "",
    playing: "",
  });

  const player = useVideoPlayer(videoUri);

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const handlePost = () => {
    navigation.navigate("Tabs", { screen: "Home" });
  };

  const hashtagTypes = [
    {
      type: "mood",
      icon: <FontAwesome5 name="theater-masks" size={14} color="#5ba1d6" />,
    },
    {
      type: "wearing",
      icon: <Feather name="shopping-bag" size={14} color="#5ba1d6" />,
    },
    {
      type: "listening",
      icon: <Feather name="music" size={14} color="#5ba1d6" />,
    },
    {
      type: "watching",
      icon: <Feather name="film" size={14} color="#5ba1d6" />,
    },
    {
      type: "playing",
      icon: (
        <FontAwesome6 name="gamepad" size={14} color="#5ba1d6" />
      ),
    },
  ];

  const shareOptions = [
    {
      key: "x",
      label: "x.com",
      icon: <FontAwesome6 name="x-twitter" size={20} color="#5ba1d6" />,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Feather name="facebook" size={20} color="#5ba1d6" />,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Feather name="linkedin" size={20} color="#5ba1d6" />,
    },
  ];

  const selected = [];
  if (showTwitter) selected.push("x");
  if (showFacebook) selected.push("facebook");
  if (showLinkedIn) selected.push("linkedin");

  const onToggle = (platform) => {
    if (platform === "x") setShowTwitter((prev) => !prev);
    else if (platform === "facebook") setShowFacebook((prev) => !prev);
    else if (platform === "linkedin") setShowLinkedIn((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {videoUri ? (
            <View className="mb-5 rounded-2xl overflow-hidden bg-black h-80">
              <VideoView
                player={player}
                style={{ width: "100%", height: "100%" }}
                allowsFullscreen
                contentFit="cover"
                allowsPictureInPicture
              />
            </View>
          ) : imageUri ? (
            <View className="mb-5 rounded-2xl overflow-hidden bg-black h-80">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full rounded-2xl object-cover"
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className="mb-5 rounded-2xl bg-gray-100 flex items-center justify-center h-80">
              <Text className="text-gray-500 text-sm">No Media Selected</Text>
            </View>
          )}

          <View className="mb-2">
            <Input
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              multiline={true}
              onClear={() => setCaption("")}
              wrapClass="mb-1"
              highlightMentions
              minMLHeight={120}
              maxLength={CAPTION_LIMIT}
            />
            <Text
              className={`text-right text-sm ${
                caption.length > CAPTION_LIMIT
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {caption.length}/{CAPTION_LIMIT}
            </Text>
          </View>

          {/* Hashtags */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Hashtags
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {hashtagTypes.map(({ type, icon }) => {
                const filled = hashtagValues[type]?.trim().length > 0;
                return (
                  <Button
                    key={type}
                    title={`#${hashtagValues[type] || type}`.trim()}
                    iconLeft={icon}
                    className={`py-[6px] flex-row items-center gap-1 ${
                      filled
                        ? "bg-black border-black"
                        : "bg-white border-gray-400"
                    }`}
                    textClass="text-gray-700 text-sm"
                    onPress={() => setSelectedHashtagType(type)}
                    variant="outline"
                  />
                );
              })}
            </View>
          </View>

          {/* Location */}
          <View className="flex-row mb-6 gap-3">
            <Button
              iconLeft={<Feather name="map-pin" size={18} color="#444" />}
              title={location || "Add Location"}
              className="!flex-1 py-[10px]"
              textClass="text-base"
              variant="outline"
              onPress={() =>
                navigation.navigate("LocationSearch", {
                  imageUri,
                  videoUri,
                })
              }
            />
          </View>

          {/* Post Visibility */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Post Visibility
            </Text>
            <ToggleSelector
              value={postVisibility}
              onChange={setPostVisibility}
              className="mb-6"
              options={[
                { label: "Following", value: "following", icon: "users" },
                { label: "Only Me", value: "onlyMe", icon: "lock" },
              ]}
            />
          </View>

          {/* Social Share */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Share to
            </Text>
            <View className="flex-row justify-between gap-2">
              {shareOptions.map((opt) => {
                const isActive = selected.includes(opt.key);

                return (
                  <Button
                    key={opt.key}
                    iconLeft={opt.icon}
                    title={opt.label}
                    className={`py-[10px] !flex-1 ${
                      isActive ? "!border-black bg-gray-100" : "border-gray-400"
                    }`}
                    textClass="text-base text-zinc-600"
                    variant="outline"
                    onPress={() => onToggle(opt.key)}
                  />
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => navigation.navigate("Tabs", { screen: "Camera" })}
              className="!flex-1 py-[10px]"
              textClass="text-lg"
            />
            <Button
              title="Post"
              variant="primary"
              onPress={handlePost}
              className="!flex-1 py-[10px]"
              textClass="text-lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Hashtag Input Modal */}
      <CustomModal
        title={`#${selectedHashtagType}`}
        visible={!!selectedHashtagType}
        onClose={() => setSelectedHashtagType(null)}
        type="input"
        inputValue={hashtagValues[selectedHashtagType] || ""}
        onChangeInput={(text) =>
          setHashtagValues((prev) => ({
            ...prev,
            [selectedHashtagType]: text,
          }))
        }
        placeholder={`Enter #${selectedHashtagType}...`}
        onSubmit={() => setSelectedHashtagType(null)}
      />
    </SafeAreaView>
  );
};

export default CreatePostScreen;
