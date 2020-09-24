<template>
  <view class="terposannfee-bg">
    <view class="terposannfee-space">
      <view class="terposannfee-row">
        <view class="terposannfee-top-left">
          <image :src="img1" class="terposannfee-img" />
          <input
            class="terposannfee-input"
            placeholder="请输入终端号"
            placeholder-class="terposannfee-plahol"
            v-model="inputdata"
          />
        </view>
        <view class="terposannfee-top-right">
          <view class="terposannfee-topright-title">
            <view class="terposannfee-title">
              <view @click="search" class="terposannfee-color">搜索</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view :key="index" class="terposannfee-box" v-for="(item,index) in posYearfeeList">
      <view class="terposannfee-space">
        <view class="terposannfee-title">
          <view class="terposannfee-color2">售达方编码：{{item.customerCode}}</view>
        </view>
      </view>
      <view class="terposannfee-space">
        <view class="terposannfee-line"></view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">应收年：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color4">{{item.year}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">应收月：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color4">{{item.month}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">年费：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color4">{{item.nianFei}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">社区名称：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color4">{{item.shopName}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">终端号：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color2">{{item.terminalNo}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">频次：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color2">{{item.pinCi}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space3">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">状态：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view
                class="terposannfee-color2"
                v-if="item.status==='1'"
              >{{item.status|statusjudgment}}</view>
              <view class="terposannfee-color5" v-else>{{item.status|statusjudgment}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space">
        <view class="terposannfee-row">
          <view class="terposannfee-title">
            <view class="terposannfee-color3">机器状态：</view>
          </view>
          <view class="terposannfee-right">
            <view class="terposannfee-title">
              <view class="terposannfee-color2">{{item.posJiStatus|posjistatusjudge}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposannfee-space4">
        <view class="terposannfee-line2"></view>
      </view>
      <view class="terposannfee-row">
        <view class="terposannfee-button1">
          <view class="terposannfee-but1-text">
            <view class="terposannfee-title">
              <view class="terposannfee-color5">费用查询</view>
            </view>
          </view>
        </view>
        <view class="terposannfee-button2">
          <view class="terposannfee-but2-text">
            <view class="terposannfee-title">
              <view class="terposannfee-color">缴费</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import "./css/terposannfee.scss";
import img1 from "../../assets/img/bankacceptance/search.png";
import { mapGetters } from "vuex";
import { USER } from "../../store/mutationsTypes";

export default {
  data() {
    return {
      img1,
      inputdata: "",
      form: {
        customerCode: "",
        pageNum: null,
        pageSize: "10",
        terminalNo: "",
      },
      total: 0,
      posYearfeeList: [],
      pageNo: 1,
    };
  },
  methods: {
    async getposYearfeeList() {
      this.form.pageNum = 1;
      const { code, data } = await this.accountService.posYearfeeList(
        this.form
      );
      console.log(data.list);
      this.posYearfeeList = data.list;
      this.total = data.total;
    },
    async addlist() {
      this.form.pageNum = this.pageNo;
      const { code, data } = await this.accountService.posYearfeeList(
        this.form
      );
      console.log(data);
      this.posYearfeeList = this.posYearfeeList.concat(data.list);
    },
    onReachBottom() {
      console.log("到底了，该加页了");
      if (
        this.posYearfeeList.length > 0 &&
        this.total > (this.pageNo - 1) * 10
      ) {
        this.pageNo++;
        console.log(this.pageNo);
        this.addlist();
      } else {
        console.log("到底了，没数了");
      }
    },
    search() {
      this.form.terminalNo = this.inputdata;
      this.getposYearfeeList();
    },
  },
  created() {
    this.form.customerCode = this.saleInfo.customerCode;
    this.getposYearfeeList();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO,
    }),
  },
  filters: {
    statusjudgment(value) {
      if (value === "1") {
        return "已缴费";
      }
      return "未缴费";
    },
    posjistatusjudge(value) {
      if (value === "0") {
        return "正常";
      }
      return "不正常";
    },
  },
};
</script>

<style></style>
