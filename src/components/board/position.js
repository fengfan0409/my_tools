class Position {
  constructor(size) {
    this.size = size || 19;
    this.schema = [];
    this.init();
  }
  init() {
    for (let i = 0; i < this.size * this.size; i++) {
      this.schema[i] = 0;
    }
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
      return undefined;
    }
    return this.schema[x * this.size + y];
  }
  set(x, y, c) {
    this.schema[x * this.size + y] = c;
    return this;
  }
  clear() {
    this.init();
    return this;
  }
  clone() {
    let clone = new Position(this.size);
    clone.schema = this.schema.slice(0);
    return clone;
  }
  compare(position) {
    let add = [];
    let remove = [];

    for (let i = 0; i < this.size * this.size; i++) {
      if (this.schema[i] && !position.schema[i])
        remove.push({
          x: Math.floor(i / this.size),
          y: i % this.size
        });
      else if (this.schema[i] !== position.schema[i])
        add.push({
          x: Math.floor(i / this.size),
          y: i % this.size,
          c: position.schema[i]
        });
    }

    return {
      add: add,
      remove: remove
    };
  }
}
export default Position;
