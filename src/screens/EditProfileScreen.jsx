import { useCallback, useEffect, useState, useRef, memo, useMemo } from "react";
import {
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
  Switch,
  ScrollView,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import EditProfileBanner from "../components/profile/edit/EditProfileBanner";
import EditProfilePersonalInfo from "../components/profile/edit/EditProfilePersonalInfo";
import EditProfileAccountType from "../components/profile/edit/EditProfileAccountType";
import EditProfilePrivacySettings from "../components/profile/edit/EditProfilePrivacySettings";
import Button from "../components/Button";

const EditProfileScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
  );
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    phone: "",
    website: "",
    bio: "",
  });
  const [accountType, setAccountType] = useState("Public");
  const [notifications, setNotifications] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    smilePost: "Everyone",
    followers: "Everyone",
    following: "Everyone",
    videos: "Everyone",
  });
  const [openPrivacyKey, setOpenPrivacyKey] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: accountType === "Public" ? 0 : 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [accountType]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }, []);

  const pickBanner = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setBannerImage(result.assets[0].uri);
    }
  }, []);

  const handlePrivacyChange = useCallback((key, value) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
    setOpenPrivacyKey("");
  }, []);

  const togglePrivacyDropdown = useCallback((key) => {
    setOpenPrivacyKey((prev) => (prev === key ? "" : key));
  }, []);

  const handleProfileChange = useCallback((key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const inputFields = useMemo(
    () => [
      {
        label: "Full Name",
        value: profileData.name,
        onChangeText: (value) => handleProfileChange("name", value),
        placeholder: "Enter your full name",
        icon: "user",
      },
      {
        label: "Username",
        value: profileData.username,
        onChangeText: (value) => handleProfileChange("username", value),
        placeholder: "Enter your username",
        icon: "at-sign",
      },
      {
        label: "Email",
        value: profileData.email,
        onChangeText: (value) => handleProfileChange("email", value),
        placeholder: "Enter your email",
        icon: "mail",
      },
      {
        label: "Phone",
        value: profileData.phone,
        onChangeText: (value) => handleProfileChange("phone", value),
        placeholder: "Enter your phone number",
        icon: "phone",
      },
      {
        label: "Website",
        value: profileData.website,
        onChangeText: (value) => handleProfileChange("website", value),
        placeholder: "Enter your website",
        icon: "globe",
      },
      {
        label: "Bio",
        value: profileData.bio,
        onChangeText: (value) => handleProfileChange("bio", value),
        placeholder: "Tell us about yourself",
        multiline: true,
      },
    ],
    [profileData, handleProfileChange]
  );

  return (
    <View className="flex-1 bg-zinc-100">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="px-3 py-5">
          <EditProfileBanner
            bannerImage={bannerImage}
            profileImage={profileImage}
            pickBanner={pickBanner}
            pickImage={pickImage}
          />

          <EditProfilePersonalInfo inputFields={inputFields} />

          <EditProfileAccountType
            accountType={accountType}
            setAccountType={setAccountType}
          />

          <EditProfilePrivacySettings
            privacySettings={privacySettings}
            openPrivacyKey={openPrivacyKey}
            handlePrivacyChange={handlePrivacyChange}
            togglePrivacyDropdown={togglePrivacyDropdown}
          />

          <View className="bg-white rounded-xl p-6 mb-6 flex-row items-center justify-between">
            <Text className="text-lg text-gray-800 font-medium">Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#d1d5db", true: "#5ba1d6" }}
              thumbColor={notifications ? "#ffffff" : "#f4f4f5"}
            />
          </View>

          <Text className="mb-4 text-base text-center">
            <Text
              className="text-primary text-base"
              onPress={() => navigation.navigate("TermsScreen")}
            >
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              className="text-primary text-base"
              onPress={() => navigation.navigate("PrivacyScreen")}
            >
              Privacy Policy
            </Text>
          </Text>
          <Button title="Save Changes" className="mb-8" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(EditProfileScreen);