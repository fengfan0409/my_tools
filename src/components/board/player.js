import Board from "./board";
import Kifu from "./kifu";
import KifuReader from "./kifuReader";
import KNode from "./kNode";
class Player {
  constructor(config) {
    this.ready = false;
    this.config = config;
    this.default_config = {
      sgf: undefined,
      json: undefined,
      sgfFile: undefined,
      move: "last",
      board_click: true,
      board: {},
      enableWheel: true,
      lockScroll: true,
      enableKeys: true,
      rememberPath: true,
      kifuLoaded: undefined,
      update: undefined,
      frozen: undefined,
      unfrozen: undefined,
      allowIllegalMoves: false,
      markLastMove: true,
      displayVariations: true
    };
    // add default configuration
    for (let key in this.default_config)
      if (
        this.config[key] === undefined &&
        this.default_config[key] !== undefined
      )
        this.config[key] = this.default_config[key];
    this.init();
    this.initGame();
    this.ready = true;
  }
  init() {
    // declare kifu
    this.board = new Board(this.config.board);
    this.kifu = null;
  }

  initGame() {
    // try to load game passed in configuration
    this.loadSgf(this.config.sgf, this.config.move);
  }

  loadKifu(kifu, path) {
    this.kifu = kifu;
    // kifu is replayed by KifuReader, it manipulates a Kifu object and gets all changes
    this.kifuReader = new KifuReader(
      this.kifu,
      this.config.rememberPath,
      this.config.allowIllegalMoves
    );
    // fire kifu loaded event
    this.prepare_board();
    // update player - initial position in kifu doesn't have to be an empty board
    this.update("init");
    if (path) {
      this.goTo(path);
    }
    /*if(this.kifu.nodeCount === 0) this.error("");
    else if(this.kifu.propertyCount === 0)*/
  }

  loadSgf(sgf, path) {
    try {
      let kifu = new Kifu();
      this.config.sgf = sgf;
      this.loadKifu(kifu.fromSgf(sgf), path);
    } catch (err) {
      // console.log(err)
    }
  }
  getGameInfo() {
    if (!this.kifu) return null;
    let info = {};
    for (let key in this.kifu.info) {
      if (this.kifu.infoList.indexOf(key) == -1) continue;
      if (this.kifu.infoFormatters[key]) {
        info[WGo.t(key)] = this.kifu.infoFormatters[key](this.kifu.info[key]);
      }
    }
    return info;
  }
  next(i) {
    if (this.config.frozen || !this.kifu) return;
    try {
      this.kifuReader.next(i);
      this.update("next");
    } catch (err) {
      console.log(err);
    }
  }

  previous() {
    if (this.config.frozen || !this.kifu) return;

    try {
      this.kifuReader.previous();
      this.update("previous");
    } catch (err) {
      console.log(err);
    }
  }

  last() {
    if (this.config.frozen || !this.kifu) return;

    try {
      this.kifuReader.last();
      this.update("last");
    } catch (err) {
      console.log(err);
    }
  }

  first() {
    if (this.config.frozen || !this.kifu) return;

    try {
      this.kifuReader.first();
      this.update("first");
    } catch (err) {
      console.log(err);
    }
  }

  goTo(move) {
    if (this.config.frozen || !this.kifu) return;
    let path;
    if (typeof move == "function") move = move.call(this);

    if (typeof move == "number") {
      path = this.kifu.clone(this.kifuReader.path);
      path.m = move || 0;
    } else if (typeof move == "string") {
      switch (move) {
        case "last":
          path = this.kifu.clone(this.kifuReader.path);
          path.m = path.propertyCount || 0;
          break;
        case "first":
          path = this.kifu.clone(this.kifuReader.path);
          path.m = 0;
          break;
      }
    }

    try {
      this.kifuReader.goTo(path);
      this.update("load_sgf");
    } catch (err) {
      console.log(err);
    }
  }

  update_board(e) {
    // update board's position
    if (e.change) this.board.update(e.change);
    if (e.node.markup) {
      setTimeout(() => {
        this.board.addMarkUpObject(e.node.markup);
      }, 100);
    }
    // remove old markers from the board
    if (this.last_marks) this.board.removeObject(this.last_marks);

    // add current move marker
    if (
      e.node.move &&
      this.config.markLastMove &&
      !this.config.showMoveNumber
    ) {
      if (e.node.move.pass) {
        console.log(e.node.move.c === "B" ? "黑方" : "白方" + "pass了！");
      } else {
        this.last_marks = {
          type: "CR",
          x: e.node.move.x,
          y: e.node.move.y
        };
        this.board.addMarkUpObject(this.last_marks);
      }
    }
    if (this.config.showMoveNumber) {
      this.show_move_number();
    } else {
      this.board.clearAllMoveField();
    }
  }
  prepare_board() {
    this.board.setSize(this.kifuReader.kifu.size);
    this.board.removeAllObjects();
  }
  // 黑白
  board_click(x, y, c) {
    if (!this.kifu) {
      this.kifu = this.kifuReader.kifu;
    }
    if (this.kifuReader.game.isValid(x, y, c)) {
      this.kifuReader.node.appendChild(
        new KNode({
          move: {
            x: x,
            y: y,
            c: c ? c : this.kifuReader.game.turn
          }
        })
      );
      this.next(this.kifuReader.node.children.length - 1);
    } else if (this.config.board_click === false) {
      console.log("棋盘点击关闭");
    } else if (!this.kifuReader.game.isValid(x, y, this.kifuReader.game.turn)) {
      console.log(`落子不合法x:${x} y:${y} c:${this.kifuReader.game.turn}`);
    }
  }

  pass() {
    if (!this.kifu) {
      this.kifu = this.kifuReader.kifu;
    }
    this.kifuReader.node.appendChild(
      new KNode({
        move: {
          pass: true,
          c: this.kifuReader.game.turn
        }
      })
    );
    this.next(this.kifuReader.node.children.length - 1);
  }

  update(op) {
    if (!this.kifuReader || !this.kifuReader.change) return;
    let ev = {
      type: "update",
      op: op,
      target: this,
      node: this.kifuReader.node,
      position: this.kifuReader.getPosition(),
      path: this.kifuReader.path,
      change: this.kifuReader.change
    };
    this.update_board(ev);
  }

  convert_sgf_to_xy(sgf) {
    let xyInt = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t"
    ];
    let c = sgf.split(";")[1].split("[")[0] === "W" ? "W" : "B";
    let xyStr = sgf.split(";")[1].split("[")[1].split("]")[0];
    let x = xyInt.indexOf(xyStr[0]);
    let y = xyInt.indexOf(xyStr[1]);
    return { c: c, x: x, y: y };
  }
  convert_xy_to_sgf(obj) {
    let cow = "abcdefghijklmnopqrst";
    if (obj.c === "B") {
      return `;B[${cow[obj.x]}${cow[obj.y]}]`;
    } else {
      return `;W[${cow[obj.x]}${cow[obj.y]}]`;
    }
  }
  get_abc(index) {
    let cow = "ABCDEFGHIJKLMNOPQRST";
    return cow[index];
  }
  show_move_number() {
    if (this.config.showMoveNumber) {
      try {
        this.board.clearAllMoveField();
        let node = this.kifuReader.kifu.root;
        let last_move_node = this.kifuReader.node;
        if (
          "move" in last_move_node &&
          last_move_node.move.x &&
          last_move_node.move.y
        ) {
          this.board.removeMarkUpObjectAt(
            last_move_node.move.x,
            last_move_node.move.y
          );
        }

        if (node.children.length > 0) {
          this.add_move_number(node.children, 1);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  add_move_number(node, path) {
    // console.log(this.kifuReader.path.m)
    if (node.length > 0 && this.kifuReader.path.m >= path ) {
      this.board.addMoveObject({
        x: node[node.length - 1].move.x,
        y: node[node.length - 1].move.y,
        type: "NUMBER",
        text: path.toString()
      });
    }
    if (
      node[node.length - 1].children &&
      node[node.length - 1].children.length > 0
    ) {
      this.add_move_number(node[node.length - 1].children, path + 1);
    }
  }
}
export default Player;
