import { useContext } from "react";
import { userContext } from "./contexts";

export const useUserAuth = () => {
  const user = useContext(userContext);
  if (user.isLogedIn) return { isUser: true, user };
  return { isUser: false, toRedirectPath: "/login" };
};