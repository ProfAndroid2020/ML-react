import { createContext } from "react";

export const DBContext = createContext({
  classes: [],
  notes: [],
  loading: true,
  dataBase: null,
  storage: null,
});
