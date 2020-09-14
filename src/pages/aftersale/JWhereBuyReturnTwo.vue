<template>
  <view class="con2-bg">
    <view :class="{ 'con2-box': switch1, 'con2-box2': !switch1 }">
      <view :class="{ 'con2-box1-row': switch1, 'con2-box2-row': !switch1 }">
        <view class="con2-row-left">
          <view class="con2-row-left-title">购机用户信息</view>
          <view class="con2-color-bg"></view>
        </view>

        <image class="con2-row-right" @click="co111" :src="aaa" />
      </view>
      <view v-show="!switch1">
        <view class="con2-box2-row1" v-for="(item, index) in aac" :key="index">
          <view class="con2-box2-row1-left">{{ item.left }}</view>
          <view class="con2-box2-row1-right">{{ item.right }}</view>
        </view>
      </view>
    </view>
    <view
      v-for="(item, index) in aab"
      :key="index"
      :class="{ 'con2-box1': item.switch, 'con2-box3': !item.switch }"
    >
      <view
        :class="{ 'con2-box1-row': item.switch, 'con2-box2-row': !item.switch }"
      >
        <view class="con2-row-left">
          <view class="con2-row-left-title">{{ item.name }}</view>
          <view class="con2-color-bg"></view>
        </view>
        <image class="con2-row-right" @click="co112(index)" src="../../assets/img/afterSale/1.png" />
      </view>
      <view v-show="!item.switch && index == 1" class="con2-box2-row1">
        <view class="con2-box2-row1-left">发票号：</view>
        <view class="con2-box2-row1-right">{{ item.fapiaonum }}</view>
      </view>
      <view v-show="!item.switch && index == 1" class="con2-box2-row1">
        <view class="con2-box2-row1-left">购买经销商地址：</view>
        <view class="con2-box2-row1-right">{{ item.jingxiaoname }}</view>
      </view>
      <view v-show="!item.switch && index == 2" class="con2-box2-row1">
        <view class="con2-box2-row1-left">网点名称：</view>
        <view class="con2-box2-row1-right">{{ item.a1 }}</view>
      </view>
      <view v-show="!item.switch && index == 2" class="con2-box2-row1">
        <view class="con2-box2-row1-left">联系人手机：</view>
        <view class="con2-box2-row1-right">{{ item.a2 }}</view>
      </view>
      <view v-show="!item.switch && index == 2" class="con2-box2-row1">
        <view class="con2-box2-row1-left">网点地址：</view>
        <view class="con2-box2-row1-right">{{ item.a3 }}</view>
      </view>
      <view v-show="!item.switch && index == 3" class="con2-box2-row1">
        <view class="con2-box2-row1-left">税金：</view>
        <view class="con2-box2-row1-right">{{ item.a1 }}</view>
      </view>
      <view v-show="!item.switch && index == 3" class="con2-box2-row1">
        <view class="con2-box2-row1-left">差价：</view>
        <view class="con2-box2-row1-right">{{ item.a2 }}</view>
      </view>
      <view v-show="!item.switch && index == 3" class="con2-box2-row1">
        <view class="con2-box2-row1-left">服务费：</view>
        <view class="con2-box2-row1-right">{{ item.a3 }}</view>
      </view>
      <view v-show="!item.switch && index == 0">
        <view
          class="con2-box2-row1"
          v-for="(item2, index2) in item.children"
          :key="index2"
        >
          <view v-if="index2 == 6" class="con2-box2-row1-left2">
            <view class="con2-row1-left2-top">{{ item2.left }}</view>
            <view class="con2-row1-left2-bottom">{{ item2.right }}</view>
          </view>
          <view v-else class="con2-box2-row1-left">{{ item2.left }}</view>
          <view v-if="index2 == 0" class="con2-box2-row1-right3">{{
            item2.right
          }}</view>
          <view v-else-if="index2 == 3" class="con2-box2-row1-right4">{{
            item2.right
          }}</view>
          <view v-else-if="index2 == 6"></view>
          <view v-else class="con2-box2-row1-right2">{{ item2.right }}</view>
        </view>
      </view>
      <view v-show="!item.switch && index == 0" class="con2-line"></view>
      <view v-show="!item.switch && index == 0" class="con2-row2">{{
        item.bottomleft
      }}</view>
      <view v-show="!item.switch && index == 0" class="con2-row3">{{
        item.bottomright
      }}</view>
    </view>
    <view class="con2-box3">
      <view class="con2-box1-row">
        <view class="con2-row-left">
          <view class="con2-row-left-title">经销商确认</view>
          <view class="con2-color-bg"></view>
        </view>
      </view>
      <view class="con2-box1-row">
        <view class="con2-box2-row1-left">商场联系人：</view>
        <view class="con2-box2-row1-right5">王芬芬</view>
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">套机型号：</view>
        <input
          class="con2-box2-row1-right7"
          placeholder-class="con2-plaholcla"
          placeholder="请输入商品联系人"
        />
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">联系电话：</view>
        <view class="con2-box2-row1-right5">13012344567</view>
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">付款方：</view>
        <view class="con2-box2-row1-right6">请选择付款方</view>
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">明细地址：</view>
        <view class="con2-box2-row1-right7"
          >河北省邢台市平乡县丰州镇广场路</view
        >
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">处理意见：</view>
        <input
          class="con2-box2-row1-right7"
          placeholder-class="plaholcla"
          placeholder="请输入处理意见"
        />
      </view>
      <view class="con2-line2"></view>
      <view class="con2-row4">
        <view class="con2-box2-row1-left">备注：</view>
      </view>
      <textarea
        class="con2-row5"
        placeholder-class="con2-plaholcla"
        placeholder="请输入备注内容"
        maxlength="1000"
      />
    </view>
    <view class="con2-box4">
      <view class="con2-box4-title">确认</view>
    </view>
  </view>
</template>

<script>
import './css/wherebuyreturnconfirm2.scss';
// import { uniCombox } from "@dcloudio/uni-ui";

export default {
  data() {
    return {
      aac: [],
      aab: [
        {
          name: '机器故障及确认的退换机信息',
          switch: true,
          children: [
            { left: '客户要求（换机/退机）：', right: '换机' },
            { left: '海尔确认结果（换机/退机）：', right: '换机' },
            { left: '折旧费：', right: '无' },
            { left: '发票金额：', right: '¥ 34356.29' },
            { left: '网点代码：', right: 'HR410759XZ' },
            { left: '联系人姓名：', right: '辽宁省辽宁市绥中县中央路2段13' },
            { left: '客户故障描述：', right: '用户反映机器冷冻门门封变形' }
          ],
          bottomleft: '实际鉴定故障描述：',
          bottomright:
            '用户来电反映机子不制冷，外机不工作，师傅上门检测初步判定机子压缩机卡缸过流，多次勾通用户维修，用户表示机子装好后是冬天，也没有使用过，等夏天到了，开机子，就发现不工作了，因此坚持不同意维修，强烈要求更换新机，并到当地海尔专卖店投诉多次，故申请换机处理。'
        },
        {
          name: '购机经销商信息',
          switch: true,
          fapiaonum: 'SXD-2019-01-31-0',
          jingxiaoname: '湘西佳瑞商贸有限公司'
        },
        {
          name: '售后鉴定网点信息',
          switch: true,
          a1: '泸溪县海吉维修部XZ',
          a2: '无',
          a3: '无'
        },
        {
          name: '费用',
          switch: true,
          a1: '¥ 223.44',
          a2: '¥ 235.22',
          a3: '¥ 23114.13'
        }
      ],
      switch1: true,
      message: [
        { left: '客户姓名:', right: '张三' },
        { left: '联系电话:', right: '13909897696' },
        { left: '退货型号:', right: 'KFR-35G/YBA21AU' },
        { left: '退货机编:', right: 'AAA9JH000000ALJC' },
        { left: '退货数量:', right: '1' },
        { left: '购机时间:', right: '2019-01-21 00:23' },
        { left: '用户地址:', right: '辽宁省辽宁市绥中县中央路2段13' }
      ]
    };
  },
  methods: {
    co111() {
      this.switch1 = !this.switch1;
      if (this.switch1 == false) {
        this.aac = this.message;
      } else {
        this.aac = [];
      }
    },
    co112(a) {
      this.aab[a].switch = !this.aab[a].switch;
    }
  },
  components: {
    // uniCombox
  }
};
</script>

<style></style>
