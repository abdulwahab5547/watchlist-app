// context/UserContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  selectedAvatar: number | null;
  setSelectedAvatar: (avatar: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ selectedAvatar, setSelectedAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};