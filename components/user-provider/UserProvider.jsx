import React from "react";
import { useSession } from "../../hooks/useSession";
import UserContext from "./UserContext";

/**
 * @deprecated
 */
export default function UserProvider({ children }) {
  const { session, error, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  return (
    <UserContext.Provider
      value={{
        user: session?.user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
