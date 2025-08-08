import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Button from "../components/Button";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [loading, setLoading] = useState(false); // NEW STATE
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    }
  };

const pickImage = async () => {
  if (!galleryPermission) {
    Alert.alert("Permission required", "Please allow gallery access");
    return;
  }

  setLoading(true);

  let timeoutId;
  try {
    // Fallback timeout: ensure loading turns false even if picker fails silently
    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000); // 5 seconds max wait

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.5,
    });

    clearTimeout(timeoutId); // clear fallback timeout if picker works

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];

      if (asset.type === "image") {
        navigation.navigate("Filter", { imageUri: asset.uri });
      } else if (asset.type === "video") {
        navigation.navigate("CreatePost", { videoUri: asset.uri });
      } else {
        Alert.alert("Unsupported", "Selected file is not an image or video");
      }
    }

  } catch (error) {
    clearTimeout(timeoutId);
    Alert.alert("Error", "Failed to pick media");
  } finally {
    setLoading(false);
  }
};


  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleDone = () => {
    if (!capturedImage) {
      Alert.alert("No Image", "Please capture an image first");
      return;
    }

    navigation.navigate("Filter", { imageUri: capturedImage });
    setCapturedImage(null);
  };

  if (!cameraPermission?.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl mb-2">Camera permission required</Text>
        <Button
          textClass="text-base"
          title="Grant Permission"
          className="py-2"
          onPress={requestCameraPermission}
        ></Button>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: capturedImage }}
          className="flex-1"
          resizeMode="contain"
        />
        <BlurView
          intensity={90}
          className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between"
        >
          <TouchableOpacity
            className="bg-white p-3 rounded-full"
            onPress={() => setCapturedImage(null)}
          >
            <Feather name="rotate-ccw" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary p-3 rounded-full"
            onPress={handleDone}
          >
            <Feather name="check" size={24} color="white" />
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} />

      {/* Loading Spinner Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-2 text-sm">Loading media...</Text>
        </View>
      )}

      {/* Bottom Controls with all buttons */}
      <BlurView
        intensity={30}
        className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between items-center"
      >
        {/* Gallery Button */}
        <TouchableOpacity
          className="bg-white/80 p-3 rounded-full"
          onPress={pickImage}
          disabled={loading}
        >
          <Feather name="image" size={24} color="black" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          className="bg-white/90 p-4 rounded-full border-2 border-white"
          onPress={takePicture}
          disabled={loading}
        >
          <Feather name="camera" size={28} color="black" />
        </TouchableOpacity>

        {/* Flip Camera Button */}
        <TouchableOpacity
          className="bg-white/80 p-3 rounded-full"
          onPress={toggleCameraFacing}
          disabled={loading}
        >
          <Feather name="refresh-cw" size={24} color="black" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}
