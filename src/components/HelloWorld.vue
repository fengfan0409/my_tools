<template>
    <div class="hello">
        <div>
            <game-board
                ref="player_board"
                :boardObj.sync="sgf"
                :theme="theme"
                :showCoordinates.sync="show_coordinates"
                :showMoveNumber="show_move_number"
                :boardClick="true"
                :isInitBlack="is_init_black"
                :isInitWhite="is_init_white"
                :isMarkCR="is_mark_cr"
                :isMarkSQ="is_mark_sq"
                :isMarkTR="is_mark_tr"
                :isMarkNumb="is_mark_numb"
                :isMarkChar="is_mark_char"
                :isDelete="is_delete"
                :turnOnMouseMove="true"
                @chessMove="chess_move"
                @sgf="change_sgf"
                @captured="change_captured"
                @turn="change_turn"
                @setup="change_setup"
                @answerRight="answerRight"
                @answerWrong="answerWrong"
            ></game-board>
        </div>
    </div>
</template>

<script>
import gameBoard from './board/gameBoard'
export default {
    data() {
        return {
            index: 0,
            theme_index: 0,
            theme: 'simulant',
            show_coordinates: true,
            show_move_number: false,
            sgf: {
                name: '棋谱',
                sgf: '(;CA[UTF-8]SZ[19])',
                section: { top: 0, left: 0, right: 0, bottom: 0 },
                tsumego: [],
                board_model: 'normal',
            },
            theme_list: [
                { name: '立体', value: 'simulant' },
                { name: '普通', value: 'normal' },
                { name: '卡通', value: 'cartoon' },
            ],
            sgf_list: [
                {
                    name: '空棋盘',
                    sgf:
                        '(;CA[UTF-8]SZ[19];B[jj];W[dp];B[dj];W[dd];B[jp];W[pp];B[jd];W[pd];B[pj];W[cm];B[fl];W[qh];B[il];W[lq];B[gn];W[hc];B[jf];W[fd];B[he];W[ch];B[di];W[lc];B[dg];W[ql];B[cg];W[bg];B[dh];W[bh];B[bi];W[hq];B[ci];W[cf];B[ai];W[ff];B[ah];W[be];B[ag];W[bf];B[af];W[fp];B[ae];W[nd];B[bd];W[jc];B[je];W[cd];B[df];W[pn];B[de];W[ce];B[ed];W[ec];B[ee];W[cb];B[ac];W[fe];B[bc];W[rj];B[cc];W[dc];B[fc];W[bb];B[db];W[eb];B[ea];W[da];B[fa];W[ab];B[fb];W[ad];B[gd];W[gc];B[ge];W[qe];B[gf];W[fg];B[fh];W[co];B[gg];W[gb];B[ef];W[ga];B[eg];W[oq];B[fc];W[jq];B[fd];W[mn];B[fb];W[ip];B[fa];W[jo];B[hb];W[ok];B[ha];W[id];B[hd];W[ic];B[ib];W[oj];B[kc];W[kd];B[ke];W[kb];B[ie];W[mf];B[le];W[li];B[ld];W[kc];B[md];W[mc];B[me];W[ne];B[lf];W[mg];B[lg];W[kh];B[lh];W[kj];B[mh];W[ih];B[nh];W[ki];B[ng];W[ni];B[nf];W[kl];B[mi];W[jk];B[mj];W[oi];B[lj];W[ij];B[ji];W[lk];B[jh];W[jg];B[ig];W[kg];B[if];W[hh])',
                    section: { top: 0, left: 0, right: 0, bottom: 0 },
                    tsumego: [],
                    board_model: 'normal',
                },
                {
                    name: '测试1',
                    sgf:
                        '(;CA[UTF-8]SZ[13]AP[WGo.js:2]FF[4]GM[1]AB[ed][de]AW[ee]LB[ee:1]LB[ed:123]LB[ec:A]SQ[ef]TR[eg]CR[eh])',
                    section: { top: 0, left: 0, right: 0, bottom: 0 },
                    tsumego: [],
                    board_model: 'normal',
                },
                {
                    name: '黑先做活-查看答案',
                    sgf:
                        '(;SZ[19]AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]AB[sc][rc][qc][pc][oc][nc][nb][na]AW[ob][pa][qb][rb][mb][mc][ma][md][od][nd][pd][qd][rd][sd])',
                    section: { top: 0, left: 10, right: 0, bottom: 10 },
                    tsumego: [
                        {
                            B: ';B[sb]',
                            W: ';W[pb]',
                            id: '1',
                            label: '1 黑;B[sb] 白;W[pb]',
                            children: [
                                {
                                    B: ';B[ra]',
                                    id: '1-1',
                                    label: '1-1 黑;B[ra] 结果: 正确',
                                    status: 'is_right',
                                    children: [],
                                },
                            ],
                        },
                    ],
                    board_model: 'show_answer',
                },
                {
                    name: '黑先做活',
                    sgf:
                        '(;SZ[19]AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]AB[sc][rc][qc][pc][oc][nc][nb][na]AW[ob][pa][qb][rb][mb][mc][ma][md][od][nd][pd][qd][rd][sd])',
                    section: { top: 0, left: 10, right: 0, bottom: 10 },
                    move_first: 'white',
                    tsumego: [
                        {
                            B: ';B[sb]',
                            W: ';W[pb]',
                            id: '1',
                            label: '1 黑;B[sb] 白;W[pb]',
                            children: [
                                {
                                    B: ';B[ra]',
                                    id: '1-1',
                                    label: '1-1 黑;B[ra] 结果: 正确',
                                    status: 'is_right',
                                    children: [],
                                },
                            ],
                        },
                    ],
                    board_model: 'answer',
                },
                {
                    name: '棋谱',
                    sgf:
                        '(;CA[UTF-8]SZ[19];B[jj];W[dp];B[dj];W[dd];B[jp];W[pp];B[jd];W[pd];B[pj];W[cm];B[fl];W[qh];B[il];W[lq];B[gn];W[hc];B[jf];W[fd];B[he];W[ch];B[di];W[lc];B[dg];W[ql];B[cg];W[bg];B[dh];W[bh];B[bi];W[hq];B[ci];W[cf];B[ai];W[ff];B[ah];W[be];B[ag];W[bf];B[af];W[fp];B[ae];W[nd];B[bd];W[jc];B[je];W[cd];B[df];W[pn];B[de];W[ce];B[ed];W[ec];B[ee];W[cb];B[ac];W[fe];B[bc];W[rj];B[cc];W[dc];B[fc];W[bb];B[db];W[eb];B[ea];W[da];B[fa];W[ab];B[fb];W[ad];B[gd];W[gc];B[ge];W[qe];B[gf];W[fg];B[fh];W[co];B[gg];W[gb];B[ef];W[ga];B[eg];W[oq];B[fc];W[jq];B[fd];W[mn];B[fb];W[ip];B[fa];W[jo];B[hb];W[ok];B[ha];W[id];B[hd];W[ic];B[ib];W[oj];B[kc];W[kd];B[ke];W[kb];B[ie];W[mf];B[le];W[li];B[ld];W[kc];B[md];W[mc];B[me];W[ne];B[lf];W[mg];B[lg];W[kh];B[lh];W[kj];B[mh];W[ih];B[nh];W[ki];B[ng];W[ni];B[nf];W[kl];B[mi];W[jk];B[mj];W[oi];B[lj];W[ij];B[ji];W[lk];B[jh];W[jg];B[ig];W[kg];B[if];W[hh])',
                    section: { top: 0, left: 0, right: 0, bottom: 0 },
                    tsumego: [],
                    board_model: 'normal',
                },
                {
                    name: '答过题',
                    sgf:
                        '(;AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]SZ[19]AB[ar][aq][bq][cq][cp][dp]AW[as][br][cr][dr][dq]SM[cq][br]CRY[aq][as]TR[ar][dq]SQ[cp][dr];B[fs];W[fr];B[er])',
                    section: { top: 10, left: 0, right: 10, bottom: 0 },
                    tsumego: [],
                    board_model: 'normal',
                },
            ],
            is_init_black: false,
            is_init_white: false,
            is_mark_cr: false,
            is_mark_tr: false,
            is_mark_sq: false,
            is_mark_numb: false,
            is_mark_char: false,
            is_black_white: false,
            is_white_black: false,
            is_delete: false,
        }
    },
    components: {
        gameBoard,
    },
    methods: {
        check_mark: function (e, event) {
            this.is_init_black = false
            this.is_init_white = false
            this.is_mark_cr = false
            this.is_mark_tr = false
            this.is_mark_sq = false
            this.is_mark_numb = false
            this.is_mark_char = false
            this.is_black_white = false
            this.is_white_black = false
            this.is_delete = false
            switch (event) {
                case 'is_init_black':
                    this.is_init_black = !e
                    break
                case 'is_init_white':
                    this.is_init_white = !e
                    break
                case 'is_mark_cr':
                    this.is_mark_cr = !e
                    break
                case 'is_mark_tr':
                    this.is_mark_tr = !e
                    break
                case 'is_mark_sq':
                    this.is_mark_sq = !e
                    break
                case 'is_mark_numb':
                    this.is_mark_numb = !e
                    break
                case 'is_mark_char':
                    this.is_mark_char = !e
                    break
                case 'is_black_white':
                    if (e) {
                        this.is_black_white = false
                    } else {
                        if (this.turn === 'W') {
                            this.$refs.player_board.pass()
                        }
                        this.is_black_white = true
                    }
                    break
                case 'is_white_black':
                    if (e) {
                        this.is_white_black = false
                    } else {
                        if (this.turn === 'B') {
                            this.$refs.player_board.pass()
                        }
                        this.is_white_black = true
                    }
                    break
                case 'is_delete':
                    this.is_delete = !e
                    break
            }
        },
        change_show_move_number: function (e) {
            if (e.detail.value[0] === 'true') {
                this.show_move_number = true
            } else {
                this.show_move_number = false
            }
        },
        change_show_coordinates: function (e) {
            if (e.detail.value[0] === 'true') {
                this.show_coordinates = true
            } else {
                this.show_coordinates = false
            }
        },
        select_theme: function (e) {
            this.theme = this.theme_list[e.detail.value].value
            this.theme_index = e.detail.value
        },
        select_sgf: function (e) {
            this.sgf = this.sgf_list[e.detail.value]
            this.index = e.detail.value
        },
        chess_move: function (ob) {
            //this.$refs.player_board.call_player('board.addObject',ob)
            this.$refs.player_board.chess_move(ob)
        },
        change_captured: function (e) {
            console.log('captured', e)
        },
        change_turn: function (e) {
            this.turn = e
            console.log('turn', e)
        },
        change_sgf: function (e) {
            console.log('sgf', e)
        },
        change_setup: function (e) {
            console.log('setup', e)
        },
        answerRight: function () {
            alert('answerRight')
        },
        answerWrong: function () {
            alert('answerWrong')
        },
    },
    onLoad() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
