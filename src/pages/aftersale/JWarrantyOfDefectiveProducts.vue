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
      <input class="appdefpro-title" placeholder="请输入付款方" />
      <i class="appdefpro-icon iconfont iconyou"></i>
    </view>
    <view class="appdefpro-row-row"></view>
    <view class="appdefpro-row">
      <view class="appdefpro-row-left">明细地址</view>
      <input class="appdefpro-title" placeholder="请输入明细地址" />
      <i class="appdefpro-icon iconfont iconyou"></i>
      <view class="appdefpro-addressList">
        <view v-for="(item, index) in addressesList" :key="index">
          <view class="appdefpro-address">{{item.name}}</view>
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
import { USER } from '@/store/mutationsTypes';

export default {
  data() {
    return {
      value: [0],
      years: ['aa', 'bbb', 'cc', 'ccdd', 'eee'],
      textnum: 12,
      //配送地址列表
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
          this.addressesList.forEach(item => {
            item.name = `(${item.customerCode})${item.addressName}`;
          });
          console.log(this.addressesList);
          // console.log(data);
          // // 配送地址列表
          // this.deliveryAddressList = data.map(v => ({
          //   id: v.customerCode,
          //   name: `(${v.customerCode})${v.addressName}`,
          //   tradeCode: v.tradeCode
          // }));
          // console.log(this.deliveryAddressList);
          // // 当前配送地址修改(选出默认地址)
          // const defaultIndex = data.findIndex(v => v.defaultFlag === 1);
          // console.log(defaultIndex);
          // if (defaultIndex > -1) {
          //   console.log(data[defaultIndex]);
          //   const curChoseDeliveryAddress = data[defaultIndex];
          //   curChoseDeliveryAddress.name = `${curChoseDeliveryAddress.customerCode}${curChoseDeliveryAddress.addressName}`;
          //   console.log(curChoseDeliveryAddress);
          //   // 更新默认送达方store
          //   this[USER.UPDATE_DEFAULT_SEND_TO](curChoseDeliveryAddress);
          //   this.deliveryAddressList[defaultIndex].checked = true;
          //   this.curChoseDeliveryAddress = curChoseDeliveryAddress;
          // }
        }
      });
    },
    //  售后付款方列表
    async getAfterSalePayer() {
      await this.customerService.getcustomersList(1).then(({ code, data }) => {
        if (code === '1') {
          this.payerList = data;
        }
      });
    }
  },
};
</script>

<style></style>
