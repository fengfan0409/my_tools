<!--  -->
<template>
  <div class=''>
    <!-- <el-button @click="spiderData">获取数据</el-button> -->
    <el-button @click="initData">自动刷新开启</el-button>
    <div>
      <el-table
        :data="tableList"
        style="width: 1400px"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{'text-align':'center'}"
        row-key="id"
      >
        <!-- :expand-row-keys="expands" -->
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="报名人数">
                <span>{{ props.row.accessEnsureNum }}</span>
              </el-form-item>
              <el-form-item label="围观人数">
                <span>{{ props.row.accessNum }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column
          label="商品 ID"
          prop="id"
        >
          <template slot-scope="props">
            <a
              :href="props.row.src"
              target="_blank"
            >{{ props.row.id }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="围观人数"
          prop="accessNum"
        >
        </el-table-column>
        <el-table-column
          label="面积"
          prop="area"
          width="50px"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          width="80px"
          prop="auctionStatus"
        >
        </el-table-column>
        <el-table-column
          label="起拍价"
          prop="startPrice"
        >
        </el-table-column>
        <el-table-column
          label="现价"
          prop="currentPrice"
        >
        </el-table-column>
        <el-table-column
          label="单价"
          prop="currentPrice"
        >
          <template slot-scope="props">
            <span>{{ parseInt(props.row.currentPrice*10000/props.row.area) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="报名人数"
          prop="accessEnsureNum"
          width="50px"
        >
        </el-table-column>
        <el-table-column
          label="出价人数"
          prop="accessEnsureNum"
          width="50px"
        >
        </el-table-column>
        <el-table-column
          label="出价次数"
          prop="bidCount"
        >
        </el-table-column>
        <!-- <el-table-column
          label="当前出价人"
          prop="currentBidUserNumber"
        >
          <template slot-scope="props">
            <span style="color:blue">{{'..'+ props.row.currentBidUserNumber.slice(-4) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="出价详情"
          prop="currentBidUserNumber"
          width="150px"
        >
          <template slot-scope="props">
            <div
              v-for="(item,index) in props.row.bidList.slice(0,5)"
              :key="index"
              style="text-align:center;font-size:10px;line-height:18px"
            >
              <span
                style="color:blue;margin-right:10px"
                class="pointer"
                @click="openDialog(props.row,index)"
              >{{'..'+ item.username.slice(-4) }}</span>
              <span>{{ formatDate(new Date(item.bidTime),'hh:mm:ss') }}</span>
            </div>
            <div
              style="text-align:center"
              class="pointer"
              v-show="props.row.bidCount > 0"
              @click="openDialog(props.row,0)"
            >......</div>
          </template>
        </el-table-column>

        <el-table-column
          label="剩余时间"
          prop="endDuring"
        >
        </el-table-column>
        <el-table-column
          label="结束时间"
          prop="endTime"
        >
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="detailDialog"
      width="1000px"
      center
    >
      <div style="display:flex;justify-content:space-between;width:100%">
        <div class="detail-box">
          <div
            v-for="(item,index) in detailRow.bidList"
            :key="index"
            style="text-align:center;font-size:12px;line-height:20px"
          >
            <span
              style="color:blue;margin-right:10px"
              class="pointer"
              @click="detailIndex = index"
            >{{'..'+ item.username.slice(-4) }}</span>
            <span>{{ formatDate(new Date(item.bidTime),'hh:mm:ss') }}</span>
          </div>
        </div>
        <div>222</div>
        <div>333</div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="detailDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="detailDialog = false"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Axios from 'axios';
import spider from '../../../components/spider/getcount.js'

export default {
  name: '',
  components: {

  },
  data() {
    return {
      paiList: [

      ],
      tableList: [],
      expands: [],
      detailDialog: false,
      detailRow: {},
      detailIndex: -1,
    }
  },
  computed: {},
  watch: {},
  methods: {
    spiderData(){
      spider()
    },
    openDialog(row, index) {
      this.detailRow = row; this.detailIndex = index; this.detailDialog = true;
    },
    init() {
      this.paiList = [
        new PaiInfo(299394826, '7-1-1403', 822846, 115),
        new PaiInfo(299398074, '7-1-1803', 822846, 115),
        new PaiInfo(299404800, '7-2-1301', 822846, 115),
        new PaiInfo(299395085, '7-1-1701', 881214, 126),
        new PaiInfo(299398383, '7-1-801', 881214, 126),
        new PaiInfo(299514528, '湖2-1-2401', 933633, 117),
      ];
    },
    initData() {
      for (let i = 0; i < this.paiList.length; i++) {
        this.getRealData(i)
      }
      let t = setInterval(() => {
        var arr = []
        for (const item of this.paiList) {
          arr.push({
            id: item.id,
            name: item.name,
            src: `https://paimai.jd.com/${item.id}`,
            endDuring: this.formatDuring((item.endTime - Date.now()) / 1000),
            endTime: this.formatDate(new Date(item.endTime), 'MM-dd hh:mm:ss'),
            startPrice: item.startPrice / 10000,
            currentPrice: item.currentPrice / 10000,
            auctionStatus: { 0: '未开始', 1: '进行中', 2: '已结束', }[item.auctionStatus],// 0未开始，1已开始，2已结束

            bidList: item.bidList,
            bidCount: item.bidCount,
            currentBidUserNumber: item.currentBidUserNumber,
            accessEnsureNum: item.accessEnsureNum, // 报名人数
            accessNum: item.accessNum,// 围观人数
            area: item.area,
          })
        }
        this.tableList = arr
        // if(Date.now() < 1697594400000){
        //   clearInterval(t)
        // }
      }, 1000);
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

    async getRealData(i) {
      let info = this.paiList[i];
      let paimaiId = info.id, end = info.end, start = info.start;
      let jsonpData = `jsonp_${Date.now()}_${parseInt(Math.random() * 99999)}`
      let res = await Axios.get('api', {
        params: {
          appid: 'paimai',
          functionId: 'getPaimaiRealTimeData',
          body: JSON.stringify({ "end": end, "paimaiId": paimaiId, "source": 0, "start": start }),
          loginType: 3,
          jsonp: jsonpData,
        },
      })
      if (typeof res.data === 'string' && res.data.indexOf(jsonpData) > -1) {
        let doJs = res.data || ''
        doJs = doJs.replace(jsonpData + '(', '')
        doJs = doJs.replace(');', '')
        let raw = JSON.parse(doJs)
        if (raw.message === '成功') {
          let obj = raw.data
          info.currentPrice = obj.currentPrice || info.currentPrice;
          info.endTime = obj.endTime || info.endTime;
          info.bidCount = obj.bidCount || 0;
          info.bidList = obj.bidList || [];
          info.accessEnsureNum = obj.accessEnsureNum; // 报名人数
          info.accessNum = obj.accessNum;// 围观人数
          info.auctionStatus = obj.auctionStatus;// 0未开始，1已开始，2已结束
          info.currentBidUserNumber = obj.currentBidUserNumber;
        }
      }

      let timeout = parseInt(Math.random() * 3000) + 4000

      // 成交总数不等于已经加载出来的 需要立即加载
      if (info.bidCount != info.bidList.length) {
        timeout = 1000
        info.end = parseInt(info.bidCount / 10) * 10 + 9
        this.timer = this.loopTimer(timeout, i);
        return;
      }
      if (info.auctionStatus != 1) {
        return
      }
      // 结束位-成交总数 < 5 结束位+10 保持结束位始终大于成交总数10
      if (info.end - info.bidCount <= 5) {
        info.end += 10
      }
      console.log(info)
      this.timer = this.loopTimer(timeout, i);
    },
    loopTimer(timeout, index) {
      return setTimeout(() => {
        this.getRealData(index)
      }, timeout)
    },
  },
  created() {
    this.init();
  },
  mounted() {
    // this.initData()
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
.detail-box{
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
