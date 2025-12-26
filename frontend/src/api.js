import axios from "axios";
export const getAuthUser=async () => {
    const res = await axios.get(
      "https://mediastack-1.onrender.com/auth/me",
      { withCredentials: true }
    );
    
    return res.data;
  }