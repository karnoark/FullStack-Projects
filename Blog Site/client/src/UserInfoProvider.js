import React, { createContext, useState } from "react";

//create a context object
export const UserContext = createContext();

//UserInfoProvider component to provide the context value

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
