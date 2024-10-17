class InvalidMoveError {
  constructor(code, node) {
    this.error = new Error();
    this.code = code;
    this.node = node;
    this.init();
  }
  init() {
    this.error.name = "InvalidMoveError";
    this.error.message = "Invalid move in kifu detected. ";

    if (
      this.node.move &&
      this.node.move.c !== undefined &&
      this.node.move.x !== undefined &&
      this.node.move.y !== undefined
    ) {
      let letter = this.node.move.x;
      if (this.node.move.x > 7) letter++;
      letter = String.fromCharCode(letter + 65);
      this.error.message +=
        "Trying to play " +
        (this.node.move.c === "W" ? "white" : "black") +
        " move on " +
        String.fromCharCode(this.node.move.x + 65) +
        "" +
        (19 - this.node.move.y);
    } else
      this.error.message += "Move object doesn't contain arbitrary attributes.";

    if (this.code) {
      switch (this.code) {
        case 1:
          this.error.message += ", but these coordinates are not on board.";
          break;
        case 2:
          this.error.message += ", but there already is a stone.";
          break;
        case 3:
          this.error.message += ", but this move is a suicide.";
          break;
        case 4:
          this.error.message += ", but this position already occured.";
          break;
      }
    } else this.error.message += ".";
  }
}
export default InvalidMoveError;
