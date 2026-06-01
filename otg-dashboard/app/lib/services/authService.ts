/**
 * Authentication Service
 * 
 * Handles user authentication, login, logout, and session management
 */

import { api, APIResponse } from '../api';

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string | number;
    email: string;
    name?: string;
    role?: string;
    branchId?: string;
    [key: string]: any; // Allow additional fields from API
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    data?: {
        token?: string;
        // user?: AuthUser;
        admin?: AuthUser;
        accessToken?: string;
        refreshToken?: string;
    };
    token?: string; // Support both nested and flat token structure
    admin?: AuthUser;
}

const AUTH_ENDPOINTS = {
    login: '/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
};

// Storage keys
const STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'authUser',
    REFRESH_TOKEN: 'refreshToken',
};

export const authService = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>(
                AUTH_ENDPOINTS.login,
                credentials
            );

            // Handle different response structures
            const token = response.data?.token || response.token;
            const user = response.data?.admin || response.admin;
            const accessToken = response.data?.accessToken;
            const refreshToken = response.data?.refreshToken;

            // Store token and user data
            if (token || accessToken) {
                this.setToken(token || accessToken!);
            }

            if (refreshToken) {
                this.setRefreshToken(refreshToken);
            }

            if (user) {
                this.setUser(user);
            }

            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Call logout endpoint if available
            await api.post(AUTH_ENDPOINTS.logout).catch(() => {
                // Ignore errors on logout endpoint
            });
        } finally {
            // Always clear local storage
            this.clearAuth();
        }
    },

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<APIResponse<AuthUser>> {
        return api.get(AUTH_ENDPOINTS.me);
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<APIResponse<{ token: string }>> {
        const refreshToken = this.getRefreshToken();
        return api.post(AUTH_ENDPOINTS.refresh, { refreshToken });
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    /**
     * Get stored auth token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Set auth token
     */
    setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Set refresh token
     */
    setRefreshToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    /**
     * Get stored user data
     */
    getUser(): AuthUser | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Set user data
     */
    setUser(user: AuthUser): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    /**
     * Clear all auth data
     */
    clearAuth(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
};
