<template>
  <view class="appdefpro-bg">
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">商品联系人</view>
      <input
        class="appdefpro-row-right mla"
        placeholder="请输入商品联系人"
        placeholderClass="appdefpro-placeholder"
        v-model="form.name"
      />
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">联系电话</view>
      <input class="appdefpro-row-right mla" placeholder="请输入联系电话" v-model="form.phone"/>
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">机器编码</view>
      <input
        class="appdefpro-row-right"
        placeholderClass="appdefpro-placeholder"
         placeholder="请输入机器编码"
         v-model="form.code"
      />
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">产品型号</view>
      <input
        class="appdefpro-row-right"
        placeholder="请输入产品型号"
        disabled
      />
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">付款方</view>
      <input class="appdefpro-title" placeholder="请输入付款方" v-model="payer"/>
      <i class="appdefpro-icon iconfont iconyou" @tap="showPayer"></i>
      <view class="appdefpro-addressList" v-show="isShowPayer">
        <view v-for="(item, index) in payerList" :key="index">
          <view :class="['appdefpro-address', item.isChecked && 'active']" @tap="itemPayer(item)">{{item.name}}</view>
        </view>
      </view>
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">明细地址</view>
      <input class="appdefpro-title" placeholder="请输入明细地址" v-model="address"/>
      <i class="appdefpro-icon iconfont iconyou" @tap="showAddress"></i>
      <view class="appdefpro-addressList" v-show="isShowAddress">
        <view v-for="(item, index) in addressesList" :key="index">
          <view :class="['appdefpro-address', item.isChecked && 'active']" @tap="itemAddress(item)">{{item.name}}</view>
        </view>
      </view>
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row2">
      <view class="appdefpro-row2-title">故障描述</view>
    </view>
    <view class="appdefpro-row2-bottom">
      <view class="appdefpro-row2-iinput">
        <textarea
          class="appdefpro-row2-iinput-text"
          placeholder="请输入故障描述"
          maxlength="240"
        />
        <view class="appdefpro-row2-bottom-number">{{ textnum }}/240</view>
      </view>
    </view>
    <view class="appdefpro-botton-box">
      <button class="appdefpro-button1">
        <view class="appdefpro-button1-title">提交</view>
      </button>
    </view>
  </view>
</template>

<script>
import './css/warrantyofdefectiveproducts.scss';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  data() {
    return {
      address: '',
      payer: '',
      isShowAddress: false,
      isShowPayer: false,
      value: [0],
      years: ['aa', 'bbb', 'cc', 'ccdd', 'eee'],
      textnum: 12,
      // 配送地址列表
      addressesList: [],
      payerList: [],
      deliveryAddressList: {},
      allPayer: [],
      form: {
        name: '',
        phone: '',
        code: '',
        address: '',
        payer: ''
      },

    };
  },
  created() {
    this.getAccountMsg();
    this.getDeliveryAddress();
    this.getAfterSalePayer();
  },
  computed: {
    ...mapGetters({
      saleInfo: USER.GET_SALE,
    })

  },
  methods: {
    switchchange() {
      this.$refs.popup.open();
    },
    async getAccountMsg() {
      const { code, data } = await this.customerService.getAccountMsg();
      if (code === '1') {
        console.log(data);
        this.form.name = data.realName;
        this.form.phone = data.phone;
      }
    },
    async getDeliveryAddress() {
      /* 获取配送地址 */
      await this.customerService.addressesList(1).then(({ code, data }) => {
        if (code === '1') {
          this.addressesList = data;
          this.addressesList.forEach((item) => {
            item.name = `(${item.customerCode})${item.addressName}`;
            item.isChecked = false;
          });
          console.log(this.addressesList);
        }
      });
    },
    showAddress() {
      console.log(111111);
      this.isShowAddress = !this.isShowAddress;
      console.log(this.isShowAddress);
    },
    itemAddress(item) {
      this.address = item.name;
      this.addressesList.forEach((ele) => {
        ele.isChecked = false;
      });
      item.isChecked = true;
      this.isShowAddress = false;
    },
    //  售后付款方列表
    async getAfterSalePayer() {
      await this.customerService.afterSalePayer(this.saleInfo.salesGroupCode, 1).then(({ code, data }) => {
        if (code === '1') {
          this.payerList = data;
          this.payerList.forEach((item) => {
            item.name = `(${item.payerCode})${item.payerName}(${item.salesGroupCode})`;
            item.isChecked = false;
          });
        }
      });
    },
    showPayer() {
      this.isShowPayer = !this.isShowPayer;
    },
    itemPayer(item) {
      this.payer = item.name;
      this.payerList.forEach((ele) => {
        ele.isChecked = false;
      });
      item.isChecked = true;
      this.isShowPayer = false;
    }
  },
};
</script>

<style></style>
