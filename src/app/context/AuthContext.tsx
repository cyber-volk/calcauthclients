'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types/auth';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const userData = await response.json();
                    if (userData) {
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    const login = async (username: string, password: string): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const userData = await response.json();
        setUser(userData);
        return { ...userData }; // Return a copy of the user data
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
