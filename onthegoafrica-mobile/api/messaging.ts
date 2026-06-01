import { apiRequest, handleApiError } from "../api/utils";

/**
 * Create a private chat
 * @param profileId - The ID of the user to chat with
 */
export const createPrivateChat = async (profileId: string | number) => {
    try {
        const payload = {
            type: "private",
            profileIds: [profileId],
        };

        return await apiRequest('post', 'app/create-chat', payload);
    } catch (error) {
        handleApiError(error, "Failed to create private chat");
    }
};

/**
 * Create a group chat
 * @param name - Group chat name
 * @param profileIds - Array of profile IDs for group members
 */
export const createGroupChat = async (name: string, desc: string,
    visibility: "Private" | "Public",
    privateExposure: ("Listed" | "InviteOnly"),
    photoUri: string | null,
    profileIds: (string | number)[]) => {
    try {
        const payload = {
            type: "group",
            name,
            profileIds,
        };

        return await apiRequest('post', 'app/create-chat', payload);
    } catch (error) {
        handleApiError(error, "Failed to create group chat");
    }
};

/**
 * Fetch all chats for the logged-in user
 */
export const fetchChats = async () => {
    try {
        return await apiRequest('get', 'app/fetch-chats');
    } catch (error) {
        handleApiError(error, "Failed to fetch chats");
    }
};
