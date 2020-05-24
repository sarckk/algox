import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/app";

ReactDOM.render(
  <App compiler="typescript" framework="react" />,
  document.getElementById("root")
);
