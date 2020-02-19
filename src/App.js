import React, { useEffect } from "react";
import NASA_API_KEY from "./config";
import "./App.css";

function App() {
  useEffect(() => {
    console.log(NASA_API_KEY);
  });

  return (
    <div className="App">
      <p>
        Read through the instructions in the README.md file to build your NASA
        app! Have fun 🚀!
      </p>
    </div>
  );
}

export default App;
