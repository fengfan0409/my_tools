export default function choseTheme(theme) {
  return eval(`new ${theme}()`);
}
class simulant {
  constructor() {
    this.starPoints = this.setStarPoints();
    this.coordinatesColor = "black";
    this.startPointColor = "#86603B";
    this.gridLinesColor = "#86603B";
    this.gridLinesWidth = 1;
    this.gridCoordinatesLinesWidth = 1;
    this.shadowSize = 1;
    this.stoneRadius = 1;
    this.linesShift = 0.5;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowBlur = 10;
    this.shadowColor = "rgba(32,32,32,0.2)";
    this.starSize = 3;
    this.stoneSize = 1;
    this.black_pieces_pic_path = "/static/board/black.png";
    this.white_pieces_pic_path = "/static/board/white.png";
    this.initPiecesPic();
  }
  initPiecesPic() {
    let that = this;
    uni.getImageInfo({
      src: this.black_pieces_pic_path,
      success: function(image) {
        that.black_pieces_pic = image;
      }
    });
    uni.getImageInfo({
      src: this.white_pieces_pic_path,
      success: function(image) {
        that.white_pieces_pic = image;
      }
    });
  }
  setStarPoints() {
    return {
      5: [{ x: 2, y: 2 }],
      7: [{ x: 3, y: 3 }],
      8: [
        { x: 2, y: 2 },
        { x: 5, y: 2 },
        { x: 2, y: 5 },
        { x: 5, y: 5 }
      ],
      9: [{ x: 4, y: 4 }],
      10: [
        { x: 2, y: 2 },
        { x: 7, y: 2 },
        { x: 2, y: 7 },
        { x: 7, y: 7 }
      ],
      11: [
        { x: 2, y: 2 },
        { x: 8, y: 2 },
        { x: 5, y: 5 },
        { x: 2, y: 8 },
        { x: 8, y: 8 }
      ],
      12: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 }
      ],
      13: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 6, y: 6 },
        { x: 3, y: 9 },
        { x: 9, y: 9 }
      ],
      14: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 }
      ],
      15: [
        { x: 3, y: 3 },
        { x: 11, y: 3 },
        { x: 7, y: 7 },
        { x: 3, y: 11 },
        { x: 11, y: 11 }
      ],
      16: [
        { x: 3, y: 3 },
        { x: 12, y: 3 },
        { x: 3, y: 12 },
        { x: 12, y: 12 }
      ],
      17: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 13, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 },
        { x: 13, y: 8 },
        { x: 3, y: 13 },
        { x: 8, y: 13 },
        { x: 13, y: 13 }
      ],
      18: [
        { x: 3, y: 3 },
        { x: 14, y: 3 },
        { x: 3, y: 14 },
        { x: 14, y: 14 }
      ],
      19: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 15, y: 3 },
        { x: 3, y: 9 },
        { x: 9, y: 9 },
        { x: 15, y: 9 },
        { x: 3, y: 15 },
        { x: 9, y: 15 },
        { x: 15, y: 15 }
      ],
      20: [
        { x: 3, y: 3 },
        { x: 16, y: 3 },
        { x: 3, y: 16 },
        { x: 16, y: 16 }
      ],
      21: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 17, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 },
        { x: 17, y: 10 },
        { x: 3, y: 17 },
        { x: 10, y: 17 },
        { x: 17, y: 17 }
      ]
    };
  }
  drawBlackPiece(args, that) {
    if (!this.black_pieces_pic.path) {
      this.drawBackBlackPiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.black_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );
    that.pointContext.closePath();
  }
  drawWhitePiece(args, that) {
    if (!this.white_pieces_pic.path) {
      this.drawBackWhitePiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.white_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );

    that.pointContext.closePath();
  }
  drawBackBlackPiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();

    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#666");
    grd.addColorStop(1, "#000");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();
    that.pointContext.closePath();
  }
  drawBackWhitePiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#fff");
    grd.addColorStop(1, "#e3e3e3");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();

    that.pointContext.closePath();
  }
}
class normal {
  constructor() {
    this.starPoints = this.setStarPoints();
    this.coordinatesColor = "black";
    this.startPointColor = "#86603B";
    this.gridLinesColor = "#86603B";
    this.gridLinesWidth = 1;
    this.gridCoordinatesLinesWidth = 1;
    this.shadowSize = 1;
    this.stoneRadius = 1;
    this.linesShift = 0.5;
    this.shadowOffsetX = 1;
    this.shadowOffsetY = 1;
    this.shadowBlur = 10;
    this.shadowColor = "rgba(32,32,32,0.2)";
    this.starSize = 3;
    this.stoneSize = 1;
    this.black_pieces_pic_path = "/static/board/2d_black.png";
    this.white_pieces_pic_path = "/static/board/2d_white.png";
    this.initPiecesPic();
  }
  initPiecesPic() {
    let that = this;
    uni.getImageInfo({
      src: this.black_pieces_pic_path,
      success: function(image) {
        that.black_pieces_pic = image;
      }
    });
    uni.getImageInfo({
      src: this.white_pieces_pic_path,
      success: function(image) {
        that.white_pieces_pic = image;
      }
    });
  }
  setStarPoints() {
    return {
      5: [{ x: 2, y: 2 }],
      7: [{ x: 3, y: 3 }],
      8: [
        { x: 2, y: 2 },
        { x: 5, y: 2 },
        { x: 2, y: 5 },
        { x: 5, y: 5 }
      ],
      9: [{ x: 4, y: 4 }],
      10: [
        { x: 2, y: 2 },
        { x: 7, y: 2 },
        { x: 2, y: 7 },
        { x: 7, y: 7 }
      ],
      11: [
        { x: 2, y: 2 },
        { x: 8, y: 2 },
        { x: 5, y: 5 },
        { x: 2, y: 8 },
        { x: 8, y: 8 }
      ],
      12: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 }
      ],
      13: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 6, y: 6 },
        { x: 3, y: 9 },
        { x: 9, y: 9 }
      ],
      14: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 }
      ],
      15: [
        { x: 3, y: 3 },
        { x: 11, y: 3 },
        { x: 7, y: 7 },
        { x: 3, y: 11 },
        { x: 11, y: 11 }
      ],
      16: [
        { x: 3, y: 3 },
        { x: 12, y: 3 },
        { x: 3, y: 12 },
        { x: 12, y: 12 }
      ],
      17: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 13, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 },
        { x: 13, y: 8 },
        { x: 3, y: 13 },
        { x: 8, y: 13 },
        { x: 13, y: 13 }
      ],
      18: [
        { x: 3, y: 3 },
        { x: 14, y: 3 },
        { x: 3, y: 14 },
        { x: 14, y: 14 }
      ],
      19: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 15, y: 3 },
        { x: 3, y: 9 },
        { x: 9, y: 9 },
        { x: 15, y: 9 },
        { x: 3, y: 15 },
        { x: 9, y: 15 },
        { x: 15, y: 15 }
      ],
      20: [
        { x: 3, y: 3 },
        { x: 16, y: 3 },
        { x: 3, y: 16 },
        { x: 16, y: 16 }
      ],
      21: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 17, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 },
        { x: 17, y: 10 },
        { x: 3, y: 17 },
        { x: 10, y: 17 },
        { x: 17, y: 17 }
      ]
    };
  }
  drawBlackPiece(args, that) {
    if (!this.black_pieces_pic.path) {
      this.drawBackBlackPiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.black_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );

    that.pointContext.closePath();
  }
  drawWhitePiece(args, that) {
    if (!this.white_pieces_pic.path) {
      this.drawBackWhitePiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.white_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );

    that.pointContext.closePath();
  }
  drawBackBlackPiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#666");
    grd.addColorStop(1, "#000");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();

    that.pointContext.closePath();
  }
  drawBackWhitePiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#fff");
    grd.addColorStop(1, "#e3e3e3");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();

    that.pointContext.closePath();
  }
}
class cartoon {
  constructor() {
    this.starPoints = this.setStarPoints();
    this.coordinatesColor = "black";
    this.startPointColor = "#86603B";
    this.gridLinesColor = "#86603B";
    this.gridLinesWidth = 1;
    this.gridCoordinatesLinesWidth = 1;
    this.shadowSize = 1;
    this.stoneRadius = 1;
    this.linesShift = 0.5;
    this.shadowOffsetX = 1;
    this.shadowOffsetY = 1;
    this.shadowBlur = 10;
    this.shadowColor = "rgba(32,32,32,0.2)";
    this.starSize = 3;
    this.stoneSize = 1;
    this.black_pieces_pic_path = "/static/board/cartoon_black.png";
    this.white_pieces_pic_path = "/static/board/cartoon_white.png";
    this.initPiecesPic();
  }
  initPiecesPic() {
    let that = this;
    uni.getImageInfo({
      src: this.black_pieces_pic_path,
      success: function(image) {
        that.black_pieces_pic = image;
      }
    });
    uni.getImageInfo({
      src: this.white_pieces_pic_path,
      success: function(image) {
        that.white_pieces_pic = image;
      }
    });
  }
  setStarPoints() {
    return {
      5: [{ x: 2, y: 2 }],
      7: [{ x: 3, y: 3 }],
      8: [
        { x: 2, y: 2 },
        { x: 5, y: 2 },
        { x: 2, y: 5 },
        { x: 5, y: 5 }
      ],
      9: [{ x: 4, y: 4 }],
      10: [
        { x: 2, y: 2 },
        { x: 7, y: 2 },
        { x: 2, y: 7 },
        { x: 7, y: 7 }
      ],
      11: [
        { x: 2, y: 2 },
        { x: 8, y: 2 },
        { x: 5, y: 5 },
        { x: 2, y: 8 },
        { x: 8, y: 8 }
      ],
      12: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 }
      ],
      13: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 6, y: 6 },
        { x: 3, y: 9 },
        { x: 9, y: 9 }
      ],
      14: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 }
      ],
      15: [
        { x: 3, y: 3 },
        { x: 11, y: 3 },
        { x: 7, y: 7 },
        { x: 3, y: 11 },
        { x: 11, y: 11 }
      ],
      16: [
        { x: 3, y: 3 },
        { x: 12, y: 3 },
        { x: 3, y: 12 },
        { x: 12, y: 12 }
      ],
      17: [
        { x: 3, y: 3 },
        { x: 8, y: 3 },
        { x: 13, y: 3 },
        { x: 3, y: 8 },
        { x: 8, y: 8 },
        { x: 13, y: 8 },
        { x: 3, y: 13 },
        { x: 8, y: 13 },
        { x: 13, y: 13 }
      ],
      18: [
        { x: 3, y: 3 },
        { x: 14, y: 3 },
        { x: 3, y: 14 },
        { x: 14, y: 14 }
      ],
      19: [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 15, y: 3 },
        { x: 3, y: 9 },
        { x: 9, y: 9 },
        { x: 15, y: 9 },
        { x: 3, y: 15 },
        { x: 9, y: 15 },
        { x: 15, y: 15 }
      ],
      20: [
        { x: 3, y: 3 },
        { x: 16, y: 3 },
        { x: 3, y: 16 },
        { x: 16, y: 16 }
      ],
      21: [
        { x: 3, y: 3 },
        { x: 10, y: 3 },
        { x: 17, y: 3 },
        { x: 3, y: 10 },
        { x: 10, y: 10 },
        { x: 17, y: 10 },
        { x: 3, y: 17 },
        { x: 10, y: 17 },
        { x: 17, y: 17 }
      ]
    };
  }
  drawBlackPiece(args, that) {
    if (!this.black_pieces_pic.path) {
      this.drawBackBlackPiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.black_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );

    that.pointContext.closePath();
  }
  drawWhitePiece(args, that) {
    if (!this.white_pieces_pic.path) {
      this.drawBackWhitePiece(args, that);
      return;
    }
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    // that.pointContext.setShadow(
    //   this.shadowOffsetX,
    //   this.shadowOffsetY,
    //   this.shadowBlur,
    //   this.shadowColor
    // );
    that.pointContext.drawImage(
      this.white_pieces_pic.path,
      xr - that.stoneSize,
      yr - that.stoneSize,
      2 * that.stoneSize,
      2 * that.stoneSize
    );

    that.pointContext.closePath();
  }
  drawBackBlackPiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#666");
    grd.addColorStop(1, "#000");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();

    that.pointContext.closePath();
  }
  drawBackWhitePiece(args, that) {
    let xr = that.getX(args.x);
    let yr = that.getY(args.y);
    that.pointContext.beginPath();
    that.pointContext.setShadow(
      this.shadowOffsetX,
      this.shadowOffsetY,
      this.shadowBlur,
      this.shadowColor
    );
    const grd = that.pointContext.createCircularGradient(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize
    );
    grd.addColorStop(0, "#fff");
    grd.addColorStop(1, "#e3e3e3");
    that.pointContext.setFillStyle(grd);
    that.pointContext.arc(
      xr - (2 * this.stoneRadius) / 5,
      yr - (2 * this.stoneRadius) / 5,
      that.stoneSize,
      0,
      5 * Math.PI
    );
    that.pointContext.fill();

    that.pointContext.closePath();
  }
}
