import Position from "./position";
class Game {
  constructor(size, checkRepeat, allowRewrite, allowSuicide) {
    this.size = size || 19;
    this.repeating = checkRepeat === undefined ? "KO" : checkRepeat; // possible values: KO, ALL or nothing
    this.allow_rewrite = allowRewrite || false;
    this.allow_suicide = allowSuicide || false;
    this.stack = [];
    this.stack[0] = new Position(this.size);
    this.stack[0].capCount = {
      black: 0,
      white: 0
    };
    this.turn = "B";
    this.init();
  }
  init() {
    Object.defineProperty(this, "position", {
      get: function() {
        return this.stack[this.stack.length - 1];
      },
      set: function(pos) {
        this.stack[this.stack.length - 1] = pos;
      }
    });
  }
  getPosition() {
    return this.stack[this.stack.length - 1];
  }

  play(x, y, c, noplay) {
    //check coordinates validity
    if (!this.isOnBoard(x, y)) {
      return 1;
    }
    if (!this.allow_rewrite && this.position.get(x, y) !== 0) {
      return 2;
    }

    // clone position
    if (!c) {
      c = this.turn;
    }

    let new_pos = this.position.clone();
    new_pos.set(x, y, c);

    // check capturing
    let cap_color = c;
    let captured = check_capturing(new_pos, x - 1, y, reverseColours(c)).concat(
      check_capturing(new_pos, x + 1, y, reverseColours(c)),
      check_capturing(new_pos, x, y - 1, reverseColours(c)),
      check_capturing(new_pos, x, y + 1, reverseColours(c))
    );

    // check suicide
    if (!captured.length) {
      let testing = new Position(this.size);
      if (check_liberties(new_pos, testing, x, y, c)) {
        if (this.allow_suicide) {
          cap_color = reverseColours(c);
          do_capture(new_pos, captured, x, y, c);
        } else return 3;
      }
    }

    // check history
    if (this.repeating && !checkHistory.call(this, new_pos, x, y)) {
      return 4;
    }

    if (noplay) {
      return false;
    }

    // update position info
    new_pos.color = c;
    new_pos.capCount = {
      black: this.position.capCount.black,
      white: this.position.capCount.white
    };
    if (cap_color === "B") {
      new_pos.capCount.black += captured.length;
    } else {
      new_pos.capCount.white += captured.length;
    }

    // save position
    this.pushPosition(new_pos);

    // reverse turn
    this.turn = reverseColours(c);

    return captured;
  }

  pass(c) {
    this.pushPosition();
    if (c) {
      this.position.color = c;
      this.turn = reverseColours(c);
    } else {
      this.position.color = this.turn;
      this.turn = reverseColours(this.turn);
    }
  }

  isValid(x, y, c) {
    return typeof this.play(x, y, c, true) !== "number";
  }

  isOnBoard(x, y) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }

  addStone(x, y, c) {
    if (this.isOnBoard(x, y) && this.position.get(x, y) === 0) {
      this.position.set(x, y, c || 0);
      return true;
    }
    return false;
  }

  removeStone(x, y) {
    if (this.isOnBoard(x, y) && this.position.get(x, y) !== 0) {
      this.position.set(x, y, 0);
      return true;
    }
    return false;
  }

  setStone(x, y, c) {
    if (this.isOnBoard(x, y)) {
      this.position.set(x, y, c || 0);
      return true;
    }
    return false;
  }

  getStone(x, y) {
    if (this.isOnBoard(x, y)) {
      return this.position.get(x, y);
    }
    return 0;
  }

  pushPosition(pos) {
    if (!pos) {
      let new_pos = this.position.clone();
      new_pos.capCount = {
        black: this.position.capCount.black,
        white: this.position.capCount.white
      };
      new_pos.color = this.position.color;
      pos = new_pos;
    }
    this.stack.push(pos);
    if (pos.color) {
      this.turn = reverseColours(pos.color);
    }
    return this;
  }

  popPosition() {
    let old = null;
    if (this.stack.length > 0) {
      old = this.stack.pop();
      if (this.stack.length === 0) {
        this.turn = "B";
      } else if (this.position.color) {
        this.turn = reverseColours(this.position.color);
      } else {
        this.turn = reverseColours(this.turn);
      }
    }
    return old;
  }

  firstPosition() {
    this.stack = [];
    this.stack[0] = new Position(this.size);
    this.stack[0].capCount = {
      black: 0,
      white: 0
    };
    this.turn = "B";
    return this;
  }

  getCaptureCount(color) {
    return color === "B"
      ? this.position.capCount.black
      : this.position.capCount.white;
  }

  validatePosition() {
    let c,
      p,
      white = 0,
      black = 0,
      captured = [],
      new_pos = this.position.clone();

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        c = this.position.get(x, y);
        if (c) {
          p = captured.length;
          captured = captured.concat(
            check_capturing(new_pos, x - 1, y, reverseColours(c)),
            check_capturing(new_pos, x + 1, y, reverseColours(c)),
            check_capturing(new_pos, x, y - 1, reverseColours(c)),
            check_capturing(new_pos, x, y + 1, reverseColours(c))
          );

          if (c === "B") {
            black += captured - p;
          } else {
            white += captured - p;
          }
        }
      }
    }
    this.position.capCount.black += black;
    this.position.capCount.white += white;
    this.position.schema = new_pos.schema;

    return captured;
  }
}

function reverseColours(c) {
  if (c === "B") {
    return "W";
  } else if (c === "W") {
    return "B";
  } else {
    return "B";
  }
}
// function for stone capturing
function do_capture(position, captured, x, y, c) {
  if (
    x >= 0 &&
    x < position.size &&
    y >= 0 &&
    y < position.size &&
    position.get(x, y) === c
  ) {
    position.set(x, y, 0);
    captured.push({
      x: x,
      y: y
    });

    do_capture(position, captured, x, y - 1, c);
    do_capture(position, captured, x, y + 1, c);
    do_capture(position, captured, x - 1, y, c);
    do_capture(position, captured, x + 1, y, c);
  }
}

// looking at liberties
function check_liberties(position, testing, x, y, c) {
  // out of the board there aren't liberties
  if (x < 0 || x >= position.size || y < 0 || y >= position.size) {
    return true;
  }
  // however empty field means liberty
  if (position.get(x, y) === 0) {
    return false;
  }
  // already tested field or stone of enemy isn't giving us a liberty.
  if (testing.get(x, y) === true || position.get(x, y) === reverseColours(c)) {
    return true;
  }

  // set this field as tested
  testing.set(x, y, true);

  // in this case we are checking our stone, if we get 4 trues, it has no liberty
  return (
    check_liberties(position, testing, x, y - 1, c) &&
    check_liberties(position, testing, x, y + 1, c) &&
    check_liberties(position, testing, x - 1, y, c) &&
    check_liberties(position, testing, x + 1, y, c)
  );
}

// analysing function - modifies original position, if there are some capturing, and returns array of captured stones
function check_capturing(position, x, y, c) {
  let captured = [];
  // is there a stone possible to capture?
  if (
    x >= 0 &&
    x < position.size &&
    y >= 0 &&
    y < position.size &&
    position.get(x, y) === c
  ) {
    // create testing map
    var testing = new Position(position.size);
    // if it has zero liberties capture it
    if (check_liberties(position, testing, x, y, c)) {
      // capture stones from game
      do_capture(position, captured, x, y, c);
    }
  }
  return captured;
}

// analysing history
function checkHistory(position, x, y) {
  let flag, stop;

  if (this.repeating === "KO" && this.stack.length - 2 >= 0) {
    stop = this.stack.length - 2;
  } else if (this.repeating === "ALL") {
    stop = 0;
  } else {
    return true;
  }

  for (let i = this.stack.length - 2; i >= stop; i--) {
    if (this.stack[i].get(x, y) === position.get(x, y)) {
      flag = true;
      for (let j = 0; j < this.size * this.size; j++) {
        if (this.stack[i].schema[j] !== position.schema[j]) {
          flag = false;
          break;
        }
      }
      if (flag) return false;
    }
  }
  return true;
}
export default Game;
