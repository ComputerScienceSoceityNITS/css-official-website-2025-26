import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Events from "./components/Events";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Events />
  </StrictMode>
);
