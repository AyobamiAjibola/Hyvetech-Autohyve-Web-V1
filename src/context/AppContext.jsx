import { useContext, createContext, useState } from "react";
const AppContext = createContext();

export default AppContext;

function AppContextProvider({ children }) {
  const [state, setState] = useState();

  return (
    <MyContext.Provider value={{ state, updateState }}>
      {children}
    </MyContext.Provider>
  );
}

export { AppContext, AppContextProvider };
