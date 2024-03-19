import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { AuthProvider } from "./context/AuthContex";
import { LikeFavoriteProvider } from "./context/LikeFavoriteContext";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <LikeFavoriteProvider>
            <App />
          </LikeFavoriteProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
