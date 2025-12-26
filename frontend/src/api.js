import axios from "axios";
export const getAuthUser=async () => {
    const res = await axios.get(
      "http://localhost:9000/auth/me",
      { withCredentials: true }
    );
    
    return res.data;
  }