<template>
  <view class="temposapp-bg">
    <view class="temposapp-space2">
      <view class="temposapp-row">
        <view @click="urlnewposinf" class="temposapp-left">
          <image :src="img2" class="temposapp-lefticon" />
          <view class="temposapp-lefttitle">新建</view>
        </view>
        <view class="temposapp-right2">
          <view @click="openpopright" class="temposapp-row">
            <view class="temposapp-title">
              <view class="temposapp-color">日期</view>
            </view>
            <image :src="img1" class="temposapp-img" />
          </view>
        </view>
      </view>
    </view>
    <view :key="index" class="temposapp-box" v-for="(item,index) in pospaymentlist">
      <view class="temposapp-space3">
        <view class="temposapp-title">
          <view class="temposapp-color">订单号：{{item.corderCode}}</view>
        </view>
      </view>
      <view class="temposapp-space3">
        <view class="temposapp-line"></view>
      </view>
      <view class="temposapp-space">
        <view class="temposapp-row">
          <view class="temposapp-title">
            <view class="temposapp-width">
              <view class="temposapp-color2">售达方编码/售达方名称：</view>
            </view>
          </view>
          <view class="temposapp-right">
            <view class="temposapp-width2">
              <view class="temposapp-title">
                <view class="temposapp-color3">{{item.ccustCode_SP}}/{{item.ccustName_SP}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="temposapp-space">
        <view class="temposapp-row">
          <view class="temposapp-title">
            <view class="temposapp-width">
              <view class="temposapp-color2">客户详细地址：</view>
            </view>
          </view>
          <view class="temposapp-right">
            <view class="temposapp-width2">
              <view class="temposapp-title">
                <view class="temposapp-color3">{{item.csqdAddress}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="temposapp-space">
        <view class="temposapp-row">
          <view class="temposapp-title">
            <view class="temposapp-width">
              <view class="temposapp-color2">客户负责人：</view>
            </view>
          </view>
          <view class="temposapp-right">
            <view class="temposapp-width2">
              <view class="temposapp-title">
                <view class="temposapp-color3">{{item.csqdManager}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="temposapp-space">
        <view class="temposapp-row">
          <view class="temposapp-title">
            <view class="temposapp-width">
              <view class="temposapp-color2">申请日期：</view>
            </view>
          </view>
          <view class="temposapp-right">
            <view class="temposapp-width2">
              <view class="temposapp-title">
                <view class="temposapp-color3">{{item.dinsert|dateoutput}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="temposapp-space">
        <view class="temposapp-row">
          <view class="temposapp-title">
            <view class="temposapp-width">
              <view class="temposapp-color2">状态：</view>
            </view>
          </view>
          <view class="temposapp-right">
            <view class="temposapp-width2">
              <view class="temposapp-title">
                <view class="temposapp-color">
                  <view class="temposapp-textposi">{{item.status|statusJudgment}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="temposapp-space4">
        <view class="temposapp-line2"></view>
      </view>
      <view class="temposapp-row">
        <view class="temposapp-leftbutton">
          <view @click="popup" class="temposapp-buttitle1">装机确认</view>
        </view>
        <view @click="tourl(item)" class="temposapp-rightbutton">
          <view class="temposapp-buttitle2">查看</view>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <JInstallation-confirmation></JInstallation-confirmation>
    </uni-popup>
    <uni-popup ref="popright" type="right">
      <jpos-applicationinquiry
        :enddatechild="enddate"
        :startdatechild="startdate"
        @opencalendar="opencalendar"
        @posappinqconfirm="terposappsearch"
        @posappinqreset="datereset"
      ></jpos-applicationinquiry>
    </uni-popup>
    <uni-calendar :insert="false" @confirm="confirm($event)" ref="calendar"></uni-calendar>
  </view>
</template>

<script>
import {
  uniCalendar,
  uniPopup
} from '@dcloudio/uni-ui';
import img1 from '../../assets/img/bankacceptance/down.png';
import './css/terposapp.scss';
import JInstallationConfirmation from './JInstallationConfirmation';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';
import jposApplicationinquiry from './JPosApplicationInquiry';
import img2 from '../../assets/img/bankacceptance/add.png';

export default {
  data() {
    return {
      img1,
      img2,
      pageNo: 1,
      total: 1,
      form: {
        custCode: '',
        endDate: '',
        orderCode: '',
        pageNum: 1,
        pageSize: '10',
        startDate: ''
      },
      pospaymentlist: [],
      startdate: '开始时间',
      enddate: '结束时间',
      datejudgment: null,
    };
  },

  methods: {
    opencalendar(a) {
      this.datejudgment = a;
      this.$refs.calendar.open();
    },
    datereset() {
      this.startdate = '开始时间';
      this.enddate = '结束时间';
    },
    popup() {
      this.$refs.popup.open();
    },
    openpopright() {
      this.$refs.popright.open();
    },
    popdown() {
      this.$refs.popup.close();
    },
    async init() {
      await this.getposPaymentList();
    },
    async getposPaymentList() {
      this.form.pageNum = 1;
      const { code, data } = await this.accountService.posPaymentList(this.form);
      console.log(data.list);
      this.pospaymentlist = data.list;
      this.total = data.total;
    },
    async addlist() {
      this.form.pageNum = this.pageNo;
      const { code, data } = await this.accountService.posPaymentList(this.form);
      console.log(data);
      this.pospaymentlist = this.pospaymentlist.concat(data.list);
    },
    confirm(e) {
      if (this.datejudgment === 1) {
        this.startdate = e.fulldate;
        console.log(this.startdate);
      } else {
        this.enddate = e.fulldate;
      }
    },
    onReachBottom() {
      console.log('到底了，该加页了');
      this.pageNo++;
      if (this.pospaymentlist.length > 0 && (this.total > (this.pageNo - 1) * 10)) {
        this.pageNo++;
        this.addlist();
      } else {
        console.log('到底了，没数了');
      }
    },
    onPullDownRefresh() {
      this.getposPaymentList();
      console.log('nihao');
    },
    tourl(i) {
      const istr = JSON.stringify(i);
      uni.navigateTo({
        url: `/pages/bankacceptance/JTerminalPOSDetails?i=${istr}`
      });
    },
    urlnewposinf() {
      uni.navigateTo({
        url: '/pages/bankacceptance/JNewPosInformation'
      });
    },
    async terposappsearch(o) {
      if (this.startdate === '开始时间') {
        this.form.startDate = '';
      } else {
        this.form.startDate = this.startdate;
      }
      if (this.enddate === '结束时间') {
        this.form.endDate = '';
      } else {
        this.form.endDate = this.enddate;
      }
      this.form.pageNum = 1;
      this.form.orderCode = o;
      const { code, data } = await this.accountService.posPaymentList(this.form);
      console.log(data);
      this.pospaymentlist = data.list;
      this.total = data.total;
      this.$refs.popright.close();
    }
  },
  created() {
    this.form.custCode = this.saleInfo.customerCode;
    this.init();
  },
  components: {
    uniPopup,
    JInstallationConfirmation,
    jposApplicationinquiry,
    uniCalendar
  },
  filters: {
    dateoutput(value) {
      if (value === '') {
        return value;
      }
      return value.slice(0, 10);
    },
    statusJudgment(value) {
      if (value === 1) {
        return '已装机';
      }
      if (value === 0) {
        return '已撤机';
      }

      if (value === 6) return '草稿';

      return '未处理';
    },
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
  }

};
</script>

<style>
/deep/ .uni-calendar__header-btn-box {
  /* display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;*/
  width: 100px;
}
/deep/ .uni-calendar__backtoday {
  position: absolute;
  right: 6px;
  top: 17px;
  padding: 0 2px;
  padding-left: 5px;
  height: 13px;
  line-height: 13px;
  font-size: 6px;
  border-top-left-radius: 13px;
  border-bottom-left-radius: 13px;
  color: #333;
  background-color: #f1f1f1;
}
</style>
