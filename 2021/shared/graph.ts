export class UndirectedGraph {
  nodes = new Set<string>();
  edgesByNode = new Map<string, string[]>();

  public addEdge(a: string, b: string) {
    this.nodes.add(a);
    this.nodes.add(b);
    this.addOrSetEdgeForNode(a, b);
    this.addOrSetEdgeForNode(b, a);
  }

  private addOrSetEdgeForNode(a: string, b: string) {
    const edges = this.edgesByNode.get(a);
    if (edges) {
      edges.push(b);
    } else {
      this.edgesByNode.set(a, [b]);
    }
  }

  public getNodes(): ReadonlySet<string> {
    return this.nodes;
  }

  public getNeighbors(id: string): ReadonlyArray<string> {
    return this.edgesByNode.get(id) || [];
  }
}
