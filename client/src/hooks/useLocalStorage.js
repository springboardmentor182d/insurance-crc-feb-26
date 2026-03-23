import { useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
        setStoredValue(null);
      } else {
        localStorage.setItem(key, value);
        setStoredValue(value);
      }
    } catch (err) {
      console.error("useLocalStorage error:", err);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;