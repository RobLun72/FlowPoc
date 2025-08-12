import { useState, type ReactNode } from "react";
import { AppContext, type AppContextType } from "./AppContext";

// Create a provider component
interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [user, setUser] = useState<string>();
  const [jwt, setJwt] = useState<string>();

  const value: AppContextType = {
    user,
    jwt,
    setUser,
    setJwt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
