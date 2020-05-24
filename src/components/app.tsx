import React from "react";

interface AppProps {
  compiler: string;
  framework: string;
}

export const App = (props: AppProps) => (
  <div>
    <h1>Algox</h1>
    <p>Advanced algorithm visualisation</p>
  </div>
);
