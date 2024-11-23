import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const DijkstraApp = () => {
  const [vertices, setVertices] = useState(30); // Number of vertices
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
    setEdges([]); // Reset edges to avoid duplicates on re-render
    setShortestPaths([]); // Reset paths
  }, [vertices]);

  // Function to add an edge
  const addEdge = (from, to, weight) => {
    if (from >= vertices || to >= vertices) {
      alert("Vertex index out of bounds.");
      return;
    }

    // Update graph state directly
    setGraph((prevGraph) => {
      const updatedGraph = { ...prevGraph };
      if (!updatedGraph[from]) updatedGraph[from] = [];
      if (!updatedGraph[to]) updatedGraph[to] = [];

      updatedGraph[from].push({ to, weight });
      updatedGraph[to].push({ to: from, weight }); // Assuming undirected graph
      return updatedGraph;
    });

    setEdges((prevEdges) => [...prevEdges, { from, to, weight }]);
  };

  // Dijkstra's Algorithm to calculate shortest paths
  const dijkstra = (src) => {
    const dist = Array(vertices).fill(Infinity);
    const parent = Array(vertices).fill(-1);
    const visited = Array(vertices).fill(false);
    dist[src] = 0;

    for (let count = 0; count < vertices - 1; count++) {
      let u = -1;
      // Find the vertex with the minimum distance that is not yet visited
      for (let i = 0; i < vertices; i++) {
        if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
          u = i;
        }
      }

      if (u === -1) break; // No more reachable vertices

      visited[u] = true;

      // Update distances to adjacent vertices
      for (const neighbor of graph[u]) {
        const { to: v, weight } = neighbor;
        if (!visited[v] && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          parent[v] = u;
        }
      }
    }

    // Store shortest paths
    const paths = Array(vertices).fill("");
    for (let i = 0; i < vertices; i++) {
      if (dist[i] !== Infinity) {
        let temp = i;
        const path = [];
        while (temp !== -1) {
          path.push(temp);
          temp = parent[temp];
        }
        paths[i] = path.reverse().join("|");
      }
    }

    setShortestPaths(paths);
    displayPathsSequentially(paths); // Display paths sequentially after calculation
  };

  // Display paths sequentially with a delay (2 seconds between paths)
  const displayPathsSequentially = (paths) => {
    let index = 0;

    const displayPath = () => {
      if (index < paths.length) {
        const path = paths[index];
        console.log(`Path to vertex ${index}: ${path}`);
        highlightPath(path); // Call function to highlight the path in the graph
        index++;
        setTimeout(displayPath, 2000); // Delay of 2 seconds between paths
      }
    };

    displayPath();
  };

  // Highlight the path on the graph (use this function to visually highlight the path)
  const highlightPath = (path) => {
    const nodes = path.split("|").map(Number);
    const svg = d3.select("#graph");
    const vertexPositions = {}; // Ensure you have the correct vertex positions available

    // Render the graph first
    renderGraph(vertexPositions);

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
  };

  // Render the graph using D3.js
  const renderGraph = (vertexPositions) => {
    const baseSize = 600;
    const scalingFactor = Math.sqrt(vertices) * 50;
    const width = baseSize + scalingFactor;
    const height = baseSize + scalingFactor;

    const radius = Math.min(width, height) / 2 - 50;
    const angleStep = (2 * Math.PI) / vertices;

    const svg = d3.select("#graph").attr("width", width).attr("height", height);
    svg.selectAll("*").remove(); // Clear any existing elements

    // Calculate vertex positions
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

    // Render edges
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
        .attr("y", midY)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(weight);
    });
  };

  const handleEdgeInputChange = (e) => {
    setEdgeInput({ ...edgeInput, [e.target.name]: e.target.value });
  };

  const handleAddEdge = () => {
    const { from, to, weight } = edgeInput;
    if (from && to && weight) {
      addEdge(Number(from), Number(to), Number(weight));
      setEdgeInput({ from: "", to: "", weight: "" }); // Clear the input fields
    } else {
      alert("Please fill in all edge fields.");
    }
  };

  return (
    <div>
      <h1>Dijkstra's Algorithm Visualizer</h1>
      <div>
        <input
          type="number"
          value={vertices}
          onChange={(e) => setVertices(Number(e.target.value))}
        />
        <button onClick={() => dijkstra(startVertex)}>Run Dijkstra</button>
      </div>

      <div>
        <label>
          Source Vertex:
          <input
            type="number"
            value={startVertex}
            onChange={(e) => setStartVertex(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          From Vertex:
          <input
            type="number"
            name="from"
            value={edgeInput.from}
            onChange={handleEdgeInputChange}
          />
        </label>
        <label>
          To Vertex:
          <input
            type="number"
            name="to"
            value={edgeInput.to}
            onChange={handleEdgeInputChange}
          />
        </label>
        <label>
          Weight:
          <input
            type="number"
            name="weight"
            value={edgeInput.weight}
            onChange={handleEdgeInputChange}
          />
        </label>
        <button onClick={handleAddEdge}>Add Edge</button>
      </div>

      <svg id="graph"></svg>
    </div>
  );
};

export default DijkstraApp;
