import { createContext, useContext } from "react";

const AnalyticsContext = createContext({});

export const AnalyticsProvider = ({ children }) => {
  return <AnalyticsContext.Provider value={{}}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => useContext(AnalyticsContext);
