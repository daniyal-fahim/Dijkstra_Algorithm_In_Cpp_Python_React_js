import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const App = () => {
  const [vertices, setVertices] = useState(0);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState({});
  const [startVertex, setStartVertex] = useState(0);
  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState({});
  const [animationStep, setAnimationStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shortestPathEdges, setShortestPathEdges] = useState([]);

  const [edgeInput, setEdgeInput] = useState({ from: "", to: "", weight: "" });

  useEffect(() => {
    if (vertices > 0) {
      const newGraph = {};
      for (let i = 0; i < vertices; i++) {
        newGraph[i] = [];
      }
      setGraph(newGraph);
      setDistances({});
      setVisited({});
    }
  }, [vertices]);

  const addEdge = (from, to, weight) => {
    if (from >= vertices || to >= vertices) {
      alert("Vertex index out of bounds.");
      return;
    }

    if (!graph[from]) graph[from] = [];
    graph[from].push({ to, weight });

    if (!graph[to]) graph[to] = [];
    graph[to].push({ to: from, weight });

    setEdges([...edges, { from, to, weight }]);
  };

  const initializeDijkstra = () => {
    const initialDistances = {};
    const initialVisited = {};
    for (let i = 0; i < vertices; i++) {
      initialDistances[i] = Infinity;
      initialVisited[i] = false;
    }
    initialDistances[startVertex] = 0;
    setDistances(initialDistances);
    setVisited(initialVisited);
    setShortestPathEdges([]);
    setIsRunning(true);
  };

  const runDijkstraStep = () => {
    if (!isRunning) return;

    let minVertex = null;
    let minDistance = Infinity;

    for (let vertex in distances) {
      if (!visited[vertex] && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        minVertex = vertex;
      }
    }

    if (minVertex === null) {
      setIsRunning(false);
      return;
    }

    visited[minVertex] = true;

    graph[minVertex].forEach((neighbor) => {
      const { to, weight } = neighbor;
      if (!visited[to] && distances[minVertex] + weight < distances[to]) {
        distances[to] = distances[minVertex] + weight;
        setShortestPathEdges((prevEdges) => [
          ...prevEdges.filter((e) => e.from !== minVertex || e.to !== to),
          { from: minVertex, to, weight },
        ]);
      }
    });

    setDistances({ ...distances });
    setVisited({ ...visited });
    setAnimationStep(animationStep + 1);
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        runDijkstraStep();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning, distances, visited, animationStep]);

  const renderGraph = () => {
    const width = 800;
    const height = 600;
    const radius = 300;
    const angleStep = (2 * Math.PI) / vertices;

    const vertexPositions = {};
    const svg = d3.select("#graph")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    for (let i = 0; i < vertices; i++) {
      const angle = i * angleStep;
      const x = width / 2 + radius * Math.cos(angle);
      const y = height / 2 + radius * Math.sin(angle);
      vertexPositions[i] = { x, y };

      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .style("fill", visited[i] ? "red" : "lightblue")
        .style("stroke", "black");

      svg.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(i);
    }

    edges.forEach((edge) => {
      const { from, to, weight } = edge;
      const fromPos = vertexPositions[from];
      const toPos = vertexPositions[to];
      const isShortestPath = shortestPathEdges.some(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );

      svg.append("line")
        .attr("x1", fromPos.x)
        .attr("y1", fromPos.y)
        .attr("x2", toPos.x)
        .attr("y2", toPos.y)
        .style("stroke", isShortestPath ? "blue" : "black")
        .style("stroke-width", 2);

      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      svg.append("text")
        .attr("x", midX)
        .attr("y", midY - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "red")
        .text(`${from} ➡ ${to} (w: ${weight})`);
    });
  };

  useEffect(() => {
    if (vertices > 0) {
      renderGraph();
    }
  }, [vertices, edges, visited, distances, shortestPathEdges]);

  return (
    <div>
      <h1>Dijkstra's Algorithm Visualization</h1>
      <div>
        <label>Number of Vertices: </label>
        <input
          type="number"
          min="1"
          value={vertices}
          onChange={(e) => setVertices(parseInt(e.target.value) || 0)}
        />
      </div>
      <div>
        <h3>Add Edges</h3>
        <input
          type="number"
          placeholder="From"
          value={edgeInput.from}
          onChange={(e) => setEdgeInput({ ...edgeInput, from: e.target.value })}
        />
        <input
          type="number"
          placeholder="To"
          value={edgeInput.to}
          onChange={(e) => setEdgeInput({ ...edgeInput, to: e.target.value })}
        />
        <input
          type="number"
          placeholder="Weight"
          value={edgeInput.weight}
          onChange={(e) =>
            setEdgeInput({ ...edgeInput, weight: parseInt(e.target.value) || 0 })
          }
        />
        <button
          onClick={() => {
            addEdge(
              parseInt(edgeInput.from),
              parseInt(edgeInput.to),
              parseInt(edgeInput.weight)
            );
          }}
        >
          Add Edge
        </button>
      </div>
      <div>
        <h3>Set Start Vertex</h3>
        <input
          type="number"
          value={startVertex}
          onChange={(e) => setStartVertex(parseInt(e.target.value) || 0)}
        />
        <button onClick={initializeDijkstra}>Start Dijkstra</button>
      </div>
      <svg id="graph"></svg>
    </div>
  );
};

export default App;
