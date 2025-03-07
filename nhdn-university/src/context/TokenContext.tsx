import React, { createContext, useContext, useState } from 'react';

type TokenContextType = {
  token: string | undefined;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const TokenContext = createContext<TokenContextType>({} as TokenContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};

type TokenProviderProps = {
  children: React.ReactNode;
};

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const clearToken = () => {
    setToken(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  const setTokenWithExpiry = (tk: string) => {
    setToken(tk);
    localStorage.setItem('token', tk);
    setTimeout(clearToken, 3600000); // 1 hour in milliseconds
  };

  const contextValue: TokenContextType = {
    token,
    setToken:setTokenWithExpiry,
    clearToken
  };

  return <TokenContext.Provider value={contextValue}>{children}</TokenContext.Provider>;
};
