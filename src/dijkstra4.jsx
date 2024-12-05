import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const DijkstraApp = () => {
  const [vertices, setVertices] = useState(30); // Number of vertices
  const [edges, setEdges] = useState([]); // Array of edges
  const [graph, setGraph] = useState({}); // Adjacency list
  const [startVertex, setStartVertex] = useState(0); // Source vertex for Dijkstra
  const [shortestPaths, setShortestPaths] = useState([]); // Store shortest path results
  const [edgeInput, setEdgeInput] = useState({ from: "", to: "", weight: "" }); // Input for adding edges
  const [dest,setDestination] =useState(0)
  // Initialize the adjacency list whenever the number of vertices changes
  useEffect(() => {
    if (vertices === 0) return; // Prevent graph initialization when vertices are reset
  
    const newGraph = {};
    for (let i = 0; i < vertices; i++) {
      newGraph[i] = [];
    }
    setGraph(newGraph);
    setEdges([]); // Reset edges
    setShortestPaths([]); // Clear shortest paths
  
    // Add hardcoded edges if vertices are initialized
    if (vertices >= 30) {
      addEdge(0, 1, 2);
      addEdge(0, 2, 6);
      addEdge(1, 3, 5);
      addEdge(2, 3, 8);
      addEdge(3, 4, 10);
      addEdge(3, 5, 15);
      addEdge(4, 6, 2);
      addEdge(5, 6, 6);
      addEdge(0, 7, 1);
      addEdge(1, 8, 3);
      addEdge(7, 9, 4);
      addEdge(8, 10, 2);
      addEdge(9, 11, 6);
      addEdge(10, 12, 7);
      addEdge(12, 13, 1);
      addEdge(13, 14, 2);
      addEdge(14, 15, 3);
      addEdge(15, 16, 4);
      addEdge(16, 17, 5);
      addEdge(17, 18, 6);
      addEdge(18, 19, 7);
      addEdge(19, 20, 8);
      addEdge(20, 21, 9);
      addEdge(21, 22, 10);
      addEdge(22, 23, 11);
      addEdge(23, 24, 12);
      addEdge(24, 25, 13);
      addEdge(25, 26, 14);
      addEdge(26, 27, 15);
      addEdge(27, 28, 16);
      addEdge(28, 29, 17);
    }
  }, [vertices]);
  

  // Function to add an edge
  const addEdge = (from, to, weight) => {
    if (from >= vertices || to >= vertices) {
      alert("Vertex index out of bounds.");
      return;
    }

    // Check if graph[from] exists, otherwise initialize it as an array
    setGraph((prevGraph) => {
      const updatedGraph = { ...prevGraph };
      if (!updatedGraph[from]) updatedGraph[from] = [];
      if (!updatedGraph[to]) updatedGraph[to] = [];
      
      updatedGraph[from].push({ to, weight });
      updatedGraph[to].push({ to: from, weight }); // Assuming undirected graph
      return updatedGraph;
    });

    // Add edge to the edges array for visualization
    setEdges((prevEdges) => [...prevEdges, { from, to, weight }]);
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
    var i=dest;
      if (dist[i] !== Infinity) {
        let temp = i;
        const path = [];
        while (temp !== -1) {
          path.push(temp);
          temp = parent[temp];
        }
        paths[i] = path.reverse().join("|"); // Save path as string
      }
    
    setShortestPaths(paths);
  };

  // Render the graph using D3.js
  const renderGraph = () => {
    // Adjust dimensions dynamically based on the number of vertices
    const baseSize = 600; // Base size for a small graph
    const scalingFactor = Math.sqrt(vertices) * 50; // Increase size with vertex count
    const width = baseSize + scalingFactor;
    const height = baseSize + scalingFactor;

    // Adjust radius dynamically
    const radius = Math.min(width, height) / 2 - 50; // Reduce to avoid cutting off vertices
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

  //   // Highlight shortest paths
  //   shortestPaths.forEach((path, idx) => {
  //     const nodes = path.split("|").map(Number);
  //     for (let i = 0; i < nodes.length - 1; i++) {
  //       const from = nodes[i];
  //       const to = nodes[i + 1];
  //       const fromPos = vertexPositions[from];
  //       const toPos = vertexPositions[to];

  //       // svg
  //       //   .append("line")
  //       //   .attr("x1", fromPos.x)
  //       //   .attr("y1", fromPos.y)
  //       //   .attr("x2", toPos.x)
  //       //   .attr("y2", toPos.y)
  //       //   .style("stroke", "green")
  //       //   .style("stroke-width", 3);
  //       setTimeout(() => {
  //         svg
  //           .append("line")
  //           .attr("x1", fromPos.x)
  //           .attr("y1", fromPos.y)
  //           .attr("x2", toPos.x)
  //           .attr("y2", toPos.y)
  //           .style("stroke", "green")
  //           .style("stroke-width", 3);
  //       }, i * 2000); // 2-second delay for each step
  //     }
  //   });

  // Highlight shortest paths with delay
shortestPaths.forEach((path, idx) => {
  const nodes = path.split("|").map(Number);

  nodes.forEach((node, i) => {
    if (i < nodes.length - 1) {
      const from = node;
      const to = nodes[i + 1];
      const fromPos = vertexPositions[from];
      const toPos = vertexPositions[to];

      if (fromPos && toPos) {
        setTimeout(() => {
          svg
            .append("line")
            .attr("x1", fromPos.x)
            .attr("y1", fromPos.y)
            .attr("x2", toPos.x)
            .attr("y2", toPos.y)
            .style("stroke", "green")
            .style("stroke-width", 3);
        }, (idx * nodes.length + i) * 500); // Scaled delay for each path segment
      } else {
        console.error(`Missing position for nodes: ${from} or ${to}`);
      }
    }
  });
});

  };
// const resetGraph = () => {
    
//     setEdgeInput({ from: "", to: "", weight: "" }); // Reset edge input
//     setGraph({}); // Reset graph to empty
//     setEdges([]); // Reset edges list
//     setShortestPaths([]);
//     setVertices(0); // Reset vertices count
//     }

const resetGraph = () => {
  // Reset state variables
  setEdgeInput({ from: "", to: "", weight: "" }); 
  setGraph({}); 
  setEdges([]); 
  setShortestPaths([]); 
  setVertices(0);

  // Clear SVG elements (graph rendering)
  const svgContainer = document.querySelector("svg");
  if (svgContainer) {
    while (svgContainer.firstChild) {
      svgContainer.removeChild(svgContainer.firstChild);
    }
  }

  // Log reset for debugging
  console.log("Graph has been reset.");
};

  // Run Dijkstra and render the graph
  useEffect(() => {
    renderGraph();
  }, [graph, edges, vertices, shortestPaths]);


  return (
    <div>
      <h2>Dijkstra's Algorithm Visualizer</h2>
      <span> Set Number of Vertices</span>
      <div>
        <input
          type="number"
          value={vertices}
          onChange={(e) => setVertices(parseInt(e.target.value))}
          min={2}
        />
      </div>
      <span> Set START Vertex</span>
<div>
  <input
    type="number"
    value={startVertex} // Bind to startVertex state
    onChange={(e) => setStartVertex(parseInt(e.target.value))} // Update startVertex
    min={0}
    max={vertices - 1} // Ensure it stays within the range of available vertices
  />
</div>
<span> Set END Vertex</span>
<div>
  <input
    type="number"
    value={dest} // Bind to dest state
    onChange={(e) => setDestination(parseInt(e.target.value))} // Update dest
    min={0}
    max={vertices - 1} // Ensure it stays within the range of available vertices
  />
</div>

      <div>
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
          onChange={(e) => setEdgeInput({ ...edgeInput, to: e.target.value })}
        />
        <input
          type="number"
          placeholder="Weight"
          value={edgeInput.weight}
          onChange={(e) =>
            setEdgeInput({ ...edgeInput, weight: e.target.value })
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
        <button onClick={() => resetGraph()}>Reset Dijkstra Graph</button>
      </div>
      <div>
        <button onClick={() => dijkstra(startVertex)}>Run Dijkstra</button>
      </div>
      <svg id="graph"></svg>
      <div>
        <h3>Shortest Paths from Vertex {startVertex}</h3>
        <ul>
          {shortestPaths.map((path, idx) => (
            <li key={idx}>
              {path && `Path to ${idx}: ${path} (Distance: ${path.split("|").length - 1})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DijkstraApp;
