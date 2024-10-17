import Kifu from "./kifu";
import KNode from "./kNode";
function to_num(str, i) {
  return str.charCodeAt(i) - 97;
}
function sgf_player_info(type, black, kifu, node, value, ident) {
  let c = ident === black ? "black" : "white";
  kifu.info[c] = kifu.info[c] || {};
  kifu.info[c][type] = value[0];
}
class SGF {
  constructor() {
    this.reg_seq = /\(|\)|(;(\s*[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+)*)/g;
    this.reg_node = /[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+/g;
    this.reg_ident = /[A-Z]+/;
    this.reg_props = /(\[\])|(\[(.|\s)*?([^\\]\]))/g;
    this.properties = {};
    this.init_properties();
  }

  init_properties() {
    this.properties["B"] = this.properties["W"] = function(
      kifu,
      node,
      value,
      ident
    ) {
      if (!value[0] || (kifu.size <= 19 && value[0] === "tt"))
        node.move = {
          pass: true,
          c: ident === "B" ? "B" : "W"
        };
      else
        node.move = {
          x: to_num(value[0], 0),
          y: to_num(value[0], 1),
          c: ident === "B" ? "B" : "W"
        };
    };

    // Setup properties
    this.properties["AB"] = this.properties["AW"] = function(
      kifu,
      node,
      value,
      ident
    ) {
      for (let i in value) {
        node.addSetup({
          x: to_num(value[i], 0),
          y: to_num(value[i], 1),
          c: ident === "AB" ? "B" : "W"
        });
      }
    };
    this.properties["AE"] = function(kifu, node, value) {
      for (let i in value) {
        node.addSetup({
          x: to_num(value[i], 0),
          y: to_num(value[i], 1)
        });
      }
    };
    this.properties["PL"] = function(kifu, node, value) {
      node.turn = value[0] === "b" || value[0] === "B" ? "B" : "W";
    };

    // Node annotation properties
    this.properties["C"] = function(kifu, node, value) {
      node.comment = value.join();
    };

    // Markup properties
    this.properties["LB"] = function(kifu, node, value) {
      for (let i in value) {
        node.addMarkup({
          x: to_num(value[i], 0),
          y: to_num(value[i], 1),
          type: "LB",
          text: value[i].substr(3)
        });
      }
    };
    this.properties["CR"] = this.properties["SQ"] = this.properties[
      "TR"
    ] = this.properties["SL"] = this.properties["MA"] = this.properties[
      "SM"
    ] = this.properties["CRY"] = function(kifu, node, value, ident) {
      for (let i in value) {
        node.addMarkup({
          x: to_num(value[i], 0),
          y: to_num(value[i], 1),
          type: ident
        });
      }
    };

    // Root properties
    this.properties["SZ"] = function(kifu, node, value) {
      kifu.size = parseInt(value[0]);
    };

    // Game info properties
    this.properties["BR"] = this.properties["WR"] = sgf_player_info.bind(
      this,
      "rank",
      "BR"
    );
    this.properties["PB"] = this.properties["PW"] = sgf_player_info.bind(
      this,
      "name",
      "PB"
    );
    this.properties["BT"] = this.properties["WT"] = sgf_player_info.bind(
      this,
      "team",
      "BT"
    );
    this.properties["TM"] = function(kifu, node, value, ident) {
      kifu.info[ident] = value[0];
      node.BL = value[0];
      node.WL = value[0];
    };
  }

  parse(str) {
    let stack = [],
      sequence,
      props,
      vals,
      ident,
      kifu = new Kifu(),
      node = null;

    // make sequence of elements and process it
    sequence = str.match(this.reg_seq);

    for (let i in sequence) {
      // push stack, if new letiant
      if (sequence[i] === "(") stack.push(node);
      // pop stack at the end of letiant
      else if (sequence[i] === ")") node = stack.pop();
      // reading node (string starting with ';')
      else {
        // create node or use root
        if (node) kifu.nodeCount++;
        let knode = new KNode();
        node = node ? node.appendChild(knode) : kifu.root;

        // make array of properties
        props = sequence[i].match(this.reg_node) || [];
        kifu.propertyCount += props.length;

        // insert all properties to node
        for (let j in props) {
          // get property's identificator
          ident = this.reg_ident.exec(props[j])[0];

          // separate property's values
          vals = props[j].match(this.reg_props);

          // remove additional braces [ and ]
          for (let k in vals)
            vals[k] = vals[k]
              .substring(1, vals[k].length - 1)
              .replace(/\\(?!\\)/g, "");

          // call property handler if any
          if (this.properties[ident])
            this.properties[ident](kifu, node, vals, ident);
          else {
            // if there is only one property, strip array
            if (vals.length <= 1) vals = vals[0];

            // default node property saving
            if (node.parent) node[ident] = vals;
            // default root property saving
            else {
              kifu.info[ident] = vals;
            }
          }
        }
      }
    }

    return kifu;
  }
}
export default SGF;
