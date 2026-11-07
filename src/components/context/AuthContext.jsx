"use client";

import { authClient } from "@/app/lib/auth-client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSessionWithRetry = async (retries = 3, delay = 1000) => {
        setLoading(true);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const { data, error: authError } = await authClient.getSession();

                if (authError) {
                    throw new Error(authError.message || "Failed to fetch session data");
                }
                setSessionData(data);
                setLoading(false);
                setError(null);
                return;
            } catch (err) {
                if (attempt === retries) {
                    setError(err);
                    setSessionData(null);
                    setLoading(false);
                } else {
                    await new Promise((resolve) => setTimeout(resolve, delay * attempt));
                }
            }
        }
    }; // fetchSessionWithRetry এখানে সঠিকভাবে শেষ হয়েছে

    useEffect(() => {
        fetchSessionWithRetry();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: sessionData?.user ?? null,
                session: sessionData?.session ?? null,
                loading,
                error,
                refreshSession: () => fetchSessionWithRetry(3, 1000),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};