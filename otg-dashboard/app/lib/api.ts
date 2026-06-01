/**
 * API Utility Functions for OTG Dashboard
 *
 * This module provides centralized API configuration and helper functions
 * for making HTTP requests throughout the application.
 */

// API Configuration
const API_CONFIG = {
    adminBaseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/admin' || 'http://127.0.0.1:5006/api/v1/admin',
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5006/api/v1',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
};

// API Error Class
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Response wrapper type
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Extended request options
export interface APIRequestOptions extends RequestInit {
    useAdmin?: boolean; // If true, use adminBaseURL; if false, use baseURL
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithConfig<T>(
    endpoint: string,
    options: APIRequestOptions = {}
): Promise<T> {
    const { useAdmin = true, ...fetchOptions } = options;

    let url = endpoint;
    if (!endpoint.startsWith('http')) {
        // Use adminBaseURL by default, or baseURL if useAdmin is false
        const baseUrl = useAdmin ? API_CONFIG.adminBaseURL : API_CONFIG.baseURL;
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        url = `${cleanBaseUrl}${path}`;
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers: {
            ...API_CONFIG.headers,
            ...getAuthHeader(), // Automatically attach auth header
            ...fetchOptions.headers,
        },
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(url, {
            ...config,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || errorData.error || 'Request failed',
                response.status,
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }
            throw new APIError(error.message);
        }

        throw new APIError('An unexpected error occurred');
    }
}

/**
 * HTTP Methods
 */
export const api = {
    /**
     * GET request
     */
    get: <T = any>(endpoint: string, options?: APIRequestOptions): Promise<T> => {
        return fetchWithConfig<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    },

    /**
     * POST request
     */
    post: <T = any>(
        endpoint: string,
        data?: any,
        options?: APIRequestOptions
    ): Promise<T> => {
        return fetchWithConfig<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    /**
     * PUT request
     */
    put: <T = any>(
        endpoint: string,
        data?: any,
        options?: APIRequestOptions
    ): Promise<T> => {
        return fetchWithConfig<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    /**
     * PATCH request
     */
    patch: <T = any>(
        endpoint: string,
        data?: any,
        options?: APIRequestOptions
    ): Promise<T> => {
        return fetchWithConfig<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    /**
     * DELETE request
     */
    delete: <T = any>(endpoint: string, options?: APIRequestOptions): Promise<T> => {
        return fetchWithConfig<T>(endpoint, {
            ...options,
            method: 'DELETE',
        });
    },
};

/**
 * Helper function to build query strings
 */
export function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Helper function to handle file uploads
 */
export async function uploadFile(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
    }

    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_CONFIG.adminBaseURL}${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
            errorData.message || 'Upload failed',
            response.status,
            errorData
        );
    }

    return await response.json();
}

/**
 * Helper to get authorization header
 */
export function getAuthHeader(token?: string): Record<string, string> {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}
