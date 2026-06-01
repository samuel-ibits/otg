import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, getAuthHeaders, handleApiError, apiRequest } from "../api/utils";

// ==========================================
// 1. HELPERS & AUTH
// ==========================================

// ==========================================
// 2. PROFILE MANAGEMENT
// ==========================================

// Fetch Profile API endpoint
export const fetchProfile = async () => {
  try {
    const data = await apiRequest('get', 'profile/fetch');

    // --- Save to AsyncStorage ---
    if (data.data.profile && data.data.profile.id) {
      await AsyncStorage.setItem('profileId', data.data.profile.id.toString());
      await AsyncStorage.setItem('userProfile', JSON.stringify(data.data.profile));
    }
    return data.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch profile");
  }
};

// Login API endpoint - Modified to save token to AsyncStorage
export const loginUser = async (email: string, password: string) => {
  try {
    const data = await apiRequest('post', 'auth/login', { email, password });

    // Save token to AsyncStorage for future use
    if (data.data.token) {
      await AsyncStorage.setItem('authToken', data.data.token);
    }
    // Save user data to AsyncStorage if needed
    if (data.data.user) {
      await AsyncStorage.setItem('authUser', JSON.stringify(data.data.user));
    }
    // Persist profile info when present on response
    if (data.data.profile) {
      await AsyncStorage.setItem('profileId', String(data.data.profile.id));
      await AsyncStorage.setItem('userProfile', JSON.stringify(data.data.profile));
    }
    // Fallback: sometimes profile is nested under user
    const nestedProfileId = data.data?.user?.profile?.id
      ?? data.data?.user?.profileId
      ?? data.data?.user?.profile_id;
    if (nestedProfileId) {
      await AsyncStorage.setItem('profileId', String(nestedProfileId));
    }

    return data;
  } catch (error) {
    handleApiError(error, "Login failed");
  }
};

// Register API endpoint
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone_number: string;
  referral_code?: string;
}) => {
  try {
    return await apiRequest('post', 'auth/register', userData);
  } catch (error) {
    handleApiError(error, "Registration failed");
  }
};

export const verifyEmail = async (code: string, email: string) => {
  try {
    const data = await apiRequest('post', 'auth/verify-email', { code, email });
    // Save token to AsyncStorage after email verification
    if (data.data && typeof data.data === 'string') {
      await AsyncStorage.setItem('authToken', data.data);
    }
    return data;
  } catch (error) {
    handleApiError(error, "Email verification failed");
  }
};

export const sendVerificationCode = async (email: string) => {
  try {
    return await apiRequest('post', 'auth/send-code', { email });
  } catch (error) {
    handleApiError(error, "Failed to send verification code");
  }
};

// Create User Profile with Auth Token
export const createUserProfile = async (profileData: {
  userName?: string;
  bio?: string;
  profession?: string;
  skills?: string[];
  gender?: string;
  profileType: string;
  picture?: any;
  image?: any;
  is_student?: boolean;
  university?: string;
  hobbies?: string[];
  interests?: string[];
  places?: string[];
}) => {
  try {
    const formData = new FormData();
    formData.append('userName', profileData.userName ?? "Anonymous User");
    formData.append('bio', profileData.bio ?? "No bio provided yet.");
    formData.append('profession', profileData.profession ?? "Not specified");
    formData.append('profileType', String(profileData.profileType));

    if (profileData.gender) formData.append('gender', profileData.gender);
    if (Array.isArray(profileData.skills) && profileData.skills.length > 0) {
      const skillNames = profileData.skills.map(skill => skill.name);
      formData.append('skills', JSON.stringify(skillNames));
    }

    const hobbies = profileData.hobbies?.length ? profileData.hobbies : profileData.interests?.length ? profileData.interests : [];
    if (hobbies.length > 0) formData.append('interests', JSON.stringify(hobbies));
    if (Array.isArray(profileData.places) && profileData.places.length > 0) formData.append('placesVisited', JSON.stringify(profileData.places));
    if (profileData.is_student !== undefined) formData.append('is_student', String(profileData.is_student));
    if (profileData.university) formData.append('university', profileData.university);

    if (profileData.picture) {
      formData.append('picture', {
        uri: profileData.picture.uri,
        type: profileData.picture.type || 'image/jpeg',
        name: profileData.picture.fileName || `picture-${Date.now()}.jpg`,
      } as any);
    }
    if (profileData.image) {
      formData.append('image', {
        uri: profileData.image.uri,
        type: profileData.image.type || 'image/jpeg',
        name: profileData.image.fileName || `image-${Date.now()}.jpg`,
      } as any);
    }

    const data = await apiRequest('post', 'profile/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (data.data.token) await AsyncStorage.setItem('authUser', JSON.stringify(data.data.token));
    if (data.data.profile && data.data.profile.id) {
      await AsyncStorage.setItem('profileId', data.data.profile.id.toString());
      await AsyncStorage.setItem('userProfile', JSON.stringify(data.data.profile));
    }
    return data.data;
  } catch (error) {
    handleApiError(error, "Profile creation failed");
  }
};

// Create Business Profile with Auth Token
export const createBusinessProfile = async (profileData: {
  userName: string;
  picture?: any;
  streetAddress: string;
  geoLocation: number[];
  state: string;
  city: string;
  country: string;
  businessCategory: string;
  profileType: string;
  cacNo?: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("userName", profileData.userName || "");
    formData.append("profileType", profileData.profileType || "business");
    formData.append("streetAddress", profileData.streetAddress || "");
    formData.append("state", profileData.state || "");
    formData.append("city", profileData.city || "");
    formData.append("country", profileData.country || "");
    formData.append("businessCategory", profileData.businessCategory || "");
    if (profileData.cacNo) formData.append("cacNo", profileData.cacNo);

    const data = await apiRequest('post', 'profile/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (data.profile && data.profile.id) {
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem("profileId", data.profile.id.toString());
      await AsyncStorage.setItem("userProfile", JSON.stringify(data.profile));
    }
    return data;
  } catch (error) {
    handleApiError(error, "Business profile creation failed");
  }
};


// Upload document endpoint with Auth Token
export const uploadDocument = async (documentData: {
  document: any;
  documentType: string;
}) => {
  try {
    const formData = new FormData();
    formData.append('documentType', documentData.documentType);

    if (documentData.document) {
      formData.append('document', {
        uri: documentData.document.uri,
        type: documentData.document.type || 'application/pdf',
        name: documentData.document.fileName || `document-${Date.now()}.pdf`,
      } as any);
    }

    return await apiRequest('post', 'profile/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } catch (error) {
    handleApiError(error, "Document upload failed");
  }
};
export const addMoreInformation = async (infoData: {
  bio: string;
  businessType: string;
  website: string;
}) => {
  try {
    return await apiRequest('post', 'profile/add-more-information', infoData);
  } catch (error) {
    handleApiError(error, "Failed to add more information");
  }
};

// Add social media links endpoint with Auth Token
export const addSocialMedia = async (socialData: {
  socials: {
    instagram?: string;
    twitter?: string;
    website?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  profileId?: number;
}) => {
  try {
    if (!socialData.profileId) {
      const stored = await AsyncStorage.getItem('profileId');
      if (stored) socialData.profileId = parseInt(stored);
    }
    return await apiRequest('post', 'profile/socials', socialData);
  } catch (error) {
    handleApiError(error, "Failed to add social media links");
  }
};

// Add reward redeem hours endpoint with Auth Token
export const addRewardRedeemHours = async (hoursData: {
  hours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }>;
  profileId?: number;
}) => {
  try {
    if (!hoursData.profileId) {
      const stored = await AsyncStorage.getItem('profileId');
      if (stored) hoursData.profileId = parseInt(stored);
    }
    return await apiRequest('post', 'profile/reward-redeem-hours', hoursData);
  } catch (error) {
    handleApiError(error, "Failed to add reward redeem hours");
  }
};

// Add opening hours endpoint with Auth Token
export const addOpeningHours = async (hoursData: {
  hours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }>;
  profileId?: number;
}) => {
  try {
    if (!hoursData.profileId) {
      const stored = await AsyncStorage.getItem('profileId');
      if (stored) hoursData.profileId = parseInt(stored);
    }
    return await apiRequest('post', 'profile/opening-hours', hoursData);
  } catch (error) {
    handleApiError(error, "Failed to add opening hours");
  }
};

// Add WiFi details endpoint with Auth Token
export const addWifiDetails = async (wifiData: {
  name: string;
  password: string;
  profileId?: number;
}) => {
  try {
    if (!wifiData.profileId) {
      const stored = await AsyncStorage.getItem('profileId');
      if (stored) wifiData.profileId = parseInt(stored);
    }
    return await apiRequest('post', 'profile/wifi', wifiData);
  } catch (error) {
    handleApiError(error, "Failed to add WiFi details");
  }
};

// Update interests and places endpoint with Auth Token
export const updateInterestsAndPlaces = async (payload: {
  interests?: string[];
  placesVisited?: string[];
  profileId?: number;
}) => {
  try {
    if (!payload.profileId) {
      const stored = await AsyncStorage.getItem('profileId');
      if (stored) payload.profileId = parseInt(stored);
    }
    return await apiRequest('post', 'profile/interests-places', payload);
  } catch (error) {
    handleApiError(error, 'Failed to update interests and places');
  }
};

// Helper function to check if user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
};

// Create Post endpoint with Auth Token
export const createReviewPost = async (postData: {
  body: string;
  postType?: string;
  reviewTarget?: string | null;
  media?: any[];
  amenities?: Record<string, number>;
  rating?: number;
  ratingDescription?: string;
}) => {
  try {
    const formData = new FormData();
    formData.append('body', postData.body);
    formData.append('postType', postData.postType || 'review');

    if (postData.reviewTarget != null) formData.append('reviewTarget', String(postData.reviewTarget));
    if (typeof postData.rating === 'number') formData.append('rating', String(postData.rating));
    if (postData.ratingDescription) formData.append('ratingDescription', postData.ratingDescription);
    if (postData.amenities && Object.keys(postData.amenities).length > 0) formData.append('amenities', JSON.stringify(postData.amenities));

    if (postData.media && postData.media.length > 0) {
      postData.media.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `post-${Date.now()}-${index}.jpg`,
        } as any);
      });
    }

    return await apiRequest('post', 'app/create-post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } catch (error) {
    handleApiError(error, "Post creation failed");
  }
};



// ==========================================
// 5. SEARCH & DISCOVERY
// ==========================================

/**
 * Global Search across the platform (primarily used for businesses)
 */
export const performGlobalSearch = async (params: { q: string; offset?: number; limit?: number }) => {
  try {
    return await apiRequest('get', 'search/global', null, { params });
  } catch (error) {
    handleApiError(error, "Global search failed");
  }
};

/**
 * Discover businesses and amenities
 */
export const discoverSearch = async (params: {
  type?: string;
  amenity?: string;
  query?: string;
  near_me?: boolean;
  lat?: number;
  lng?: number;
  sort?: string;
  partners_only?: boolean;
}) => {
  try {
    return await apiRequest('get', 'search/discover', null, { params });
  } catch (error) {
    console.log(error);
    handleApiError(error, "Discovery search failed");
  }
};

// Fetch Business Profiles endpoint with pagination
export const fetchBusinessProfiles = async (params: {
  search?: string;
  type?: string;
  offset?: number;
  location?: string;
  limit?: number;
}) => {
  try {
    // Prefer POST per backend endpoint
    return await apiRequest('post', 'app/fetch-profiles', params);
  } catch (error) {
    // If POST fails, apiRequest will handle the error. 
    // The previous implementation had a GET fallback, but apiRequest standardizes on the documented method.
    handleApiError(error, "Failed to fetch business profiles");
  }
};

// Alternative simpler version with default parameters
export const getBusinessProfiles = async (
  search: string = '',
  profileType: string = 'business',
  offset: number = 0,
  limit: number = 20
) => {
  try {
    return await apiRequest('get', 'app/fetch-profiles', null, {
      params: { search, type: profileType, offset, limit }
    });
  } catch (error) {
    handleApiError(error, "Failed to fetch business profiles");
  }
};

// Helper function to logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
    await AsyncStorage.removeItem('profileId');
    await AsyncStorage.removeItem('userProfile');
    console.log("User logged out successfully", await AsyncStorage.getItem("authUser"));
  } catch (error) {
    console.log("Error during logout:", error);
    throw new Error("Logout failed");
  }
};

// Helper function to get current user data
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('authUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

// Helper function to get saved profile ID
export const getProfileId = async (): Promise<number | null> => {
  try {
    // Primary: directly stored
    const direct = await AsyncStorage.getItem('profileId');
    if (direct) return parseInt(direct);
    // Fallback from saved profile
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (profileJson) {
      const prof = JSON.parse(profileJson);
      if (prof?.id) return Number(prof.id);
    }
    // Fallback from auth user
    const userJson = await AsyncStorage.getItem('authUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      const id = user?.profile?.id ?? user?.profileId ?? user?.profile_id;
      if (id) return Number(id);
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Helper function to get saved profile data
export const getSavedProfile = async () => {
  try {
    const profileData = await AsyncStorage.getItem('userProfile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    return null;
  }
};

// Update Profile API endpoint
export const updateProfile = async (profileData: {
  userName?: string;
  bio?: string;
  profession?: string;
  skills?: string[];
  gender?: string;
  profileType?: string;
  picture?: string;
}) => {
  try {
    const data = await apiRequest('post', 'profile/update', profileData);
    if (data.profile) {
      await AsyncStorage.setItem('userProfile', JSON.stringify(data.profile));
    }
    return data;
  } catch (error) {
    handleApiError(error, "Profile update failed");
  }
};


// Fetch Posts API endpoint
export const fetchPosts = async (params: { limit?: number; offset?: number } = {}) => {
  try {
    const data = await apiRequest('get', 'app/fetch-posts', null, { params });
    return data.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch posts");
  }
};


/**
 * Toggle reaction (like, love, etc.) on a post, comment, or other target
 */
export const toggleReaction = async (
  data: {
    targetId: number | string,
    targetType: string,
    type: string
  }
) => {
  try {
    return await apiRequest('post', 'app/toggle-reaction', data);
  } catch (error) {
    handleApiError(error, "Failed to toggle reaction");
  }
};

/**
 * Make a comment or reply to a comment
 */
export const makeComment = async (
  data: {
    postId: number,
    body: string,
    parentId?: number
  }
) => {
  try {
    return await apiRequest('post', 'app/make-comment', data);
  } catch (error) {
    handleApiError(error, "Failed to post comment");
  }
};
// ==========================================
// 3. SOCIAL (POSTS, FEED, SOCIAL GRAPH)
// ==========================================

/**
 * Follow a user profile
 */
export const followProfile = async (userId: string | number) => {
  try {
    return await apiRequest('post', `social/follow/${userId}`);
  } catch (error) {
    handleApiError(error, "Failed to follow profile");
  }
};

/**
 * Unfollow a user profile
 */
export const unfollowProfile = async (userId: string | number) => {
  try {
    return await apiRequest('post', `social/unfollow/${userId}`);
  } catch (error) {
    handleApiError(error, "Failed to unfollow profile");
  }
};

// ==========================================
// 4. BUSINESS & BRANCHES
// ==========================================

export const fetchBranchDetails = async (branchId: string | number) => {
  try {
    const data = await apiRequest('get', `app/${branchId}/branch`);
    return data.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch branch details");
  }
};

export const filterBranchProducts = async (params: {
  branchId: string | number;
  featured?: boolean;
  amenityId?: string;
  limit?: number;
}) => {
  try {
    const data = await apiRequest('get', 'app/branch/filter', null, { params });
    console.log("filtered services", data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    handleApiError(error, "Failed to filter branch products");
  }
};

/**
 * Get followers list
 */
export const getFollowers = async () => {
  try {
    return await apiRequest('get', 'social/followers');
  } catch (error) {
    handleApiError(error, "Failed to get followers");
  }
};

/**
 * Get following list
 */
export const getFollowing = async () => {
  try {
    return await apiRequest('get', 'social/following');
  } catch (error) {
    handleApiError(error, "Failed to get following list");
  }
};

/**
 * Get follow suggestions
 */
export const getFollowSuggestions = async () => {
  try {
    return await apiRequest('get', 'social/suggestions/following');
  } catch (error) {
    handleApiError(error, "Failed to get suggestions");
  }
};
/**
 * Submit user's interests and places visited
 */
export const submitInterestsAndPlaces = async (
  interests: string[],
  placesVisited: string[]
) => {
  try {
    const data = await apiRequest('post', 'profile/interests-places', { interests, placesVisited });
    await fetchProfile();
    return data;
  } catch (error) {
    handleApiError(error, "Failed to submit interests and places");
  }
};

/**
 * Add an amenity to a specific branch
 */
export const addBranchAmenity = async (branchId: string | number, amenityId: string | number) => {
  try {
    return await apiRequest('post', `amenities/branch/${branchId}/${amenityId}`);
  } catch (error) {
    handleApiError(error, "Failed to add branch amenity");
  }
};

/**
 * Create a new community
 */
export const createCommunity = async (communityData: {
  name: string;
  description: string;
  type: string;
  photo?: any;
}) => {
  try {
    const formData = new FormData();
    formData.append('name', communityData.name);
    formData.append('description', communityData.description);
    formData.append('type', communityData.type);

    if (communityData.photo) {
      formData.append('photo', {
        uri: communityData.photo.uri,
        type: communityData.photo.type || 'image/jpeg',
        name: communityData.photo.fileName || `community-${Date.now()}.jpg`,
      } as any);
    }

    return await apiRequest('post', 'community/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } catch (error) {
    handleApiError(error, "Failed to create community");
  }
};

// ==========================================
// 4. BOOKMARKS
// ==========================================

/**
 * Toggle bookmark status for a post
 */
export const toggleBookmark = async (postId: number | string) => {
  try {
    return await apiRequest('post', 'bookmarks', { postId });
  } catch (error) {
    handleApiError(error, "Failed to toggle bookmark");
  }
};

/**
 * Get user bookmarks
 */
export const getBookmarks = async () => {
  try {
    return await apiRequest('get', 'bookmarks');
  } catch (error) {
    handleApiError(error, "Failed to fetch bookmarks");
  }
};

// ==========================================
// 8. ADMIN (STAFF, ROLES, ANALYTICS)
// ==========================================

/**
 * Get all staff members (requires admin token)
 */
export const getAdminStaff = async () => {
  try {
    return await apiRequest('get', 'admin/staff');
  } catch (error) {
    handleApiError(error, "Failed to fetch staff");
  }
};

/**
 * Create a new staff member (requires admin token)
 */
export const createAdminStaff = async (staffData: {
  name: string;
  email: string;
  password?: string;
  role: string;
  branchId: number;
}) => {
  try {
    return await apiRequest('post', 'admin/staff/create', staffData);
  } catch (error) {
    handleApiError(error, "Failed to create staff");
  }
};

/**
 * Get all available permissions
 */
export const getAdminPermissions = async () => {
  try {
    return await apiRequest('get', 'admin/permissions');
  } catch (error) {
    handleApiError(error, "Failed to fetch permissions");
  }
};

/**
 * Get all available roles
 */
export const getAdminRoles = async () => {
  try {
    return await apiRequest('get', 'admin/roles');
  } catch (error) {
    handleApiError(error, "Failed to fetch roles");
  }
};

/**
 * Get analytics summary
 */
export const getAdminAnalyticsSummary = async () => {
  try {
    return await apiRequest('get', 'admin/analytics/summary');
  } catch (error) {
    handleApiError(error, "Failed to fetch analytics");
  }
};

// ==========================================
// 7. COMMUNITY MANAGEMENT
// ==========================================

/**
 * Add members to a community
 */
export const addCommunityMembers = async (communityId: string, memberIds: number[]) => {
  try {
    return await apiRequest('post', 'community/add-members', {
      communityId,
      members: memberIds
    });
  } catch (error) {
    handleApiError(error, "Failed to add members");
  }
};

/**
 * List all communities
 */
export const listCommunities = async () => {
  try {
    return await apiRequest('get', 'community');
  } catch (error) {
    handleApiError(error, "Failed to fetch communities");
  }
};

/**
 * Get community details by ID
 */
export const getCommunityDetails = async (communityId: string | number) => {
  try {
    return await apiRequest('get', `community/${communityId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch community details");
  }
};

/**
 * Join a community
 */
export const joinCommunity = async (communityId: string | number) => {
  try {
    return await apiRequest('post', 'app/join-community', { communityId });
  } catch (error) {
    handleApiError(error, "Failed to join community");
  }
};

/**
 * Fetch members of a community
 */
export const getCommunityMembers = async (communityId: string | number) => {
  try {
    return await apiRequest('get', 'community/fetch-members', null, { params: { communityId } });
  } catch (error) {
    handleApiError(error, "Failed to fetch community members");
  }
};

// ==========================================
// 8. TRANSACTIONS
// ==========================================

/**
 * Get transactions history
 */
export const getTransactions = async (limit: number = 10) => {
  try {
    return await apiRequest('get', 'transactions', null, { params: { limit } });
  } catch (error) {
    handleApiError(error, "Failed to fetch transactions");
  }
};

/**
 * Get transaction details by ID
 */
export const getTransactionDetails = async (transactionId: string) => {
  try {
    return await apiRequest('get', `transactions/${transactionId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch transaction details");
  }
};

// ==========================================
// 14. CHAT
// ==========================================

/**
 * List user chats
 */
export const listChats = async () => {
  try {
    return await apiRequest('get', 'chats');
  } catch (error) {
    handleApiError(error, "Failed to fetch chats");
  }
};

/**
 * Create or open a chat with a profile
 */
export const createChat = async (profileId: number | string) => {
  try {
    return await apiRequest('post', 'chats', { profileId });
  } catch (error) {
    handleApiError(error, "Failed to create chat");
  }
};

// ==========================================
// 9. BRANCH MANAGEMENT
// ==========================================

/**
 * Get all branches (requires admin token)
 */
export const getAllBranches = async () => {
  try {
    return await apiRequest('get', 'admin/branches');
  } catch (error) {
    handleApiError(error, "Failed to fetch branches");
  }
};

/**
 * Get branch details by ID
 */
export const getBranchDetails = async (branchId: string | number) => {
  try {
    return await apiRequest('get', `admin/branches/${branchId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch branch details");
  }
};

// ==========================================
// 11. REWARDS & VOUCHERS
// ==========================================

export const fetchMyVouchers = async (limit: number = 10) => {
  try {
    const data = await apiRequest('get', 'rewards/my-vouchers', null, { params: { limit } });
    return data.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch vouchers");
  }
};

/**
 * Redeem a voucher
 */
export const redeemVoucher = async (data: { code?: string; voucherId?: string | number }) => {
  try {
    const response = await apiRequest('post', 'rewards/vouchers/redeem', data);
    // apiRequest returns the response body (response.data from axios).
    // The structure is { status_code, success, message, data: {...} }
    // We want to return this whole object so the caller can check .success and .message
    return response;
  } catch (error) {
    handleApiError(error, "Failed to redeem voucher");
  }
};

// ==========================================
// 12. PRODUCT MANAGEMENT
// ==========================================

/**
 * Get all products
 */
export const getAllProducts = async () => {
  try {
    return await apiRequest('get', 'product');
  } catch (error) {
    handleApiError(error, "Failed to fetch products");
  }
};

/**
 * Get product details by ID
 */
export const getProductDetails = async (productId: string | number) => {
  try {
    return await apiRequest('get', `product/${productId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch product details");
  }
};

/**
 * Create a new product (requires admin/vendor token)
 */
export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  branchAmenityId: string;
  media?: any[];
}) => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', String(productData.price));
    formData.append('branchAmenityId', productData.branchAmenityId);

    if (productData.media && productData.media.length > 0) {
      productData.media.forEach((mediaFile, index) => {
        const uri = typeof mediaFile === 'string' ? mediaFile : mediaFile.uri;
        const type = typeof mediaFile === 'string' ? 'image/jpeg' : (mediaFile.type || 'image/jpeg');
        const name = typeof mediaFile === 'string' ? `product-${Date.now()}-${index}.jpg` : (mediaFile.fileName || `product-${Date.now()}-${index}.jpg`);
        formData.append('media', { uri, type, name } as any);
      });
    }

    return await apiRequest('post', 'product/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } catch (error) {
    handleApiError(error, "Failed to create product");
  }
};

// ==========================================
// 11. ORDER MANAGEMENT
// ==========================================

/**
 * Get branch orders (dashboard for staff)
 */
export const getBranchOrders = async () => {
  try {
    return await apiRequest('get', 'order/dashboard/branch-orders');
  } catch (error) {
    handleApiError(error, "Failed to fetch branch orders");
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    return await apiRequest('post', 'order/dashboard/update-order-status', { orderId, status });
  } catch (error) {
    handleApiError(error, "Failed to update order status");
  }
};

/**
 * Get order details by ID
 */
export const getOrderDetails = async (orderId: string | number) => {
  try {
    return await apiRequest('get', `order/${orderId}/items`);
  } catch (error) {
    handleApiError(error, "Failed to fetch order details");
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: {
  businessId: string | number;
  branchId: string | number;
  items: { productId: string | number; quantity: number }[];
  voucherId?: string | number;
}) => {
  try {
    return await apiRequest('post', 'orders', orderData);
  } catch (error) {
    handleApiError(error, "Failed to create order");
  }
};

// ==========================================
// 10. PAYMENTS (PAYSTACK)
// ==========================================

/**
 * Initialize payment for an order
 */
export const checkoutOrder = async (orderId: string | number) => {
  try {
    return await apiRequest('post', 'orders/checkout', { orderId });
  } catch (error) {
    handleApiError(error, "Failed to initialize checkout");
  }
};

/**
 * Verify payment
 */
export const verifyPayment = async (reference: string) => {
  try {
    return await apiRequest('get', `orders/verify?reference=${reference}`);
  } catch (error) {
    handleApiError(error, "Failed to verify payment");
  }
};

// ==========================================
// 12. AMENITIES
// ==========================================

/**
 * Get amenities for a specific branch
 */
export const getBranchAmenities = async (branchId: string | number) => {
  try {
    return await apiRequest('get', `amenities/branch/${branchId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch branch amenities");
  }
};

// ==========================================
// 13. CUSTOMER MANAGEMENT (ADMIN)
// ==========================================

/**
 * Get all customers for the branch (requires admin token)
 */
export const getBranchCustomers = async () => {
  try {
    return await apiRequest('get', 'admin/branches/customers');
  } catch (error) {
    handleApiError(error, "Failed to fetch customers");
  }
};

/**
 * Get detailed customer profile by ID (requires admin token)
 */
export const getCustomerDetails = async (customerId: string | number) => {
  try {
    return await apiRequest('get', `admin/branches/customers/${customerId}`);
  } catch (error) {
    handleApiError(error, "Failed to fetch customer details");
  }
};
