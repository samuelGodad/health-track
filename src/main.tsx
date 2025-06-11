
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <App />
    </SupabaseAuthProvider>
  </React.StrictMode>
);
