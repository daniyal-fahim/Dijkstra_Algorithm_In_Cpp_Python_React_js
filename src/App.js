import React, { useState } from "react";
import DijkstraVisualizer from "./dijkstra3.jsx";
import Dig from "./dijkstra4.jsx"; // Renamed 'dig' to 'Dig' for consistency

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="App">
      <h1>Dijkstra's Algorithm Visualization</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveComponent(<DijkstraVisualizer />)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            background: "#007BFF",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          Open DijkstraVisualizer
        </button>
        <button
          onClick={() => setActiveComponent(<Dig />)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            background: "#28A745",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go to Specific Path
        </button>
      </div>
      <div style={{ border: "1px solid #DDD", padding: "20px" }}>
        {activeComponent || <p>Please select a component to display.</p>}
      </div>
    </div>
  );
}

export default App;
