import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../api";

const userAuth = () => {
  const { data, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });  

  return {
    user: data?.user || null,
    isLoading,
    
  };
};

export default userAuth;
