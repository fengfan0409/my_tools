import KNode from "./kNode";
import SGF from "./sgfparser";
class Kifu {
  constructor() {
    this.size = 19;
    this.info = {};
    this.root = new KNode();
    this.nodeCount = 0;
    this.propertyCount = 0;
    this.a_char = "a".charCodeAt(0);
    this.infoList = [
      "black",
      "white",
      "AN",
      "CP",
      "DT",
      "EV",
      "GN",
      "GC",
      "HA",
      "ON",
      "OT",
      "RE",
      "RO",
      "RU",
      "SO",
      "TM",
      "US",
      "PC",
      "KM"
    ];
    this.infoFormatters = {
      black: this.player_formatter,
      white: this.player_formatter,
      TM: function(time) {
        if (time === 0) return WGo.t("none");

        let res,
          t = Math.floor(time / 60);

        if (t === 1) res = "1 " + WGo.t("minute");
        else if (t > 1) res = t + " " + WGo.t("minutes");

        t = time % 60;
        if (t === 1) res += " 1 " + WGo.t("second");
        else if (t > 1) res += " " + t + " " + WGo.t("seconds");

        return res;
      },
      RE: function(res) {
        return res;
      }
    };
  }
  fromSgf(sgf) {
    let sgf_obj = new SGF();
    return sgf_obj.parse(sgf);
  }

  fromJGO(arg) {
    let jgo = typeof arg == "string" ? JSON.parse(arg) : arg;
    let kifu = new Kifu();
    kifu.info = JSON.parse(JSON.stringify(jgo.info));
    kifu.size = jgo.size;
    kifu.nodeCount = jgo.nodeCount;
    kifu.propertyCount = jgo.propertyCount;

    kifu.root = new KNode(jgo.game[0]);
    this.recursive_save2(jgo.game, kifu.root);

    return kifu;
  }

  toSgf() {
    let output = { sgf: "(\n;" };

    let root_props = {};

    // other info
    for (let key in this.info) {
      if (key === "black") {
        if (this.info.black.name)
          root_props.PB = this.sgf_escape(this.info.black.name);
        if (this.info.black.rank)
          root_props.BR = this.sgf_escape(this.info.black.rank);
        if (this.info.black.team)
          root_props.BT = this.sgf_escape(this.info.black.team);
      } else if (key === "white") {
        if (this.info.white.name)
          root_props.PW = this.sgf_escape(this.info.white.name);
        if (this.info.white.rank)
          root_props.WR = this.sgf_escape(this.info.white.rank);
        if (this.info.white.team)
          root_props.WT = this.sgf_escape(this.info.white.team);
      } else root_props[key] = this.sgf_escape(this.info[key]);
    }

    // board size
    if (this.size) root_props.SZ = this.size;

    // add missing info
    if (!root_props.AP) root_props.AP = "WGo.js:2";
    if (!root_props.FF) root_props.FF = "4";
    if (!root_props.GM) root_props.GM = "1";
    if (!root_props.CA) root_props.CA = "UTF-8";

    // write root
    for (let key in root_props) {
      if (root_props[key]) output.sgf += key + "[" + root_props[key] + "]";
    }

    this.sgf_write_node(this.root, output);

    output.sgf += ")";

    return output.sgf;
  }

  /**
   * Return JGO from kifu object
   */

  toJGO(stringify) {
    let jgo = {};
    jgo.size = this.size;
    jgo.info = JSON.parse(JSON.stringify(this.info));
    jgo.nodeCount = this.nodeCount;
    jgo.propertyCount = this.propertyCount;
    jgo.game = [];
    this.recursive_save(jgo.game, this.root);
    if (stringify) return JSON.stringify(jgo);
    else return jgo;
  }

  player_formatter(value) {
    let str;
    if (value.name) {
      str = WGo.filterHTML(value.name);
      if (value.rank) str += " (" + WGo.filterHTML(value.rank) + ")";
      if (value.team) str += ", " + WGo.filterHTML(value.team);
    } else {
      if (value.team) str = WGo.filterHTML(value.team);
      if (value.rank) str += " (" + WGo.filterHTML(value.rank) + ")";
    }
    return str;
  }
  recursive_clone(node) {
    let n = new KNode(JSON.parse(JSON.stringify(node.getProperties())));
    for (let ch in node.children) {
      n.appendChild(this.recursive_clone(node.children[ch]));
    }
    return n;
  }

  find_property(prop, node) {
    let res;
    if (node[prop] !== undefined) return node[prop];
    for (let ch in node.children) {
      res = this.find_property(prop, node.children[ch]);
      if (res) return res;
    }
    return false;
  }

  recursive_save(gameTree, node) {
    gameTree.push(JSON.parse(JSON.stringify(node.getProperties())));
    if (node.children.length > 1) {
      let nt = [];
      for (let i = 0; i < node.children.length; i++) {
        let t = [];
        this.recursive_save(t, node.children[i]);
        nt.push(t);
      }
      gameTree.push(nt);
    } else if (node.children.length) {
      this.recursive_save(gameTree, node.children[0]);
    }
  }

  recursive_save2(gameTree, node) {
    let anode = node;
    let tnode;

    for (let i = 1; i < gameTree.length; i++) {
      if (gameTree[i].constructor === Array) {
        for (let j = 0; j < gameTree[i].length; j++) {
          tnode = new KNode(gameTree[i][j][0]);
          anode.appendChild(tnode);
          this.recursive_save2(gameTree[i][j], tnode);
        }
      } else {
        tnode = new KNode(gameTree[i]);
        anode.insertAfter(tnode);
        anode = tnode;
      }
    }
  }

  sgf_escape(text) {
    if (typeof text == "string")
      return text.replace(/\\/g, "\\\\").replace(/]/g, "\\]");
    else return text;
  }

  sgf_coordinates(x, y) {
    return (
      String.fromCharCode(this.a_char + x) +
      String.fromCharCode(this.a_char + y)
    );
  }

  sgf_write_group(prop, values, output) {
    if (!values.length) return;

    output.sgf += prop;
    for (let i in values) {
      output.sgf += "[" + values[i] + "]";
    }
  }

  sgf_write_node(node, output) {
    // move
    if (node.move) {
      let move = "";
      if (!node.move.pass)
        move = this.sgf_coordinates(node.move.x, node.move.y);

      if (node.move.c === "B") output.sgf += "B[" + move + "]";
      else output.sgf += "W[" + move + "]";
    }

    // setup
    if (node.setup) {
      let AB = [];
      let AW = [];
      let AE = [];

      for (let i in node.setup) {
        if (node.setup[i].c === "B")
          AB.push(this.sgf_coordinates(node.setup[i].x, node.setup[i].y));
        else if (node.setup[i].c === "W")
          AW.push(this.sgf_coordinates(node.setup[i].x, node.setup[i].y));
        else AE.push(this.sgf_coordinates(node.setup[i].x, node.setup[i].y));
      }

      this.sgf_write_group("AB", AB, output);
      this.sgf_write_group("AW", AW, output);
      this.sgf_write_group("AE", AE, output);
    }

    // markup
    if (node.markup) {
      let markup = {};

      for (let i in node.markup) {
        markup[node.markup[i].type] = markup[node.markup[i].type] || [];
        if (node.markup[i].type === "LB")
          markup["LB"].push(
            this.sgf_coordinates(node.markup[i].x, node.markup[i].y) +
              ":" +
              this.sgf_escape(node.markup[i].text)
          );
        else
          markup[node.markup[i].type].push(
            this.sgf_coordinates(node.markup[i].x, node.markup[i].y)
          );
      }

      for (let key in markup) {
        this.sgf_write_group(key, markup[key], output);
      }
    }

    // other
    let props = node.getProperties();

    for (let key in props) {
      if (typeof props[key] === "object") continue;

      if (key === "turn")
        output.sgf += "PL[" + (props[key] === "B" ? "B" : "W") + "]";
      else if (key === "comment")
        output.sgf += "C[" + this.sgf_escape(props[key]) + "]";
      else output.sgf += key + "[" + this.sgf_escape(props[key]) + "]";
    }

    if (node.children.length === 1) {
      output.sgf += "\n;";
      this.sgf_write_node(node.children[0], output);
    } else if (node.children.length > 1) {
      for (let key in node.children) {
        this.sgf_write_letiantion(node.children[key], output);
      }
    }
  }

  sgf_write_letiantion(node, output) {
    output.sgf += "(\n;";
    this.sgf_write_node(node, output);
    output.sgf += "\n)";
  }
  clone() {
    let clone = new Kifu();
    clone.size = this.size;
    clone.info = JSON.parse(JSON.stringify(this.info));
    clone.root = this.recursive_clone(this.root);
    clone.nodeCount = this.nodeCount;
    clone.propertyCount = this.propertyCount;
    return clone;
  }
  hasComments() {
    return !!this.find_property("comment", this.root);
  }
}
export default Kifu;
