'use client';

import { ErrorResponse, User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

type userContextType = {
    user: User | null,
    loadUser: () => void,
}

export const UserContext = createContext<null | userContextType>(null)

export const useUser = () => {
    const context = useContext(UserContext)

    if(!context) {
        throw new Error("useUser must be used within userProvider");
    } 

    return context;
}

export const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<null | User>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const access_token = localStorage.getItem("access_token");

                if(!access_token) return;

                await loadUser(); 
            } catch(error) {
                // If it crashes the access token is expired, so remove it
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                return;
            }
        }
        loadData();
        
    }, [])

    const loadUser = async () => {
        const token = localStorage.getItem("access_token")

        const response = await fetch("http://127.0.0.1:8000/accounts/user", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            }
        });

        if(!response.ok){
            const error: ErrorResponse = await response.json();
            throw new Error(error.detail);
        }

        const data: User = await response.json();

        setUser(data);
    }

    return (
        <UserContext.Provider value={{ user, loadUser }}>
            {children}
        </UserContext.Provider>
    )
}