import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const DijkstraApp = () => {
  const [vertices, setVertices] = useState(0); // Number of vertices
  const [edges, setEdges] = useState([]); // Array of edges
  const [graph, setGraph] = useState({}); // Adjacency list
  const [startVertex, setStartVertex] = useState(0); // Source vertex for Dijkstra
  const [shortestPaths, setShortestPaths] = useState([]); // Store shortest path results
  const [edgeInput, setEdgeInput] = useState({ from: "", to: "", weight: "" }); // Input for adding edges

  // Initialize the adjacency list whenever the number of vertices changes
  useEffect(() => {
    const newGraph = {};
    for (let i = 0; i < vertices; i++) {
      newGraph[i] = [];
    }
    setGraph(newGraph);
    setShortestPaths([]); // Reset paths
  }, [vertices]);

  // Function to add an edge
  const addEdge = (from, to, weight) => {
    if (from >= vertices || to >= vertices) {
      alert("Vertex index out of bounds.");
      return;
    }

    // Add edge to the graph
    const updatedGraph = { ...graph };
    updatedGraph[from].push({ to, weight });
    updatedGraph[to].push({ to: from, weight }); // Assuming undirected graph
    setGraph(updatedGraph);

    // Add edge to the edges array for visualization
    setEdges([...edges, { from, to, weight }]);
  };

  // Dijkstra's Algorithm to calculate shortest paths
  const dijkstra = (src) => {
    const dist = Array(vertices).fill(Infinity);
    const parent = Array(vertices).fill(-1);
    const visited = Array(vertices).fill(false);
    dist[src] = 0;

    for (let count = 0; count < vertices - 1; count++) {
      // Find the minimum distance vertex that has not been visited
      let u = -1;
      for (let i = 0; i < vertices; i++) {
        if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
          u = i;
        }
      }

      if (u === -1) break; // No more reachable vertices

      visited[u] = true;

      // Update the distance of adjacent vertices
      for (const neighbor of graph[u]) {
        const { to: v, weight } = neighbor;
        if (!visited[v] && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          parent[v] = u;
        }
      }
    }

    // Extract paths from parent array
    const paths = Array(vertices).fill("");
    for (let i = 0; i < vertices; i++) {
      if (dist[i] !== Infinity) {
        let temp = i;
        const path = [];
        while (temp !== -1) {
          path.push(temp);
          temp = parent[temp];
        }
        paths[i] = path.reverse().join("|"); // Save path as string
      }
    }
    setShortestPaths(paths);
  };

  // Render the graph using D3.js
  const renderGraph = () => {
    const width = 800;
    const height = 600;
    const radius = 300;
    const angleStep = (2 * Math.PI) / vertices;

    const vertexPositions = {};
    const svg = d3
      .select("#graph")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    // Draw vertices
    for (let i = 0; i < vertices; i++) {
      const angle = i * angleStep;
      const x = width / 2 + radius * Math.cos(angle);
      const y = height / 2 + radius * Math.sin(angle);
      vertexPositions[i] = { x, y };

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .style("fill", "lightblue")
        .style("stroke", "black");

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(i);
    }

    // Draw edges
    edges.forEach(({ from, to, weight }) => {
      const fromPos = vertexPositions[from];
      const toPos = vertexPositions[to];

      svg
        .append("line")
        .attr("x1", fromPos.x)
        .attr("y1", fromPos.y)
        .attr("x2", toPos.x)
        .attr("y2", toPos.y)
        .style("stroke", "black")
        .style("stroke-width", 2);

      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;

      svg
        .append("text")
        .attr("x", midX)
        .attr("y", midY - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "red")
        .text(weight);
    });

    // Highlight shortest paths
    shortestPaths.forEach((path, idx) => {
      const nodes = path.split("|").map(Number);
      for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to = nodes[i + 1];
        const fromPos = vertexPositions[from];
        const toPos = vertexPositions[to];

        svg
          .append("line")
          .attr("x1", fromPos.x)
          .attr("y1", fromPos.y)
          .attr("x2", toPos.x)
          .attr("y2", toPos.y)
          .style("stroke", "green")
          .style("stroke-width", 3);
      }
    });
  };

  useEffect(() => {
    if (vertices > 0) {
      renderGraph();
    }
  }, [vertices, edges, shortestPaths]);

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
          onChange={(e) =>
            setEdgeInput({ ...edgeInput, from: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="To"
          value={edgeInput.to}
          onChange={(e) =>
            setEdgeInput({ ...edgeInput, to: e.target.value })
          }
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
          onClick={() =>
            addEdge(
              parseInt(edgeInput.from),
              parseInt(edgeInput.to),
              parseInt(edgeInput.weight)
            )
          }
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
        <button onClick={() => dijkstra(startVertex)}>Run Dijkstra</button>
      </div>
      <div>
        <h3>Shortest Paths</h3>
        <ul>
          {shortestPaths.map((path, idx) => (
            <li key={idx}>
              Vertex {idx}: {path || "No Path"}
            </li>
          ))}
        </ul>
      </div>
      <svg id="graph"></svg>
    </div>
  );
};

export default DijkstraApp;
