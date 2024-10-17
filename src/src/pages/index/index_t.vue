<template>
  <view class="content">
    <view class="left-main">
      <view class="board-main">
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
      </view>
    </view>

    <view class="right-main">
      <checkbox-group @change="change_show_coordinates">
        <label>
          <checkbox value="true" :checked="show_coordinates === true" />开启坐标
        </label>
        <label>
          <checkbox
            value="false"
            :checked="show_coordinates === false"
          />关闭坐标
        </label>
      </checkbox-group>
      <checkbox-group @change="change_show_move_number">
        <label>
          <checkbox value="true" :checked="show_move_number === true" />开启步数
        </label>
        <label>
          <checkbox
            value="false"
            :checked="show_move_number === false"
          />关闭步数
        </label>
      </checkbox-group>
      <view class="picker-sgf">
        <view class="uni-list">
          <view class="uni-list-cell">
            <view class="uni-list-cell-left">
              选择sgf:
            </view>
            <picker
              mode="selector"
              :value="index"
              :range="sgf_list"
              range-key="name"
              @change="select_sgf"
            >
              <view class="uni-input">{{ sgf_list[index].name }}</view>
            </picker>
          </view>
        </view>
      </view>
      <view class="picker-sgf">
        <view class="uni-list">
          <view class="uni-list-cell">
            <view class="uni-list-cell-left">
              选择主题:
            </view>
            <picker
              mode="selector"
              :value="theme_index"
              :range="theme_list"
              range-key="name"
              @change="select_theme"
            >
              <view class="uni-input">{{ theme_list[theme_index].name }}</view>
            </picker>
          </view>
        </view>
      </view>
      <view class="control-board">
        <button plain="true" @click="$refs.player_board.first()">最前</button>
        <button plain="true" @click="$refs.player_board.goTo(-5)">
          后退5
        </button>
        <button plain="true" @click="$refs.player_board.previous()">
          后退
        </button>
        <button plain="true" @click="$refs.player_board.next()">前进</button>
        <button plain="true" @click="$refs.player_board.goTo(5)">前进5</button>
        <button plain="true" @click="$refs.player_board.last()">最后</button>
      </view>
      <view class="markup">
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_init_black ? 'background:pink' : ''"
          @click="check_mark(is_init_black, 'is_init_black')"
        >
          黑子
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_init_white ? 'background:pink' : ''"
          @click="check_mark(is_init_white, 'is_init_white')"
        >
          白子
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_mark_tr ? 'background:pink' : ''"
          @click="check_mark(is_mark_tr, 'is_mark_tr')"
        >
          三角
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_mark_cr ? 'background:pink' : ''"
          @click="check_mark(is_mark_cr, 'is_mark_cr')"
        >
          圆圈
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_mark_sq ? 'background:pink' : ''"
          @click="check_mark(is_mark_sq, 'is_mark_sq')"
        >
          方块
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_mark_numb ? 'background:pink' : ''"
          @click="check_mark(is_mark_numb, 'is_mark_numb')"
        >
          数字
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_mark_char ? 'background:pink' : ''"
          @click="check_mark(is_mark_char, 'is_mark_char')"
        >
          字母
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_black_white ? 'background:pink' : ''"
          @click="check_mark(is_black_white, 'is_black_white')"
        >
          黑白
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_white_black ? 'background:pink' : ''"
          @click="check_mark(is_white_black, 'is_white_black')"
        >
          白黑
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top"
          :style="is_delete ? 'background:pink' : ''"
          @click="$refs.player_board.remove_all_markup_object()"
        >
          删除
        </button>
        <button
          style="width: 50rpx;display: inline-block;vertical-align: top;background:pink"
          @click="$refs.player_board.reset_board()"
        >
          清空
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import gameBoard from "../../components/board/gameBoard.vue";
export default {
  data() {
    return {
      index: 0,
      theme_index: 0,
      theme: "simulant",
      show_coordinates: true,
      show_move_number: false,
      sgf: {
        name: "棋谱",
        sgf: "(;CA[UTF-8]SZ[19])",
        section: { top: 0, left: 0, right: 0, bottom: 0 },
        tsumego: [],
        board_model: "normal"
      },
      theme_list: [
        { name: "立体", value: "simulant" },
        { name: "普通", value: "normal" },
        { name: "卡通", value: "cartoon" }
      ],
      sgf_list: [
        {
          name: "空棋盘",
          sgf:
            "(;CA[UTF-8]SZ[19];B[jj];W[dp];B[dj];W[dd];B[jp];W[pp];B[jd];W[pd];B[pj];W[cm];B[fl];W[qh];B[il];W[lq];B[gn];W[hc];B[jf];W[fd];B[he];W[ch];B[di];W[lc];B[dg];W[ql];B[cg];W[bg];B[dh];W[bh];B[bi];W[hq];B[ci];W[cf];B[ai];W[ff];B[ah];W[be];B[ag];W[bf];B[af];W[fp];B[ae];W[nd];B[bd];W[jc];B[je];W[cd];B[df];W[pn];B[de];W[ce];B[ed];W[ec];B[ee];W[cb];B[ac];W[fe];B[bc];W[rj];B[cc];W[dc];B[fc];W[bb];B[db];W[eb];B[ea];W[da];B[fa];W[ab];B[fb];W[ad];B[gd];W[gc];B[ge];W[qe];B[gf];W[fg];B[fh];W[co];B[gg];W[gb];B[ef];W[ga];B[eg];W[oq];B[fc];W[jq];B[fd];W[mn];B[fb];W[ip];B[fa];W[jo];B[hb];W[ok];B[ha];W[id];B[hd];W[ic];B[ib];W[oj];B[kc];W[kd];B[ke];W[kb];B[ie];W[mf];B[le];W[li];B[ld];W[kc];B[md];W[mc];B[me];W[ne];B[lf];W[mg];B[lg];W[kh];B[lh];W[kj];B[mh];W[ih];B[nh];W[ki];B[ng];W[ni];B[nf];W[kl];B[mi];W[jk];B[mj];W[oi];B[lj];W[ij];B[ji];W[lk];B[jh];W[jg];B[ig];W[kg];B[if];W[hh])",
          section: { top: 0, left: 0, right: 0, bottom: 0 },
          tsumego: [],
          board_model: "normal"
        },
        {
          name: "测试1",
          sgf:
            "(;CA[UTF-8]SZ[13]AP[WGo.js:2]FF[4]GM[1]AB[ed][de]AW[ee]LB[ee:1]LB[ed:123]LB[ec:A]SQ[ef]TR[eg]CR[eh])",
          section: { top: 0, left: 0, right: 0, bottom: 0 },
          tsumego: [],
          board_model: "normal"
        },
        {
          name: "黑先做活-查看答案",
          sgf:
            "(;SZ[19]AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]AB[sc][rc][qc][pc][oc][nc][nb][na]AW[ob][pa][qb][rb][mb][mc][ma][md][od][nd][pd][qd][rd][sd])",
          section: { top: 0, left: 10, right: 0, bottom: 10 },
          tsumego: [
            {
              B: ";B[sb]",
              W: ";W[pb]",
              id: "1",
              label: "1 黑;B[sb] 白;W[pb]",
              children: [
                {
                  B: ";B[ra]",
                  id: "1-1",
                  label: "1-1 黑;B[ra] 结果: 正确",
                  status: "is_right",
                  children: []
                }
              ]
            }
          ],
          board_model: "show_answer"
        },
        {
          name: "黑先做活",
          sgf:
            "(;SZ[19]AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]AB[sc][rc][qc][pc][oc][nc][nb][na]AW[ob][pa][qb][rb][mb][mc][ma][md][od][nd][pd][qd][rd][sd])",
          section: { top: 0, left: 10, right: 0, bottom: 10 },
          move_first:"white",
          tsumego: [
            {
              B: ";B[sb]",
              W: ";W[pb]",
              id: "1",
              label: "1 黑;B[sb] 白;W[pb]",
              children: [
                {
                  B: ";B[ra]",
                  id: "1-1",
                  label: "1-1 黑;B[ra] 结果: 正确",
                  status: "is_right",
                  children: []
                }
              ]
            }
          ],
          board_model: "answer"
        },
        {
          name: "棋谱",
          sgf:
            "(;CA[UTF-8]SZ[19];B[jj];W[dp];B[dj];W[dd];B[jp];W[pp];B[jd];W[pd];B[pj];W[cm];B[fl];W[qh];B[il];W[lq];B[gn];W[hc];B[jf];W[fd];B[he];W[ch];B[di];W[lc];B[dg];W[ql];B[cg];W[bg];B[dh];W[bh];B[bi];W[hq];B[ci];W[cf];B[ai];W[ff];B[ah];W[be];B[ag];W[bf];B[af];W[fp];B[ae];W[nd];B[bd];W[jc];B[je];W[cd];B[df];W[pn];B[de];W[ce];B[ed];W[ec];B[ee];W[cb];B[ac];W[fe];B[bc];W[rj];B[cc];W[dc];B[fc];W[bb];B[db];W[eb];B[ea];W[da];B[fa];W[ab];B[fb];W[ad];B[gd];W[gc];B[ge];W[qe];B[gf];W[fg];B[fh];W[co];B[gg];W[gb];B[ef];W[ga];B[eg];W[oq];B[fc];W[jq];B[fd];W[mn];B[fb];W[ip];B[fa];W[jo];B[hb];W[ok];B[ha];W[id];B[hd];W[ic];B[ib];W[oj];B[kc];W[kd];B[ke];W[kb];B[ie];W[mf];B[le];W[li];B[ld];W[kc];B[md];W[mc];B[me];W[ne];B[lf];W[mg];B[lg];W[kh];B[lh];W[kj];B[mh];W[ih];B[nh];W[ki];B[ng];W[ni];B[nf];W[kl];B[mi];W[jk];B[mj];W[oi];B[lj];W[ij];B[ji];W[lk];B[jh];W[jg];B[ig];W[kg];B[if];W[hh])",
          section: { top: 0, left: 0, right: 0, bottom: 0 },
          tsumego: [],
          board_model: "normal"
        },
        {
          name: "答过题",
          sgf:
            "(;AP[WGo.js:2]FF[4]GM[1]CA[UTF-8]SZ[19]AB[ar][aq][bq][cq][cp][dp]AW[as][br][cr][dr][dq]SM[cq][br]CRY[aq][as]TR[ar][dq]SQ[cp][dr];B[fs];W[fr];B[er])",
          section: { top: 10, left: 0, right: 10, bottom: 0 },
          tsumego: [],
          board_model: "normal"
        }
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
      is_delete: false
    };
  },
  components: {
    gameBoard
  },
  methods: {
    check_mark: function(e, event) {
      this.is_init_black = false;
      this.is_init_white = false;
      this.is_mark_cr = false;
      this.is_mark_tr = false;
      this.is_mark_sq = false;
      this.is_mark_numb = false;
      this.is_mark_char = false;
      this.is_black_white = false;
      this.is_white_black = false;
      this.is_delete = false;
      switch (event) {
        case "is_init_black":
          this.is_init_black = !e;
          break;
        case "is_init_white":
          this.is_init_white = !e;
          break;
        case "is_mark_cr":
          this.is_mark_cr = !e;
          break;
        case "is_mark_tr":
          this.is_mark_tr = !e;
          break;
        case "is_mark_sq":
          this.is_mark_sq = !e;
          break;
        case "is_mark_numb":
          this.is_mark_numb = !e;
          break;
        case "is_mark_char":
          this.is_mark_char = !e;
          break;
        case "is_black_white":
          if (e) {
            this.is_black_white = false;
          } else {
            if (this.turn === "W") {
              this.$refs.player_board.pass();
            }
            this.is_black_white = true;
          }
          break;
        case "is_white_black":
          if (e) {
            this.is_white_black = false;
          } else {
            if (this.turn === "B") {
              this.$refs.player_board.pass();
            }
            this.is_white_black = true;
          }
          break;
        case "is_delete":
          this.is_delete = !e;
          break;
      }
    },
    change_show_move_number: function(e) {
      if (e.detail.value[0] === "true") {
        this.show_move_number = true;
      } else {
        this.show_move_number = false;
      }
    },
    change_show_coordinates: function(e) {
      if (e.detail.value[0] === "true") {
        this.show_coordinates = true;
      } else {
        this.show_coordinates = false;
      }
    },
    select_theme: function(e) {
      this.theme = this.theme_list[e.detail.value].value;
      this.theme_index = e.detail.value;
    },
    select_sgf: function(e) {
      this.sgf = this.sgf_list[e.detail.value];
      this.index = e.detail.value;
    },
    chess_move: function(ob) {
      //this.$refs.player_board.call_player('board.addObject',ob)
      this.$refs.player_board.chess_move(ob);
    },
    change_captured: function(e) {
      console.log("captured", e);
    },
    change_turn: function(e) {
      this.turn = e;
      console.log("turn", e);
    },
    change_sgf: function(e) {
      console.log("sgf", e);
    },
    change_setup: function(e) {
      console.log("setup", e);
    },
    answerRight: function() {
      alert("answerRight");
    },
    answerWrong: function() {
      alert("answerWrong");
    }
  },
  onLoad() {}
};
</script>

<style lang="less" scoped>
.content {
  width: 750upx;
  text-align: center;
  height: calc(100vh - 88upx);
  margin-top: 88upx;
}
.left-main {
  display: inline-block;
  vertical-align: top;
  width: 375upx;
  height: 375upx;
}
.right-main {
  display: inline-block;
  vertical-align: top;
  width: 375upx;
  height: 375upx;
}
.board-main {
  width: 375upx;
  height: 375upx;
  margin: auto;
  background: #ffd195;
  box-shadow: 0 8rpx 8rpx 0 rgba(216, 174, 135, 0.3);
}
.picker-sgf {
  width: 300upx;
  height: 50upx;
  margin: 32upx auto 0 auto;
}
.control-board {
  width: 300upx;
  height: 96upx;
  margin: 32upx auto 0 auto;
  uni-button {
    width: 50upx;
    height: 20upx;
    padding: 0;
    font-size: 10upx;
    margin-left: 10upx;
    display: inline-block;
    vertical-align: top;
    color: black;
  }
}
</style>
