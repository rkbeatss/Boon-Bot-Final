import React, { useEffect, useState } from "react";
import Firebase from "./Firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //hook
    Firebase.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
