// src/hooks/useStorage.js
export const useStorage = () => {
    const getItem = (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error getting item from storage', error);
        return defaultValue;
      }
    };
  
    const setItem = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error setting item in storage', error);
        return false;
      }
    };
  
    const removeItem = (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing item from storage', error);
        return false;
      }
    };
  
    return { getItem, setItem, removeItem };
  };