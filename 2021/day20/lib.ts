export function enhance(grid: InfiniteGrid, algorithm: string): InfiniteGrid {
  const ret = new InfiniteGrid(
    grid.baseValue === "." ? algorithm[0] : algorithm[algorithm.length - 1]
  );
  for (const point of grid.pointsInFrame()) {
    ret.set(point, getEnhancedPoint(point, grid, algorithm));
  }
  return ret;
}

export function getEnhancedPoint(
  center: Point,
  grid: InfiniteGrid,
  algorithm: string
) {
  let binary = "";
  for (const point of neighborsAndSelf(center)) {
    binary += grid.get(point) === "#" ? "1" : "0";
  }
  const idx = parseInt(binary, 2);
  return algorithm[idx];
}

function* neighborsAndSelf({ x, y }: Point) {
  yield { x: x - 1, y: y - 1 };
  yield { x, y: y - 1 };
  yield { x: x + 1, y: y - 1 };

  yield { x: x - 1, y };
  yield { x, y };
  yield { x: x + 1, y };

  yield { x: x - 1, y: y + 1 };
  yield { x, y: y + 1 };
  yield { x: x + 1, y: y + 1 };
}

export interface Point {
  x: number;
  y: number;
}

function pts(p: Point) {
  return `${p.x},${p.y}`;
}

export class InfiniteGrid {
  private points = new Map<string, string>();
  private bounds = {
    xMin: Infinity,
    xMax: -Infinity,
    yMin: Infinity,
    yMax: -Infinity,
  };
  private lit = 0;

  constructor(public baseValue = ".") {}

  public addRow(line: string, y: number) {
    for (let x = 0; x < line.length; x++) {
      this.set({ x, y }, line[x]);
    }
  }

  public countLit() {
    return this.lit;
  }

  public getBounds(): Readonly<typeof this.bounds> {
    return this.bounds;
  }

  public get(p: Point) {
    return this.points.get(pts(p)) || this.baseValue;
  }

  public set(p: Point, v: string) {
    this.points.set(pts(p), v);
    this.updateBounds(p);
    if (v === "#") {
      this.lit++;
    }
  }

  private updateBounds(p: Point) {
    this.bounds.xMin = Math.min(this.bounds.xMin, p.x);
    this.bounds.yMin = Math.min(this.bounds.yMin, p.y);
    this.bounds.xMax = Math.max(this.bounds.xMax, p.x);
    this.bounds.yMax = Math.max(this.bounds.yMax, p.y);
  }

  public print(bounds = this.bounds) {
    for (let y = bounds.yMin - 3; y <= bounds.yMax + 3; y++) {
      let line = "";
      for (let x = bounds.xMin - 3; x <= bounds.xMax + 3; x++) {
        line += this.get({ x, y });
      }
      console.log(line);
    }
  }

  public *pointsInFrame() {
    for (let y = this.bounds.yMin - 1; y <= this.bounds.yMax + 1; y++) {
      for (let x = this.bounds.xMin - 1; x <= this.bounds.xMax + 1; x++) {
        yield { x, y };
      }
    }
  }
}
