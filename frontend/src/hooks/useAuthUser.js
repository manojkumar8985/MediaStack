import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../api";

const userAuth = () => {
  console.log("hi");
  
  const { data, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });  
 console.log(data);
 
  return {
    user: data?.user || null,
    isLoading,
    
  };
};

export default userAuth;
