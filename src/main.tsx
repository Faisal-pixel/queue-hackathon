import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GlobalProvider } from "./context/global-context.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
    </BrowserRouter>
  </StrictMode>
);
