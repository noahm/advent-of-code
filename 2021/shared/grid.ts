/** utility class for drawing things onto a grid */
export class Grid {
  private rows: string[][] = [];
  private max = { x: 0, y: 0 };

  constructor(private fill = " ") {}

  public add(char: string, { x, y }: { x: number; y: number }) {
    this.max = {
      x: Math.max(x, this.max.x),
      y: Math.max(y, this.max.y),
    };
    if (!this.rows[y]) {
      this.rows[y] = [];
    }
    this.rows[y][x] = char;
  }

  public print() {
    for (let y = 0; y <= this.max.y; y++) {
      let line = "";
      for (let x = 0; x <= this.max.x; x++) {
        line += (this.rows[y] || [])[x] || this.fill;
      }
      console.log(line);
    }
  }
}
