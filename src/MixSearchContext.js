import { createContext, useContext } from "react";

export const MixSearchContext = createContext({
  mixQuery: "",
  setMixQuery: () => {},
});

export const useMixSearch = () => useContext(MixSearchContext);