import React, { useState } from "react";
import Home from "./Home";

function App() {
  const [loadClient, setLoadClient] = useState(true);
  return (
    <>
      {/* LOAD OR UNLOAD THE CLIENT */}
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        TOGGLE CLIENT
      </button>
      {/* SOCKET IO CLIENT*/}
      {loadClient ? <Home /> : null}
    </>
  );
}

export default App;