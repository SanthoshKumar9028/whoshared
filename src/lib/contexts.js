import { createContext } from "react";

export const userContext = createContext({
  isLogedIn: false,
  originalname: null,
  username: null,
  logout: null,
});
