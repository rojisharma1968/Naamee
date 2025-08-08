import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Feather } from "@expo/vector-icons";
import Avatar from "../Avatar";

const PostHeader = ({ post, onOptionsPress }) => {
  const renderContent = () => (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View className="flex-row items-center bg-white/65 px-2 py-1 rounded-lg">
        <Avatar uri={post.profileImage} className="size-10 mr-2" />
        <Text className="text-zinc-900 font-semibold">{post.username}</Text>
      </View>
      <TouchableOpacity className='bg-white/65 px-2 py-1 rounded-lg' onPress={onOptionsPress}>
        <Feather name="more-horizontal" size={25} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return post.banner ? (
    <ImageBackground
      source={{ uri: post.banner }}
      imageStyle={{ resizeMode: "cover" }}
    >
      {renderContent()}
    </ImageBackground>
  ) : (
    <View className="bg-white">{renderContent()}</View>
  );
};

export default PostHeader;
