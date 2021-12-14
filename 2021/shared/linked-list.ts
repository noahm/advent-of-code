export interface Node<T> {
  item: T;
  next: Node<T> | null;
}

export class SingleLinkedList<T> {
  private _length = 0;
  private start: Node<T> | null = null;
  private end: Node<T> | null = null;

  public get length() {
    return this._length;
  }

  public add(item: T) {
    if (!this.start) {
      this.start = { item, next: null };
      this.end = this.start;
    } else {
      this.end!.next = { item, next: null };
      this.end = this.end!.next;
    }
    this._length++;
  }

  public addAfter(node: Node<T>, item: T) {
    if (this.end === node) {
      this.add(item);
    } else {
      node.next = { item, next: node.next };
      this._length++;
    }
  }

  public *nodes() {
    let node = this.start;
    while (node) {
      yield node;
      node = node.next;
    }
  }

  public *values() {
    for (const node of this.nodes()) {
      yield node.item;
    }
  }
}
