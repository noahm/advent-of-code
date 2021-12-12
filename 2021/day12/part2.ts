import { stdinLines } from "../shared/stdin.ts";
import { UndirectedGraph } from "../shared/graph.ts";
import { CountingSet } from "../shared/counting-set.ts";

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
  const nextTrail = [...breadcrumbs, currentNode];
  if (currentNode === "end") {
    return [nextTrail];
  }

  const visited = new CountingSet(nextTrail);
  const canDoubleVisitSmallCave = Array.from(visited.entries()).every(
    ([id, visits]) => !isSmallCave(id) || visits < 2
  );
  return graph
    .getNeighbors(currentNode)
    .reduce<string[][]>((paths, neighbor) => {
      if (isSmallCave(neighbor) && visited.has(neighbor)) {
        if (neighbor === "start" || !canDoubleVisitSmallCave) return paths;
      }
      return [...paths, ...findPathsToEnd(neighbor, nextTrail)];
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
