// client/src/App.jsx

import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import ClickSpark from "./components/ClickSpark";

function App() {
  return (
    <ClickSpark>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ClickSpark>
  );
}

export default App;
