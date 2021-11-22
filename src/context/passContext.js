import { createContext } from "react";

function noop() {}

export const PassContext = createContext({
  user: '',
  login: noop,
  logout: noop
});
