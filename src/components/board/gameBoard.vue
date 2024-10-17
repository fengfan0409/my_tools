<template>
    <div class="board-box">
        <div class="board-wrap">
            <canvas
                :canvas-id="`board-main-${name_space}`"
                :class="['main-canvas', { 'main-canvas-radius': isCircle }]"
            ></canvas>
            <canvas
                :canvas-id="`point-main-${name_space}`"
                class="point-canvas"
            ></canvas>
            <canvas
                :canvas-id="`number-main-${name_space}`"
                class="number-canvas"
            ></canvas>
            <canvas
                :canvas-id="`situation-main-${name_space}`"
                class="situation-canvas"
            ></canvas>
            <canvas
                :canvas-id="`ma-main-${name_space}`"
                class="ma-canvas"
            ></canvas>
            <canvas
                :id="`markup-main-${name_space}`"
                :canvas-id="`markup-main-${name_space}`"
                class="markup-canvas"
                @click="move_chess_pieces"
            ></canvas>
        </div>
    </div>
</template>
<script>
import board from './board'
import Player from './player'
import choseTheme from './theme'
// var innerAudioContext = uni.createInnerAudioContext()
export default {
    name: 'gameBoard',
    props: {
        boardObj: {
            default: function () {
                return {
                    sgf: '',
                    section: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    },
                    tsumego: [],
                    move_first: 'black',
                    board_model: '',
                    path: '',
                }
            },
        },
        boardClick: {
            type: Boolean,
            default: true,
        },
        markLastMove: {
            type: Boolean,
            default: true,
        },
        displayVariations: {
            type: Boolean,
            default: false,
        },
        showCoordinates: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: 'simulant',
        },
        isCircle: {
            type: Boolean,
            default: false,
        },
        isMarkCR: {
            type: Boolean,
            default: false,
        },
        isMarkSQ: {
            type: Boolean,
            default: false,
        },
        isMarkTR: {
            type: Boolean,
            default: false,
        },
        isMarkNumb: {
            type: Boolean,
            default: false,
        },
        isMarkChar: {
            type: Boolean,
            default: false,
        },
        isInitBlack: {
            type: Boolean,
            default: false,
        },
        isInitWhite: {
            type: Boolean,
            default: false,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
        showMoveNumber: {
            type: Boolean,
            default: false,
        },
        backGroundColor: {
            type: String,
            default: '#ffd195',
        },
        turnOnAudio: {
            type: Boolean,
            default: false,
        },
        situationObject: {
            type: Object,
            default: function () {
                return {}
            },
        },
        turnOnMouseMove: {
            type: Boolean,
            default: false,
        },
    },
    onResize() {
        const query = uni.createSelectorQuery().in(this)
        query
            .select('.board-wrap')
            .boundingClientRect((elem) => {
                this.player.board.resize(elem)
            })
            .exec()
    },
    watch: {
        //#ifdef H5
        turnOnMouseMove: {
            handler: function (new_boolean) {
                if (typeof new_boolean === 'boolean' && new_boolean === true) {
                    this.init_mouse_move()
                }
            },
            immediate: false,
        },
        //#endif
        situationObject: {
            handler: function () {
                let situationArray = this.generate_situation_array()
                if (situationArray.length > 0) {
                    this.player.board.addSituation(situationArray)
                }
            },
            immediate: false,
            deep: true,
        },
        temp_tsumego: {
            handler: function () {
                if (this.temp_tsumego.length === 0) {
                    return
                }
                //this.temp_tsumego = this.tsumego
                switch (this.board_model) {
                    case 'show_answer':
                        this.add_branch_mark()

                        break
                    case 'research':
                        this.remove_branch_mark()
                        break
                    case 'answer':
                        this.remove_branch_mark()
                        break
                }
            },
            deep: true,
        },
        boardObj: {
            handler(new_obj) {
                // 判断传参 添加默认传参
                this.ma_number = 1
                this.ma_char = 0

                // 设置棋盘裁切
                let boardObj = this.check_board_date(
                    JSON.parse(JSON.stringify(new_obj))
                )
                this.generate_board_data(JSON.parse(JSON.stringify(boardObj)))
            },
            immediate: false,
            deep: true,
        },
        theme: {
            handler: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (!newVal) {
                        this.inner_theme = 'simulant'
                    } else {
                        this.inner_theme = newVal
                    }
                    if (this.player) {
                        this.board_theme = choseTheme(this.inner_theme)
                        setTimeout(() => {
                            this.player.board.theme = this.board_theme
                            this.player.board.reload()
                        }, 500)
                    }
                }
            },
            immediate: false,
        },
        showCoordinates: {
            handler: function (boolean) {
                if (typeof boolean === 'boolean') {
                    if (this.player) {
                        let section = this.calc_section(
                            JSON.parse(
                                JSON.stringify(this.player.board.section)
                            ),
                            boolean
                        )
                        this.player.board.showCoordinates = boolean
                        this.player.board.section = section
                        setTimeout(() => {
                            this.player.board.reload()
                        }, 500)
                    }
                }
            },
            immediate: false,
        },
        showMoveNumber: {
            handler: function (new_boolean) {
                if (typeof new_boolean === 'boolean' && new_boolean === true) {
                    this.player.config.showMoveNumber = new_boolean
                    this.player.config.markLastMove = false
                    this.player.show_move_number()
                } else if (
                    typeof new_boolean === 'boolean' &&
                    new_boolean === false
                ) {
                    this.player.config.showMoveNumber = new_boolean
                    this.player.config.markLastMove = this.markLastMove
                    this.player.board.clearAllMoveField()
                    if (this.markLastMove) {
                        let node = this.player.kifuReader.node
                        if ('move' in node && node.move.x && node.move.y) {
                            this.player.board.addMarkUpObject({
                                x: node.move.x,
                                y: node.move.y,
                                type: 'CR',
                            })
                        }
                    }
                }
            },
        },
    },
    data() {
        return {
            mark_list: [],
            temp_tsumego: [],
            board_model: 'normal',
            sgf: '',
            inner_theme: 'simulant',
            ma_number: 1,
            ma_char: 0,
            name_space: parseInt(Math.random() * (500000000 + 1), 10),
            moveFirst: 'black',
        }
    },
    methods: {
        //#ifdef H5
        mouse_move: function (e) {
            let ob = this.player.board.to_obtain_h5_coordinate(e)
            // 获取h5下鼠标移动的坐标
            //如果之前的虚拟子存在则移除
            this.player.board.removeMAObject()

            // 添加新虚拟子
            if (ob.x >= 0 && ob.y >= 0) {
                // 去除不在棋盘内的鼠标移动
                let markObj = {
                    x: ob.x,
                    y: ob.y,
                }
                if (this.isMarkCR) {
                    markObj.type = 'MACR'
                } else if (this.isMarkSQ) {
                    markObj.type = 'MASQ'
                } else if (this.isMarkTR) {
                    markObj.type = 'MATR'
                } else if (this.isMarkNumb) {
                    if (this.ma_number > 999) {
                        this.ma_number = 1
                    }
                    markObj.type = 'MALB'
                    markObj.text = this.ma_number.toString()
                } else if (this.isMarkChar) {
                    if (this.ma_number > 25) {
                        this.ma_number = 0
                    }
                    markObj.type = 'MALB'
                    let letter = String.fromCharCode(65 + this.ma_char)
                    markObj.text = letter
                } else {
                    markObj.type = 'MA'
                }
                if (markObj.type === 'MA') {
                    if (this.isInitBlack) {
                        if (
                            this.player.kifuReader.game.isValid(ob.x, ob.y, 'B')
                        ) {
                            this.player.board.addMAObject(markObj)
                        }
                    } else if (this.isInitWhite) {
                        if (
                            this.player.kifuReader.game.isValid(ob.x, ob.y, 'B')
                        ) {
                            this.player.board.addMAObject(markObj)
                        }
                    } else if (!this.isInitBlack && !this.isInitWhite) {
                        if (
                            this.player.kifuReader.game.isValid(
                                ob.x,
                                ob.y,
                                this.player.kifuReader.turn
                            )
                        ) {
                            this.player.board.addMAObject(markObj)
                        }
                    }
                } else {
                    this.player.board.addMAObject(markObj)
                }
            } else {
                this.player.board.removeMAObject()
            }
        },
        //#endif
        // playVoice() {
        //     if (this.turnOnAudio) {
        //         innerAudioContext.stop()
        //         innerAudioContext.src =
        //             'https://cdn.elf-go.com/customerTrans/b08ee00cf43ffefdff0e0eec7c43179a/2383f236-170ec67b2fb-0006-ed08-35c-4fdaf.mp3'

        //         innerAudioContext.play()
        //     }
        // },
        call_player(fun_name, fun_args = null) {
            let args
            if (fun_args) {
                if (fun_args.constructor === Object) {
                    args = JSON.stringify(fun_args)
                    return eval(`this.player.${fun_name}(${args})`)
                } else if (fun_args.constructor === Array) {
                    for (let index in fun_args) {
                        args = args + "'" + fun_args[index] + "'"
                    }
                    return eval(`this.player.${fun_name}('${args}')`)
                } else if (
                    fun_args.constructor === String ||
                    fun_args.constructor === Number
                ) {
                    args = fun_args
                    return eval(`this.player.${fun_name}('${args}')`)
                }
            } else {
                args = ''
                return eval(`this.player.${fun_name}()`)
            }
        },
        first() {
            this.player.first()
        },
        last() {
            this.player.last()
        },
        previous() {
            this.player.previous()
        },
        next() {
            this.player.next()
        },
        goTo(e) {
            if (e < 0) {
                for (let i = 0; i < -e; i++) {
                    this.player.previous()
                }
            } else if (e > 0) {
                for (let i = 0; i < e; i++) {
                    this.player.next()
                }
            }
        },
        pass() {
            this.player.pass()
            this.out_capture()
            this.out_sgf()
            this.out_turn()
            this.out_setup()
        },
        remove_all_markup_object() {
            this.player.board.removeAllMarkUpObjects()
            this.ma_number = 1
            this.ma_char = 0
        },
        out_sgf() {
            this.$emit(
                'sgf',
                this.player.kifuReader.kifu.toSgf().replace(/[\r\n]/g, '')
            )
        },
        out_capture() {
            this.$emit('captured', {
                B: this.player.kifuReader.game.getCaptureCount('B'),
                W: this.player.kifuReader.game.getCaptureCount('W'),
            })
        },
        out_turn: function () {
            this.$emit('turn', this.player.kifuReader.game.turn)
        },
        out_setup: function () {
            this.$emit('setup', this.player.kifuReader.path.m)
        },
        reset_board: function () {
            let tempObj = JSON.parse(JSON.stringify(this.boardObj))
            tempObj.sgf = `(;CA[UTF-8]SZ[${this.player.board.boardSize}])`
            this.$emit('update:boardObj', tempObj)
        },
        chess_move: function (ob) {
            if (this.player.kifuReader.game.isValid(ob.x, ob.y, ob.c)) {
                this.playVoice()
                this.player.board_click(ob.x, ob.y, ob.c)
                this.out_capture()
                this.out_sgf()
                this.out_turn()
                this.out_setup()
            }
        },
        move_chess_pieces(e) {
            const query = uni.createSelectorQuery().in(this)
            query
                .select('.board-wrap')
                .boundingClientRect((elem) => {
                    let ob = this.player.board.to_obtain_coordinate(
                        e,
                        elem.left,
                        elem.top
                    )
                    if (
                        (this.isInitBlack || this.isInitWhite) &&
                        !this.isDelete
                    ) {
                        if (
                            this.player.board.checkMarkUpPointObjectAt(
                                ob.x,
                                ob.y
                            ) &&
                            !this.player.board.checkPointObjectAt(ob.x, ob.y)
                        ) {
                            this.player.board.removePointObjectAt(ob.x, ob.y)
                            this.player.kifuReader.game.removeStone(ob.x, ob.y)
                        } else if (
                            !this.player.board.checkPointObjectAt(ob.x, ob.y)
                        ) {
                            this.player.board.addObject({
                                x: ob.x,
                                y: ob.y,
                                c: this.isInitBlack ? 'B' : 'W',
                                mark: true,
                            })
                            this.player.kifuReader.game.addStone(
                                ob.x,
                                ob.y,
                                this.isInitBlack
                                    ? 'B'
                                    : this.isInitWhite
                                    ? 'W'
                                    : 'B'
                            )
                        }
                    } else if (
                        (this.isMarkTR ||
                            this.isMarkSQ ||
                            this.isMarkCR ||
                            this.isMarkChar ||
                            this.isMarkNumb) &&
                        !this.isDelete
                    ) {
                        //如果是markup的时候
                        let markObj = {
                            x: ob.x,
                            y: ob.y,
                        }
                        // 如果当前点有标记 移除标记
                        if (
                            this.player.board.checkMarkUpObjectsAt(
                                markObj.x,
                                markObj.y
                            )
                        ) {
                            var objInfo = this.player.board.getObjectInfoAt(
                                markObj.x,
                                markObj.y
                            )
                            if (objInfo) {
                                for (let index in objInfo) {
                                    if (objInfo[index].type === 'LB') {
                                        if (
                                            parseInt(objInfo[index].text) >= 0
                                        ) {
                                            if (
                                                this.ma_number > 1 &&
                                                parseInt(
                                                    objInfo[index].text
                                                ) ===
                                                    this.ma_number - 1
                                            ) {
                                                this.ma_number =
                                                    this.ma_number - 1
                                            }
                                        } else {
                                            console.log(
                                                objInfo[index].text.charCodeAt()
                                            )
                                            console.log(
                                                String.fromCharCode(
                                                    65 + this.ma_char
                                                ).charCodeAt()
                                            )
                                            if (
                                                this.ma_char >= 1 &&
                                                objInfo[
                                                    index
                                                ].text.charCodeAt() ===
                                                    String.fromCharCode(
                                                        65 + this.ma_char - 1
                                                    ).charCodeAt()
                                            ) {
                                                this.ma_char = this.ma_char - 1
                                            }
                                        }
                                    }
                                }
                            }

                            this.player.board.removeMarkUpObjectAt(
                                markObj.x,
                                markObj.y
                            )
                        } else {
                            if (this.isMarkCR) {
                                markObj.type = 'CR'
                            } else if (this.isMarkSQ) {
                                markObj.type = 'SQ'
                            } else if (this.isMarkTR) {
                                markObj.type = 'TR'
                            } else if (this.isMarkNumb) {
                                if (this.ma_number > 999) {
                                    this.ma_number = 1
                                }
                                markObj.type = 'LB'
                                markObj.text = this.ma_number.toString()
                                this.ma_number = this.ma_number + 1
                            } else if (this.isMarkChar) {
                                if (this.ma_char > 25) {
                                    this.ma_char = 0
                                }
                                markObj.type = 'LB'
                                let letter = String.fromCharCode(
                                    65 + this.ma_char
                                )
                                markObj.text = letter
                                this.ma_char = this.ma_char + 1
                            }
                            this.player.board.addMarkUpObject(markObj)
                        }
                    } else if (this.isDelete) {
                        //删除标记
                        if (
                            this.player.board.checkMarkUpObjectsAt(ob.x, ob.y)
                        ) {
                            this.player.board.removeMarkUpObjectAt(ob.x, ob.y)
                        }
                    } else {
                        //如果不是markup的时候
                        ob['c'] = this.player.kifuReader.game.turn
                        switch (this.board_model) {
                            case 'show_answer':
                                if (
                                    this.boardClick &&
                                    this.player.kifuReader.game.isValid(
                                        ob.x,
                                        ob.y,
                                        ob.c
                                    )
                                ) {
                                    this.answer_model_move_chess(ob)
                                    this.out_sgf()
                                }
                                break
                            case 'research':
                                this.playVoice()
                                this.player.board_click(ob.x, ob.y)
                                this.out_turn()
                                break
                            case 'normal':
                                if (
                                    this.boardClick &&
                                    this.player.kifuReader.game.isValid(
                                        ob.x,
                                        ob.y,
                                        ob.c
                                    )
                                ) {
                                    this.$emit('chessMove', ob)
                                }
                                break
                            case 'answer':
                                if (
                                    this.boardClick &&
                                    this.player.kifuReader.game.isValid(
                                        ob.x,
                                        ob.y,
                                        ob.c
                                    )
                                ) {
                                    this.answer_model_move_chess(ob)
                                    this.out_sgf()
                                }
                                break
                            case 'markup':
                                break
                        }
                    }
                })
                .exec()
        },
        answer_model_move_chess(ob) {
            let move_sgf = this.player.convert_xy_to_sgf(ob)
            let has_move = false
            this.playVoice()
            this.player.board_click(ob.x, ob.y)
            for (let index in this.temp_tsumego) {
                if (
                    this.moveFirst === 'black' &&
                    this.temp_tsumego[index].B === move_sgf
                ) {
                    has_move = true
                    if ('W' in this.temp_tsumego[index]) {
                        if (this.temp_tsumego[index].W !== '') {
                            let move_xy = this.player.convert_sgf_to_xy(
                                this.temp_tsumego[index].W
                            )
                            setTimeout(() => {
                                this.playVoice()
                                this.player.board_click(move_xy.x, move_xy.y)
                            }, 100)
                        }
                    }
                } else if (
                    this.moveFirst === 'white' &&
                    this.temp_tsumego[index].W === move_sgf
                ) {
                    has_move = true
                    if ('B' in this.temp_tsumego[index]) {
                        if (this.temp_tsumego[index].B !== '') {
                            let move_xy = this.player.convert_sgf_to_xy(
                                this.temp_tsumego[index].B
                            )
                            setTimeout(() => {
                                this.playVoice()
                                this.player.board_click(move_xy.x, move_xy.y)
                            }, 100)
                        }
                    }
                }
                if (has_move) {
                    if ('status' in this.temp_tsumego[index]) {
                        if (this.temp_tsumego[index].status !== '') {
                            if (
                                this.temp_tsumego[index].status === 'is_right'
                            ) {
                                this.out_sgf()
                                this.$emit('answerRight')
                            } else if (
                                this.temp_tsumego[index].status === 'is_wrong'
                            ) {
                                this.out_sgf()
                                this.$emit('answerWrong')
                            }
                            this.remove_branch_mark()
                            this.temp_tsumego = []
                            return
                        }
                    }
                    if (
                        this.temp_tsumego[index].children &&
                        this.temp_tsumego[index].children.length !== 0
                    ) {
                        this.temp_tsumego = this.temp_tsumego[index].children
                        // this.add_branch_mark()
                    }
                    return
                }
            }
            if (has_move === false) {
                this.$emit('answerWrong')
                this.remove_branch_mark()
                this.temp_tsumego = []
            }
        },
        remove_branch_mark: function () {
            for (let index in this.mark_list) {
                this.player.board.removeObject({
                    x: this.mark_list[index].x,
                    y: this.mark_list[index].y,
                    type: 'LB',
                })
            }
        },
        add_branch_mark: function () {
            this.remove_branch_mark()
            this.mark_list = []
            let move = {}
            let mark_numb = 0
            if (this.temp_tsumego.length !== 0) {
                for (let index in this.temp_tsumego) {
                    if (this.moveFirst === 'black') {
                        if ('B' in this.temp_tsumego[index]) {
                            move = this.player.convert_sgf_to_xy(
                                this.temp_tsumego[index].B
                            )
                            this.player.board.addMarkUpObject({
                                x: move.x,
                                y: move.y,
                                type: 'LB',
                                text: this.player.get_abc(mark_numb),
                            })
                            this.mark_list.push(move)
                            mark_numb = mark_numb + 1
                        }
                    } else if (this.moveFirst === 'white') {
                        if ('W' in this.temp_tsumego[index]) {
                            move = this.player.convert_sgf_to_xy(
                                this.temp_tsumego[index].W
                            )
                            this.player.board.addMarkUpObject({
                                x: move.x,
                                y: move.y,
                                type: 'LB',
                                text: this.player.get_abc(mark_numb),
                            })
                            this.mark_list.push(move)
                            mark_numb = mark_numb + 1
                        }
                    }
                }
            }
        },
        calc_section: function (section, showCoordinates) {
            if (this.player) {
                // 当棋盘已经创建
                if (
                    this.player.board.showCoordinates === true &&
                    showCoordinates === true
                ) {
                    // 棋盘之前显示坐标 并且现在也显示坐标
                    section.top = section.top - 0.5
                    section.bottom = section.bottom - 0.5
                    section.left = section.left - 0.5
                    section.right = section.right - 0.5
                    return section
                } else if (
                    this.player.board.showCoordinates === false &&
                    showCoordinates === true
                ) {
                    // 棋盘之前不显示坐标 现在显示坐标
                    section.top = section.top - 0.5
                    section.bottom = section.bottom - 0.5
                    section.left = section.left - 0.5
                    section.right = section.right - 0.5
                    return section
                } else if (
                    this.player.board.showCoordinates === true &&
                    showCoordinates === false
                ) {
                    // 棋盘之前显示坐标 现在不显示坐标
                    section.top = section.top + 0.5
                    section.bottom = section.bottom + 0.5
                    section.left = section.left + 0.5
                    section.right = section.right + 0.5
                    return section
                } else if (
                    this.player.board.showCoordinates === false &&
                    showCoordinates === false
                ) {
                    // 棋盘之前不显示坐标 现在也不显示坐标
                    return section
                }
            } else {
                // 棋盘未创建
                if (showCoordinates) {
                    // 当显示坐标
                    section.top = section.top - 0.5
                    section.bottom = section.bottom - 0.5
                    section.left = section.left - 0.5
                    section.right = section.right - 0.5
                    return section
                } else {
                    // 当不显示坐标
                    return section
                }
            }
        },
        get_situation_x_y(situation, boardSize, color) {
            let x = parseInt(situation / boardSize)
            let y = situation % boardSize
            return { x: x, y: y, c: color }
        },
        generate_situation_array() {
            let situation_array = []
            if (
                typeof this.situationObject === 'object' &&
                JSON.stringify(this.situationObject) !== '{}'
            ) {
                let temp_obj = JSON.parse(JSON.stringify(this.situationObject))
                try {
                    if (
                        'territory' in temp_obj &&
                        JSON.stringify(temp_obj.territory) !== '{}'
                    ) {
                        let territory = temp_obj.territory
                        if ('B' in territory) {
                            for (let index in territory.B) {
                                situation_array.push(
                                    this.get_situation_x_y(
                                        territory.B[index],
                                        this.player.board.boardSize,
                                        'B'
                                    )
                                )
                            }
                        }
                        if ('W' in territory) {
                            for (let index in territory.W) {
                                situation_array.push(
                                    this.get_situation_x_y(
                                        territory.W[index],
                                        this.player.board.boardSize,
                                        'W'
                                    )
                                )
                            }
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            return situation_array
        },
        check_board_date(boardObj) {
            if (!boardObj.hasOwnProperty('section')) {
                boardObj.section = { top: 0, bottom: 0, left: 0, right: 0 }
            }
            if (!boardObj.hasOwnProperty('tsumego')) {
                boardObj.tsumego = []
            }
            if (!boardObj.hasOwnProperty('board_model')) {
                boardObj.board_model = 'normal'
            }
            return boardObj
        },
        generate_board_data(boardObj) {
            if (boardObj.sgf !== '') {
                this.player.board.section = this.calc_section(
                    JSON.parse(JSON.stringify(boardObj.section)),
                    this.showCoordinates
                )
                if (boardObj.hasOwnProperty('path') && boardObj.path != '') {
                    this.player.loadSgf(boardObj.sgf, boardObj.path)
                } else {
                    this.player.loadSgf(boardObj.sgf, 'last')
                }

                try {
                    if (this.player.kifuReader.game) {
                        this.moveFirst = boardObj.move_first || 'black'
                        if (this.moveFirst === 'white') {
                            this.player.pass()
                        }
                        this.out_capture()
                        this.out_setup()
                        this.out_turn()
                        this.board_model = boardObj.board_model
                        this.temp_tsumego = []
                        this.remove_branch_mark()
                        this.temp_tsumego = boardObj.tsumego
                        this.player.board.removeSituation()
                        let situationArray = this.generate_situation_array()
                        if (situationArray.length > 0) {
                            this.player.board.addSituation(situationArray)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        //#ifdef H5
        init_mouse_move() {
            let markupCanvas = document.getElementById(
                `markup-main-${this.name_space}`
            )
            markupCanvas.addEventListener('mousemove', this.mouse_move)
        },
        init_mouse_out() {
            let markupCanvas = document.getElementById(
                `markup-main-${this.name_space}`
            )
            markupCanvas.addEventListener('mouseout', () => {
                this.player.board.removeMAObject()
            })
        },
        //#endif
    },
    mounted() {
        //#ifdef H5
        if (this.turnOnMouseMove) {
            this.init_mouse_move()
            this.init_mouse_out()
        }
        //#endif
        this.$nextTick(() => {
            const query = uni.createSelectorQuery().in(this)
            query
                .select('.board-wrap')
                .boundingClientRect((elem) => {
                    this.mainContext = uni.createCanvasContext(
                        `board-main-${this.name_space}`,
                        this
                    )
                    this.pointContext = uni.createCanvasContext(
                        `point-main-${this.name_space}`,
                        this
                    )
                    this.numberContext = uni.createCanvasContext(
                        `number-main-${this.name_space}`,
                        this
                    )
                    this.situationContext = uni.createCanvasContext(
                        `situation-main-${this.name_space}`,
                        this
                    )
                    this.maContext = uni.createCanvasContext(
                        `ma-main-${this.name_space}`,
                        this
                    )
                    this.markUpContext = uni.createCanvasContext(
                        `markup-main-${this.name_space}`,
                        this
                    )
                    this.inner_theme = this.theme || 'simulant'
                    this.board_theme = choseTheme(this.inner_theme)
                    let tempObj = this.check_board_date(
                        JSON.parse(JSON.stringify(this.boardObj))
                    )
                    let boardSize = 9
                    try {
                        boardSize = parseInt(
                            tempObj.sgf.split('SZ[')[1].split(']')[0]
                        )
                    } catch (e) {
                        console.log(e)
                    }
                    let section = this.calc_section(
                        JSON.parse(JSON.stringify(tempObj.section)),
                        this.showCoordinates
                    )
                    let config = {
                        sgf: this.sgf,
                        allowIllegalMoves: false,
                        markLastMove: this.markLastMove,
                        showMoveNumber: this.showMoveNumber,
                        displayVariations: this.displayVariations,
                        board: {
                            elem: elem,
                            backGroundColor: this.backGroundColor,
                            boardSize: boardSize,
                            mainContext: this.mainContext,
                            pointContext: this.pointContext,
                            numberContext: this.numberContext,
                            maContext: this.maContext,
                            situationContext: this.situationContext,
                            markUpContext: this.markUpContext,
                            section: section,
                            showCoordinates: this.showCoordinates,
                            theme: this.board_theme,
                        },
                    }
                    this.player = new Player(config)
                    this.player.init()
                    setTimeout(() => {
                        this.generate_board_data(
                            JSON.parse(JSON.stringify(tempObj))
                        )
                    }, 650)
                })
                .exec()
        })
    },
}
</script>

<style scoped>
.board-box {
    width: 100%;
    height: 100%;
}

.board-wrap {
    width: 100%;
    height: 100%;
    position: relative;
}

.main-canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
}

.main-canvas-radius {
    border-radius: 24rpx;
}

.point-canvas {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 2;
}
.number-canvas {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 3;
}

.ma-canvas {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 4;
}

.situation-canvas {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 5;
}

.markup-canvas {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 6;
}
</style>
