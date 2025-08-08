import { useState } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import Input from "../components/Input";
import CommentItem from "../components/comments/CommentItem";
import PostCard from "../components/posts/PostCard";
import Avatar from "../components/Avatar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const post = {
  id: "1",
  profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
  username: "johndoe",
  mediaType: "image",
  mediaUrl: "https://images.unsplash.com/photo-1743376272672-c130603a3af2",
  likes: 6525,
  comments: 23,
  repeats: 54,
  caption: "Loving this vibe 🌆 #vibe #mountains #snow",
  time: "3 hours ago",
  mood: "peaceful",
  wearing: "Yoga pants",
  playing: "Guitar",
  type: 1,
  listening: "Nature sounds",
  watching: "Clouds",
};

const initialComments = [
  {
    id: "c1",
    username: "alex99",
    text: "@johndoe Amazing shot!",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "c2",
    username: "lisa_marie",
    text: "Love this view 🏔️",
    time: "1h ago",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
];

const mentionUsers = [
  {
    username: "alex99",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    username: "lisa_marie",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    username: "johndoe",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const CommentsScreen = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const insets = useSafeAreaInsets();

  const handleCommentChange = (text) => {
    setComment(text);
    const lastWord = text.split(" ").pop();
    if (lastWord.startsWith("@")) {
      setMentionSearch(lastWord.slice(1).toLowerCase());
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectMention = (username) => {
    const words = comment.split(" ");
    words[words.length - 1] = `@${username}`;
    setComment(words.join(" ") + " ");
    setShowMentions(false);
  };

  const handlePostComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        username: "you",
        text: comment,
        time: "just now",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
      };
      setComments([...comments, newComment]);
      setComment("");
      setShowMentions(false);
    }
  };

  const handleReport = (comment) => {
    alert(`Reported comment by ${comment.username}`);
  };

  const filteredMentions = mentionUsers.filter((u) =>
    u.username.toLowerCase().includes(mentionSearch)
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0} // adjust as needed
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                setShowMentions(false);
              }}
            >
              <View>
                <PostCard post={post} />
              </View>
            </TouchableWithoutFeedback>
          }
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                setShowMentions(false);
              }}
            >
              <CommentItem comment={item} onReport={handleReport} />
            </TouchableWithoutFeedback>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="always"
        />

        {showMentions && filteredMentions.length > 0 && (
          <View
            className={`absolute ${insets.bottom > 0 ? "bottom-24" : "bottom-20"} left-3 right-3 max-h-44 bg-white border border-zinc-200 rounded-xl shadow-md z-50`}
          >
            <FlatList
              data={filteredMentions}
              keyExtractor={(item) => item.username}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectMention(item.username)}
                  className="flex-row items-center px-4 py-3"
                  activeOpacity={0.7}
                >
                  <Avatar
                    uri={item.image}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <Text className="text-zinc-800 font-medium text-base">
                    @{item.username}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-zinc-100 mx-4" />
              )}
            />
          </View>
        )}

        <SafeAreaView edges={["bottom"]}>
          <View
            className={`px-3 pt-3 ${insets.bottom > 0 ? "pb-0" : "pb-3"} bg-white`}
          >
            <Input
              value={comment}
              onChangeText={handleCommentChange}
              onSend={handlePostComment}
              placeholder="Write a comment..."
              isCommentInput
              multiline={true}
              minMLHeight={10}
              wrapClass="mb-0"
            />
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentsScreen;
