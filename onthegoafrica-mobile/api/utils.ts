import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_KEY = "26a3281bfc65b39527447691941d6a707357a1278b1b2ec91742faec9de53ac8";
export const BASE_URL = "https://onthego.myftp.biz/api/v1/";

/**
 * Centrally handle API errors to avoid repetition
 */
export const handleApiError = (error: unknown, defaultMessage: string = "An unexpected error occurred") => {
    console.error("API Error Debug:", error);
    if (axios.isAxiosError(error)) {
        console.error("Axios Response:", error.response?.data);
        const message = error.response?.data?.message || error.message || defaultMessage;
        throw new Error(message);
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(defaultMessage);
};

/**
 * Get the authorization headers from AsyncStorage
 */
export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const headers: any = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return { headers };
};

/**
 * Generic API request wrapper to handle headers and errors
 */
export const apiRequest = async (
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data: any = null,
    options: any = {}
) => {
    try {
        const authHeaders = await getAuthHeaders();
        const config = {
            ...authHeaders,
            ...options,
        };

        let response;
        if (method === 'get' || method === 'delete') {
            response = await axios[method](`${BASE_URL}${endpoint}`, config);
        } else {
            response = await axios[method](`${BASE_URL}${endpoint}`, data, config);
        }

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};