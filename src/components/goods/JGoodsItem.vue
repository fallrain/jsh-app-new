<template>
  <view :class="['jGoodsItem j-fix-u-numberBox',isEditMode && 'checked']">
    <view
      :class="['jGoodsItem-check iconfont', goods.isChecked ? 'iconradio active':'iconradio1']"
      @tap="handleCheck"
      v-if="isEditMode"
    >
    </view>
    <view
      class="jGoodsItem-cnt-like"
      @tap="toggleFollow"
    ></view>
    <view
      class="jGoodsItem-left"
      @tap="goDetail"
    >
      <image :src="goods.image.masterImage"></image>
      <image
        :src="tagImg"
        class="jGoodsItem-left-float"
        v-if="tagImg"
      ></image>
    </view>
    <view class="jGoodsItem-cnt">
      <view class="jGoodsItem-cnt-goodsName j-goods-title" @tap="goDetail">
        {{goods.productName | rmHtml}}
      </view>
      <view class="jGoodsItem-cnt-price-tips"  @tap="goDetail">
        <view class="jGoodsItem-cnt-price-tips-item">
          直扣：{{jshUtil.arithmetic(goods.$PtPrice && goods.$PtPrice.rebateRate,100,3)}}%
        </view>
        <view class="jGoodsItem-cnt-price-tips-item">返利：{{goods.$PtPrice && goods.$PtPrice.rebatePolicy |
          rebatePolicy}}
        </view>
        <view class="jGoodsItem-cnt-price-tips-item">台返：{{goods.$PtPrice && goods.$PtPrice.rebateMoney}}
        </view>
      </view>
      <view class="jGoodsItem-cnt-price-inf" @tap="goDetail">
        <view class="jGoodsItem-cnt-price">{{priceInf.invoicePrice? priceInf.invoicePrice: '价格即将公布敬请关注'}}</view>
        <view class="jGoodsItem-cnt-price-inf-item">供价：¥{{priceInf.supplyPrice || '--'}}
        </view>
        <view class="jGoodsItem-cnt-price-inf-item">库存：{{goods.$stock && goods.$stock.stockTotalNum || 0}}</view>
      </view>
      <view class="jGoodsItem-cnt-opts">
        <u-number-box
          :max="maxGoodsNumber"
          :min="1"
          @change="goodsNumChange"
        ></u-number-box>
        <button
          v-if="isShowAddCart"
          :class="['jGoodsItem-cnt-opts-primary ml26',priceInf.disabled && 'disabled']"
          type="button"
          @tap="checkSpecifications"
          :disabled="priceInf.disabled"
        >加入购物车
        </button>
        <button
          @tap="goDetail"
          class="jGoodsItem-cnt-opts-primary ml26"
          type="button"
          v-else
        >查看详情
        </button>
        <button
          @tap="goActivity"
          class="jGoodsItem-cnt-opts-default ml26"
          type="button"
          v-if="
            (goods.arbitrages && goods.arbitrages.length) ||
            (goods.composes && goods.composes.length) ||
            (goods.bigorders && goods.bigorders.length)
          "
        >参加活动
        </button>
      </view>
      <view class="jGoodsItem-tags">
        <view
          class="jGoodsItem-tag-item"
          v-for="(item,index) in tags"
          :key="index"
        >{{item}}
        </view>
      </view>
    </view>
    <j-version-specifications
      title="版本规格"
      :show.sync="isShowSpecifications"
      :versionData="specificationsList"
      cancelBtnText="重置"
      @confirm="specificationsConfirm"
      @cancel="specificationsCancel"
      @close="clearChoseSpecifications"
    >
    </j-version-specifications>
    <m-toast
      ref="toast"
      :isdistance="true"
    ></m-toast>
  </view>
</template>

<script>
import MToast from '@/components/plugin/xuan-popup_2.2/components/xuan-popup/xuan-popup.vue';
import JVersionSpecifications from '../shoppingCart/JVersionSpecifications';
import './css/jGoodsItem.scss';
import followGoodsMixin from '@/mixins/goods/followGoods.mixin';
import projectSpecial from '@/assets/img/goods/projectSpecial.png';
import projectSpecialScf from '@/assets/img/goods/projectSpecial-scf.png';
import scf from '@/assets/img/goods/scf.png';
import threeSpecial from '@/assets/img/goods/threeSpecial.png';
import threeSpecialScf from '@/assets/img/goods/threeSpecial-scf.png';
import townSpecial from '@/assets/img/goods/townSpecial.png';
import townSpecialScf from '@/assets/img/goods/townSpecial-scf.png';

export default {
  name: 'JGoodsItem',
  components: {
    JVersionSpecifications,
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
    // 所有版本的价格 isSale
    allPrice: {
      type: Object,
      default: () => {
      }
    },
    // 用户信息
    userInf: {
      type: Object,
      default: () => {
      }
    },
    // 是否编辑模式
    isEditMode: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      maxGoodsNumber: Number.MAX_VALUE,
      // 是否显示加入购物车按钮
      isShowAddCart: true,
      // 显示选择商品版本弹层
      isShowSpecifications: false,
      // 版本规格信息
      specificationsList: [],
      // 版本规格选中的信息
      specificationsCheckList: [],
      // 所有包含的标签
      tags: [],
      projectSpecial,
      'projectSpecial-scf': projectSpecialScf,
      scf,
      threeSpecial,
      'threeSpecial-scf': threeSpecialScf,
      townSpecial,
      'townSpecial-scf': townSpecialScf
    };
  },
  created() {
    this.genSpecificationsList();
  },
  computed: {
    tagImg() {
      /* tag图片 */
      const {
        // 融资
        isScf,
        // 乡镇专供
        isTownSpecial,
        // 三专专供
        isThreeSpecial,
        // 工程专供
        isProjectSpecial
      } = this.goods;
      const tagAy = [];
      if (isTownSpecial === '1') {
        tagAy.push('townSpecial');
      }
      if (isThreeSpecial === '1') {
        tagAy.push('threeSpecial');
      }
      if (isProjectSpecial === '1') {
        tagAy.push('projectSpecial');
      }
      if (isScf === '1') {
        tagAy.push('scf');
      }
      return this[tagAy.join('-')];
    },
    priceInf() {
      /* 价格信息 */
      // 优先级一：
      // isSale为false：
      // 1）存在套餐/组合：组合价>套餐价
      // 2）无套餐/组合：不展示价格显示营销活动进行中
      // 优先级二：
      // isSale为true：
      // 抢单价>组合价>套餐价>普通价
      // 反向定制也算抢单，当是反向定制的时候，优先取反向定制
      let inf = {};
      const {
        activityType,
        isSale,
      } = this.goods;
      let priceKeyOrder;
      if (isSale) {
        priceKeyOrder = [
          // 抢单
          'flashSales',
          // 组合
          'composes',
          // 套餐价
          'arbitrages',
          // 普通价
          '$PtPrice'
        ];
        // 反向定制得加 bigorders(反向定制)
        if (activityType === 5) {
          priceKeyOrder.unshift('bigorders');
        }
      } else {
        priceKeyOrder = [
          // 组合
          'composes',
          // 套餐价
          'arbitrages'
        ];
      }
      const choseKey = this.findTruePriceKey(priceKeyOrder);
      let priceInf;
      if (choseKey) {
        if (Array.isArray(this.goods[choseKey])) {
          priceInf = this.goods[choseKey][0];
        } else {
          // 普通价为对象
          priceInf = this.goods[choseKey];
        }
      } else {
        priceInf = {};
        if (!isSale) {
          priceInf.invoicePrice = '营销活动进行中';
          // 是否是文字描述
          if (priceInf.invoicePrice === '营销活动进行中') {
            priceInf.disabled = true;
            priceInf.isText = true;
            this.isShowAddCart = true;
          }
        }
      }

      inf = {
        ...priceInf
      };
      if (priceInf.promotionPrice) {
        // 附加的数据字段,方便统一展示
        inf.invoicePrice = this.jshUtil.formatNumber(priceInf.promotionPrice, 2);
      } else {
        // 非文字描述才转换
        if (!priceInf.isText) {
          inf.invoicePrice = priceInf.invoicePrice === null ? null : `￥${this.jshUtil.formatNumber(priceInf.invoicePrice, 2)}`;
        }
      }
      // fix 供价
      inf.supplyPrice = this.jshUtil.formatNumber(inf.supplyPrice, 2);
      if (inf.invoicePrice === null) {
        inf.disabled = true;
      }
      return inf;
    }
  },
  methods: {
    findTruePriceKey(priceKeyOrder) {
      /* 找到应该显示的价格的key */
      const choseKey = priceKeyOrder.find((v) => {
        const chosePrice = this.goods[v];
        if (chosePrice) {
          let len;
          if (typeof chosePrice === 'object') {
            len = Object.keys(chosePrice).length;
          } else {
            len = chosePrice.length;
          }
          return !!len;
        }
        return false;
      });
      return choseKey;
    },
    genSpecificationsList() {
      /* 组合版本规格信息 */
      const specificationsList = [];
      const {
        tj,
        gc,
        yjList,
        tags,
        pt
      } = this.allPrice;
      const {
        isSale,
        // oms版本调货
        omsSamples
      } = this.goods;
        // 是否存在工程或则样机
      let isGcOrYj = false;
      // 特价版本信息
      // isSale为false 无特价
      if (isSale) {
        const tjList = tj.specialList;
        if (tjList && tjList.length) {
          const tjVersion = {
            id: 'tj',
            title: '特价版本',
            isExpand: true,
            list: []
          };
          tjVersion.list = tj.specialList.map(v => ({
            name: v.versionCode,
            price: this.jshUtil.formatNumber(v.invoicePrice, 2),
            time: v.endDate && v.endDate.substring(0, 10),
            num: v.usableQty,
            priceType: v.priceType ? v.priceType.toUpperCase() : v.priceType,
            checked: false
          }));
          specificationsList.push(tjVersion);
        }
      }
      // 工程版本信息
      if (gc.projectList && gc.projectList.length) {
        const version = {
          id: 'gc',
          title: '工程版本',
          isExpand: true,
          list: []
        };
        version.list = gc.projectList.map(v => ({
          name: v.versionCode,
          price: this.jshUtil.formatNumber(v.invoicePrice, 2),
          time: v.endDate && v.endDate.substring(0, 10),
          num: v.usableQty,
          priceType: v.priceType ? v.priceType.toUpperCase() : v.priceType,
          checked: false
        }));
        specificationsList.push(version);
        isGcOrYj = true;
      }
      // 样机版本信息
      if (yjList && yjList.length) {
        const version = {
          id: 'yj',
          title: '样机版本',
          isExpand: true,
          list: []
        };
        version.list = yjList.map(v => ({
          name: v.versionCode,
          price: this.jshUtil.formatNumber(v.invoicePrice, 2),
          time: v.endDate && v.endDate.substring(0, 10),
          num: v.usableQty,
          priceType: v.priceType ? v.priceType.toUpperCase() : v.priceType,
          checked: false
        }));
        specificationsList.push(version);
        isGcOrYj = true;
      }
      // 自有渠道才有版本调货
      if (this.userInf.channelGroup === 'ZY') {
        // oms调货版本信息
        if (omsSamples && omsSamples.length) {
          const version = {
            id: 'transfer',
            title: 'OMS调货',
            isExpand: true,
            list: []
          };
          version.list = omsSamples.map(v => ({
            ...v,
            priceVersion: v.versionCode,
            name: v.versionCode,
            price: this.jshUtil.formatNumber(pt.invoicePrice, 2),
            time: v.endDate && v.endDate.substring(0, 10),
            num: v.usableQty,
            checked: false
          }));
          specificationsList.push(version);
        }
      }

      this.specificationsList = specificationsList;
      // 当产品isSale为false，且没有工程或样机时，列表页不显示加入购物车按钮，显示查看详情按钮
      if (!isGcOrYj && isSale === false) {
        this.isShowAddCart = false;
      }
      // 组合tags
      const tagsTemp = [
        ...this.goods.tags,
        ...tags
      ];
        // isSale为false时代表此商品有活动且不可版本外销售
        // 如果产品isSale为false，即使存在特价标签也不展示
      if (this.goods.isSale === false) {
        const index = tagsTemp.findIndex(v => v === '特价');
        if (index > -1) {
          tagsTemp.splice(index, 1);
        }
      }
      this.tags = tagsTemp;
    },
    specificationsConfirm(checkedList) {
      /* 选中版本确认 */
      this.specificationsCheckList = checkedList;
      // 检查选择的版本
      this.addToCartForEveryVersion();
    },
    specificationsCancel() {
      /* 选中版本重置 */
      this.specificationsCheckList = [];
      this.clearChoseSpecifications();
    },
    clearChoseSpecifications() {
      /* 清除版本选中 */
      this.specificationsList.forEach((version) => {
        version.list.forEach((v) => {
          v.checked = false;
        });
      });
    },
    checkSpecifications() {
      /* 检查是否有版本规格的数据，没有直接加入购物车 */
      if (this.specificationsList.length) {
        // 有版本数据才显示选择版本的弹层
        this.isShowSpecifications = true;
      } else {
        // 添加到购物车
        this.addToCartForEveryVersion();
      }
    },
    genProductSpecificationsList() {
      /* 组合选择的各个规格的产品 */
      const {
        productCode,
        number,
      } = this.goods;
      return this.specificationsCheckList.map(v => ({
        priceType: v.priceType,
        priceVersion: v.name,
        productCode,
        // 此处用无priceType来
        number: v.priceType ? number : v.num,
      }));
    },
    addToCartForEveryVersion() {
      /* 每个选择的版本都分别加入购物车 */
      // todo 此接口存在风险，调用次数过于多
      const productSpecificationsList = this.genProductSpecificationsList();
      const noNumberObj = productSpecificationsList.find(v => !v.number);
      if (noNumberObj) {
        this.showCartToast('请先选择数量');
        return;
      }
      if (productSpecificationsList.length) {
        // 每个产品的版本都调用加购物车接口
        const addToCartPromise = productSpecificationsList.map(product => this.addToCart(product));
        Promise.all(addToCartPromise).then((res) => {
          const invalid = res.find(v => v.code !== '1');
          // 全部加入成功则提示成功
          if (!invalid) {
            this.showAddToCartToast();
          }
        });
      } else {
        // 如果没选版本规格
        // 如果存在抢购的版本，则默认加入一个抢购的版本
        // 如果没抢购的，则加入一个普通版本的商品
        this.addToCart().then(({ code }) => {
          if (code === '1') {
            this.showAddToCartToast();
          }
        });
      }
    },
    showAddToCartToast() {
      /* 展示添加到购物车提示 */
      this.$refs.toast.open({
        type: 'success',
        content: '加入购物车成功',
        timeout: 2000,
      });
    },
    showCartToast(content) {
      /* 展示购物车错误提示 */
      this.$refs.toast.open({
        type: 'warn',
        content,
        timeout: 2000,
      });
    },
    async addToCart(product) {
      /**
         ***添加到购物车
         *  product:Object
         *  是否有信用模式(0否1是)
         *  creditModel? : number,
         *  产品购买的数量
         *  number,
         *  价格类型
         *  priceType: string,
         *  价格版本号
         *  priceVersion: string,
         *  产品编码
         *  productCode,
         *  调货版本号
         *  stockVersion?: string,
         *  是否有周承诺(0否1是)
         *  weekPromise?: number
         *  */
      const {
        productCode,
        activityType,
        activityId,
        priceType,
        number
      } = this.goods;
      const {
        saletoCode,
        sendtoCode
      } = this;
        // 是否选择了版本
      let choseVersion = true;
      // 是否是调货
      let isTransfer;
      // product不传则默认普通类型
      if (!product) {
        if (!number) {
          this.showCartToast('请先选择数量');
          return Promise.reject();
        }
        choseVersion = false;
        product = {
          priceType: 'PT',
          priceVersion: '',
          productCode,
          number,
        };
      } else {
        // 调货算普通
        if (!product.priceType) {
          isTransfer = true;
          product.priceType = 'PT';
          product.stockVersion = product.priceVersion;
          // 不传priceVersion？todo
          product.priceVersion = undefined;
        }
      }
      const res = await this.cartService.addToCart({
        // 商品组合编码
        activityId,
        // 组合类型(1单品2组合3抢购4套餐5成套)
        activityType: choseVersion ? 1 : (activityType || 1),
        // 购买的数量(组合就是组合的数量)
        number: isTransfer ? product.number : number,
        //  促销活动价格类型
        //  PT:普通价格,TJ:特价,GC:工程,YJCY:样机出样(折扣样机),MFJK:免费机壳,MFYJ:免费样机,MFYJJS:免费样机结算,YPJ:样品机,CTYJ:成套样机
        priceType: priceType ? priceType.toUpperCase() : priceType,
        // dataFrom: "flashSale",
        // 价格版本号
        // priceVersion: '',
        // 产品编码
        productCode,
        productList: [product],
        // 售达方编码
        saletoCode,
        // 送达方编码
        sendtoCode,
        // 版本调货版本号
        transferVersionCode: isTransfer ? product.stockVersion : undefined,
        // 促销活动版本号
        // versionCode: '',
      });
      if (res.code === '1') {
        this.$emit('addCartSuccess');
      }
      return res;
    },
    goodsNumChange({ value }) {
      /* 商品数量change */
      this.goods.number = value;
      this.$emit('change', this.goods, this.index);
    },
    handleCheck() {
      /* 选中一个商品 */
      const isChecked = !this.goods.isChecked;
      this.$set(this.goods, 'isChecked', isChecked);
      this.$emit('change', this.goods, this.index);
      this.$emit('check', isChecked, this.goods.productCode, this.goods);
    },
    goDetail() {
      /* 跳转产品详情 */
      const queryStr = this.jshUtil.genQueryStringByObj({
        productCode: this.goods.productCode
      });
      uni.navigateTo({
        url: `/pages/productDetail/productDetail${queryStr}`
      });
    },
    goActivity() {
      /* 去参加活动 */
      const queryStr = this.jshUtil.genQueryStringByObj({
        productCode: this.goods.productCode
      });
      uni.navigateTo({
        url: `/pages/market/marketList${queryStr}`
      });
    },
    toggleFollow() {
      /* 切换关注状态 */
      if (this.goods.$favorite) {
        this.unFollowGoods();
      } else {
        this.followGoods();
      }
    },
    async followGoods() {
      /* 添加关注 */
      const {
        saletoCode: customerCode
      } = this;
      await this.$mFollowGoods({
        customerCode,
        productCode: this.goods.productCode
      });
      this.goods.$favorite = true;
      this.$emit('change', this.goods, this.index);
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
      this.goods.$favorite = false;
      this.$emit('change', this.goods, this.index);
    },
  }
};
</script>
