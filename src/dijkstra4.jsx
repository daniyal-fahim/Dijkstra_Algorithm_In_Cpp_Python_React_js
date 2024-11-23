import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const App = () => {
  const [vertices, setVertices] = useState(0);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState({});
  const [startVertex, setStartVertex] = useState(0);
  const [distances, setDistances] = useState({});
  const [parent, setParent] = useState({});
  const [visited, setVisited] = useState({});
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [shortestPathEdges, setShortestPathEdges] = useState([]);
  const [currentEdge, setCurrentEdge] = useState(null);

  const [edgeInput, setEdgeInput] = useState({ from: "", to: "", weight: "" });

  // Initialize graph
  useEffect(() => {
    if (vertices > 0) {
      const newGraph = {};
      for (let i = 0; i < vertices; i++) {
        newGraph[i] = [];
      }
      setGraph(newGraph);
      setDistances({});
      setVisited({});
      setPriorityQueue([]);
      setParent({});
    }
  }, [vertices]);

  const addEdge = (from, to, weight) => {
    if (from >= vertices || to >= vertices) {
      alert("Vertex index out of bounds.");
      return;
    }

    if (!graph[from]) graph[from] = [];
    graph[from].push({ to, weight });

    setEdges([...edges, { from, to, weight }]);
  };

  const initializeDijkstra = () => {
    const initialDistances = {};
    const initialParent = {};
    const initialVisited = {};
    const initialQueue = [];

    for (let i = 0; i < vertices; i++) {
      initialDistances[i] = Infinity;
      initialVisited[i] = false;
      initialParent[i] = -1;
    }
    initialDistances[startVertex] = 0;
    initialQueue.push({ vertex: startVertex, distance: 0 });

    setDistances(initialDistances);
    setParent(initialParent);
    setVisited(initialVisited);
    setPriorityQueue(initialQueue);
    setShortestPathEdges([]);
    setCurrentEdge(null);
  };

  const runDijkstraStep = () => {
    if (priorityQueue.length === 0) return;

    const queue = [...priorityQueue];
    queue.sort((a, b) => a.distance - b.distance); // Sort by distance
    const current = queue.shift(); // Get the vertex with the smallest distance
    const { vertex: minVertex } = current;

    if (visited[minVertex]) {
      setPriorityQueue(queue);
      return;
    }

    visited[minVertex] = true;

    graph[minVertex].forEach((neighbor) => {
      const { to, weight } = neighbor;

      if (!visited[to] && distances[minVertex] + weight < distances[to]) {
        distances[to] = distances[minVertex] + weight;
        parent[to] = minVertex;

        setShortestPathEdges((prevEdges) => [
          ...prevEdges.filter((e) => e.from !== minVertex || e.to !== to),
          { from: minVertex, to, weight },
        ]);

        queue.push({ vertex: to, distance: distances[to] });
        setCurrentEdge({ from: minVertex, to, weight });
      }
    });

    setDistances({ ...distances });
    setParent({ ...parent });
    setVisited({ ...visited });
    setPriorityQueue(queue);
  };

  useEffect(() => {
    if (priorityQueue.length > 0) {
      const timer = setInterval(() => {
        runDijkstraStep();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [priorityQueue, distances, visited]);

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
        (e) => e.from === from && e.to === to
      );

      svg.append("line")
        .attr("x1", fromPos.x)
        .attr("y1", fromPos.y)
        .attr("x2", toPos.x)
        .attr("y2", toPos.y)
        .style("stroke", isShortestPath ? "green" : "black")
        .style("stroke-width", 2)
        .attr("marker-end", isShortestPath ? "url(#arrow)" : null);

      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      svg.append("text")
        .attr("x", midX)
        .attr("y", midY - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "red")
        .text(weight);
    });

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 6)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .style("fill", "green");
  };

  useEffect(() => {
    if (vertices > 0) {
      renderGraph();
    }
  }, [vertices, edges, visited, shortestPathEdges, currentEdge]);

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
