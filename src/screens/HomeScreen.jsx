import { FlatList } from "react-native";
import PostCard from "../components/posts/PostCard";
import { useRef, useState, useCallback } from "react";
import { useAutoScrollToTop } from "../hooks/useAutoScrollToTop";

const demoPosts = [
  {
    id: "1",
    profileImage:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=faces&fit=crop&h=80&w=80",
    username: "johndoe",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1743376272672-c130603a3af2",
    banner:
      "https://images.unsplash.com/photo-1753150972975-0524f7f24888?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 6525,
    comments: 23,
    repeats: 23,
    caption: "Loving this vibe 🌆 #vibe #mountains #snow",
    time: "3 hours ago",
    mood: "happy",
    wearing: "Winter jacket",
    playing: "",
    type: 0,
    listening: "Nature sounds",
    watching: ""
  },
  {
    id: "2",
    profileImage:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&h=80&w=80",
    username: "alexsmith",
    mediaType: "video",
    mediaUrl:
      "https://cdn.coverr.co/videos/user-ai-generation-qMK3Z2p23VxA/360p.mp4",
    likes: 1200,
    comments: 12,
    repeats: 5,
    views: 2542,
    caption: "funny 🤣",
    time: "1 hour ago",
    mood: "excited",
    wearing: "Casual t-shirt",
    playing: "Piano",
    type: 1,
    listening: "Pop music",
    watching: "Comedy show"
  },
  {
    id: "3",
    profileImage:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=faces&fit=crop&h=80&w=80",
    username: "emilyrose",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    likes: 3400,
    comments: 30,
    repeats: 10,
    caption: "Coffee time ☕️",
    time: "2 hours ago",
    mood: "relaxed",
    wearing: "Summer dress",
    playing: "",
    type: 0,
    listening: "Jazz",
    watching: ""
  },
  {
    id: "4",
    profileImage:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=faces&fit=crop&h=80&w=80",
    username: "michaelb",
    mediaType: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    likes: 900,
    comments: 8,
    repeats: 2,
    banner:
      "https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "City lights ✨",
    time: "4 hours ago",
    mood: "inspired",
    wearing: "Business casual",
    playing: "",
    type: 0,
    listening: "Ambient sounds",
    watching: "City view"
  },
  {
    id: "5",
    profileImage:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?crop=faces&fit=crop&h=80&w=80",
    username: "sarahj",
    mediaType: "video",
    mediaUrl: "https://cdn.pixabay.com/video/2025/05/13/278750_tiny.mp4",
    likes: 2100,
    comments: 15,
    repeats: 6,
    views: 1360,
    caption: "Clouds feels 💨",
    time: "5 hours ago",
    mood: "peaceful",
    wearing: "Yoga pants",
    playing: "Guitar",
    type: 1,
    listening: "Nature sounds",
    watching: "Clouds"
  }
];

const HomeScreen = () => {
  const listRef = useRef();
  useAutoScrollToTop(listRef);
  const [viewableItems, setViewableItems] = useState([]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableItems(viewableItems.map((item) => item.item.id));
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 40,
    minimumViewTime: 300,
  };

  return (
    <FlatList
      ref={listRef}
      data={demoPosts}
      renderItem={({ item }) => (
        <PostCard post={item} isViewable={viewableItems.includes(item.id)} />
      )}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

export default HomeScreen;
