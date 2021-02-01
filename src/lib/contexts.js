import { createContext } from "react";

export const userContext = createContext({
  isLogedIn: false,
  name: null,
  logout: null,
});
