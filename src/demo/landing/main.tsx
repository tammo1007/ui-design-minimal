import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SmoothScroll } from "@/components/lg";
import "@/index.css";
import { Landing } from "./Landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScroll>
      <Landing />
    </SmoothScroll>
  </StrictMode>,
);
