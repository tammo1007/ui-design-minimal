import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SmoothScroll } from "@/components/lg";
import "@/index.css";
import { Styleguide } from "./Styleguide";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScroll>
      <Styleguide />
    </SmoothScroll>
  </StrictMode>,
);
