import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SmoothScroll } from "@/components/lg";
import "@/index.css";
import { Dashboard } from "./Dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScroll>
      <Dashboard />
    </SmoothScroll>
  </StrictMode>,
);
