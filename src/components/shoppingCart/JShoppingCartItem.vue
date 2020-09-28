<template>
  <view class="jShoppingCartItem j-fix-u-numberBox">
    <view class="jShoppingCartItem-head">
      <!--组合类型(1单品2组合3抢购4套餐5成套)-->
      <block
        v-if="goods.activityType===3"
      >
        <button
          class="jShoppingCartItem-btn-primary mr12"
          type="button"
        >抢购
        </button>
        <text class="jShoppingCartItem-head-text">活动到期日：{{goods.expTime}}</text>
        <view class="jShoppingCartItem-head-line"></view>
        <text class="jShoppingCartItem-head-text">活动数量：{{goods.canBuy}}</text>
      </block>
      <!--普通购物车5代表反向定制，属于抢购=。=-->
      <block
        v-else-if="goods.activityType===5"
      >
        <button
          :class="['jShoppingCartItem-btn-primary mr12',goods.signed !== true && 'disabled']"
          type="button"
        >反向定制
        </button>
        <template v-if="goods.signed !== true">
          <view class="j-flex-aic">
            <view class="jShoppingCartItem-head-text">
              未签约不能购买活动
            </view>
            <view
              @tap="handleSign"
              class="j-flex-aic ml20 jShoppingCartItem-head-to-sign"
            >
              <view
                class="iconfont icongoahead jShoppingCartItem-head-to-sign-icon mr6"
              ></view>前往签约
            </view>
          </view>

        </template>
        <template v-else>
          <text class="jShoppingCartItem-head-text">活动到期日：{{goods.expTime}}</text>
          <view class="jShoppingCartItem-head-line"></view>
          <template v-if="goods.intentionMoney">
            <text class="jShoppingCartItem-head-text">预定金比例：{{goods.intentionMoney}}%</text>
            <view class="jShoppingCartItem-head-line"></view>
            <text class="jShoppingCartItem-head-text">直发订单</text>
          </template>
        </template>
      </block>
      <view
        @tap="handleDel"
        class="jShoppingCartItem-head-close iconfont iconcross"
      ></view>
    </view>
    <view class="jShoppingCartItem-cnt">
      <view
        class="jShoppingCartItem-cnt-check"
        @tap="choose"
      >
        <i
          :class="['iconfont', goods.checked ? 'iconradio active':'iconradio1']"
          v-if="!disabledCheck"
        ></i>
        <i
          :class="['iconfont icontabledisable disabled']"
          v-else
        ></i>
      </view>
      <view class="jShoppingCartItem-cnt-img-wrap">
        <u-lazy-load
          :error-img="errorImg"
          :image="goods.productList && goods.productList[0].productImageUrl"
          @tap="goDetail(goods)"
        ></u-lazy-load>
      </view>
      <view class="jShoppingCartItem-cnt-inf">
        <view class="jShoppingCartItem-cnt-inf-title">
          {{goods.productList && goods.productList[0].productName}}
        </view>
        <view class="jShoppingCartItem-cnt-price-inf">
          <view class="jShoppingCartItem-cnt-price">
            ¥{{chosePrice.invoicePrice}}
          </view>
          <view class="jShoppingCartItem-cnt-price-inf-item">
            小计：¥{{totalChosePrice}}
          </view>
          <j-number-box
            :max="maxGoodsNumber"
            :min="minGoodsNumber"
            :value="goods.number"
            @blur="goodsNumChange"
            @minus="goodsNumChange"
            @plus="goodsNumChange"
          ></j-number-box>
        </view>
      </view>
      <view
        :class="['jShoppingCartItem-cnt-like iconfont',followState ? 'iconicon3':'iconshoucang1']"
        @tap="toggleFollow"
      ></view>
    </view>
    <view class="jShoppingCartItem-btm">
      <view class="jShoppingCartItem-btm-options-wrap">
        <view class="jShoppingCartItem-btm-tags mr34">
          <view
            v-if="goods.productList[0].swrhFlag==='Y'"
            class="jShoppingCartItem-btm-tag"
          >统
          </view>
          <view
            v-if="goods.productList[0].signStatus==='Y'"
            class="jShoppingCartItem-btm-tag"
          >云
          </view>
          <view
            v-if="goods.productList[0].ydzfFlag==='Y'"
            class="jShoppingCartItem-btm-tag"
          >异
          </view>
        </view>
        <view
          @tap="showStockPicker"
          class="jShoppingCartItem-btm-text"
        >
          库存：{{goods.productList[0].productStock}}
          <view
            v-if="stockOptions.length"
            class="iconfont iconxia"
          ></view>
        </view>
        <view class="j-flex-aic">
          <view
            class="jShoppingCartItem-btm-switch-wrap"
            v-if="isCreditModel"
          >
            <j-switch
              :active="goods.isCreditMode"
              :beforeChange="handleBeforeCreditModeChange"
              @change="switchModeChange('isCreditMode',$event)"
            >
            </j-switch>
            <text class="jShoppingCartItem-btm-switch-text mr32 ml8">信用模式</text>
          </view>
          <view
            class="jShoppingCartItem-btm-switch-wrap"
            v-if="isFundsFirst"
          >
            <j-switch
              :active="goods.isFundsFirstMode"
              @change="switchModeChange('isFundsFirstMode',$event)"
            >
            </j-switch>
            <text class="jShoppingCartItem-btm-switch-text mr32 ml8">款先</text>
          </view>
          <view
            class="jShoppingCartItem-btm-switch-wrap"
            v-if="isDirect"
          >
            <j-switch
              :active.sync="goods.isDirectMode"
              @change="switchModeChange('isDirectMode',$event)"
            >
            </j-switch>
            <text class="jShoppingCartItem-btm-switch-text mr32 ml8">直发</text>
          </view>
          <view
            class="jShoppingCartItem-btm-switch-wrap"
            v-if="isWeek"
          >
            <j-switch
              :active.sync="goods.isWeekMode"
              @change="switchModeChange('isWeekMode',$event)"
            >
            </j-switch>
            <text
              class="jShoppingCartItem-btm-switch-text ml8"
            >远周次</text>
            <template
              v-if="goods.isWeekMode"
            >
              <text
                @tap="showWeekPicker"
                class="jShoppingCartItem-btm-week-text mr4 ml8"
              >{{choseWeekKeys.join('') || '请选择时间'}}</text>
              <view
                @tap="showWeekPicker"
                class="iconfont iconxia mr32"
              ></view>
            </template>
          </view>
        </view>
        <!--v-if="goods.productList[0].specialPrice==='Y'"-->
        <view
          v-if="isShowSpecificationsBtn"
          :class="['jShoppingCartItem-btm-version-picker',goods.choseOtherVersions.length && 'active']"
          @tap="showSpecifications"
        >
          <text>版本规格</text>
          <i class="iconfont iconxia"></i>
        </view>
      </view>
      <block v-if="choseVersionInf && choseVersionInf.length">
        <view
          v-for="(inf,index) in choseVersionInf"
          :key="index"
        >
          <view
            v-if="inf"
            class="jShoppingCartItem-btm-inf-wrap"
          >
            <view
              v-if="inf.$origin==='update'"
              @tap="handleDelVersion(inf)"
              class="jShoppingCartItem-btm-inf-close iconfont iconcross"
            ></view>
            <view class="jShoppingCartItem-btm-inf-icon">
              <view class="iconfont iconi"></view>
            </view>
            <view>{{inf.content}}</view>
          </view>
        </view>
      </block>
      <view>
        <template
          v-for="(item,index) in choseVersions"
        >
          <view
            :key="index"
            class="jShoppingCartItem-btm-inf-real-wrap"
            v-if="item.$isRealProduct"
          >
            <view
              class="jShoppingCartItem-btm-inf-real-icon mr10"
            >
              <view class="iconfont iconcalculator"></view>
            </view>
            <view class="jShoppingCartItem-btm-inf-real-cnt">
              <view class="jShoppingCartItem-btm-inf-real-title j-text-ellipsis">
                样机版本：{{item.versionCode}}
              </view>
              <view class="jShoppingCartItem-btm-inf-real-text-wrap">
                <text class="mr20">价格：¥{{item.invoicePrice}}</text>
                <text class="mr20">数量：{{item.usableQty}}</text>
                <text class="mr20">小计：¥{{item.$realProductTotalPrice}}</text>
              </view>
            </view>
            <view
              class="jShoppingCartItem-btm-inf-real-close-wrap"
              v-if="item.$origin==='update'"
            >
              <view
                @tap="handleDelVersion(item)"
                class="jShoppingCartItem-btm-inf-real-close iconfont iconcross"
              ></view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <j-version-specifications
      :show.sync="isShowSpecifications"
      :versionData="specificationsList"
      type="custom"
      @customCheck="specificationsCustomCheckFun"
      @confirm="specificationsConfirm"
      @cancel="specificationsCancel"
      @change="specificationsChange"
    >
      <template #head>
        <view class="jVersionSpecifications-pop-head-wrap">
          <view class="jVersionSpecifications-pop-head">
            <view class="jVersionSpecifications-pop-head-left">
              <image :src="goods.productList[0].productImageUrl"></image>
            </view>
            <view class="jVersionSpecifications-pop-head-cnt">
              <view class="jVersionSpecifications-pop-head-cnt-title">{{goods.productList[0].productName}}</view>
              <view class="mt16 jVersionSpecifications-pop-head-cnt-item">
                <view class="jVersionSpecifications-pop-head-cnt-text">建议零售价：</view>
                <view class="jVersionSpecifications-pop-head-cnt-price">
                  ¥{{ptPrice.recommendsalePrice}}
                </view>
                <view class="jVersionSpecifications-pop-head-cnt-text ml20">
                  供价：{{ptPrice.supplyPrice}}
                </view>
              </view>
              <view class="mt8 jVersionSpecifications-pop-head-cnt-item">
                <view class="jVersionSpecifications-pop-head-cnt-text">
                  台返 ：{{ptPrice.rebateMoney || 0.00}}
                </view>
                <view class="jVersionSpecifications-pop-head-cnt-text ml20">
                  返利：{{ptPrice.rebatePolicy | rebatePolicy}}
                </view>
                <view class="jVersionSpecifications-pop-head-cnt-text ml20">
                  直扣率：{{ptPrice.rebateRate}}%
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </j-version-specifications>
    <view class="jShoppingCartItem-stock-picker-par">
      <j-pop-picker
        :choseKeys.sync="choseStockOptions"
        :isCanBeCheck="false"
        :isShowValue="false"
        :options="stockOptions"
        :show.sync="isStockPickerShow"
        keyName="stockTypeCode"
        title="库存"
      >
        <template #default="slotProps">
          <view class="jShoppingCartItem-stock-picker-wrap">
            <view
              class="jShoppingCartItem-stock-picker-l"
            >
              <view class="jShoppingCartItem-stock-picker-dot"></view>
              <text style="color:#666; font-size:13px; margin-right:6px;">{{slotProps.data.stockType}}</text>
              <text>{{slotProps.data.qty}}</text>
              台
            </view>
            <view
              class="jShoppingCartItem-stock-picker-r"
            >预计到货时间：{{slotProps.data.arrivalTime}}
            </view>
          </view>
        </template>
      </j-pop-picker>
    </view>
    <j-pop-picker
      :choseKeys.sync="choseWeekKeys"
      :options="weekOptions"
      :show.sync="isWeekPickerShow"
      @change="weekPickerChange"
      title="远周次"
    ></j-pop-picker>
    <!--只为可以图片打包进去-->
    <image
      :src="`${baseUrl}public/assets/img/goods/defaultImg.png`"
      class="dis-none"
    ></image>
  </view>
</template>

<script>
import {
  produce
} from 'immer';
import JSwitch from '../form/JSwitch';
import JVersionSpecifications from './JVersionSpecifications';
import JPopPicker from '../form/JPopPicker';
import './css/JShoppingCartItem.scss';
import followGoodsMixin from '@/mixins/goods/followGoods.mixin';
import shoppingCartMixin from '@/mixins/shoppingCart/shoppingCart.mixin';
import {
  getGoodsInCartPriceType,
  getYj
} from '@/lib/dataDictionary';

import AddNumberForm from '@/model/AddNumberForm';
import JNumberBox from '../common/JNumberBox';

export default {
  name: 'JShoppingCartItem',
  components: {
    JNumberBox,
    JPopPicker,
    JVersionSpecifications,
    JSwitch,
  },
  mixins: [
    followGoodsMixin,
    shoppingCartMixin
  ],
  props: {
    // 商品数据
    goods: {
      type: Object,
      default: () => {
      }
    },
    // 商品索引
    index: {
      type: [String, Number]
    },
    // 所有版本的价格
    allPrice: {
      type: Object,
      default: () => {
      }
    },
    // 仓库标志，云仓，异地云仓皆有值
    warehouseFlag: {},
    // 版本价格
    versionPrice: {
      type: Object
    },
    // 用户信息
    userInf: {
      type: Object
    },
    // 默认售达方信息
    defaultSendTo: {
      type: Object
    },
    creditQuotaList: {
      type: Array,
      default: () => []
    },
    // 收藏状态
    followState: {
      type: Boolean
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      // 错误图片
      errorImg: `${process.env.BASE_URL}public/assets/img/goods/defaultImg.png`,
      // 是否显示版本规格
      isShowSpecifications: false,
      // 版本信息
      specificationsList: [],
      // 选择的版本
      specificationsCheckList: [],
      // 库存展示
      isStockPickerShow: false,
      // 库存数据
      stockOptions: [],
      // 选中的库存数据
      choseStockOptions: [''],
      // 数组框是否初始化了
      isNumberInit: false,
      // 远周次picker show
      isWeekPickerShow: false,
      // 远周次数据
      weekOptions: [],
      // 选择的远周次key
      choseWeekKeys: [''],
      // 创建的次数
      createdNum: 0
    };
  },
  created() {
    this.createdNum++;
    this.setPageInf();
  },
  computed: {
    thisProduct() {
      /* 获取产品 */
      return this.goods.productList && this.goods.productList[0];
    },
    sdsds() {
      /* 获取产品 */
      // todo 纯测试用，待删除
      return this.goods.activityId;
    },
    stockNum() {
      // inStock
      const product = this.thisProduct;
      if (!product) {
        return 0;
      }
      const {
        inStock
      } = product;
      return inStock;
    },
    isDirect() {
      /* 直发 */
      const product = this.thisProduct;
      if (!product) {
        return false;
      }
      // 符合显示直发的产品组
      const directProducts = ['BA', 'BB', 'BD'];
      const {
        productGroup
      } = product;
      const inProductGroup = directProducts.find(v => v === productGroup);
      // 如果选中了工程版本，也会显示【直发】switch
      return inProductGroup || !!(this.choseVersions.find(v => v.priceType === 'GC') && !this.choseVersions.find(v => v.$isTransfer));
    },
    isCreditModel() {
      /* 是否支持信用模式 */
      // 传统渠道不支持信用模式
      if (this.userInf.channelGroup === 'CT') {
        return false;
      }
      const {
        activityType,
        productList
      } = this.goods;
      let state = false;
      // 异地云仓 抢购、反向定制都不支持信用模式
      state = productList[0].creditModel === '1'
          && !this.warehouseFlag
          && (activityType !== 3 || activityType !== 5);

      if (this.choseVersions && this.choseVersions.length) {
        // 查找是否有非普通版本，非普通版本也没有信用模式
        state = state && !this.choseVersions.find((v) => {
          const priceType = v.priceType;
          return !!((priceType && priceType.toUpperCase() !== 'PT') || v.$isTransfer);
        });
      }
      return state;
    },
    isFundsFirst() {
      /* 是否款先 */
      let state = false;
      if (Object.keys(this.versionPrice).length) {
        const {
          kuanXian
        } = this.versionPrice;
        if (kuanXian && Object.keys(kuanXian).length && kuanXian[this.goods.productList[0].productCode] === '1') {
          state = true;
        }
      }
      // 传统渠道样机不支持选择款先，默认款先
      if (this.userInf.channelGroup === 'CT' && this.chosePrice) {
        const isContainYj = getYj()[this.chosePrice.priceType];
        state = state && !isContainYj;
      }
      // 异地云仓不支持选择款先，默认款先
      if (this.warehouseFlag === 'ydyc') {
        state = false;
      }

      return state;
    },
    isWeek() {
      /* 是否显示远周次 */
      return !!this.weekOptions.length && !this.choseVersions.find(v => v.$isTransfer);
    },
    isShowSpecificationsBtn() {
      /* 是否显示【版本规格】按钮 */
      return !!(this.specificationsList.filter(v => !v.isHide).length) && !this.goods.isCreditMode;
    },
    choseVersions() {
      /* 选择的所有版本信息 */
      return this.getPriceVersionData(this.goods);
    },
    choseVersionInf() {
      /* 选择的版本信息 */
      const curVersions = this.choseVersions;
      // !!(product && product.priceType === 'PT');
      return curVersions.map((curVersion) => {
        // 普通价格不额外显示
        const {
          // 版本类型
          priceType,
          $origin,
          $isTransfer
        } = curVersion;
        if (JSON.stringify(curVersion) === '{}' || (priceType === 'PT' && !$isTransfer) || curVersion.$isRealProduct) {
          return '';
        }
        const {
          // 版本名
          // priceTypeName,
          // 版本编号
          versionCode,
          // 版本发票价
          invoicePrice,
          // 版本可用数量
          usableQty,
          // 版本调货可用数量
          number,
          // 更新的版本的picker父id
          $parentId,
          // 更新的版本在picker里的index
          $choseIndex
        } = curVersion;
        const inf = {
          $parentId,
          $choseIndex,
          $origin
        };
        if (priceType) {
          inf.content = `${getGoodsInCartPriceType()[priceType.toUpperCase()]}版本：${versionCode} ￥${invoicePrice} 数量：${usableQty}`;
        } else {
          inf.content = `版本调货：${versionCode} 数量：${number}`;
        }
        return inf;
      });
    },
    chosePrice() {
      /* 选择的用来显示价格的版本信息 */
      const versions = this.choseVersions;
      // 非版本调货的才显示
      let v = versions.find(vs => vs.priceType && !vs.$isRealProduct);
      if (!v) {
        if (versions.length) {
          // 说明有版本调货,版本调货无价格，需要取普通价
          v = this.goods.$PriceInfo.commonPrice;
        } else {
          v = {};
        }
      }
      v = JSON.parse(JSON.stringify(v));
      v.invoicePrice = this.jshUtil.formatNumber(v.invoicePrice, 2);
      v.supplyPrice = this.jshUtil.formatNumber(v.supplyPrice, 2);
      v.rebateMoney = this.jshUtil.formatNumber(v.rebateMoney, 2);
      v.rebateRate = this.jshUtil.formatNumber(this.jshUtil.arithmetic(v.rebateRate, 100, 3), 2);
      return v;
    },
    ptPrice() {
      /* 普通价格 */
      const priceInfTemp = this.goods.$PriceInfo.commonPrice;
      const priceInf = {};
      const recommendsalePrice = this.goods.productList[0].recommendsalePrice;
      priceInf.recommendsalePrice = this.jshUtil.formatNumber(recommendsalePrice, 2);
      priceInf.invoicePrice = this.jshUtil.formatNumber(priceInfTemp.invoicePrice, 2);
      priceInf.supplyPrice = this.jshUtil.formatNumber(priceInfTemp.supplyPrice, 2);
      priceInf.rebateMoney = this.jshUtil.formatNumber(priceInfTemp.rebateMoney, 2);
      priceInf.rebateRate = this.jshUtil.formatNumber(this.jshUtil.arithmetic(priceInfTemp.rebateRate, 100, 3), 2);
      return priceInf;
    },
    totalChosePrice() {
      /* 本产品的总价格 */
      let total = 0;
      if (this.chosePrice && this.chosePrice.invoicePrice) {
        total = this.jshUtil.arithmetic(this.chosePrice.invoicePrice, this.goods.number, 3);
      }
      return this.jshUtil.formatNumber(total, 2);
    },
    maxGoodsNumber() {
      /* 计算最大可购买数量 */
      let maxNum = Number.MAX_SAFE_INTEGER;
      const {
        activityType,
        // 可购买的数量
        canBuy
      } = this.goods;
        // 有活动的时候,取canBuy
      if (activityType !== 1) {
        maxNum = canBuy;
      }
      // 无活动看是否选择了版本
      if (this.choseVersions && this.choseVersions.length) {
        // 设置各个版本的最低数量
        this.choseVersions.forEach((v) => {
          // 正品样机不计算最大数量
          if (v.$isRealProduct) {
            return;
          }
          let curNum;
          if (v.$isTransfer) {
            curNum = v.number;
          } else {
            curNum = v.usableQty;
          }
          if (curNum < maxNum) {
            maxNum = curNum;
          }
        });
      }
      return maxNum === undefined || maxNum === null ? Number.MAX_SAFE_INTEGER : maxNum;
    },
    minGoodsNumber() {
      /* 最小数量 */
      let minNum = 1;
      // 看是否选择了版本;
      if (this.choseVersions && this.choseVersions.length) {
        const realExample = this.choseVersions.find(vs => vs.$isRealProduct);
        // 正品样机有最小购买数量
        if (realExample) {
          minNum = realExample.realQty;
        }
      }
      return minNum;
    },
    disabledCheck() {
      /* 禁止选中 */
      let state = false;
      if (this.goods.activityType === 5 && this.goods.signed !== true) {
        state = true;
      }
      return state;
    }
  },
  watch: {
    versionPrice(val, oldVal) {
      // h5只要是第一次创建，则一定渲染（下拉刷新的时候，组件重新创建，但是versionPrice值相同，但是specificationsList却在data里初始化为[]）
      if (this.createdNum > 1 && JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.genSpecificationsList();
        this.setFollowState();
        this.genWeekOptions();
      }
    },
    isCreditModel(val) {
      /* 如果不支持信用模式了，已经打开的则关闭 */
      if (val === false) {
        this.switchModeChange('isCreditMode', false);
      }
    },
    isDirect(val) {
      /* 如果不支持直发模式了，已经打开的则关闭 */
      if (val === false) {
        this.switchModeChange('isDirectMode', false);
        const transfer = this.specificationsList.find(v => v.id === 'example');
        if (transfer) {
          transfer.isHide = false;
        }
      }
    },
    'goods.isDirectMode': function (val) {
      // 直发不支持版本调货,如果是先打开的直发，则隐藏版本选择里的版本调货
      const transfer = this.specificationsList.find(v => v.id === 'transfer');
      if (this.isDirect) {
        if (transfer) {
          transfer.isHide = val;
        }
      }
    },
    'goods.isWeekMode': function (val) {
      // 远周次不支持版本调货,如果是先打开的远周次，则隐藏版本选择里的版本调货
      const transfer = this.specificationsList.find(v => v.id === 'transfer');
      if (this.isWeek) {
        if (transfer) {
          transfer.isHide = val;
        }
      }
    },
    isFundsFirst(val) {
      /* 如果不支持款先模式了，已经打开的则关闭 */
      if (val === false) {
        this.goods.isFundsFirstMode = true;
        this.goodsChange();
      }
    },
    maxGoodsNumber(val) {
      /* 最大数量如果小于已选的数量，则修改已选数量之 */
      if (this.goods.number > val) {
        this.$emit('numberChange', val, this.index);
      }
    },
    minGoodsNumber(val) {
      /* 最小数量如果大于已选的数量，则修改已选数量之 */
      if (this.goods.number < val) {
        this.$emit('numberChange', val, this.index);
      }
    },
  },
  methods: {
    goDetail(goods) {
      console.log(goods.productList[0].productCode);
      uni.navigateTo({
        url: `/pages/productDetail/productDetail?productCode=${goods.productList[0].productCode}`
      });
    },
    setPageInf() {
      this.genStockPickerOption();
      this.genSpecificationsList();
      this.setFollowState();
      this.genWeekOptions();
    },
    choose() {
      /* 选中本商品 */
      if (this.disabledCheck) {
        return;
      }
      const {
        checked
      } = this.goods;
      this.$emit('propertyChange', {
        checked: !checked
      });
    },
    handleBeforeCreditModeChange() {
      /* 检查是否支持开启信用模式 */
      let state = true;
      const {
        productGroup,
        priceInfo
      } = this.goods.productList[0];
      const {
        number
      } = this.goods;
        // 计算选择的商品的总价，信用额度做比较，超出则不允许开启
      const totalPrice = this.jshUtil.arithmetic(priceInfo.commonPrice.invoicePrice, number, 3);
      // 检查信用额度是否在范围内
      const quotaMap = this.creditQuotaList.find(v => v.GROUPCODE === productGroup);
      if (quotaMap) {
        state = quotaMap.PLAN >= totalPrice;
      }
      return state;
    },
    goodsChange(newGoods) {
      /* goods chang */
      const goods = newGoods || this.goods;
      this.$emit('change', goods, this.index);
    },
    switchModeChange(propertyName, val) {
      /* switch change */
      this.$emit('propertyChange', {
        [propertyName]: val
      });
    },
    showSpecifications() {
      /* 显示版本规格 */
      this.isShowSpecifications = true;
    },
    getVersionPriceState() {
      /* versionPrice是否有值 */
      return !(!this.versionPrice || JSON.stringify(this.versionPrice) === '{}');
    },
    genWeekOptions() {
      /* 组合远周次数据 */
      this.weekOptions = [];
      if (!this.getVersionPriceState()) {
        return;
      }
      const productCode = this.goods.productList[0].productCode;
      if (this.versionPrice && this.versionPrice.week) {
        const productWeeks = this.versionPrice.week[productCode];
        if (productWeeks) {
          // 远周次数据
          productWeeks.forEach((v) => {
            // fix ios time bug
            const fixTime = v.replace('-', '/');
            const curDate = new Date();
            // 调用getTime也是fix ios bug
            if (curDate.getTime() < new Date(fixTime).getTime()) {
              this.weekOptions.push({
                key: v,
                value: v,
              });
            }
          });
        }
      }
    },
    genSpecificationsList() {
      /* 组合版本规格信息 */
      this.specificationsList = [];
      if (!this.getVersionPriceState()) {
        return;
      }
      const specificationsList = [];
      const product = this.goods.productList[0];
      const {
        productCode,
        priceInfo,
        // 版本调货号，以此来判断是否有版本调货
        stockVersion
      } = product;
      let {
        priceType
      } = product;
      const {
        TJ: tj,
        GC: gc,
        YJCY: yjList,
      } = this.versionPrice.activity[productCode];
        // priceType转为大写
      priceType && (priceType = priceType.toUpperCase());
      const {
        activityType,
        productList
      } = this.goods;
        // (priceType)特价版本信息，已经有非普通版本价格的不可选择（调货除外）
      if (stockVersion || priceType === 'PT') {
        // 是否有特价
        let hasTj = true;
        // 如果是抢单或者反向定制，则specialPrice需要为Y才行
        if ((activityType === 3 || activityType === 5) && productList[0].specialPrice === 'N') {
          hasTj = false;
        }
        if (hasTj) {
          const tjList = tj;
          if (tjList && tjList.length) {
            const tjVersion = {
              id: 'special',
              title: '特价版本',
              isExpand: true,
              isHide: false,
              list: []
            };
            tjVersion.list = tjList.map(v => ({
              ...v,
              priceVersion: v.versionCode,
              name: v.versionCode,
              price: this.jshUtil.formatNumber(v.invoicePrice, 2),
              time: v.endDate && v.endDate.substring(0, 10),
              num: v.usableQty,
              priceType: v.priceType,
              checked: false
            }));
            specificationsList.push(tjVersion);
          }
        }

        // (activityType)如果加入类型为抢单或者反向定制，则没有工程和样机
        if (activityType !== 3 && activityType !== 5) {
          // 工程版本信息
          if (gc && gc.length) {
            const version = {
              id: 'project',
              title: '工程版本',
              isExpand: true,
              isHide: false,
              list: []
            };
            version.list = gc.map(v => ({
              ...v,
              priceVersion: v.versionCode,
              name: v.versionCode,
              price: this.jshUtil.formatNumber(v.invoicePrice, 2),
              time: v.endDate && v.endDate.substring(0, 10),
              num: v.usableQty,
              priceType: v.priceType,
              checked: false
            }));
            specificationsList.push(version);
          }
          // 样机版本信息
          // 已有版本调货不可选样机
          if (!stockVersion && yjList && yjList.length) {
            const version = {
              id: 'example',
              title: '样机版本',
              isExpand: true,
              isHide: false,
              list: []
            };
            version.list = yjList.map(v => ({
              ...v,
              priceVersion: v.versionCode,
              name: v.versionCode,
              price: this.jshUtil.formatNumber(v.invoicePrice, 2),
              time: v.endDate && v.endDate.substring(0, 10),
              num: v.usableQty,
              priceType: v.priceType,
              checked: false
            }));
            specificationsList.push(version);
          }
        }
      }
      // 自有渠道才有版本调货
      if (this.userInf.channelGroup === 'ZY') {
        // 调货 选的是普通、特价、工程的时候，还可选个调货
        if (!stockVersion && ['PT', 'TJ', 'GC'].find(v => v === priceType)) {
          const transformVersionList = this.versionPrice.version.version[productCode];
          if (transformVersionList && transformVersionList.length) {
            const version = {
              id: 'transfer',
              title: '调货版本',
              isExpand: true,
              isHide: false,
              list: []
            };
            version.list = transformVersionList.map(v => ({
              ...v,
              priceVersion: v.versionCode,
              name: v.versionCode,
              price: this.jshUtil.formatNumber(priceInfo.commonPrice.invoicePrice, 2),
              time: v.endDate && v.endDate.substring(0, 10),
              num: v.number,
              checked: false
            }));
            specificationsList.push(version);
          }
        }
      }

      this.specificationsList = specificationsList;
    },
    specificationsCustomCheckFun(oldVersionData, list, parIndex, curIndex) {
      /* 版本价格自定义check fun */
      const {
        // 不支持的版本价格类型
        notSupportPriceTypes
      } = this.goods;
      const parent = oldVersionData[parIndex];

      this.specificationsList = produce(this.specificationsList, (versionData) => {
        // 点击的版本
        const version = versionData[parIndex].list[curIndex];
        const {
          priceType
        } = version;
        const curChecked = !version.checked;
        // 如果取消的话,直接修改并返回
        if (!curChecked) {
          version.checked = false;
          return;
        }
        // 遇到不支持的版本，直接提示并返回
        const notSupportPriceType = notSupportPriceTypes.find(v => v.type === priceType);
        if (notSupportPriceType) {
          uni.showModal({
            title: '提示',
            content: notSupportPriceType.msg
          });
          return;
        }
        const checkedList = [];
        versionData.forEach((vs) => {
          vs.list.forEach((v, index) => {
            if (v.checked) {
              checkedList.push({
                ...v,
                $parentId: vs.id,
                $choseIndex: index
              });
            }
          });
        });
        // 工程、特价map
        const map = {
          GC: 1,
          TJ: 1
        };

        function setCheck() {
          version.checked = true;
        }

        const checkedListLen = checkedList.length;
        if (!checkedListLen) {
          setCheck();
        } else {
          for (let i = 0; i < checkedListLen; i++) {
            const checkVersion = checkedList[0];
            // 父元素一致直接设置
            if (checkVersion.$parentId === parent.id) {
              setCheck();
              // 取消之前的
              versionData.find(v => v.id === parent.id).list[checkVersion.$choseIndex].checked = false;
            } else {
              // 工程、特价可以和版本调货共存
              // 此处用!priceType来判断是否是版本调货
              if ((map[checkVersion.priceType] && !priceType) || (map[priceType] && !checkVersion.priceType)) {
                version.checked = true;
                if (checkedListLen > 1) {
                  const otherKey = i === 1 ? 0 : 1;
                  // 取消另一个
                  versionData.find(v => v.id === checkedList[otherKey].$parentId).list[checkedList[otherKey].$choseIndex].checked = false;
                }
              } else if (checkedListLen === 1) {
                setCheck();
                // 取消之前的
                versionData.find(v => v.id === checkVersion.$parentId).list[checkVersion.$choseIndex].checked = false;
              } else {
                const str = getGoodsInCartPriceType()[checkVersion.priceType] || '调货';
                const compareStr = getGoodsInCartPriceType()[priceType] || '调货';
                uni.showModal({
                  title: '提示',
                  content: `${str}版本和${compareStr}版本不能共存`
                });
                return;
              }
            }
          }
        }
      });
    },
    specificationsChange(data) {
      /* 版本规格change */
      this.specificationsList = data;
    },
    specificationsConfirm(checkedList) {
      /* 选中版本确认 */
      this.specificationsCheckList = checkedList;
      // 搜索调货版本
      const transfer = checkedList.find(v => !v.priceType);
      // todo 还有库存的判断
      if (transfer) {
        this.$emit('numberChange', transfer.number);
      }
      this.$emit('choseOtherVersionsChange', checkedList);
    },
    specificationsCancel() {
      /* 选中版本取消 */
      this.isShowSpecifications = false;
    },
    goodsNumChange({ value: number }) {
      /* 商品数量change */
      // 防抖
      this.$u.debounce(() => {
        this.updateCartProductNumber({
          ...this.goods.productList[0],
          oldValue: this.goods.productList[0].number,
          newValue: number
        });
        this.$emit('numberChange', number);
      }, 500, false);
    },
    updateCartProductNumber({
      composeId,
      id: productId,
      newValue,
      oldValue
    }) {
      /* 更新购物车里的数量 */
      // 相同或者设置了0不请求接口
      if (!newValue || newValue === oldValue) {
        return;
      }
      const form = new AddNumberForm({
        composeId,
        number: newValue,
        productId,
        saletoCode: this.userInf.customerCode,
        sendtoCode: this.defaultSendTo.customerCode,
      });

      this.cartService.updateProductNumber(form);
      // 不需要等待，否则会太慢
      this.$emit('updateNumber', newValue);
    },
    setFollowState() {
      /* 设置关注状态 */
      if (!this.getVersionPriceState()) {
        return;
      }
      const state = !!this.versionPrice.product.find(v => v === this.goods.productList[0].productCode);
      this.$emit('update:followState', state);
    },
    toggleFollow() {
      /* 切换关注状态 */
      if (this.goods.followState) {
        this.unFollowGoods();
      } else {
        this.followGoods();
      }
    },
    async followGoods() {
      /* 添加关注 */
      const {
        customerCode
      } = this.userInf;
      await this.$mFollowGoods({
        customerCode,
        productCode: this.goods.productList[0].productCode
      });
      this.$emit('update:followState', true);
    },
    async unFollowGoods() {
      /* 取消关注 */
      const {
        customerCode
      } = this.userInf;
      await this.$mUnFollowGoods({
        customerCode,
        productCodeList: [this.goods.productList[0].productCode]
      });
      this.$emit('update:followState', false);
    },
    handleDel() {
      /* 移除购物车操作 */
      this.$emit('del', this.goods);
    },
    handleDelVersion(item) {
      /* 移除一个版本操作 */
      const {
        // 在picker里的版本id
        $parentId,
        // 在picker里的子版本条目index
        $choseIndex
      } = item;
      // 重置选中状态
      this.specificationsList = produce(this.specificationsList, (specificationsList) => {
        const choseItem = specificationsList.find(v => v.id === $parentId);
        choseItem.list[$choseIndex].checked = false;
      });

      // 删除已选版本里的数据
      const delIndex = this.goods.choseOtherVersions.findIndex(v => v.$parentId === $parentId && v.$choseIndex === $choseIndex);
      if (delIndex > -1) {
        this.$emit('choseOtherVersionsDel', delIndex);
      }
    },
    genStockPickerOption() {
      /* 组合库存数据 */
      // this.stockOptions
      const product = this.thisProduct;
      if (!product) {
        return;
      }
      const {
        stock
      } = product;
      if (stock) {
        this.stockOptions = stock.storeInfo.map(v => ({
          ...v,
          value: v.stockType,
          arrivalTime: v.arrivalTime ? v.arrivalTime.substring(0, 10) : '--'
        }));
      }
    },
    showStockPicker() {
      /* 库存picker 展示 */
      // 有库存类型才显示
      if (this.stockOptions.length) {
        this.isStockPickerShow = true;
      }
    },
    weekPickerChange() {
      /* 远周次change */
    },
    showWeekPicker() {
      /* 展示远周次picker */
      this.isWeekPickerShow = true;
    },
    handleSign() {
      /* 反向定制签约 */
      this.$emit('sign');
    }
  }
};
</script>
