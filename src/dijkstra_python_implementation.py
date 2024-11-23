# Dijkstra's Algorithm to find the shortest paths in a weighted graph
import time

INF = float('inf')  # Infinite distance

class Graph:
    def __init__(self, V):
        self.V = V  # Total vertices
        self.adj = {i: [] for i in range(V)}  # Adjacency list

    # Adds an edge between nodes u and v with a specified weight
    def addEdge(self, u, v, w):
        self.adj[u].append((v, w))  # Adds v to u's list with weight w
        self.adj[v].append((u, w))  # Adds u to v's list with weight w

    # Computes shortest paths from the source vertex to each vertex in the graph
    def shortestPath(self, src):
        dist = [INF] * self.V  # Distance array, initialized with INF for all vertices
        parent = [-1] * self.V  # Parent array to keep track of shortest path tree
        visited = [False] * self.V  # Visited array to mark processed nodes

        dist[src] = 0  # Starting node has a distance of 0

        for count in range(self.V - 1):
            u = -1
            # Find the vertex with the smallest unprocessed distance
            for i in range(self.V):
                if not visited[i] and (u == -1 or dist[i] < dist[u]):
                    u = i

            # Mark this node as processed
            visited[u] = True

            # Explore all neighbors of the selected vertex
            for v, weight in self.adj[u]:
                # If a shorter path to v is found through u, update it
                if not visited[v] and dist[v] > dist[u] + weight:
                    dist[v] = dist[u] + weight
                    parent[v] = u

        # Print shortest distances and paths from source to each vertex
        print("Vertex\tDistance\tPath")
        for i in range(self.V):
            print(f"{i}\t\t{dist[i]}\t\t", end="")
            if dist[i] != INF:
                # Print the path from source to vertex i
                path = []
                temp = i
                while temp != -1:
                    path.append(temp)
                    temp = parent[temp]
                path.reverse()
                print(" -> ".join(map(str, path)))
            else:
                print()

# Main function to test the Graph class
if __name__ == "__main__":
    start_time = time.perf_counter()
    V = 30  # Number of vertices in the graph
    g = Graph(V)

    # Adding edges with weights
    g.addEdge(0, 1, 2)
    g.addEdge(0, 2, 6)
    g.addEdge(1, 3, 5)
    g.addEdge(2, 3, 8)
    g.addEdge(3, 4, 10)
    g.addEdge(3, 5, 15)
    g.addEdge(4, 6, 2)
    g.addEdge(5, 6, 6)
    g.addEdge(0, 7, 1)
    g.addEdge(1, 8, 3)
    g.addEdge(7, 9, 4)
    g.addEdge(8, 10, 2)
    g.addEdge(9, 11, 6)
    g.addEdge(10, 12, 7)
    g.addEdge(12, 13, 1)
    g.addEdge(13, 14, 2)
    g.addEdge(14, 15, 3)
    g.addEdge(15, 16, 4)
    g.addEdge(16, 17, 5)
    g.addEdge(17, 18, 6)
    g.addEdge(18, 19, 7)
    g.addEdge(19, 20, 8)
    g.addEdge(20, 21, 9)
    g.addEdge(21, 22, 10)
    g.addEdge(22, 23, 11)
    g.addEdge(23, 24, 12)
    g.addEdge(24, 25, 13)
    g.addEdge(25, 26, 14)
    g.addEdge(26, 27, 15)
    g.addEdge(27, 28, 16)
    g.addEdge(28, 29, 17)
    # Calculate and display shortest paths from vertex 0
    g.shortestPath(0)
    end_time = time.perf_counter()
    execution_time_microseconds = (end_time - start_time) * 1_000_000

    print(f"Execution time: {execution_time_microseconds:.3f} microseconds")

