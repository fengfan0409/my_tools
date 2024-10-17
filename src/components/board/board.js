class Board {
  constructor(config) {
    this.config = config
    this.boardWidth = config.elem.width
    this.boardHeight = config.elem.height
    this.boardSize = config.boardSize
    this.mainContext = config.mainContext
    this.numberContext = config.numberContext
    this.situationContext = config.situationContext
    this.maContext = config.maContext
    this.pointContext = config.pointContext
    this.markUpContext = config.markUpContext
    this.section = config.section
    this.showCoordinates = config.showCoordinates
    this.theme = config.theme
    this.init()
  }

  init() {
    this.setSection()
    this.setDimensions()
    this.stoneSize = this.calcStoneSize()
    this.obj_arr = []
    for (let i = 0; i < this.boardSize; i++) {
      this.obj_arr[i] = []
      for (let j = 0; j < this.boardSize; j++) this.obj_arr[i][j] = []
    }
    this.drawBoard()
  }

  reset() {
    this.init()
  }

  resize(elem) {
    this.config.elem = elem
    this.boardWidth = config.elem.width
    this.boardHeight = config.elem.height
    this.setSection()
    this.setDimensions()
    this.stoneSize = this.calcStoneSize()
    this.drawBoard()
    for (let i in this.obj_arr) {
      for (let j in this.obj_arr[i]) {
        for (let layer in this.obj_arr[i][j]) {
          this.drawField(this.obj_arr[i][j][layer])
        }
      }
    }
    this.pointContext.draw()
    this.markUpContext.draw()
    this.numberContext.draw()
    this.maContext.draw()
  }

  setSize(boardSize) {
    this.boardSize = boardSize
    this.setSection()
    this.setDimensions()
    this.stoneSize = this.calcStoneSize()
    this.drawBoard()
    this.obj_arr = []
    for (var i = 0; i < this.boardSize; i++) {
      this.obj_arr[i] = []
      for (var j = 0; j < this.boardSize; j++) this.obj_arr[i][j] = []
    }
    this.pointContext.draw()
    this.markUpContext.draw()
    this.numberContext.draw()
    this.maContext.draw()
  }

  reload() {
    this.setSection()
    this.setDimensions()
    this.stoneSize = this.calcStoneSize()
    this.drawBoard()
    for (let i in this.obj_arr) {
      for (let j in this.obj_arr[i]) {
        for (let layer in this.obj_arr[i][j]) {
          this.drawField(this.obj_arr[i][j][layer])
        }
      }
    }
    this.pointContext.draw()
    this.markUpContext.draw()
    this.numberContext.draw()
    this.maContext.draw()
  }

  setDimensions() {
    this.width = parseInt(this.boardWidth, 10)
    this.height = parseInt(this.boardHeight, 10)
    this.fieldWidth = this.calcFieldWidth()
    this.fieldHeight = this.calcFieldHeight()
    this.left = this.calcLeftMargin()
    this.top = this.calcTopMargin()
  }

  setSection() {
    this.tx = this.section.left
    this.ty = this.section.top
    this.bx = this.boardSize - 1 - this.section.right
    this.by = this.boardSize - 1 - this.section.bottom
  }

  getX(x) {
    return this.left + x * this.fieldWidth
  }

  getY(y) {
    return this.top + y * this.fieldHeight
  }

  calcLeftMargin() {
    return (
      (3 * this.boardWidth) / (4 * (this.bx + 1 - this.tx) + 2) -
      this.fieldWidth * this.tx
    )
  }

  calcTopMargin() {
    return (
      (3 * this.boardHeight) / (4 * (this.by + 1 - this.ty) + 2) -
      this.fieldHeight * this.ty
    )
  }

  calcFieldWidth() {
    return (4 * this.boardWidth) / (4 * (this.bx + 1 - this.tx) + 2)
  }

  calcFieldHeight() {
    return (4 * this.boardHeight) / (4 * (this.by + 1 - this.ty) + 2)
  }

  calcStoneSize() {
    return (
      (this.config.theme.stoneSize *
        Math.min(this.fieldWidth, this.fieldHeight)) /
      2.2
    )
  }
  to_obtain_h5_coordinate(event) {
    // 捕捉落子的x y 坐标
    let x = event.offsetX
    let y = event.offsetY
    x -= this.left
    x /= this.fieldWidth
    x = Math.round(x)
    y -= this.top
    y /= this.fieldHeight
    y = Math.round(y)
    return {
      x: x >= this.boardSize ? -1 : x,
      y: y >= this.boardSize ? -1 : y
    }
  }
  to_obtain_coordinate(e, left, top) {
    let x = e.detail.x - e.target.offsetLeft - left
    let y = e.detail.y - e.target.offsetTop - top
    x -= this.left
    x /= this.fieldWidth
    x = Math.round(x)
    y -= this.top
    y /= this.fieldHeight
    y = Math.round(y)
    return {
      x: x >= this.boardSize ? -1 : x,
      y: y >= this.boardSize ? -1 : y
    }
  }
  getMarkUpColor(args) {
    let color = "#002DFF"
    if ("c" in args) {
      if (args.c === "B") {
        color = "white"
      } else if (args.c === "W") {
        color = "#333333"
      }
    } else {
      let obj = this.obj_arr[args.x][args.y]
      for (let layer in obj) {
        if ("c" in obj[layer]) {
          if (obj[layer].c === "B") {
            color = "white"
          } else if (obj[layer].c === "W") {
            color = "#333333"
          }
        }
      }
    }
    return color
  }
  getTRMarkUpColor(args) {
    let color = "#E02020"
    if ("c" in args) {
      if (args.c === "B") {
        color = "white"
      } else if (args.c === "W") {
        color = "#333333"
      }
    } else {
      let obj = this.obj_arr[args.x][args.y]
      for (let layer in obj) {
        if ("c" in obj[layer]) {
          if (obj[layer].c === "B") {
            color = "white"
          } else if (obj[layer].c === "W") {
            color = "#333333"
          }
        }
      }
    }
    return color
  }
  getSQMarkUpColor(args) {
    let color = "#1DCE56"
    if ("c" in args) {
      if (args.c === "B") {
        color = "white"
      } else if (args.c === "W") {
        color = "#333333"
      }
    } else {
      let obj = this.obj_arr[args.x][args.y]
      for (let layer in obj) {
        if ("c" in obj[layer]) {
          if (obj[layer].c === "B") {
            color = "white"
          } else if (obj[layer].c === "W") {
            color = "#333333"
          }
        }
      }
    }
    return color
  }
  getCRMarkUpColor(args) {
    let color = "#00AEFF"
    if ("c" in args) {
      if (args.c === "B") {
        color = "white"
      } else if (args.c === "W") {
        color = "#333333"
      }
    } else {
      let obj = this.obj_arr[args.x][args.y]
      for (let layer in obj) {
        if ("c" in obj[layer]) {
          if (obj[layer].c === "B") {
            color = "white"
          } else if (obj[layer].c === "W") {
            color = "#333333"
          }
        }
      }
    }
    return color
  }

  drawBoard() {
    this.draw_grid()
    this.draw_coordinates()
    this.draw_layer_shadow()
    this.draw_star_points()
    this.mainContext.draw()
  }
  draw_grid() {
    // 画棋盘线
    let tmp
    this.mainContext.beginPath()
    this.mainContext.setStrokeStyle(this.theme.gridLinesColor)
    let tx = Math.round(this.left)
    let ty = Math.round(this.top)
    let bw = Math.round(this.fieldWidth * (this.boardSize - 1))
    let bh = Math.round(this.fieldHeight * (this.boardSize - 1))
    this.mainContext.strokeRect(
      tx - this.theme.linesShift,
      ty - this.theme.linesShift,
      bw,
      bh
    )
    this.mainContext.setLineWidth(this.theme.gridLinesWidth)
    for (let i = 1; i < this.boardSize - 1; i++) {
      tmp = Math.round(this.getX(i)) - this.theme.linesShift
      this.mainContext.moveTo(tmp, ty)
      this.mainContext.lineTo(tmp, ty + bh)

      tmp = Math.round(this.getY(i)) - this.theme.linesShift
      this.mainContext.moveTo(tx, tmp)
      this.mainContext.lineTo(tx + bw, tmp)
    }
    this.mainContext.stroke()
    this.mainContext.closePath()
  }
  draw_coordinates() {
    // 画边缘坐标标志

    let font = 14
    if (this.boardSize === 19) {
      font = 14
    } else if (this.boardSize === 13) {
      font = 18
    } else if (this.boardSize === 9) {
      font = 28
    }

    let tmp
    let t,
      leftXright,
      leftXleft,
      rightXright,
      rightXleft,
      topYtop,
      topYbotoom,
      bottomYtop,
      bottomYbotoom
    this.mainContext.beginPath()
    this.mainContext.setLineWidth(this.theme.gridCoordinatesLinesWidth)
    this.mainContext.setFillStyle(this.theme.coordinatesColor)
    // 上方纵坐标
    this.mainContext.setTextAlign("center")
    this.mainContext.setTextBaseline("middle")
    if (this.showCoordinates) {
      topYtop = this.getY(-0.75)
      this.mainContext.setFillStyle("#774546")
      this.mainContext.setFontSize(font)
      for (let a = 0; a < this.boardSize; a++) {
        const letter = String.fromCharCode(65 + a)
        t = this.getX(a)
        this.mainContext.fillText(letter, t, topYtop)
      }
    }
    // 下方纵坐标
    bottomYtop = this.getY(this.boardSize - 0.25)
    this.mainContext.setTextAlign("center")
    this.mainContext.setTextBaseline("middle")
    if (this.showCoordinates) {
      for (let b = 0; b < this.boardSize; b++) {
        const letter = String.fromCharCode(65 + b)
        t = this.getX(b)
        this.mainContext.fillText(letter, t, bottomYtop)
      }
    }

    // 左边横坐标
    leftXright = this.getX(-0.75)
    this.mainContext.setTextAlign("center")
    this.mainContext.setTextBaseline("bottom")
    if (this.showCoordinates) {
      for (let c = 0; c < this.boardSize; c++) {
        t = this.getY(c) + 15
        this.mainContext.fillText(this.boardSize - c, leftXright, t)
      }
    }
    // 右边横坐标
    rightXright = this.getX(this.boardSize - 0.25)
    this.mainContext.setTextAlign("center")
    this.mainContext.setTextBaseline("bottom")
    if (this.showCoordinates) {
      for (let d = 0; d < this.boardSize; d++) {
        t = this.getY(d) + 15
        this.mainContext.fillText(this.boardSize - d, rightXright, t)
      }
    }
    this.mainContext.closePath()
  }
  draw_star_points() {
    if (this.theme.starPoints[this.boardSize]) {
      for (let key in this.theme.starPoints[this.boardSize]) {
        let xr = this.getX(this.theme.starPoints[this.boardSize][key].x)
        let yr = this.getY(this.theme.starPoints[this.boardSize][key].y)
        this.mainContext.beginPath()
        this.mainContext.setFillStyle(this.theme.startPointColor)
        this.mainContext.arc(
          xr - (2.2 * this.theme.stoneRadius) / 5,
          yr - (2.2 * this.theme.stoneRadius) / 5,
          this.stoneSize / 6,
          0,
          2 * Math.PI
        )
        this.mainContext.fill()
        this.mainContext.closePath()
      }
    }
  }
  draw_layer_shadow() {
    this.mainContext.setTransform(
      1,
      0,
      0,
      1,
      Math.round((this.theme.shadowSize * this.theme.stoneRadius) / 7),
      Math.round((this.theme.shadowSize * this.theme.stoneRadius) / 7)
    )
  }
  drawMarkUp(args) {
    switch (args.type) {
      case "CR":
        this.drawCR(args)
        break
      case "MA":
        this.drawMA(args)
        break
      case "MASQ":
        this.drawMASQ(args)
        break
      case "MATR":
        this.drawMATR(args)
        break
      case "MACR":
        this.drawMACR(args)
        break
      case "MALB":
        this.drawMALB(args)
        break
      case "SQ":
        this.drawSQ(args)
        break
      case "TR":
        this.drawTR(args)
        break
      case "SM":
        this.drawSM(args)
        break
      case "CRY":
        this.drawCRY(args)
        break
      case "LB":
        this.drawLB(args)
        break
      case "NUMBER":
        this.drawNumber(args)
    }
  }
  drawPieces(args) {
    if (args.c === "W") {
      this.theme.drawWhitePiece(args, this)
    } else if (args.c === "B") {
      this.theme.drawBlackPiece(args, this)
    }
    if (this.checkMarkUpObjectsAt(args.x, args.y)) {
      let obj = this.obj_arr[args.x][args.y]
      for (let layer in obj) {
        if (
          ("type" in obj[layer] && obj[layer].type === "CR") ||
          obj[layer].type === "TR" ||
          obj[layer].type === "SQ" ||
          obj[layer].type === "LB"
        ) {
          this.removeMarkUpObjectAt(obj.x, obj.y, false)
          this.addMarkUpObject(obj[layer])
        }
      }
    }
  }
  drawMA(args) {
    // 画半透明棋子
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    this.maContext.beginPath()
    this.maContext.setGlobalAlpha(0.2)
    this.maContext.arc(
      xr - (2 * this.theme.stoneRadius) / 5,
      yr - (2 * this.theme.stoneRadius) / 5,
      this.stoneSize,
      0,
      2 * Math.PI
    )
    this.maContext.setFillStyle("black")
    this.maContext.fill()

    this.maContext.closePath()
  }
  drawMASQ(args) {
    // 方块
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getSQMarkUpColor(args)
    this.maContext.beginPath()
    this.maContext.setGlobalAlpha(0.5)
    this.maContext.setFillStyle(color)
    this.maContext.fillRect(
      Math.round(xr - this.stoneSize / 2.2) - this.theme.linesShift,
      Math.round(yr - this.stoneSize / 2.2) - this.theme.linesShift,
      this.stoneSize,
      this.stoneSize
    )
    this.maContext.stroke()
    this.maContext.closePath()
  }
  drawMATR(args) {
    // 三角
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getTRMarkUpColor(args)
    this.maContext.beginPath()
    this.maContext.setGlobalAlpha(0.5)
    this.maContext.setFillStyle(color)
    this.maContext.moveTo(
      xr - this.theme.linesShift,
      yr - this.theme.linesShift - Math.round(this.stoneSize / 2.2)
    )
    this.maContext.lineTo(
      Math.round(xr - this.stoneSize / 2.2) - this.theme.linesShift,
      Math.round(yr + this.stoneSize / 3) + this.theme.linesShift
    )
    this.maContext.lineTo(
      Math.round(xr + this.stoneSize / 2.2) + this.theme.linesShift,
      Math.round(yr + this.stoneSize / 3) + this.theme.linesShift
    )
    this.maContext.fill()
    this.maContext.closePath()
  }
  drawMACR(args) {
    // 三角
    var xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getCRMarkUpColor(args)
    this.maContext.beginPath()
    this.maContext.setGlobalAlpha(0.5)
    this.maContext.setStrokeStyle(color)
    this.maContext.setLineWidth(3)
    this.maContext.arc(
      xr - (2.2 * this.theme.stoneRadius) / 5,
      yr - (2.2 * this.theme.stoneRadius) / 5,
      this.stoneSize / 2,
      0,
      2 * Math.PI,
      true
    )
    this.maContext.stroke()
    this.maContext.closePath()
  }
  drawMALB(args) {
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getMarkUpColor(args)
    this.maContext.beginPath()
    this.maContext.setGlobalAlpha(0.5)
    this.maContext.setFillStyle(color)
    let font = 1
    if (args.text.length === 1) {
      font = Math.round(this.stoneSize * 1.2) + font
    } else if (args.text.length === 2) {
      font = Math.round(this.stoneSize * 1.1) + font
    } else {
      font = Math.round(this.stoneSize) + font
    }
    let font_str = `bold ${font}px sans-serif`
    this.maContext.font = font_str
    this.maContext.textBaseline = "middle"
    this.maContext.textAlign = "center"
    this.maContext.fillText(args.text.toString(), xr, yr, 2 * this.stoneSize)

    this.maContext.closePath()
  }
  drawBlackSituation(args) {
    // 黑形势
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    this.situationContext.beginPath()
    this.situationContext.setFillStyle("black")
    this.situationContext.fillRect(
      Math.round(xr - this.stoneSize / 4.3) - this.theme.linesShift,
      Math.round(yr - this.stoneSize / 4.3) - this.theme.linesShift,
      this.stoneSize / 2,
      this.stoneSize / 2
    )
    this.situationContext.closePath()
  }
  drawWhiteSituation(args) {
    // 白形势
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    this.situationContext.beginPath()
    this.situationContext.setFillStyle("white")
    this.situationContext.fillRect(
      Math.round(xr - this.stoneSize / 4.3) - this.theme.linesShift,
      Math.round(yr - this.stoneSize / 4.3) - this.theme.linesShift,
      this.stoneSize / 2,
      this.stoneSize / 2
    )
    this.situationContext.closePath()
  }
  drawCR(args) {
    // 圆圈
    var xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getCRMarkUpColor(args)
    this.markUpContext.beginPath()
    this.markUpContext.setStrokeStyle(color)
    this.markUpContext.setLineWidth(3)
    this.markUpContext.arc(
      xr - (2.2 * this.theme.stoneRadius) / 5 + 0.4,
      yr - (2.2 * this.theme.stoneRadius) / 5 + 0.4,
      this.stoneSize / 2,
      0,
      2 * Math.PI,
      true
    )
    this.markUpContext.stroke()
    this.markUpContext.closePath()
  }
  drawSQ(args) {
    // 方块
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getSQMarkUpColor(args)
    this.markUpContext.beginPath()
    this.markUpContext.setLineCap("round")
    this.markUpContext.setFillStyle(color)
    this.markUpContext.setStrokeStyle(color)
    this.markUpContext.setLineWidth(1)
    this.markUpContext.fillRect(
      Math.round(xr - this.stoneSize / 2.2) - this.theme.linesShift,
      Math.round(yr - this.stoneSize / 2.2) - this.theme.linesShift,
      this.stoneSize,
      this.stoneSize
    )
    this.markUpContext.stroke()
    this.markUpContext.closePath()
  }
  drawTR(args) {
    // 三角
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getTRMarkUpColor(args)
    this.markUpContext.beginPath()
    this.markUpContext.setFillStyle(color)
    this.markUpContext.setStrokeStyle(color)
    this.markUpContext.moveTo(
      xr - this.theme.linesShift,
      yr - this.theme.linesShift - Math.round(this.stoneSize / 2.2)
    )
    this.markUpContext.lineTo(
      Math.round(xr - this.stoneSize / 2.2) - this.theme.linesShift,
      Math.round(yr + this.stoneSize / 3) + this.theme.linesShift
    )
    this.markUpContext.lineTo(
      Math.round(xr + this.stoneSize / 2.2) + this.theme.linesShift,
      Math.round(yr + this.stoneSize / 3) + this.theme.linesShift
    )
    this.markUpContext.fill()
    this.markUpContext.closePath()
  }
  drawSM(args) {
    // 笑脸
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getMarkUpColor(args)
    this.markUpContext.beginPath()
    this.markUpContext.setStrokeStyle(color)
    this.markUpContext.setLineWidth(2)

    this.markUpContext.arc(
      xr - this.stoneSize / 3,
      yr - this.stoneSize / 3,
      this.stoneSize / 6,
      0,
      2 * Math.PI,
      true
    )
    this.markUpContext.stroke()
    this.markUpContext.beginPath()
    this.markUpContext.arc(
      xr + this.stoneSize / 3,
      yr - this.stoneSize / 3,
      this.stoneSize / 6,
      0,
      2 * Math.PI,
      true
    )
    this.markUpContext.stroke()
    this.markUpContext.moveTo(xr - this.stoneSize / 1.5, yr)
    this.markUpContext.bezierCurveTo(
      xr - this.stoneSize / 1.5,
      yr + this.stoneSize / 2,
      xr + this.stoneSize / 1.5,
      yr + this.stoneSize / 2,
      xr + this.stoneSize / 1.5,
      yr
    )
    this.markUpContext.stroke()
    this.markUpContext.closePath()
  }
  drawCRY(args) {
    // 哭
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getMarkUpColor(args)
    this.markUpContext.beginPath()
    this.markUpContext.setStrokeStyle(color)
    this.markUpContext.setLineWidth(2)

    this.markUpContext.arc(
      xr - this.stoneSize / 3,
      yr - this.stoneSize / 3,
      this.stoneSize / 6,
      0,
      2 * Math.PI,
      true
    )
    this.markUpContext.stroke()
    this.markUpContext.arc(
      xr + this.stoneSize / 3,
      yr - this.stoneSize / 3,
      this.stoneSize / 6,
      0,
      2 * Math.PI,
      true
    )
    this.markUpContext.stroke()
    this.markUpContext.moveTo(
      xr - this.stoneSize / 1.5,
      yr + this.stoneSize / 1.5
    )
    this.markUpContext.bezierCurveTo(
      xr - this.stoneSize / 1.5,
      yr,
      xr + this.stoneSize / 1.5,
      yr,
      xr + this.stoneSize / 1.5,
      yr + this.stoneSize / 1.5
    )
    this.markUpContext.stroke()
    this.markUpContext.closePath()
  }
  drawLB(args) {
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getMarkUpColor(args)
    let needBackGround = false
    if (!this.getObjectAt(args.x, args.y)) {
      needBackGround = true
    }
    this.markUpContext.beginPath()
    if (needBackGround) {
      this.markUpContext.setFillStyle(this.config.backGroundColor)
      this.markUpContext.arc(
        xr - (2.2 * this.theme.stoneRadius) / 5,
        yr - (2.2 * this.theme.stoneRadius) / 5,
        this.stoneSize / 1.5,
        0,
        2 * Math.PI,
        true
      )
      this.markUpContext.fill()
    }
    this.markUpContext.setFillStyle(color)
    let font = 1
    if (args.text.length === 1) {
      font = Math.round(this.stoneSize * 1.2) + font
    } else if (args.text.length === 2) {
      font = Math.round(this.stoneSize * 1.1) + font
    } else {
      font = Math.round(this.stoneSize) + font
    }
    let font_str = `bold ${font}px sans-serif`
    this.markUpContext.font = font_str
    this.markUpContext.textBaseline = "middle"
    this.markUpContext.textAlign = "center"
    this.markUpContext.fillText(
      args.text.toString(),
      xr,
      yr,
      2 * this.stoneSize
    )
    this.markUpContext.closePath()
  }
  drawNumber(args) {
    let xr = this.getX(args.x)
    let yr = this.getY(args.y)
    let color = this.getMarkUpColor(args)
    this.numberContext.beginPath()
    this.numberContext.setFillStyle(color)
    let font = 1
    if (args.text.length === 1) {
      font = Math.round(this.stoneSize * 1.2) + font
    } else if (args.text.length === 2) {
      font = Math.round(this.stoneSize * 1.1) + font
    } else {
      font = Math.round(this.stoneSize) + font
    }
    let font_str = `bold ${font}px sans-serif`
    this.numberContext.font = font_str
    this.numberContext.textBaseline = "middle"
    this.numberContext.textAlign = "center"
    this.numberContext.fillText(
      args.text.toString(),
      xr,
      yr,
      2 * this.stoneSize
    )
    this.numberContext.closePath()
  }
  drawField(args) {
    for (let z = 0; z < this.obj_arr[args.x][args.y].length; z++) {
      let obj = this.obj_arr[args.x][args.y][z]
      if (obj) {
        if ("c" in obj) {
          this.drawPieces(obj)
        } else if ("type" in obj) {
          this.drawMarkUp(obj)
        }
      }
    }
  }
  update(changes) {
    let i
    if (changes.remove && changes.remove === "all") this.removeAllObjects()
    else if (changes.remove) {
      for (i = 0; i < changes.remove.length; i++) {
        this.removeObject(changes.remove[i])
      }
    }
    if (changes.add) {
      for (i = 0; i < changes.add.length; i++) {
        this.addObject(changes.add[i])
      }
    }
  }
  addObject(obj) {
    // handling multiple objects
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) {
        this.addObject(obj[i])
      }
      return
    }
    this.clearField(obj)
    let layers = this.obj_arr[obj.x][obj.y]
    layers.push(obj)
    if ("c" in obj) {
      this.drawPieces(obj)
    }
    this.pointContext.draw(true)
  }
  addMarkUpObject(obj) {
    // handling multiple objects
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) {
        this.addMarkUpObject(obj[i])
      }
      return
    }
    this.clearField(obj)

    let layers = this.obj_arr[obj.x][obj.y]
    layers.push(obj)
    if ("type" in obj && obj.type !== "NUMBER") {
      this.drawMarkUp(obj)
    }
    this.markUpContext.draw(true)
  }
  addMAObject(obj) {
    // handling multiple objects
    this.maContext.draw()
    if ("type" in obj && obj.type !== "NUMBER") {
      this.drawMarkUp(obj)
    }
    this.maContext.draw()
  }
  addMoveObject(obj) {
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) {
        this.addMoveObject(obj[i])
      }
      return
    }
    if (this.getMoveObjectAt(obj.x, obj.y)) {
      this.removeMoveObjectAt(obj.x, obj.y)
    }
    if (this.getObjectAt(obj.x, obj.y) === true) {
      let layers = this.obj_arr[obj.x][obj.y]
      if ("type" in obj && obj.type === "NUMBER") {
        layers.push(obj)
        this.drawMarkUp(obj)
      }
    }
    this.numberContext.draw(true)
  }
  addSituation(obj) {
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) {
        this.addSituation(obj[i])
      }
      return
    }
    if ("c" in obj && obj.c === "B") {
      this.drawBlackSituation(obj)
    } else if ("c" in obj && obj.c === "W") {
      this.drawWhiteSituation(obj)
    }
    this.situationContext.draw(true)
  }
  removeSituation() {
    this.situationContext.draw()
  }
  removeMAObject() {
    this.maContext.draw()
  }
  removeObject(obj) {
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) {
        this.removeObject(obj[i])
      }
      return
    }

    this.clearField(obj)

    // for (let i in this.obj_arr) {
    //   for (let j in this.obj_arr[i]) {
    //     for (let layer in this.obj_arr[i][j]) {
    //       this.drawField(this.obj_arr[i][j][layer]);
    //     }
    //   }
    // }
    this.pointContext.draw(true)
    this.markUpContext.draw(true)
    this.numberContext.draw(true)
  }
  removePointObjectAt(x, y, remove = true) {
    if (remove) {
      this.clearPointField({ x: x, y: y })
    }
    let xr = this.getX(x)
    let yr = this.getY(y)
    this.pointContext.beginPath()
    this.pointContext.clearRect(
      xr - this.stoneSize,
      yr - this.stoneSize,
      2.2 * this.stoneSize,
      2.2 * this.stoneSize
    )
    this.pointContext.closePath()
    this.pointContext.draw(true)
  }
  removeMarkUpObjectAt(x, y, remove = true) {
    if (remove) {
      this.clearMarkUpField({ x: x, y: y })
    }
    this.markUpContext.beginPath()
    let xr = this.getX(x)
    let yr = this.getY(y)
    this.markUpContext.clearRect(
      xr - this.stoneSize,
      yr - this.stoneSize,
      2.2 * this.stoneSize,
      2.2 * this.stoneSize
    )
    this.markUpContext.closePath()
    this.markUpContext.draw(true)
  }
  removeMoveObjectAt(x, y, remove = true) {
    if (remove) {
      this.clearMoveField({ x: x, y: y })
    }
    this.numberContext.beginPath()
    let xr = this.getX(x)
    let yr = this.getY(y)
    this.numberContext.clearRect(
      xr - this.stoneSize,
      yr - this.stoneSize,
      2.2 * this.stoneSize,
      2.2 * this.stoneSize
    )
    this.numberContext.closePath()
    this.numberContext.draw(true)
  }
  removeObjectsAt(x, y) {
    this.clearField({ x: x, y: y })
    for (let i in this.obj_arr) {
      for (let j in this.obj_arr[i]) {
        for (let layer in this.obj_arr[i][j]) {
          if ("type" in this.obj_arr[i][j][layer]) {
            this.drawField(this.obj_arr[i][j][layer])
          }
        }
      }
    }
    this.pointContext.draw()
    this.markUpContext.draw()
    this.numberContext.draw()
  }
  checkMarkUpObjectsAt(x, y) {
    let layers = this.obj_arr[x][y]
    for (let layer in layers) {
      if ("type" in layers[layer] && layers[layer].type !== "NUMBER") {
        if (!/^MA/.test(layers[layer].type)) {
          return true
        }
      }
    }
    return false
  }
  checkMarkUpPointObjectAt(x, y) {
    let layers = this.obj_arr[x][y]
    for (let layer in layers) {
      if (
        "c" in layers[layer] &&
        "mark" in layers[layer] &&
        layers[layer].mark === true
      ) {
        return true
      }
    }
    return false
  }
  checkPointObjectAt(x, y) {
    let layers = this.obj_arr[x][y]
    for (let layer in layers) {
      if ("c" in layers[layer] && !("mark" in layers[layer])) {
        return true
      }
    }
    return false
  }
  removeAllMarkUpObjects() {
    try {
      for (let i in this.obj_arr) {
        for (let j in this.obj_arr[i]) {
          for (let layer in this.obj_arr[i][j]) {
            if ("type" in this.obj_arr[i][j][layer]) {
              if (
                this.obj_arr[i][j][layer].type === "CR" ||
                this.obj_arr[i][j][layer].type === "TR" ||
                this.obj_arr[i][j][layer].type === "SQ" ||
                this.obj_arr[i][j][layer].type === "LB"
              ) {
                this.removeMarkUpObjectAt(
                  this.obj_arr[i][j][layer].x,
                  this.obj_arr[i][j][layer].y,
                  false
                )
                delete this.obj_arr[i][j][layer]
              }
            }
          }
        }
      }
    } catch (e) {}
  }
  removeAllObjects() {
    this.obj_arr = []
    for (let i = 0; i < this.boardSize; i++) {
      this.obj_arr[i] = []
      for (let j = 0; j < this.boardSize; j++) this.obj_arr[i][j] = []
    }
    this.pointContext.draw()
    this.markUpContext.draw()
    this.numberContext.draw()
  }
  clearField(obj) {
    try {
      let layers = this.obj_arr[obj.x][obj.y]
      for (let layer in layers) {
        if ("c" in obj) {
          if (layers[layer].c === obj.c) {
            this.removePointObjectAt(obj.x, obj.y, false)
            delete layers[layer]
          }
        } else if ("type" in obj) {
          if (layers[layer].type === obj.type) {
            if (
              layers[layer].type === "CR" ||
              layers[layer].type === "TR" ||
              layers[layer].type === "SQ" ||
              layers[layer].type === "LB"
            ) {
              this.removeMarkUpObjectAt(obj.x, obj.y, false)
            }
            if (layers[layer].type === "NUMBER") {
              this.removeMoveObjectAt(obj.x, obj.y, false)
            }
            delete layers[layer]
          }
        } else {
          this.removePointObjectAt(obj.x, obj.y, false)
          this.removeMarkUpObjectAt(obj.x, obj.y, false)
          this.removeMoveObjectAt(obj.x, obj.y, false)
          delete layers[layer]
        }
      }
    } catch (e) {
    }
  }
  getObjectAt(x, y) {
    try {
      let layers = this.obj_arr[x][y]
      for (let layer in layers) {
        if ("c" in layers[layer]) {
          return true
        }
      }
      return false
    } catch (e) {
      return false
    }
  }
  getObjectInfoAt(x, y) {
    try {
      let layers = this.obj_arr[x][y]
      return layers
    } catch (e) {
      return false
    }
  }
  getMoveObjectAt(x, y) {
    try {
      let layers = this.obj_arr[x][y]
      for (let layer in layers) {
        if ("type" in layers[layer] && layers[layer].type === "NUMBER") {
          return true
        }
      }
      return false
    } catch (e) {
      return false
    }
  }
  clearPointField(obj) {
    try {
      let layers = this.obj_arr[obj.x][obj.y]
      for (let layer in layers) {
        if ("c" in layers[layer]) {
          delete layers[layer]
        }
      }
    } catch (e) {
    }
  }
  clearMarkUpField(obj) {
    try {
      let layers = this.obj_arr[obj.x][obj.y]
      for (let layer in layers) {
        if ("type" in layers[layer] && layers[layer].type !== "NUMBER") {
          delete layers[layer]
        }
      }
    } catch (e) {
    }
  }
  clearMoveField(obj) {
    try {
      let layers = this.obj_arr[obj.x][obj.y]
      for (let layer in layers) {
        if ("type" in layers[layer] && layers[layer].type === "NUMBER") {
          delete layers[layer]
        }
      }
    } catch (e) {
    }
  }
  clearAllMoveField() {
    for (let x in this.obj_arr) {
      for (let y in this.obj_arr[x]) {
        for (let layer in this.obj_arr[x][y]) {
          if (
            "type" in this.obj_arr[x][y][layer] &&
            this.obj_arr[x][y][layer].type === "NUMBER"
          ) {
            delete this.obj_arr[x][y][layer]
          }
        }
      }
    }
    this.numberContext.draw()
  }
}
export default Board
