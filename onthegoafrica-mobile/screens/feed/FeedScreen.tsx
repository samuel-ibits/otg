// screens/feed/FeedScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import EngagementModal from "../../component/EngagementModal";
import {
  fetchPosts,
  followProfile,
  makeComment,
  toggleReaction,
} from "../../api/api"; // Import the API function

// Keep this in sync with your FeedStack
type FeedStackParamList = {
  FeedMain: undefined;
  UserProfile: { userId?: string } | undefined;
  BusinessProfile: { businessId?: string } | undefined;
};
type Nav = StackNavigationProp<FeedStackParamList, "FeedMain">;

const { width, height } = Dimensions.get("window");
const IMG_H = Math.round(width * 0.66);

type MediaItem = {
  type: "image" | "video";
  source: any;
  thumbnail?: any;
};

type Post = {
  id: string;
  author: string;
  avatar: any;
  timeAgo: string;
  photos: any[];
  media: MediaItem[];
  text: string;
  likes: number;
  comments: number;
  rating: number;
  distance: string;
  tags: {
    icon: "wifi" | "coffee" | "ambience" | "cowork";
    label: string;
    value?: string;
  }[];
  reviewsCount: number;
  sponsored?: boolean;
  isLiked?: boolean;
  followed?: boolean;
  postType?: "user" | "business";
  userId?: number;
  profileId?: number;
};

type Comment = {
  id: string;
  author: string;
  avatar: any;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string; // For replies
  replies?: Comment[]; // Nested replies
};

// Map rating keys from API to tag icons
const ratingKeyToIcon: Record<
  string,
  "wifi" | "coffee" | "ambience" | "cowork"
> = {
  wifi: "wifi",
  coffee: "coffee",
  ambience: "ambience",
  coworking: "cowork",
};

// Helper function to transform API post to app Post format
const transformApiPost = (apiPost: any): Post => {
  const profile = apiPost.profile || apiPost.business;
  const user = apiPost.auther;

  // Transform media URLs to MediaItem format
  const media: MediaItem[] = (apiPost.media || []).map((url: string) => {
    const isVideo =
      url.includes(".mov") || url.includes(".mp4") || url.includes(".MOV");
    return {
      type: isVideo ? "video" : "image",
      source: { uri: url },
      ...(isVideo && { thumbnail: { uri: url } }),
    };
  });

  // Transform rating object to tags array
  const tags = Object.entries(apiPost.rating || {}).map(([key, value]) => {
    const icon = ratingKeyToIcon[key.toLowerCase()] || "wifi";
    return {
      icon,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: `(${value})`,
    };
  });

  // Calculate time ago
  const timeAgo = calculateTimeAgo(apiPost.createdAt);
  console.log(`Post ${apiPost.author.userName}`);

  return {
    id: String(apiPost.id),
    author: apiPost.author.userName || "Anonymous",
    avatar: apiPost.business?.picture
      ? { uri: apiPost.business.picture }
      : apiPost.author?.picture
        ? { uri: apiPost.author.picture }
        : require("../../assets/feed/user1.png"),
    timeAgo,
    photos: media.map((m) => m.source),
    media,
    text: apiPost.body || "",
    likes: apiPost.likes || 0,
    comments: apiPost.comments || 0,
    rating: calculateAverageRating(apiPost.rating),
    distance: "", // You can calculate this based on geoLocation if needed
    tags,
    reviewsCount: 0, // Add this if your API provides it
    isLiked: false,
    followed: false,
    postType: profile?.profileType === "business" ? "business" : "user",
    userId: apiPost.userId,
    profileId: apiPost.profileId,
  };
};

// Helper to calculate average rating
const calculateAverageRating = (ratingObj: any): number => {
  if (!ratingObj || Object.keys(ratingObj).length === 0) return 0;
  const values = Object.values(ratingObj).filter(
    (v) => typeof v === "number"
  ) as number[];
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

// Helper to calculate time ago
const calculateTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const POST_COMMENTS: Record<string, Comment[]> = {};

export default function FeedScreen() {
  const [showEngagement, setShowEngagement] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [allComments, setAllComments] = useState(POST_COMMENTS);
  const [commentsModal, setCommentsModal] = useState<{
    visible: boolean;
    post: Post | null;
  }>({ visible: false, post: null });
  const [fullScreenMedia, setFullScreenMedia] = useState<{
    visible: boolean;
    media: MediaItem[];
    currentIndex: number;
  }>({
    visible: false,
    media: [],
    currentIndex: 0,
  });
  const [actionsModal, setActionsModal] = useState<{
    visible: boolean;
    post: Post | null;
  }>({ visible: false, post: null });
  const [currentUserAvatar, setCurrentUserAvatar] = useState<any>(
    require("../../assets/feed/user1.png")
  );

  // Load posts on mount
  useEffect(() => {
    loadPosts();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userProfileData = await AsyncStorage.getItem("userProfile");
      if (userProfileData) {
        const profile = JSON.parse(userProfileData);
        if (profile.picture) {
          setCurrentUserAvatar({ uri: profile.picture });
        }
      }
    } catch (error) {
      console.error("Error loading current user avatar:", error);
    }
  };

  const loadPosts = async (isRefresh = false) => {
    if (loadingMore || (loading && posts.length > 0 && !isRefresh)) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (posts.length === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = isRefresh ? 0 : offset;
      const response = await fetchPosts({ limit: LIMIT, offset: currentOffset });

      if (!response || !response.posts) {
        if (isRefresh) setPosts([]);
        setHasMore(false);
        return;
      }

      const newPosts = response.posts.map(transformApiPost);

      if (isRefresh) {
        setPosts(newPosts);
        setOffset(newPosts.length);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + newPosts.length);
      }

      setHasMore(newPosts.length === LIMIT);
    } catch (error) {
      console.error("Error loading posts:", error);
      Alert.alert("Error", "Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    await loadPosts(true);
  };

  const handleLike = async (postId: string) => {
    // Optimistically update UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          }
          : p
      )
    );

    try {
      await toggleReaction({
        targetId: postId,
        targetType: "post",
        type: "like",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
            : p
        )
      );
      Alert.alert("Error", "Failed to update like. Please try again.");
    }
  };

  const handleComments = (post: Post) => {
    const postComments = allComments[post.id] || [];
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, comments: postComments.length } : p
      )
    );
    setCommentsModal({ visible: true, post });
  };

  const closeCommentsModal = () =>
    setCommentsModal({ visible: false, post: null });

  const updateComments = (postId: string, comments: Comment[]) => {
    setAllComments((prev) => ({ ...prev, [postId]: comments }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: comments.length } : p
      )
    );
  };

  const handleToggleFollow = async (postId: string | number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, followed: !p.followed } : p))
    );
    try {
      await followProfile(postId);
      console.log("follow clicked");
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleMediaPress = (media: MediaItem[], index: number) => {
    setFullScreenMedia({ visible: true, media, currentIndex: index });
  };

  const closeFullScreenMedia = () => {
    setFullScreenMedia({ visible: false, media: [], currentIndex: 0 });
  };

  const handleMore = (post: Post) => {
    setActionsModal({ visible: true, post });
  };

  const complainSupport = () => {
    setActionsModal({ visible: false, post: null });
    Alert.alert("Support", "Your complaint has been queued.");
  };

  const blockUser = () => {
    const author = actionsModal.post?.author;
    setActionsModal({ visible: false, post: null });
    if (!author) return;
    setPosts((prev) => prev.filter((p) => p.author !== author));
    Alert.alert("Blocked", `You will no longer see posts from ${author}.`);
  };

  const reportPost = () => {
    const pid = actionsModal.post?.id;
    setActionsModal({ visible: false, post: null });
    if (!pid) return;
    Alert.alert("Reported", "Thanks. We will review this post.");
  };

  if (loading) {
    return (
      <SafeAreaView style={s.root}>
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color="#0145FE" />
          <Text style={s.loadingText}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root}>
      <FlatList
        ListHeaderComponent={<Header />}
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) =>
          item.sponsored ? (
            <SponsoredCard onMediaPress={handleMediaPress} />
          ) : (
            <PostCard
              post={item}
              onLike={handleLike}
              onComments={handleComments}
              onFollow={handleToggleFollow}
              onMore={handleMore}
              onMediaPress={handleMediaPress}
            />
          )
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0145FE"
            colors={["#0145FE"]}
          />
        }
        onEndReached={() => {
          if (hasMore && !loading && !loadingMore && !refreshing) {
            loadPosts();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#0145FE" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Text style={s.emptyText}>No posts yet</Text>
            <Text style={s.emptySubText}>Pull down to refresh</Text>
          </View>
        }
      />

      <CommentsModal
        visible={commentsModal.visible}
        post={commentsModal.post}
        comments={
          commentsModal.post ? allComments[commentsModal.post.id] || [] : []
        }
        onClose={closeCommentsModal}
        onUpdateComments={updateComments}
        currentUserAvatar={currentUserAvatar}
      />

      <FullScreenMediaModal
        visible={fullScreenMedia.visible}
        media={fullScreenMedia.media}
        currentIndex={fullScreenMedia.currentIndex}
        onClose={closeFullScreenMedia}
      />

      <PostActionsModal
        visible={actionsModal.visible}
        onClose={() => setActionsModal({ visible: false, post: null })}
        onComplainSupport={complainSupport}
        onBlockUser={blockUser}
        onReportPost={reportPost}
        postTitle={actionsModal.post?.text?.slice(0, 80)}
        username={actionsModal.post?.author}
      />
      <EngagementModal
        visible={showEngagement}
        onClose={() => setShowEngagement(false)}
      />
    </SafeAreaView>
  );
}

function Header() {
  const navigation = useNavigation<any>();

  return (
    <View style={s.headerRow}>
      <Text style={s.headerTitle}>Stay in the loop</Text>
      <TouchableOpacity
        style={s.createPostBtn}
        onPress={() => navigation.navigate("Post")}
        activeOpacity={0.8}
      >
        <Text style={s.createPostText}>＋ Post</Text>
      </TouchableOpacity>
    </View>
  );
}

function PostCard({
  post,
  onLike,
  onComments,
  onFollow,
  onMore,
  onMediaPress,
}: {
  post: Post;
  onLike: (postId: string) => void;
  onComments: (post: Post) => void;
  onFollow: (postId: string) => void;
  onMore?: (post: Post) => void;
  onMediaPress: (media: MediaItem[], index: number) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<Nav>();

  const mediaItems =
    post.media && post.media.length > 0
      ? post.media
      : post.photos.map((photo) => ({ type: "image" as const, source: photo }));

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(contentOffset / width);
    setCurrentImageIndex(imageIndex);
  };

  const fmt = (n: number) => {
    if (n < 1000) return String(n);
    if (n < 10000) return (n / 1000).toFixed(1) + "k";
    return Math.round(n / 1000) + "k";
  };

  const goToProfile = () => {
    if (post.postType === "business") {
      navigation.navigate("BusinessProfile", { businessId: post.profileId });
    } else {
      navigation.navigate("UserProfile", { userId: post.userId });
    }
  };

  const isBusinessPost = post.postType === "business";

  return (
    <View style={s.card}>
      <View style={s.authorRow}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            onPress={goToProfile}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 1,
            }}
          >
            <Image source={post.avatar} style={s.avatar} />
            <View style={{ marginRight: 8 }}>
              <Text style={s.author} numberOfLines={1}>
                {post.author}
              </Text>
              {isBusinessPost && <Text style={s.businessLabel}>Business</Text>}
            </View>
          </TouchableOpacity>

          <FollowButton
            followed={!!post.followed}
            onPress={() => onFollow(post.id)}
          />
        </View>

        <TouchableOpacity onPress={() => onMore?.(post)} style={{ padding: 8 }}>
          <Image
            source={require("../../assets/feed/more.png")}
            style={{ width: 5, height: 18, tintColor: "#1F2533" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {mediaItems.length > 0 && (
        <View style={s.imageWrap}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {mediaItems.map((mediaItem, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => onMediaPress(mediaItems, index)}
              >
                {mediaItem.type === "video" ? (
                  <VideoThumbnail mediaItem={mediaItem} />
                ) : (
                  <ImageBackground
                    source={mediaItem.source}
                    style={s.image}
                    imageStyle={s.imageRadius}
                  >
                    <TouchableOpacity style={s.bookmarkBtn}>
                      <Image
                        source={require("../../assets/feed/bookmark.png")}
                        style={{ width: 18, height: 18, tintColor: "#1F2533" }}
                      />
                    </TouchableOpacity>
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.5)"]}
                      style={s.imgGradient}
                    />
                  </ImageBackground>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {mediaItems.length > 1 ? (
            <View style={s.dotsRow}>
              {mediaItems.map((_, index) => (
                <View
                  key={index}
                  style={[s.dot, index === currentImageIndex && s.dotActive]}
                />
              ))}
            </View>
          ) : null}
        </View>
      )}

      <View style={s.actionsRow}>
        <TouchableOpacity onPress={() => onLike(post.id)}>
          <IconText
            icon={require("../../assets/feed/like.png")}
            label={fmt(post.likes)}
            isLiked={post.isLiked}
          />
        </TouchableOpacity>
        <View style={{ width: 18 }} />
        <TouchableOpacity onPress={() => onComments(post)}>
          <IconText
            icon={require("../../assets/feed/comment.png")}
            label={fmt(post.comments)}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {!isBusinessPost && post.rating > 0 && <Stars value={post.rating} />}
      </View>

      <Text style={s.text} numberOfLines={3}>
        {post.text}
      </Text>

      {!isBusinessPost && post.tags.length > 0 && (
        <View style={s.detailCard}>
          <View style={s.topRow}>
            <View style={{ flexShrink: 1, paddingRight: 8 }}>
              <Text style={s.titleDark} numberOfLines={1}>
                {post.author}
              </Text>
              {post.distance && (
                <Text style={s.distanceBlue} numberOfLines={1}>
                  {post.distance}
                </Text>
              )}
            </View>
            {post.rating > 0 && (
              <View style={s.ratingRight}>
                <Stars value={post.rating} />
                {post.reviewsCount > 0 && (
                  <Text style={s.countDark}>{post.reviewsCount}</Text>
                )}
              </View>
            )}
          </View>

          <TagRows tags={post.tags} />

          <View style={s.visitRow}>
            <View />
            <TouchableOpacity onPress={goToProfile}>
              <Text style={s.visitLink}>Visit profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={s.time}>{post.timeAgo}</Text>
    </View>
  );
}

function VideoThumbnail({ mediaItem }: { mediaItem: MediaItem }) {
  return (
    <ImageBackground
      source={mediaItem.thumbnail || mediaItem.source}
      style={s.image}
      imageStyle={s.imageRadius}
    >
      <TouchableOpacity style={s.bookmarkBtn}>
        <Image
          source={require("../../assets/feed/bookmark.png")}
          style={{ width: 18, height: 18, tintColor: "#1F2533" }}
        />
      </TouchableOpacity>

      <View style={s.playButtonOverlay}>
        <View style={s.playButton}>
          <Image
            source={require("../../assets/icons/play.png")}
            style={s.playIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)"]}
        style={s.imgGradient}
      />
    </ImageBackground>
  );
}

function FullScreenMediaModal({
  visible,
  media,
  currentIndex,
  onClose,
}: {
  visible: boolean;
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  React.useEffect(() => {
    if (visible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: activeIndex * width,
          animated: false,
        });
      }, 100);
    }
  }, [visible, activeIndex]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setActiveIndex(index);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={s.fullScreenOverlay}>
        <TouchableOpacity
          style={s.fullScreenCloseBtn}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/icons/close.png")}
            style={s.fullScreenCloseIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {media.map((mediaItem, index) => (
            <View key={index} style={s.fullScreenMediaContainer}>
              {mediaItem.type === "video" ? (
                <Video
                  source={mediaItem.source}
                  style={s.fullScreenVideo}
                  useNativeControls
                  shouldPlay={index === activeIndex}
                  isLooping
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={mediaItem.source}
                  style={s.fullScreenImage}
                  resizeMode="contain"
                />
              )}
            </View>
          ))}
        </ScrollView>

        {media.length > 1 && (
          <View style={s.fullScreenDotsContainer}>
            {media.map((_, index) => (
              <View
                key={index}
                style={[
                  s.fullScreenDot,
                  index === activeIndex && s.fullScreenDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}

function TagRows({
  tags,
}: {
  tags: {
    icon: "wifi" | "coffee" | "ambience" | "cowork";
    label: string;
    value?: string;
  }[];
}) {
  const first = tags.slice(0, 2);
  const second = tags.slice(2);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={s.tagRowInline}>
        {first.map((t, i) => (
          <React.Fragment key={`r1-${t.label}-${i}`}>
            {i > 0 && <View style={s.bulletDot} />}
            <TagItem t={t} />
          </React.Fragment>
        ))}
      </View>
      {second.length > 0 && (
        <View style={[s.tagRowInline, { marginTop: 6 }]}>
          {second.map((t, i) => (
            <React.Fragment key={`r2-${t.label}-${i}`}>
              {i > 0 && <View style={s.bulletDot} />}
              <TagItem t={t} />
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

function TagItem({
  t,
}: {
  t: {
    icon: "wifi" | "coffee" | "ambience" | "cowork";
    label: string;
    value?: string;
  };
}) {
  const map: { [k in "wifi" | "coffee" | "ambience" | "cowork"]: any } = {
    wifi: require("../../assets/feed/wifi.png"),
    coffee: require("../../assets/feed/coffee.png"),
    ambience: require("../../assets/feed/ambience.png"),
    cowork: require("../../assets/feed/cowork.png"),
  };

  return (
    <View style={s.tagInline}>
      <Image source={map[t.icon]} style={s.tagIconGreen} />
      <Text style={s.tagTextDark}>
        {t.label} {t.value ?? ""}
      </Text>
    </View>
  );
}

function CommentsModal({
  visible,
  post,
  comments: initialComments = [],
  onClose,
  onUpdateComments,
  currentUserAvatar,
}: {
  visible: boolean;
  post: Post | null;
  comments: Comment[];
  onClose: () => void;
  onUpdateComments: (postId: string, comments: Comment[]) => void;
  currentUserAvatar: any;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments, post]);

  const handleLikeComment = async (commentId: string) => {
    // Optimistically update UI
    const updated = comments.map((c) =>
      c.id === commentId
        ? {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
        }
        : c
    );
    setComments(updated);
    if (post) onUpdateComments(post.id, updated);

    try {
      // Call API to toggle comment reaction
      await toggleReaction({
        targetId: Number(commentId),
        targetType: "comment",
        type: "like",
      });
    } catch (error) {
      console.error("Error toggling comment like:", error);
      // Revert on error
      setComments(comments);
      if (post) onUpdateComments(post.id, comments);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare request data
      const requestData: {
        postId: number;
        body: string;
        parentId?: number;
      } = {
        postId: Number(post.id),
        body: newComment.trim(),
      };

      // Add parentId if replying to a comment
      if (replyingTo) {
        requestData.parentId = Number(replyingTo.id);
      }

      // Call API to create comment or reply
      const response = await makeComment(requestData);

      // Create comment object from response
      const c: Comment = {
        id: String(response.comment?.id || Date.now()),
        author: "You",
        avatar: currentUserAvatar,
        text: newComment.trim(),
        timeAgo: "now",
        likes: 0,
        isLiked: false,
        parentId: replyingTo?.id,
      };

      const updated = [c, ...comments];
      setComments(updated);
      onUpdateComments(post.id, updated);
      setNewComment("");
      setReplyingTo(null);
      Keyboard.dismiss();

      // Show success message
      const message = replyingTo
        ? "Reply posted successfully!"
        : "Comment posted successfully!";
      Alert.alert("Success", message);
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setNewComment(`@${comment.author} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.modalOverlay}>
        <KeyboardAvoidingView
          style={s.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        >
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Comments ({comments.length})</Text>
              <TouchableOpacity
                onPress={onClose}
                style={s.closeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={s.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={s.commentsList}
              contentContainerStyle={s.commentsListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onLike={() => handleLikeComment(c.id)}
                  onReply={() => handleReply(c)}
                />
              ))}
            </ScrollView>

            {replyingTo && (
              <View style={s.replyingToContainer}>
                <Text style={s.replyingToText}>
                  Replying to @{replyingTo.author}
                </Text>
                <TouchableOpacity onPress={cancelReply}>
                  <Text style={s.cancelReplyText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={s.addCommentContainer}>
              <Image source={currentUserAvatar} style={s.commentAvatar} />
              <TextInput
                style={s.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#92A2BA"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={[
                  s.sendButton,
                  { opacity: newComment.trim() && !isSubmitting ? 1 : 0.5 },
                ]}
                disabled={!newComment.trim() || isSubmitting}
              >
                <Text style={s.sendButtonText}>
                  {isSubmitting ? "Posting..." : "Post"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function CommentItem({
  comment,
  onLike,
  onReply,
}: {
  comment: Comment;
  onLike: () => void;
  onReply?: () => void;
}) {
  return (
    <View style={s.commentItem}>
      <Image source={comment.avatar} style={s.commentAvatar} />
      <View style={s.commentContent}>
        <View style={s.commentBubble}>
          <Text style={s.commentAuthor}>{comment.author}</Text>
          <Text style={s.commentText}>{comment.text}</Text>
        </View>
        <View style={s.commentActions}>
          <Text style={s.commentTime}>{comment.timeAgo}</Text>
          <TouchableOpacity onPress={onLike} style={s.commentLikeBtn}>
            <Image
              source={require("../../assets/feed/like.png")}
              style={[
                s.commentLikeIcon,
                { tintColor: comment.isLiked ? "#FF3040" : "#A5B1C6" },
              ]}
            />
            <Text style={s.commentLikes}>{comment.likes}</Text>
          </TouchableOpacity>
          {onReply && (
            <TouchableOpacity onPress={onReply} style={s.commentReplyBtn}>
              <Text style={s.commentReplyText}>Reply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

function SponsoredCard({
  onMediaPress,
}: {
  onMediaPress: (media: MediaItem[], index: number) => void;
}) {
  const sponsoredMedia = [
    {
      type: "image" as const,
      source: require("../../assets/feed/sponsored-banner.png"),
    },
  ];

  return (
    <View style={{ paddingHorizontal: 12, marginTop: 8, marginBottom: 14 }}>
      <TouchableOpacity
        onPress={() => onMediaPress(sponsoredMedia, 0)}
        activeOpacity={0.9}
      >
        <Image
          source={require("../../assets/feed/sponsored-banner.png")}
          style={{ width: "100%", height: IMG_H * 0.7, borderRadius: 14 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text style={s.sponsored}>Sponsored ad</Text>
    </View>
  );
}

function FollowButton({
  followed,
  onPress,
}: {
  followed: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.followBtn, followed && { backgroundColor: "#0145FE14" }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Text style={[s.followText, followed && { color: "#0A1220" }]}>
        {followed ? "Following" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
}

function IconText({
  icon,
  label,
  isLiked,
}: {
  icon: any;
  label: string;
  isLiked?: boolean;
}) {
  return (
    <View style={s.iconText}>
      <Image
        source={icon}
        style={[s.icon, { tintColor: isLiked ? "#FF3040" : "#A5B1C6" }]}
      />
      <Text style={s.iconLabel}>{label}</Text>
    </View>
  );
}

function Stars({ value, small }: { value: number; small?: boolean }) {
  const items = [0, 1, 2, 3, 4];
  return (
    <View style={[s.starsRow, small && { transform: [{ scale: 0.9 }] }]}>
      {items.map((i) => (
        <Image
          key={i}
          source={require("../../assets/feed/star.png")}
          style={[s.star, { tintColor: i < value ? "#FFC107" : "#E3E9F3" }]}
        />
      ))}
    </View>
  );
}

function PostActionsModal({
  visible,
  onClose,
  onComplainSupport,
  onBlockUser,
  onReportPost,
  postTitle,
  username,
}: {
  visible: boolean;
  onClose?: () => void;
  onComplainSupport?: () => void;
  onBlockUser?: () => void;
  onReportPost?: () => void;
  postTitle?: string;
  username?: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={sA.overlay}>
        <View style={sA.sheet}>
          <TouchableOpacity
            style={sA.close}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={sA.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={sA.title}>More options</Text>
          {postTitle ? <Text style={sA.sub}>{postTitle}</Text> : null}
          {username ? <Text style={sA.subMuted}>by @{username}</Text> : null}

          <View style={sA.list}>
            <ActionRow
              emoji="🛟"
              label="Complain to support"
              desc="Tell support what went wrong"
              onPress={onComplainSupport}
            />
            <View style={sA.divider} />
            <ActionRow
              emoji="🚫"
              label="Block user"
              desc="Hide posts and messages from this user"
              onPress={onBlockUser}
              danger
            />
            <View style={sA.divider} />
            <ActionRow
              emoji="🚩"
              label="Report post"
              desc="Flag this post for review"
              onPress={onReportPost}
              danger
            />
          </View>

          <TouchableOpacity
            style={sA.cancel}
            onPress={onClose}
            activeOpacity={0.9}
          >
            <Text style={sA.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ActionRow({
  emoji,
  label,
  desc,
  onPress,
  danger,
}: {
  emoji: string;
  label: string;
  desc?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={sA.row} onPress={onPress} activeOpacity={0.9}>
      <Text style={sA.emoji}>{emoji}</Text>
      <View style={sA.rowText}>
        <Text style={[sA.rowLabel, danger && sA.rowDanger]}>{label}</Text>
        {desc ? <Text style={sA.rowDesc}>{desc}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const DIST = "#5E8BFF";
const DARK = "#111827";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#A9B6CC", fontFamily: "RCB-Bold", fontSize: 14 },
  link: { color: "#9FB7FF", fontFamily: "RCB-SemiBold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: MUTED,
    fontFamily: "RCB-Medium",
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
  emptySubText: {
    marginTop: 8,
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 18,
    borderRadius: 16,
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  avatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  author: {
    color: "#1E293B",
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
    maxWidth: width * 0.45,
  },
  businessLabel: {
    color: "#0145FE",
    fontFamily: "RCB-Medium",
    fontSize: 11,
    marginTop: 1,
    backgroundColor: "#E6ECFF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  followBtn: {
    backgroundColor: "#E6ECFF80",
    paddingHorizontal: 14,
    height: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  followText: { color: "#0145FE", fontFamily: "RCB-SemiBold", fontSize: 12 },
  imageWrap: { paddingHorizontal: 12, paddingTop: 8, position: "relative" },
  image: { width: width - 24, height: IMG_H, justifyContent: "flex-end" },
  imageRadius: { borderRadius: 12 },
  bookmarkBtn: {
    position: "absolute",
    right: 14,
    top: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFFDD",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D8DEEA" },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: "#FFFFFF" },
  imgGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    width: 24,
    height: 24,
    tintColor: "#0145FE",
    marginLeft: 3,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
    justifyContent: "center",
  },
  fullScreenCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreenCloseIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  fullScreenMediaContainer: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  fullScreenVideo: {
    width: width,
    height: height * 0.8,
  },
  fullScreenDotsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  fullScreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  fullScreenDotActive: {
    backgroundColor: "#FFFFFF",
    width: 20,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  iconText: { flexDirection: "row", alignItems: "center" },
  icon: { width: 18, height: 18, tintColor: "#A5B1C6", marginRight: 6 },
  iconLabel: { color: "#94A3B8", fontFamily: "RCB-Medium" },
  starsRow: { flexDirection: "row", alignItems: "center" },
  star: { width: 14, height: 14, marginLeft: 4 },
  text: {
    color: "#334155",
    fontFamily: "RCB-Regular",
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 10,
    marginHorizontal: 12,
  },
  detailCard: {
    marginTop: 10,
    alignSelf: "stretch",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E6ECF5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleDark: { color: DARK, fontFamily: "RCB-Bold", fontSize: 18 },
  distanceBlue: {
    marginTop: 2,
    color: DIST,
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
  },
  ratingRight: { flexDirection: "row", alignItems: "center" },
  countDark: {
    marginLeft: 6,
    color: DARK,
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
  tagRowInline: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    marginTop: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#36465F",
    marginHorizontal: 10,
  },
  tagInline: { flexDirection: "row", alignItems: "center" },
  tagIconGreen: { width: 16, objectFit: "contain", height: 16, marginRight: 6 },
  tagTextDark: { color: "#334155", fontFamily: "RCB-Medium", fontSize: 15 },
  visitRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  visitLink: {
    color: "#36465F",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  time: {
    color: "#92A2BA",
    fontFamily: "RCB-Regular",
    fontSize: 12,
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 6,
  },
  sponsored: {
    color: "#8FA4C0",
    fontFamily: "RCB-Regular",
    fontSize: 11,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: { flex: 1, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalTitle: { fontSize: 18, fontFamily: "RCB-Bold", color: TEXT },
  closeButton: { padding: 8 },
  closeText: { fontSize: 24, lineHeight: 24, color: MUTED },
  commentsList: { flex: 1 },
  commentsListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  commentContent: { flex: 1 },
  commentBubble: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    padding: 12,
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: "RCB-SemiBold",
    color: TEXT,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: "RCB-Regular",
    color: TEXT,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },
  commentTime: {
    fontSize: 12,
    fontFamily: "RCB-Regular",
    color: MUTED,
    marginRight: 16,
  },
  commentLikeBtn: { flexDirection: "row", alignItems: "center" },
  commentLikeIcon: { width: 14, height: 14, marginRight: 4 },
  commentLikes: { fontSize: 12, fontFamily: "RCB-Medium", color: MUTED },
  commentReplyBtn: { marginLeft: 16 },
  commentReplyText: {
    fontSize: 12,
    fontFamily: "RCB-SemiBold",
    color: BLUE,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#F0F4FF",
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  replyingToText: {
    fontSize: 13,
    fontFamily: "RCB-Medium",
    color: TEXT,
  },
  cancelReplyText: {
    fontSize: 13,
    fontFamily: "RCB-SemiBold",
    color: BLUE,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 14,
    fontFamily: "RCB-Regular",
    color: TEXT,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: { color: "#fff", fontSize: 14, fontFamily: "RCB-SemiBold" },
  createPostBtn: {
    backgroundColor: "#F4F7FB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7EEF8",
  },
  createPostText: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
  },
});

const sA = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeX: {
    fontSize: 24,
    lineHeight: Platform.OS === "ios" ? 24 : 26,
    color: "#617291",
  },
  title: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 6,
  },
  sub: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  subMuted: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  list: {
    marginTop: 14,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  emoji: { fontSize: 18, marginRight: 10 },
  rowText: { flex: 1 },
  rowLabel: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 15 },
  rowDesc: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 12,
    marginTop: 2,
  },
  rowDanger: { color: "#B91C1C" },
  divider: { height: 1, backgroundColor: BORDER },
  cancel: {
    marginTop: 14,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: "#FFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
