class KNode {
  constructor(properties, parent) {
    this.parent = parent || null;
    this.children = [];
    if (properties) for (let key in properties) this[key] = properties[key];
  }

  no_add(arr, obj, key) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].x === obj.x && arr[i].y === obj.y) {
        arr[i][key] = obj[key];
        return;
      }
    }
    arr.push(obj);
  }

  no_remove(arr, obj) {
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].x === obj.x && arr[i].y === obj.y) {
        arr.splice(i, 1);
        return;
      }
    }
  }

  getChild(ch) {
    let i = ch || 0;
    if (this.children[i]) return this.children[i];
    else return null;
  }

  addSetup(setup) {
    this.setup = this.setup || [];
    this.no_add(this.setup, setup, "c");
    return this;
  }

  removeSetup(setup) {
    this.no_remove(this.setup, setup);
    return this;
  }

  addMarkup(markup) {
    this.markup = this.markup || [];
    this.no_add(this.markup, markup, "type");
    return this;
  }

  removeMarkup(markup) {
    this.no_remove(this.markup, markup);
    return this;
  }

  remove() {
    let p = this.parent;
    if (!p) throw new Error("Root node cannot be removed");
    for (let i in p.children) {
      if (p.children[i] == this) {
        p.children.splice(i, 1);
        break;
      }
    }
    p.children = p.children.concat(this.children);
    this.parent = null;
    return p;
  }

  insertAfter(node) {
    for (let child in this.children) {
      this.children[child].parent = node;
    }
    node.children = node.children.concat(this.children);
    node.parent = this;
    this.children = [node];
    return node;
  }

  appendChild(node) {
    node.parent = this;
    this.children.push(node);
    return node;
  }

  getProperties() {
    let props = {};
    for (let key in this) {
      if (
        this.hasOwnProperty(key) &&
        key !== "children" &&
        key !== "parent" &&
        key[0] !== "_"
      )
        props[key] = this[key];
    }
    return props;
  }
}
export default KNode;
