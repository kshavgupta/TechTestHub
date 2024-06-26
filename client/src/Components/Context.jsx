import React, { createContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState(() => {
    return localStorage.getItem('currentUsername') || null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return JSON.parse(localStorage.getItem('userLoggedIn')) || false;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('currentUsername', currentUsername);
  }, [currentUsername]);

  return (
    <GlobalStateContext.Provider value={{
      isLoggedIn,
      currentUsername,
      setIsLoggedIn,
      setCurrentUsername
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContext, GlobalStateProvider };
