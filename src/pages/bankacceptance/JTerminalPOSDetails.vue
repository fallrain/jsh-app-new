<template>
  <view class="terposdet-bg">
    <view class="terposdet-box">
      <view class="terposdet-space3">
        <view class="terposdet-top">终端POS申请</view>
        <view class="terposdet-top-bg"></view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">中心名称：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.cgmName}}</view>
          </view>
        </view>
      </view>

      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">客户负责人电话：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.csqdManagerTel}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">签约法人公司：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.cqianYueFRGS}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">公司代码：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccorpCode}}</view>
          </view>
        </view>
      </view>

      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">公司简称：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccorpJc}}</view>
          </view>
        </view>
      </view>

      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">付款方编码：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccustCode_PY}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">申请人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.cinsertUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">提交人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccheckUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">提交日期：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.dcheckDate}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">退回日期：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.ddelDate}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">退回原因：</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space3">
        <view class="terposdet-row">
          <view class="terposdet-space5">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.creturnReason}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space1">
        <view class="terposdet-space6">
          <view class="terposdet-line"></view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">确认上线人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.shangXianUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">上线日期：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.dshangXianDate}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">重新记账人：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2"></view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">是否装机：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.czhuangJiUser}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">确认装机人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.czhuangJiUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">是否已撤机：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.icheJiFlag|chejiJudgment}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">确认撤机人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccheJiUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">撤机原因：</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space3">
        <view class="terposdet-row">
          <view class="terposdet-space5">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.cheJiReason}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space3">
        <view class="terposdet-space6">
          <view class="terposdet-line"></view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">年费：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color1">{{posdetailslist.iyearFee}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">签约商户号：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.cqianYueShangHu}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">付款方名称：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.ccustName_PY}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">提交状态：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color1">{{posdetailslist.icheckFlag|tijiaojudgment}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">退回人：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.creturnUserName}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">是否已上线：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ishangXianFlag|shangxianjudgment}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">终端号：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.czhongDuanHao}}</view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">装机日期：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.dzhuangJiDate}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">撤机日期：</view>
          </view>
          <view class="terposdet-space4">
            <view class="terposdet-title">
              <view class="terposdet-color2">{{posdetailslist.dcheJiDate}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="terposdet-space2">
        <view class="terposdet-row">
          <view class="terposdet-title">
            <view class="terposdet-color">公司名称：</view>
          </view>
          <view class="terposdet-title">
            <view class="terposdet-color2">{{posdetailslist.ccorpName}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './css/terposdet.scss';

export default {
  data() {
    return {
      posdetailslist: {}
    };
  },
  onLoad(option) {
    this.posdetailslist = JSON.parse(option.i);
  },
  filters: {
    dateoutput(value) {
      if (value === '') {
        return value;
      }
      return value.slice(0, 10);
    },
    chejiJudgment(value) {
      if (value === 1) {
        return '已撤机';
      }
      return '未撤机';
    },
    tijiaojudgment(value) {
      if (value === 1) {
        return '已提交';
      }
      return '未提交';
    },
    shangxianjudgment(value) {
      if (value === 1) {
        return '已上线';
      }
      return '未上线';
    }
  }
};
</script>

<style></style>
