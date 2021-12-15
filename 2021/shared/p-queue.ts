export class PQueue<T> {
  private _length = 0;
  private stacks = new Map<number, T[]>();

  /**
   *
   * @param item
   * @param p priority of this item, integers only, lower numbers shifts off first
   */
  public push(item: T, p: number) {
    if (!Number.isInteger(p) || p < 0) {
      throw new TypeError("priority must be an integer >= 0");
    }

    if (!this.stacks.has(p)) {
      this.stacks.set(p, [item]);
    } else {
      this.stacks.get(p)!.push(item);
    }
    this._length += 1;
  }

  public shift() {
    const [[nextPriority, nextVals]] = Array.from(this.stacks.entries()).sort(
      (a, b) => a[0] - b[0]
    );
    this._length--;
    const ret = nextVals.shift();
    if (!nextVals.length) {
      this.stacks.delete(nextPriority);
    }
    return ret;
  }

  public get length() {
    return this._length;
  }
}
