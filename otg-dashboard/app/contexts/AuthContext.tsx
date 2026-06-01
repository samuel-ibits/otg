"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, LoginCredentials } from '@/app/lib/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = () => {
            const storedUser = authService.getUser();
            const token = authService.getToken();

            if (storedUser && token) {
                setUser(storedUser);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);

            // Get user from response or storage
            const loggedInUser = response.data?.admin || response.admin || authService.getUser();

            if (loggedInUser) {
                setUser(loggedInUser);
            }

            // Redirect to dashboard after successful login
            router.push('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if API call fails
            setUser(null);
            router.push('/login');
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && authService.isAuthenticated(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
