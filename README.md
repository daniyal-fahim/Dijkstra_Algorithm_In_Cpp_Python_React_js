# Dijkstra's Algorithm Visualization - README

## About the Project  
This project is a comprehensive visualization tool for **Dijkstra's Algorithm** implemented in **React**, along with **C++** and **Python** implementations. It demonstrates how Dijkstra's Algorithm works for finding the shortest path in a graph while providing an interactive user interface for better understanding. The tool supports dynamic edge addition, real-time visualization, and highlights shortest paths step-by-step.

### Key Features:
- **React Visualization**: An intuitive, interactive graphical representation of Dijkstra's Algorithm using D3.js.
- **Cross-Language Support**: Includes implementations in both **C++** and **Python** for performance comparison and learning.
- **Dynamic Graph Building**: Add vertices, edges, and weights directly through the UI and visualize the changes in real time.
- **Pathfinding Step-by-Step**: See the algorithm's progression and shortest path discovery with visual feedback.

---

## Live Demo 🌐
You can try the live visualization of **Dijkstra's Algorithm** here:  
🔗 [Dijkstra Algorithm Visualization](https://dijkstra-visualization-sandy.vercel.app/)

---

## Installation and Usage Instructions  

### React Visualization  
To run the React-based visualization locally:  
1. Clone this repository:  
   ```bash
   git clone https://github.com/your-username/dijkstra-visualization.git
   cd dijkstra-visualization
   ```
2. Install the dependencies:  
   ```bash
   npm install
   ```
3. Run the project:  
   ```bash
   npm start
   ```
4. Open your browser and go to `http://localhost:3000` to access the application.

> **Note**: Only `dijkstra4.jsx` is used for the primary visualization. Other components are included as temporary modules to demonstrate debugging and handling of various challenges during development.  

---

### C++ Implementation  
src/dijkstra_cpp_implementation.cpp
To execute the C++ version of Dijkstra's Algorithm:  
1. Navigate to the `src` directory:  
   ```bash
   cd src
   ```
2. Compile and run the file using `g++`:  
   ```bash
   g++ dijkstra_cpp_implementation.cpp -o dijkstra
   ./dijkstra
   ```

---

### Python Implementation  
To execute the Python version of Dijkstra's Algorithm:  
src/dijkstra_python_implementation.py
1. Navigate to the `src` directory:  
   ```bash
   cd src
   ```
2. Run the Python file with the Python interpreter:  
   ```bash
   python dijkstra_python_implementation.py
   ```

---

## About Dijkstra's Algorithm  
Dijkstra's Algorithm is one of the most widely used algorithms in graph theory for solving the **single-source shortest path problem**. It operates on a weighted graph and finds the shortest path from a source vertex to all other vertices. 

### Algorithm Highlights:  
1. **Initialization**: Start by setting the source vertex distance to `0` and all other vertices to infinity.  
2. **Relaxation**: Iteratively update the shortest path for each vertex by checking all adjacent vertices.  
3. **No Priority Queue**: I have used my own logic instead of min-priority queue to always process the vertex with the smallest known distance.  
4. **Output**: The shortest path from the source to each vertex is generated once the algorithm completes.

### Real-World Applications:  
- **Routing and Navigation**: GPS systems use Dijkstra to calculate optimal routes.  
- **Network Optimization**: Used in network routing protocols like OSPF (Open Shortest Path First).  
- **Game Development**: Pathfinding for AI characters in games.  

---

## How This Project Helps  
- Visual learners can **see** how Dijkstra's Algorithm operates in real-time.  
- Developers can compare **React**, **C++**, and **Python** implementations to understand differences in programming styles and performance.  
- Aids in debugging and problem-solving during the implementation of complex graph algorithms.

---

## Contributing  
Contributions are welcome! If you want to improve the project or add new features, feel free to fork the repository and submit a pull request.  

---

## License  
This project is open-source and available for all.

---

Enjoy exploring the world of Dijkstra's Algorithm! 🚀
