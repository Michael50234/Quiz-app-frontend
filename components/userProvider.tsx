'use client';

import { User } from "@/types";
import { createContext, useState } from "react";

type userContextType = {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<null | userContextType>(null)

export const userProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<null | User>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}