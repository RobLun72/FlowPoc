import { createContext, useContext } from "react";

export interface AppContextType {
  user?: string;
  jwt?: string;
  setUser: (user: string) => void;
  setJwt: (jwt: string) => void;
}

// Create the actual Context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a custom hook to use the context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
