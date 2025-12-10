import React, { createContext, useState, useContext, ReactNode } from "react";
import { currentUser } from "@/data/mockData";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  blogCount?: number;
  totalLikes?: number;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar,
    bio: currentUser.bio,
    followers: currentUser.followers,
    following: currentUser.following,
    blogCount: currentUser.blogCount,
    totalLikes: currentUser.totalLikes,
  });

  const updateUser = (updates: Partial<User>) => {
    setUserState(prev => ({ ...prev, ...updates }));
    // Also update the mock data so it persists
    Object.assign(currentUser, updates);
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    Object.assign(currentUser, newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
