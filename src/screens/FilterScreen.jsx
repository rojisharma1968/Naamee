import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const FilterScreen = () => {
  const route = useRoute();
  const { imageUri } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState("Normal");
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  // 🔧 Filters with overlays and optional blur
  const filters = [
    { name: "Normal", overlay: null, blur: 0 },
    { name: "Grayscale", overlay: "rgba(128, 128, 128, 0.2)", blur: 0 },
    { name: "Sepia", overlay: "rgba(112, 66, 20, 0.2)", blur: 0 },
    { name: "Bright", overlay: "rgba(255, 255, 255, 0.1)", blur: 0 },
    { name: "Dark", overlay: "rgba(0, 0, 0, 0.2)", blur: 0 },
    { name: "Blur", overlay: null, blur: 5 },
  ];

  const mainImageUri = Array.isArray(imageUri)
    ? imageUri.find((uri) => uri && typeof uri === "string")
    : typeof imageUri === "string"
    ? imageUri
    : null;

  const filterData = mainImageUri
    ? filters.map((filter, index) => ({
        id: `${index}`,
        uri: mainImageUri,
        filter: filter,
        filterName: filter.name,
      }))
    : [];

  const handleReset = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    navigation.navigate("CreatePost", {
      imageUri: mainImageUri,
      selectedFilter,
    });
  };

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedFilter(item.filterName)}
      className="mx-2 my-1.5"
    >
      <View className="relative bg-gray-100 rounded-xl overflow-hidden">
        <Image
          source={{ uri: item.uri }}
          style={{
            width: 80,
            aspectRatio: 1,
          }}
          className="rounded-xl"
          contentFit="cover"
          blurRadius={item.filter.blur || 0}
        />
        {item.filter.overlay && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: item.filter.overlay },
            ]}
          />
        )}
        <View className="absolute bottom-1 left-1 bg-black/50 px-1 py-0.5 rounded-md">
          <Text className="text-white text-xs font-medium">
            {item.filterName}
          </Text>
        </View>
        <View className="absolute top-1 right-1">
          <Feather
            name="check-circle"
            size={16}
            color={
              selectedFilter === item.filterName ? "#fff" : "transparent"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const selectedFilterObj = filters.find((f) => f.name === selectedFilter);
  const selectedStyle = {
    overlay: selectedFilterObj?.overlay,
    blur: selectedFilterObj?.blur || 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-5">
      {mainImageUri ? (
        <>
          {/* Main Image */}
          <View className="px-4 pb-4 flex-1">
            <View className="flex-1 rounded-2xl overflow-hidden bg-gray-100">
              <Image
                source={{ uri: mainImageUri }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="rounded-2xl"
                contentFit="cover"
                blurRadius={selectedStyle.blur}
              />
              {selectedStyle.overlay && (
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: selectedStyle.overlay },
                  ]}
                />
              )}
            </View>
          </View>

          {/* Filter Options */}
          <View className="px-4">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Filter Options
            </Text>
            <FlatList
              data={filterData}
              renderItem={renderFilterItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              snapToInterval={84}
              decelerationRate="fast"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between space-x-6 px-5 mt-5 mb-6">
            <TouchableOpacity
              className="bg-zinc-200 p-3 rounded-full"
              onPress={handleReset}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary p-3 rounded-full"
              onPress={handleDone}
            >
              <Feather name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Feather name="alert-circle" size={40} color="#555" />
          <Text className="text-base text-gray-500 mt-2">
            No images provided
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FilterScreen;
