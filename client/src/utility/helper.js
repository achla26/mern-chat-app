export const formatTimestamp = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Safe sessionStorage helper functions
export const safeSessionStorage = {
  getItem: (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error("sessionStorage getItem error:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error("sessionStorage setItem error:", error);
    }
  },
};