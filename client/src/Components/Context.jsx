import React, { createContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState(() => {
    // Get the currentUsername from localStorage, defaulting to null if not found
    return localStorage.getItem('currentUsername') || null;
  });
  const [userLoggedIn, setUserLoggedIn] = useState(() => {
    // Get the userLoggedIn state from localStorage, defaulting to false if not found
    return JSON.parse(localStorage.getItem('userLoggedIn')) || false;
  });

  useEffect(() => {
    localStorage.setItem('userLoggedIn', JSON.stringify(userLoggedIn));
  }, [userLoggedIn]);

  useEffect(() => {
    localStorage.setItem('currentUsername', currentUsername);
  }, [currentUsername]);

  return (
    <GlobalStateContext.Provider value={{
      userLoggedIn,
      currentUsername,
      setUserLoggedIn,
      setCurrentUsername
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContext, GlobalStateProvider };
