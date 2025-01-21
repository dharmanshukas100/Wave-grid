import React, { useState } from "react";
import Grid from "./components/Grid";
import "./App.css";
import "../src/index.css";

function App() {
  const [appBackground, setAppBackground] = useState("#000000");
  return (
    <div
      className="App"
      style={{
        backgroundColor: appBackground,
        transition: "background-color 0.5s ease",
      }}
    >
      <h1>Dynamic Wave Grid</h1>
      <Grid setAppBackground={setAppBackground} />
    </div>
  );
}

export default App;
