import { createContext, useContext, useEffect, useState } from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = Boolean(user);

    const loadCurrentUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const currentUser = await apiClient.get("/auth/me");
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to load current user:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const login = async (email, password) => {
        const data = await apiClient.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("token", data.token);
        setUser(data.user);

        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        loadCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}