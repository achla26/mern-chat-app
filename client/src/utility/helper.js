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


// Safe sessionStorage helper functions
export const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("localStorage getItem error:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("localStorage setItem error:", error);
    }
  },
};
const currentUserDetails = () => {
  const userDetails = safeLocalStorage.getItem("user");
  return userDetails ? JSON.parse(userDetails) : null;
}

// Usage:
export const userData = currentUserDetails(); 

export const getOtherParticipant = (chat, currentUserId = userData?._id) => {
  // For one-to-one chats
  if (!chat.isGroup) {
    return chat.members.find(member => member !== currentUserId);
  }
  // For group chats (you might want to handle differently)
  return null;
};