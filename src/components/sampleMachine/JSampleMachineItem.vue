<template>
  <view class="jSampleMachineItem">
    <view class="jSampleMachine-left">
      <u-lazy-load
        :error-img="errorImg"
        :image="goods.searchImage"
      ></u-lazy-load>
    </view>
    <view class="jSampleMachine-cnt">
      <view class="jSampleMachine-cnt-goodsName j-goods-title">
        {{goods.name}}
      </view>
      <view class="jSampleMachine-cnt-price-tips">
        <view v-if="goods.$allPrice" class="jSampleMachine-cnt-price-tips-item">直扣：{{toPercent(goods.$allPrice.ReLossRate)}}%</view>
        <view v-if="goods.$allPrice" class="jSampleMachine-cnt-price-tips-item">返利：{{toFixedNum(goods.$allPrice.ReBateMoney)}}</view>
        <view v-if="goods.$allPrice" class="jSampleMachine-cnt-price-tips-item">台返：{{toFixedNum(goods.$allPrice.RetailPrice)}}</view>
      </view>
      <view class="jSampleMachine-cnt-price-inf">
        <view v-if="goods.$allPrice" class="jSampleMachine-cnt-price">¥ {{toFixedNum(goods.$allPrice.UnitPrice)}}</view>
        <view v-else class="jSampleMachine-cnt-price fs24 fw600">价格即将发布</view>
        <view v-if="goods.$allPrice" class="jSampleMachine-cnt-price-inf-item">供价：¥{{toFixedNum(goods.$allPrice.ActPrice)}}</view>
        <view v-if="goods.detailList" class="jSampleMachine-cnt-price-inf-item">库存：{{goods.detailList[0].ygsKykcl}}</view>
      </view>
      <view class="jSampleMachine-cnt-opts">
        <j-number-box
          v-if="goods.detailList"
          :max="Number(goods.detailList[0].ygsKykcl)"
          @change="goodsNumChange"
        ></j-number-box>
        <button
          class="jSampleMachine-cnt-opts-primary ml26"
          type="button"
          @tap="buyNow"
        >立即购买
        </button>
      </view>
      <view class="jSampleMachine-tags">
        <view
          class="jSampleMachine-tag-item"
          v-for="(item,index) in goods.tags"
          :key="index"
        >{{item}}
        </view>
      </view>
    </view>
    <view
      @tap="choose"
      :class="['jSampleMachine-cnt-like iconfont',goods.$favorite ? 'iconicon3':'iconshoucang1']">
    </view>
    <m-toast
      ref="toast"
      :isdistance="true"
    ></m-toast>
  </view>
</template>

<script>
import MToast from '@/components/plugin/xuan-popup_2.2/components/xuan-popup/xuan-popup.vue';
import './css/JSampleMachineItem.scss';
import JNumberBox from '../common/JNumberBox';
import followGoodsMixin from '@/mixins/goods/followGoods.mixin';

export default {
  name: 'jSampleMachine',
  components: {
    JNumberBox,
    MToast
  },
  mixins: [
    followGoodsMixin
  ],
  props: {
    // 商品对象
    goods: {
      type: Object,
      default: () => {
      }
    },
    // 商品下标
    index: {
      type: Number,
    },
    // 售达方编码
    saletoCode: {
      type: String,
      default: ''
    },
    // 送达方编码
    sendtoCode: {
      type: String,
      default: ''
    },
    // 所有版本的价格
    allPrice: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      // 错误图片
      errorImg: `${process.env.BASE_URL}public/assets/img/goods/defaultImg.png`,
      // 显示选择商品版本弹层
      isShowSpecifications: false,
      // 版本规格信息
      specificationsList: ['111'],
      // 版本规格选中的信息
      specificationsCheckList: []
    };
  },
  created() {
    // this.genSpecificationsList();
  },
  computed: {
    toPercent() {
      return function (val) {
        return (Math.round(val * 10000) / 100).toFixed(2);
      };
    },
    toFixedNum() {
      return function (val) {
        return (Number(val)).toFixed(2);
      };
    }
  },
  methods: {
    choose() {
      /* 选中本商品 */
      const {
        $favorite
      } = this.goods;
      /* 切换关注状态 */
      if ($favorite) {
        this.unFollowGoods();
      } else {
        this.followGoods();
      }
      this.goods.$favorite = !$favorite;
      this.$emit('change', this.goods, this.index);
    },
    async followGoods() {
      /* 添加关注 */
      const {
        saletoCode: customerCode
      } = this;
      console.log(customerCode)
      await this.$mFollowGoods({
        customerCode,
        productCode: this.goods.productCode
      });
      this.$emit('update:followState', true);
    },
    async unFollowGoods() {
      /* 取消关注 */
      const {
        saletoCode: customerCode
      } = this;
      await this.$mUnFollowGoods({
        customerCode,
        productCodeList: [this.goods.productCode]
      });
      this.$emit('update:followState', false);
    },
    buyNow() {
      console.log(this.goods);
      this.$emit('sampleMachineConfirm', this.goods);
    },
    showAddToCartToast() {
      /* 展示添加到购物车提示 */
      this.$refs.toast.open({
        type: 'success',
        content: '加入购物车成功',
        timeout: 2000,
      });
    },
    goodsNumChange({ value }) {
      /* 商品数量change */
      this.goods.number = value;
      // this.$emit('changeNum', this.goods, this.index);
    }
  }
};
</script>
