import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./assets/css/input.css";
import "./App.css";
import Login from "./pages/unauth/Login";
import WelcomeAuthenticationPage from "./pages/unauth/WelcomeAuthenticationPage";

function App() {
  return (
    <>
      <WelcomeAuthenticationPage />
    </>
  );
}

export default App;
