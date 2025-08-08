import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import TabNavigator from "./TabNavigator";
import SearchScreen from "../screens/SearchScreen";
import UsersProfileScreen from "../screens/UsersProfileScreen";
import CommentsScreen from "../screens/CommentsScreen";
import PostsScreen from "../screens/PostsScreen";
import ReelsScreen from "../screens/ReelsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import HashtagScreen from "../screens/HashtagScreen";
import FilterScreen from "../screens/FilterScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import LocationSearchScreen from "../screens/LocationSearchScreen";
import TermsScreen from "../screens/TermsScreen";
import PrivacyScreen from "../screens/PrivacyScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={({ navigation }) => {
        const canGoBack = navigation.canGoBack?.();

        return {
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#5ba1d6",
            fontWeight: 700,
          },
          headerLeft: () =>
            canGoBack ? (
              <Pressable onPress={() => navigation.goBack()}>
                <View className="size-10 items-center justify-center bg-primary/20 rounded-full">
                  <Feather name="chevron-left" size={24} color="#5ba1d6" />
                </View>
              </Pressable>
            ) : null,
        };
      }}
    >
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled:false }}
        name="Tabs"
        component={TabNavigator}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="UsersProfile" component={UsersProfileScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="Posts" component={PostsScreen} />
      <Stack.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="HashTags" component={HashtagScreen} />
      <Stack.Screen
        name="Filter"
        options={{
          headerShown: false,
        }}
        component={FilterScreen}
      />
      <Stack.Screen
        name="CreatePost"
        options={{
          headerShown: false,
        }}
        component={CreatePostScreen}
      />
      <Stack.Screen
        name="LocationSearch"
        options={{
          headerShown: false,
        }}
        component={LocationSearchScreen}
      />
      <Stack.Screen
        name="TermsScreen"
        options={{
          headerTitle: "Terms of Use",
        }}
        component={TermsScreen}
      />
      <Stack.Screen
        name="PrivacyScreen"
        options={{
          headerTitle: "Privacy Policy",
        }}
        component={PrivacyScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
