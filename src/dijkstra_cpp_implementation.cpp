// Dijkstra's Algorithm to find the shortest paths in a weighted graph
#include <bits/stdc++.h>
#include <chrono>
using namespace std;
#define INF 0x3f3f3f3f

typedef pair<int, int> iPair; // iPair ==> Integear Pair

// A class representing a directed graph using an adjacency list
class Graph {
    int V; // Total vertices
    list<pair<int, int>>* adj; // Adjacency list storing neighbors and edge weights

public:
    Graph(int V); // Constructor
    void addEdge(int u, int v, int w); // Method to add edges to the graph
    void shortestPath(int s); // Method to compute and display shortest paths
};

// Constructor: Initializes adjacency list for each vertex
Graph::Graph(int V) {
    this->V = V;
    adj = new list<iPair>[V];
}

// Adds an edge between nodes u and v with a specified weight
void Graph::addEdge(int u, int v, int w) {
    adj[u].push_back(make_pair(v, w)); // Adds v to u's list with weight w
    adj[v].push_back(make_pair(u, w)); // Adds u to v's list with weight w
}

// Computes shortest paths from the source vertex to each vertex in the graph
void Graph::shortestPath(int src) {
     
    vector<int> dist(V, INF); // Distance array, initialized with INF for all vertices
    vector<int> parent(V, -1); // Parent array to keep track of shortest path tree
    vector<bool> visited(V, false); // Visited array to mark processed nodes

    dist[src] = 0; // Starting node has a distance of 0

    for (int count = 0; count < V - 1; ++count) {
        int u = -1;

        // Find the vertex with the smallest unprocessed distance
        for (int i = 0; i < V; ++i) {
            if (!visited[i] && (u == -1 || dist[i] < dist[u])) {
                u = i;
            }
        }

        // Mark this node as processed
        visited[u] = true;

        // Explore all neighbors of the selected vertex
        for (auto& neighbor : adj[u]) {
            int v = neighbor.first; // Neighboring vertex
            int weight = neighbor.second; // Weight of the edge u-v

            // If a shorter path to v is found through u, update it
            if (!visited[v] && dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight; // Update distance to v
                parent[v] = u; // Set u as parent of v
            }
        }
    }
   
    // Print shortest distances and paths from source to each vertex
    printf("Vertex\t Distance\tPath\n");
    for (int i = 0; i < V; ++i) {
        printf("%d\t\t %d\t\t", i, dist[i]);

        // Print the path from source to vertex i
        if (dist[i] != INF) {
            int temp = i;
            stack<int> path; // Stack to reverse the order of path
            while (temp != -1) {
                path.push(temp);
                temp = parent[temp];
            }
            while (!path.empty()) {
                printf("%d", path.top());
                path.pop();
                if (!path.empty()) printf(" -> ");
            }
        }
        printf("\n");
    }
}

// Main function to test the Graph class
int main() {
    auto start = std::chrono::high_resolution_clock::now();
    int V = 30; // Number of vertices in the graph
    Graph g(V);

    // Adding edges with weights
   g.addEdge(0, 1, 2);
    g.addEdge(0, 2, 6);
    g.addEdge(1, 3, 5);
    g.addEdge(2, 3, 8);
    g.addEdge(3, 4, 10);
    g.addEdge(3, 5, 15);
    g.addEdge(4, 6, 2);
    g.addEdge(5, 6, 6);
    g.addEdge(0, 7, 1);
    g.addEdge(1, 8, 3);
    g.addEdge(7, 9, 4);
    g.addEdge(8, 10, 2);
    g.addEdge(9, 11, 6);
    g.addEdge(10, 12, 7);
    g.addEdge(12, 13, 1);
    g.addEdge(13, 14, 2);
    g.addEdge(14, 15, 3);
    g.addEdge(15, 16, 4);
    g.addEdge(16, 17, 5);
    g.addEdge(17, 18, 6);
    g.addEdge(18, 19, 7);
    g.addEdge(19, 20, 8);
    g.addEdge(20, 21, 9);
    g.addEdge(21, 22, 10);
    g.addEdge(22, 23, 11);
    g.addEdge(23, 24, 12);
    g.addEdge(24, 25, 13);
    g.addEdge(25, 26, 14);
    g.addEdge(26, 27, 15);
    g.addEdge(27, 28, 16);
    g.addEdge(28, 29, 17);

    // Calculate and display shortest paths from vertex 0
    g.shortestPath(0);
 auto end = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();

    // Output the duration
    std::cout << "Execution time: " << duration << " microseconds" << std::endl;
    return 0;
}
