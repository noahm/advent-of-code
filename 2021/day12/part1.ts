import { stdinLines } from "../shared/stdin.ts";
import { UndirectedGraph } from "../shared/graph.ts";

function isSmallCave(id: string) {
  return id.match(/^[a-z]+$/);
}

const graph = new UndirectedGraph();
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const [a, b] = line.split("-");
  graph.addEdge(a, b);
}

function findPathsToEnd(
  currentNode: string,
  breadcrumbs: ReadonlyArray<string> = []
): string[][] {
  if (currentNode === "end") {
    const ret = breadcrumbs.slice();
    ret.push(currentNode);
    return [ret];
  }
  const visited = new Set(breadcrumbs);
  return graph
    .getNeighbors(currentNode)
    .reduce<string[][]>((paths, neighbor) => {
      if (isSmallCave(neighbor) && visited.has(neighbor)) {
        return paths;
      }
      return [
        ...paths,
        ...findPathsToEnd(neighbor, [...breadcrumbs, currentNode]),
      ];
    }, []);
}

const paths = findPathsToEnd("start");
console.log(
  paths
    .map((path) => path.join(",") + "\n")
    .sort((a, b) => {
      if (a > b) return 1;
      return -1;
    })
    .join("")
);
console.log(paths.length);
