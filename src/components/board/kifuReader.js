import Game from "./game";
import InvalidMoveError from "./invalidMoveError";
class KifuReader {
  constructor(kifu, rememberPath, allowIllegalMoves) {
    this.kifu = kifu;
    this.rememberPath = rememberPath;
    this.allowIllegalMoves = allowIllegalMoves;
    this.init();
  }
  init() {
    this.node = this.kifu.root;
    this.allow_illegal = this.allowIllegalMoves || false;
    this.game = new Game(
      this.kifu.size,
      this.allow_illegal ? "NONE" : "KO",
      this.allow_illegal,
      this.allow_illegal
    );
    this.path = { m: 0 };

    if (this.kifu.info["HA"] && this.kifu.info["HA"] > 1) this.game.turn = "W";
    this.change = this.exec_node(this.game, this.node, true);

    if (this.rememberPath) this.rememberPath = true;
    else this.rememberPath = false;
  }

  set_subtract(a, b) {
    let n = [],
      q;
    for (let i in a) {
      q = true;
      for (let j in b) {
        if (a[i].x == b[j].x && a[i].y == b[j].y) {
          q = false;
          break;
        }
      }
      if (q) n.push(a[i]);
    }
    return n;
  }

  concat_changes(ch_orig, ch_new) {
    ch_orig.add = this.set_subtract(ch_orig.add, ch_new.remove).concat(
      ch_new.add
    );
    ch_orig.remove = this.set_subtract(ch_orig.remove, ch_new.add).concat(
      ch_new.remove
    );
  }

  exec_node(game, node, first) {
    if (node.parent)
      node.parent._last_selected = node.parent.children.indexOf(node);

    // handle moves nodes
    if (node.move !== undefined) {
      if (node.move.pass) {
        game.pass(node.move.c);
        return { add: [], remove: [] };
      } else {
        let res = game.play(node.move.x, node.move.y, node.move.c);
        if (typeof res == "number") {
          throw new InvalidMoveError(res, node);
        }
        // we must check whether to add move (it can be suicide)
        for (let i in res) {
          if (res[i].x === node.move.x && res[i].y === node.move.y) {
            return {
              add: [],
              remove: res
            };
          }
        }
        return {
          add: [node.move],
          remove: res
        };
      }
    }
    // handle other(setup) nodes
    else {
      if (!first) game.pushPosition();
      let add = [],
        remove = [];

      if (node.setup !== undefined) {
        for (let i in node.setup) {
          if (node.setup[i].c) {
            game.setStone(node.setup[i].x, node.setup[i].y, node.setup[i].c);
            add.push(node.setup[i]);
          } else {
            game.removeStone(node.setup[i].x, node.setup[i].y,node.setup[i].c);
            remove.push(node.setup[i]);
          }
        }
      }

      if (node.turn) game.turn = node.turn;
      return {
        add: add,
        remove: remove
      };
    }
  }

  exec_next(i) {
    if (i === undefined && this.rememberPath) i = this.node._last_selected;
    i = i || 0;
    let node = this.node.children[i];

    if (!node) return false;

    let ch = this.exec_node(this.game, node);

    this.path.m++;
    if (this.node.children.length > 1) this.path[this.path.m] = i;

    this.node = node;
    return ch;
  }

  exec_previous() {
    if (!this.node.parent) return false;

    this.node = this.node.parent;

    this.game.popPosition();
    if (this.node.turn) this.game.turn = this.node.turn;

    if (this.path[this.path.m] !== undefined) delete this.path[this.path.m];
    this.path.m--;
    return true;
  }

  exec_first() {
    //if(!this.node.parent) return;

    this.game.firstPosition();
    this.node = this.kifu.root;

    this.path = { m: 0 };

    if (this.kifu.info["HA"] && this.kifu.info["HA"] > 1) this.game.turn = "W";
    this.change = this.exec_node(this.game, this.node, true);
  }

  next(i) {
    this.change = this.exec_next(i);
    return this;
  }

  /**
   * Execute all nodes till the end.
   */

  last() {
    let ch;
    this.change = {
      add: [],
      remove: []
    };
    while ((ch = this.exec_next())) this.concat_changes(this.change, ch);
    return this;
  }

  pos_diff(old_p, new_p) {
    let size = old_p.size,
      add = [],
      remove = [];

    for (let i = 0; i < size * size; i++) {
      if (old_p.schema[i] && !new_p.schema[i])
        remove.push({ x: Math.floor(i / size), y: i % size });
      else if (old_p.schema[i] !== new_p.schema[i])
        add.push({ x: Math.floor(i / size), y: i % size, c: new_p.schema[i] });
    }

    return {
      add: add,
      remove: remove
    };
  }

  /**
   * Return to the previous position (redo actual node)
   */

  previous() {
    let old_pos = this.game.getPosition();
    this.exec_previous();
    this.change = this.pos_diff(old_pos, this.game.getPosition());
    return this;
  }

  /**
   * Go to the initial position
   */

  first() {
    let old_pos = this.game.getPosition();
    this.exec_first();
    this.change = this.pos_diff(old_pos, this.game.getPosition());
    return this;
  }

  /**
   * Go to position specified by path object
   */

  goTo(path) {
    if (path === undefined) return this;

    let old_pos = this.game.getPosition();
    this.exec_first();
    let r;

    for (let i = 0; i < path.m; i++) {
      if (!this.exec_next(path[i + 1])) {
        break;
      }
    }
    this.change = this.pos_diff(old_pos, this.game.getPosition());

    return this;
  }

  /**
   * Go to previous fork (a node with more than one child)
   */

  previousFork() {
    let old_pos = this.game.getPosition();
    while (this.exec_previous() && this.node.children.length === 1) {}
    this.change = this.pos_diff(old_pos, this.game.getPosition());
    return this;
  }

  /**
   * Shortcut. Get actual position object.
   */

  getPosition() {
    return this.game.getPosition();
  }

  /**
   * Allow or disallow illegal moves to be played
   */

  allowIllegalMoves(b) {
    if (b) {
      this.game.allow_rewrite = true;
      this.game.allow_suicide = true;
      this.repeating = "NONE";
    } else {
      this.game.allow_rewrite = false;
      this.game.allow_suicide = false;
      this.repeating = "KO";
    }
  }
}
export default KifuReader;
