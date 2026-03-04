import axios from "axios";
export const getAuthUser = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
    { withCredentials: true }
  );

  return res.data;
}