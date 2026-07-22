import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "token";

function getTokenFromResponse(response) {
    return (
        response?.token ||
        response?.accessToken ||
        response?.access_token ||
        null
    );
}

function getUserFromResponse(response) {
    return response?.user || response || null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);

            if (!token) {
                if (isMounted) {
                    setIsLoading(false);
                }

                return;
            }

            try {
                const response = await apiClient.get("/auth/me");
                const restoredUser = getUserFromResponse(response);

                if (isMounted) {
                    setUser(restoredUser);
                }
            } catch (error) {
                console.error("Unable to restore login session:", error);

                localStorage.removeItem(TOKEN_STORAGE_KEY);

                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (credentials) => {
        const response = await apiClient.post(
            "/auth/login",
            credentials,
        );

        const token = getTokenFromResponse(response);

        if (!token) {
            throw new Error("The server did not return an authentication token.");
        }

        localStorage.setItem(TOKEN_STORAGE_KEY, token);

        /*
         * Fetch the authenticated user after storing the token.
         * This keeps the context user shape consistent after login
         * and after a browser refresh.
         */
        const userResponse = await apiClient.get("/auth/me");
        const authenticatedUser = getUserFromResponse(userResponse);

        setUser(authenticatedUser);

        return authenticatedUser;
    };

    const register = async (registrationData) => {
        const response = await apiClient.post(
            "/auth/register",
            registrationData,
        );

        const token = getTokenFromResponse(response);

        if (!token) {
            throw new Error("The server did not return an authentication token.");
        }

        localStorage.setItem(TOKEN_STORAGE_KEY, token);

        const userResponse = await apiClient.get("/auth/me");
        const authenticatedUser = getUserFromResponse(userResponse);

        setUser(authenticatedUser);

        return authenticatedUser;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isLoading,
            loading: isLoading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
        }),
        [user, isLoading],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
}