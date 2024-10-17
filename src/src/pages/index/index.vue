<!--  -->
<template>
  <div class=''>
    <!-- <el-button @click="spiderData">获取数据</el-button> -->
    <el-button @click="initData">自动刷新开启</el-button>
    <div
      id="chart"
      style="width:1400px;height:600px"
    />
  </div>
</template>

<script>
import Axios from 'axios';
import data300 from '../../../components/300.js'
import data1000 from '../../../components/1000.js'
import { init, dispose } from 'klinecharts'
export default {
  name: '',
  components: {

  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      const chart = init('chart')
      var res = []
      for (let i = 0; i < data300.length; i++) {
        try {

          const item3 = data300[i];
          const item1 = data1000[i];
          var open = item3[2] * 6 - item1[2] * 4
          var high = item3[3] * 6 - item1[3] * 4
          var low = item3[4] * 6 - item1[4] * 4
          var close = item3[5] * 6 - item1[5] * 4
          if (open > close) {
            if (high < open) {
              high = open
            }
            if (low > close) {
              low = close
            }
          } else {

            if (high < close) {
              high = close
            }
            if (low > open) {
              low = open
            }
          }
          var obj = {
            close,
            high,
            low,
            open,
            timestamp: item3[0],
            volume: item3[1],
          };
          res.push(obj)
        } catch (error) {
          console.log("init_data_for err:", error)
        }
      }
      chart.applyNewData(res)
    },

    formatDuring(during) {
      if (during < 0) {
        return '---'
      }
      let h = parseInt(during / 60 / 60 % 24)
      let m = parseInt(during / 60 % 60)
      let s = parseInt(during % 60)
      return `${h}时${m}分${s}秒`
    },

    formatDate(date, fmt) {
      if (typeof date == 'string') {
        return date;
      }

      if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

      if (!date || date == null) return null;
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    },
  },
  created() {
  },
  mounted() {
    this.initData()
  }
}


class PaiInfo {
  constructor(id, name, startPrice, area) {
    this.id = id;
    this.name = name;
    this.startPrice = startPrice;
    this.area = area;

    this.timer = null;
    this.start = 0;
    this.end = 9;

    this.currentPrice = startPrice;
    this.endTime = 1697680800000;

    this.bidCount = 0;
    this.bidList = [];
    this.accessEnsureNum = 0; // 报名人数
    this.accessNum = 0;// 围观人数
    this.auctionStatus = 0;// 0未开始，1已开始，2已结束
    this.currentBidUserNumber = '';

    if (Date.now() >= 1697594400000) {
      this.auctionStatus = 1;
    }
  }
}
</script>

<style scoped>
.pointer:hover {
  cursor: pointer;
  color: blue;
}
.center {
  display: flex;
  width: 150px;
  justify-content: center;
  flex-wrap: wrap;
  align-content: space-between;
}
.text_blue {
  color: blue;
}
.text_red {
  color: red;
}
.text_gray {
  color: gainsboro;
}
.detail-box {
  padding: 5px;
  height: 400px;
  overflow: auto;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
