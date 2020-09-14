<template>
  <view class="homepage">
<!--     <uni-nav-bar left-icon="back" title="采购首页" fixed="true" @clickLeft="goBack"></uni-nav-bar>-->
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="homepage-top">
      <view class="homepage-top-head">
        <view class='iconfont iconzuo homepage-top-head-iconl'  @tap="goBack"></view>
        <image
          class="homepage-top-head-name"
          src="../../assets/img/index/logo-white.png"
          mode="aspectFill"
        ></image>
        <view class='iconfont iconpeople homepage-top-head-icon'  @tap="service"></view>
      </view>
      <view class="jSearchInput-wrap j-flex-aic">
        <view class="jSearchInput-icon iconfont iconsousuo"></view>
        <input
            class="jSearchInput"
            type="text"
            :placeholder="mendli"
            placeholder-class="col_c"
            v-model="name"
            @tap="confirm"
        >
      </view>
      <!-- 全部 -->
      <scroll-view
        class="homepage-top-center"
        scroll-x
        scroll-with-animation
      >
        <view
          :class="['homepage-top-center-list',item.active && 'active']"
          v-for="(item,index) in list"
          :key="index"
          scroll-x
          scroll-with-animation
          @tap="goGoodsList(item)"
        >
          {{item.title}}
        </view>
      </scroll-view>
      <!-- 轮播图 -->
      <view class="homepage-swiper">
        <uni-swiper-dot
          :current="current"
          :dotsStyles="dotsStyles"
          :info="bannerList"
          :mode="mode"
          field="content"
        >
          <swiper class="swiper-box" @change="changePic" autoplay="true"  interval="5000" circular="true">
            <swiper-item v-for="(item,index) in bannerList" :key="index">
              <view class="swiper-item">
                <image class="image" :src="item.imageUrl" mode="aspectFill" @tap='goSwiperDetail(item)'/>
              </view>
            </swiper-item>
          </swiper>
        </uni-swiper-dot>
      </view>
    </view>
    <!-- 目录列表 -->
    <view class="homepage-cataloglist">
      <view
        class="homepage-cataloglist-item"
        v-for="item in cataloglist"
        :key="item.id"
        @click="goCatalog(item)"
      >
        <image :src="item.src" class="cataloglist-item-img" mode="aspectFill"/>
        <view class="cataloglist-item-title">{{item.title}}</view>
      </view>
    </view>

    <!-- 头条公告 -->
    <view class="homepage-headlines-nav">
      <view class="homepage-headlines">
        <image class="homepage-headlines-img" mode="aspectFill" src="../../assets/img/index/topnew.png"/>
        <view class="homepage-headlines-title">最新</view>
      </view>
      <!-- <view class="iconfont iconyou homepage-headlines-icon"></view> -->
      <view class="homepage-headlines-con">
        <view class="homepage-headlines-content">这是一条公告内容，请点击查看…</view>
      </view>
    </view>


      <!-- 推荐 + 资讯-->
      <view class="homepage-recommend-info">
        <!-- 推荐 -->
        <view class="homepage-recommend">
          <view
            class="homepage-recommend-list"
            v-for="item in recommendList"
            :key="item.id"

          >
            <view class="homepage-recommend-name">
              <view class="homepage-recommend-title">{{item.title}}</view>
              <view class="homepage-recommend-describe">{{item.describe}}</view>
            </view>
            <swiper
              class="homepage-recommend-swiper"
              @change="change"
              next-margin="68px"
              autoplay="true"
              interval="5000"
              circular="true"
            >
              <swiper-item
                v-for="v in item.data"
                :key="v.id"
                class="homepage-recommend-swiper-item"
              >
                <view class="homepage-recommend-imgs" @tap="goDetail(v)">
                  <image class="homepage-recommend-image" :src="v.imageUrl" mode="aspectFill"/>
                </view>
              </swiper-item>
            </swiper>

          </view>
        </view>
<!--   资讯测试版     -->
        <!-- 资讯 -->
        <view class="homepage-info">
          <view class="homepage-info-name">
            <text class="homepage-info-title">热门资讯</text>
            <text class="homepage-info-more">MORE</text>
          </view>
          <view>
            <view
                class="homepage-info-list"
                v-for="item in infoList"
                :key="item.id"
                @click="goCatalog(item.url)"
            >
              <view class="homepage-info-list-hot">{{item.hot}}</view>
              <view class="homepage-info-list-title">{{item.info}}</view>
            </view>
          </view>

        </view>
        <!-- 资讯正式版 -->
<!--         <view class="homepage-info">-->
<!--          <view class="homepage-info-name">-->
<!--            <text class="homepage-info-title">热门资讯</text>-->
<!--            <text class="homepage-info-more" @tap="goAnnouncement">MORE</text>-->
<!--          </view>-->
<!--          <view>-->
<!--            <view-->
<!--            class="homepage-info-list"-->
<!--            v-for="item in infoList"-->
<!--            :key="item.id"-->
<!--          >-->
<!--            <view class="homepage-info-list-hot" @tap="goInfoDetail(item)">{{item.title}}</view>-->
<!--            <view class="homepage-info-list-title">{{item.info}}</view>-->
<!--          </view>-->
<!--          </view>-->
<!--        </view>-->
      </view>
    <!-- tabber -->
    <!-- <view
      v-for="item in tabBarList"
      :key="item.id"
    >
      <image :src="item.image" mode="aspectFill" />
      <image :src="item.img" mode="aspectFill" />
    </view> -->
    <!-- 广告图 直播-->
<!--     <view class="homepage-nav" v-show="isShowNav">-->
<!--      <image mode="aspectFill" src="../../assets/img/index/manypeople.png" @tap="goNav"/>-->
<!--      <i-->
<!--        @tap="deleteNav"-->
<!--        class="homepage-nav-close iconfont iconcross"-->
<!--      ></i>-->
<!--    </view>-->
  </view>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex';
import {
  USER,
  COMMODITY
} from '../../store/mutationsTypes';

import {
  hex_sha1
} from '@/pages/index/SHA1.js';
import homePageImg from '@/assets/img/tabbar/shouye.png';
import homePageImgActive from '@/assets/img/tabbar/shouye-actived.png';
import categoryImg from '@/assets/img/tabbar/fenlei.png';
import categoryImgActive from '@/assets/img/tabbar/fenlei-actived.png';
import shoppingImg from '@/assets/img/tabbar/shopping.png';
import shoppingImgImgActive from '@/assets/img/tabbar/shopping-actived.png';
import mineImg from '@/assets/img/tabbar/mine.png';
import mineImgImgActive from '@/assets/img/tabbar/mine-actived.png';
import './css/index.scss';

export default {
  name: 'index',
  components: {
  },

  data() {
    return {
      tabBarImgs: {
        homePageImg,
        homePageImgActive,
        categoryImg,
        categoryImgActive,
        shoppingImg,
        shoppingImgImgActive,
        mineImg,
        mineImgImgActive
      },
      // 广告图显示
      isShowNav: true,
      // 搜索栏
      name: '',
      bannerList: [],
      list: [],
      // list: ['全部', '水洗空冷', '电视电脑', '厨房卫浴', '手机数码', '生活'],
      current: 0, // 轮播图第几张
      mode: 'round', // 轮播图底部按钮样式
      dotsStyles: {
        backgroundColor: 'rgba(255,255,255,.4)', // 未选择指示点背景色
        border: '1px rgba(255,255,255,.3) solid',
        selectedBackgroundColor: 'rgba(255,255,255,1)', // 已选择指示点背景色
        selectedBorder: '1px rgba(255,255,255,.3) solid'
      },
      cataloglist: [
        {
          id: 1,
          src: require('@/assets/img/index/function-car.png'),
          title: '整车',
          url: '/pages/vehicleList/vehicleList'
        },
        {
          id: 2,
          src: require('@/assets/img/index/function-box.png'),
          title: '调货',
          url: '/pages/transferGoods/transferGoods'
        },
        {
          id: 3,
          src: require('@/assets/img/index/function-qiang.png'),
          title: '抢单',
          url: '/pages/goods/goodsList?isFlashSale=1'
        },
        {
          id: 4,
          src: require('@/assets/img/index/function-washingmachine.png'),
          title: '套餐',
          url: '/pages/market/marketList?activityType=taocan'
        },
        {
          id: 5,
          src: require('@/assets/img/index/function-compose.png'),
          title: '组合',
          url: '/pages/market/marketList?activityType=zuhe'
        },
        {
          id: 6,
          src: require('@/assets/img/index/function-sale.png'),
          title: '特价',
          url: '/pages/goods/goodsList?isSpecialOffer=1'
        },
        {
          id: 7,
          src: require('@/assets/img/index/function-project.png'),
          title: '工程',
          url: '/pages/goods/goodsList?isProject=1'
        },
        {
          id: 8,
          src: require('@/assets/img/index/function-tv.png'),
          title: '样机',
          url: '/pages/goods/goodsList?isSample=1'
        },
        {
          id: 9,
          src: require('@/assets/img/index/function-yang.png'),
          title: '样品机',
          url: '/pages/sampleMachine/sampleMachineList'
        },
        {
          id: 10,
          src: require('@/assets/img/index/function-money.png'),
          title: '反向定制',
          url: '/pages/market/marketList?activityType=baoxiao'
        }
      ],
      recommendList: [
        {
          id: 1,
          title: '新品推荐',
          describe: '人气榜',
          data: []
        },
        {
          id: 2,
          title: '爆款推荐',
          describe: 'HOT',
          data: []
        },
        {
          id: 3,
          title: '我的专供',
          describe: '热卖好物',
          data: []
        },
        {
          id: 4,
          title: '聚划算',
          describe: '精选榜单',
          data: []
        },

      ],
      isSwiper: true,
      // recommendList: [
      //   {
      //     id: 1,
      //     title: '新品推荐',
      //     describe: '人气榜',
      //     image: require('@/assets/img/index/FC511Z00L.png'),
      //     img: require('@/assets/img/index/GD0R7N000.png'),
      //     url: '#'
      //   },
      //   {
      //     id: 2,
      //     title: '爆款推荐',
      //     describe: 'HOT',
      //     image: require('@/assets/img/index/CEAAJ300F.png'),
      //     img: require('@/assets/img/index/BH02Z00A8.png'),
      //     url: '#'
      //   },
      //   {
      //     id: 3,
      //     title: '我的专供',
      //     describe: '热卖好物',
      //     image: require('@/assets/img/index/FC511Z00L.png'),
      //     img: require('@/assets/img/index/GE0QA000W.png'),
      //     url: '#'
      //   },
      //   {
      //     id: 4,
      //     title: '聚划算',
      //     describe: '精选榜单',
      //     image: require('@/assets/img/index/FC511Z00L.png'),
      //     img: require('@/assets/img/index/GD0R7N000.png'),
      //     url: '#'
      //   },
      // ],
      // infoList: []
      infoList: [
        {
          id: 1,
          hot: '热门',
          info: '这是一条热门资讯的内容,具体内容请查看详情......',
          url: '#'
        },
        {
          id: 2,
          hot: '热门',
          info: '这是一条热门资讯的内容,具体内容请查看详情......',
          url: '#'
        },
        {
          id: 3,
          hot: '热门',
          info: '这是一条热门资讯的内容,具体内容请查看详情......',
          url: '#'
        }
      ],
      // 首页推荐轮播
      mend: [],
      mendli: '',
      //搜索框轮播数据
      allMendli: {}
      // tabBarList: [
      //   {
      //     id: 1,
      //     image: require('@/assets/img/tabbar/shouye.png'),
      //     img: require('@/assets/img/tabbar/shouye-actived.png'),
      //     tloimg: require('@/assets/img/index/logo-white.png')
      //   },
      //   {
      //     id: 2,
      //     image: require('@/assets/img/tabbar/fenlei.png'),
      //     img: require('@/assets/img/tabbar/fenlei-actived.png'),
      //     tloimg: require('@/assets/img/index/manypeople.png')
      //   },
      //   {
      //     id: 3,
      //     image: require('@/assets/img/tabbar/xiaoxi.png'),
      //     img: require('@/assets/img/tabbar/xiaoxi-actived.png'),
      //     tloimg: require('@/assets/img/index/topnew.png')

      //   },
      //   {
      //     id: 4,
      //     image: require('@/assets/img/tabbar/shopping.png'),
      //     img: require('@/assets/img/tabbar/shopping-actived.png')
      //   },
      //   {
      //     id: 5,
      //     image: require('@/assets/img/tabbar/mine.png'),
      //     img: require('@/assets/img/tabbar/mine-actived.png')
      //   },

      // ]
    };
  },
  created() {
    this.getPageInf();
    (async () => {
      await this[USER.UPDATE_DEFAULT_SEND_TO_ASYNC]();
      await this[USER.UPDATE_SALE_ASYNC]();
      await this[USER.UPDATE_TOKEN_USER_ASYNC]();
    })().then((res) => {
      // this.get()
      console.log(this.defaultSendToInf);
      console.log(this.tokenUserInf);
    });

    // this.recommend();
    // this[USER.UPDATE_DEFAULT_SEND_TO_ASYNC]();
    // this[USER.UPDATE_SALE_ASYNC]();
    // this[USER.UPDATE_TOKEN_USER_ASYNC]();
  },
  onLoad() {
    const _this = this;
    let index = 0;
    setInterval(() => {
      // console.log(1111);
      _this.mendli = _this.mend[index];
      // console.log(_this.mendli);
      index += 1;
      if (index >= _this.mend.length) {
        index = 0;
      }
    }, 5000);
  },
  computed: {
    ...mapGetters({
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO,
      tokenUserInf: USER.GET_TOKEN_USER,
      saleInfo: USER.GET_SALE
    })
  },
  methods: {
    ...mapActions([
      // 默认送达方信息
      USER.UPDATE_DEFAULT_SEND_TO_ASYNC,
      // 获取售达方信息
      USER.UPDATE_SALE_ASYNC,
      // 修改token用户信息
      USER.UPDATE_TOKEN_USER_ASYNC,
      // 更新有货商品分类
      COMMODITY.UPDATE_CATALOG_LIST_ASYNC
    ]),
    getPageInf() {
      this.getbannerList();
      // this.getIndexList();
      this.getList();
      this.getXinPin();
      this.getBaoKuan();
      this.getZhuanGong();
      this.getZiYuanJi();
      this.getShow();
    },
    // 导航栏返回
    goBack() {
      // uni.navigateBack({
      //     delta: 1
      // });
      uni.redirectTo({
        url: '/pages/applicationsIndex/applicationsIndex'
      });
    },
    get() {
      // this.$nextTick(() => {
      // const a = JSON.stringify(this.defaultSendToInf);
    },
    changePic(e) {
      this.current = e.detail.current;
    },
    // 客服
    async service() {
      let url = '';
      const { code, data } = await this.udeskService.getUdesk(this.saleInfo.customerCode, {
        addressArea: this.defaultSendToInf.customerCode
      });
      if (code === '1') {
        console.log(data);
        const web_token1 = data.accountId;
        const timestamp1 = new Date().getTime();// 时间戳
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let nonce1 = '';// 随机数
        for (let i = 0; i < 12; i++) {
          const id = Math.ceil(Math.random() * 35);
          nonce1 += chars[id];
        }
        const signature = `nonce=${nonce1}&timestamp=${timestamp1}&web_token=${web_token1}&9767b0677a6f46f5d3d0af8c00f3f16c`;
        let sha = hex_sha1(signature);
        sha = sha.toUpperCase();
        console.log(signature); console.log(sha);
        //* c_phone 电话号码（唯一）* nonce 随机数［必填］* timestamp 13位毫秒时间戳［必填］
        //* web_token/weiyi:id  客户ID，如果客户ID为邮箱或手机号，可以用邮箱和手机号［必填］
        //* signature 加密签名，对timestamp、nonce、web_token和c_key进行SHA1加密后的字符串［必填］
        url = `https://haier.s2.udesk.cn/im_client?web_plugin_id=28198&customer_token=${web_token1}&c_phone=${this.tokenUserInf.phoneNumber}&nonce=${nonce1}&signature=${sha}&timestamp=${timestamp1}&web_token=${web_token1}`;
        console.log(url);
        // InAppBrowserService.openAd(url);
      } else {
        // PopupService.showToast(response.message);
      }

      uni.navigateTo({
        url: `/pages/index/service?url=${url}`
      });
    },
    // 历史记录
    confirm() {
      console.log(this.name);
      // this.mescroll.resetUpScroll(true);
      console.log(this.mendli);
      if (!this.name) {
        this.allMendli.forEach(item => {

        })
        this.allMendli = JSON.stringify(this.allMendli);
        uni.navigateTo({
          url: `/pages/index/historical?name=${this.allMendli}`
        });
      } else {
        uni.navigateTo({
          url: '/pages/index/historical'
        });
      }
    },
    async getShow() {
      const params = {
        bigChannel: [this.saleInfo.channel],
        centerCode: [this.saleInfo.tradeCode],
        custCode: [this.saleInfo.customerCode],
        smallChannel: [this.saleInfo.subChannel],
        type: 1,
        userId: this.tokenUserInf.name,
        userName: this.tokenUserInf.nickname
      };
      const { code, data } = await this.commodityService.show({
        pageNum: 1,
        pageSize: 4,
        params
      });
      if (code === '10000') {
        this.allMendli = data;
        console.log(data);
        let word = '';
        data.records.forEach((item) => {
          word = item.recoWord;
          this.mend.push(word);
        });
        console.log(this.mend);
        this.mendli = this.mend[0];
      }
    },
    // 轮播图
    async getbannerList() {
      const { code, data } = await this.indexService.bannerList({});
      if (code === '1') {
        this.bannerList = data;
        console.log(this.bannerList);
        console.log(data);
      }
    },
    // 轮播图跳转
    goSwiperDetail(item) {
      console.log(item);
      if (item.type === 'html') {
        uni.navigateTo({
          url: `/pages/index/banner?url=${item.url}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/productDetail/productDetail?productCode=${item.code}`
        });
      }
    },
    // 目录列表跳转
    goCatalog(item) {
      console.log(item);
      uni.navigateTo({
        url: item.url
      });
      // console.log(url);
    },
    // 广告图
    deleteNav() {
      this.isShowNav = false;
    },
    goNav() {
      uni.navigateTo({
        url: `/pages/index/liveBroadcast?userId=${this.saleInfo.customerCode}`
      });
    },
    // // 新闻资讯
    // async getIndexList() {
    //   const list = await this.messageService.indexList({
    //     customerCode: this.saleInfo.customerCode,
    //     unitId: this.tokenUserInf.name
    //   });
    //   if (list.code === '1') {
    //     console.log(list.data);
    //     this.infoList = list.data.slice(0, 4);
    //   }
    // },
    // 新闻资讯公告
    goAnnouncement() {
      uni.navigateTo({
        url: '/pages/index/announcement'
      });
    },
    // // 新闻资讯详情
    // goInfoDetail(item) {
    //   console.log(item);
    //   uni.navigateTo({
    //     url: `/pages/index/information?id=${item.id}`
    //   });
    // },

    // 推荐跳转详情
    goDetail(v) {
      console.log(v);
      uni.navigateTo({
        url: `/pages/productDetail/productDetail?productCode=${v.productCode}`
      });
    },

    change(e) {
      // this.current = e.detail.current;
    },
    // 新品推荐列表
    async getXinPin() {
      const { code, data } = await this.activityService.xinPin({
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.defaultSendToInf.customerCode,
      });
      if (code === '1') {
        console.log(this.recommendList[0]);
        this.recommendList[0].data = data;
      }
    },
    // 爆款推荐
    async getBaoKuan() {
      const { code, data } = await this.activityService.baoKuan({
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.defaultSendToInf.customerCode,
      });
      if (code === '1') {
        console.log(this.recommendList[1]);
        this.recommendList[1].data = data;
      }
    },
    // 我的专供
    async getZhuanGong() {
      const { code, data } = await this.activityService.zhuanGong({
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.defaultSendToInf.customerCode,
      });
      if (code === '1') {
        this.recommendList[2].data = data;
        console.log(this.recommendList[2]);
      }
    },
    // 聚划算
    async getZiYuanJi() {
      const { code, data } = await this.activityService.ziYuanJi({
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.defaultSendToInf.customerCode,
      });
      if (code === '1') {
        this.recommendList[3].data = data;
        console.log(data);
        console.log(this.recommendList);
      }
    },
    // 应用列表
    async getList() {
      const { code, data } = await this[COMMODITY.UPDATE_CATALOG_LIST_ASYNC]();
      if (code === '1') {
        data.forEach((item) => {
          item.categoryCode = item.code;
        });
        data.unshift({
          id: 0,
          code: '',
          title: '全部',
          categoryCode: ''
        });
        console.log(data);
        this.list = data;
        this.list.forEach((item) => {
          item.active = false;
        });
        this.list[0].active = true;
        console.log(this.list);
      }
    },
    // 应用列表跳转
    goGoodsList(item) {
      console.log(item);
      this.list.forEach((v) => {
        v.active = false;
      });
      item.active = true;
      console.log(item.active);
      if (item.categoryCode) {
        console.log(item.categoryCode);
        uni.navigateTo({
          url: `/pages/goods/goodsList?categoryCode=${item.categoryCode}`
        });
      } else {
        console.log(222);
        uni.navigateTo({
          url: '/pages/goods/goodsList'
        });
      }
    }
  }
};
</script>

<style scoped>
/deep/  .jSearchInput-wrap {
  width: 702px;
  height: 58px;
  background: rgba(209, 209, 239,1);
  box-shadow:0px 0px 12px 0px rgba(102,135,168,0.15);
  opacity: 0.8;
  border-radius:32px;
  border: 1px solid #6687A8;
  padding-left: 22px;
  padding-right: 26px;
  margin-right:26px;
  /*position: absolute;*/
  /*left: 150px;*/
  /*top:30px;*/
  margin-bottom: 32px;
}
/deep/ .col_c{
	color: #fff;
  font-size: 28px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  background: rgba(209, 209, 239,0.8);
	}
  /deep/ .jSearchInput-icon {
    color: #fff;
    font-size: 24px;
  }

  /deep/ .jSearchInput {
    margin-left: 36px;
    font-size: 24px;
    color: #fff;
    opacity: 0.8;
    background: rgba(102, 135, 168, 0.15);
  }

  /* /deep/.jSearchInput::-ms-input-placeholder{
    color:#fff;
  } */

</style>
