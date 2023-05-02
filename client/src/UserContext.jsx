import React, { createContext, useContext, useState } from "react";

const UserContext = React.createContext();

const useUser = () => useContext(UserContext);

function UserProvider({ children }) {

  const [user, setUser] = useState(null);
  const value = { user, setUser };
  const UserContext = createContext();

  return (  <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
    );
};

export { useUser, UserProvider };