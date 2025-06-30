import React, { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;

  const incrementLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const decrementLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = {
    isLoading,
    incrementLoading,
    decrementLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
