<template>
  <view class="newposinf-bg">
    <view class="newposinf-form">
      <view :key="index" class="newposinf-row" v-for="(item,index) in  newposinformation">
        <view class="newposinf-form-row" v-if="index<3">
          <view class="newposinf-row-left">{{item.l}}</view>
          <view
            @click="opencomselect(index)"
            v-if="item.show"
            class="newposinf-row-center"
          >{{item.r}}</view>
          <view
            v-else
            @click="opencomselect(index)"
            class="newposinf-row-center2"
          >{{item.newlist[0]}}</view>
          <image :src="img1" v-if="item.show" class="newposinf-row-right" />
        </view>
        <view class="newposinf-form-row" v-else-if="index===3">
          <view class="newposinf-row-left">{{item.l}}</view>
          <view class="newposinf-row-center2">{{item.r}}</view>
        </view>
        <view class="newposinf-form-row" v-else>
          <view class="newposinf-row-left">{{item.l}}</view>
          <input
            :placeholder="item.r"
            :value="item.value"
            class="newposinf-row-center2"
            placeholder-class="newposinf-row-plahol"
          />
        </view>
        <view class="newposinf-line"></view>
      </view>
    </view>
    <view class="newposinf-button-top">
      <view class="newposinf-button-toptitle">发送申请</view>
    </view>
    <view class="newposinf-button-bottom">
      <view class="newposinf-button-bottomtitle" @click="savenewpos">保存草稿</view>
    </view>
    <uni-popup ref="popbottom" type="bottom">
      <view class="newposinf-pop-bg">
        <view class="newposinf-pop-row">
          <view class="newposinf-poprow-left">{{listtitle}}</view>
          <view class="newposinf-poprow-center" @click="formconfirm">确认</view>
          <view class="newposinf-row-right2">x</view>
        </view>
        <scroll-view class="newposinf-scroll" :scroll-y="true">
          <view
            :key="index"
            @click="select(item,listtitle)"
            class="newposinf-select"
            v-for="(item,index) in bottomList"
          >
            <view class="newposinf-select-left" v-if="listtitle==='公司名称'">
              <view
                :class="[item.show? 'newposinf-color':'newposinf-color2' ]"
              >{{item.saleGroupName}}</view>
            </view>
            <view class="newposinf-select-left" v-else-if="listtitle==='公司简称'">
              <view :class="[item.show? 'newposinf-color':'newposinf-color2' ]">{{item.name}}</view>
            </view>
            <view class="newposinf-select-left" v-else>
              <view :class="[item.show? 'newposinf-color':'newposinf-color2' ]">{{item.optionName}}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import "./css/newposinf.scss";
import { uniPopup } from "@dcloudio/uni-ui";
import img1 from "../../assets/img/bankacceptance/right.png";
import { mapGetters } from "vuex";
import { USER } from "../../store/mutationsTypes";

export default {
  data() {
    return {
      img1,
      newposinformation: [
        { l: "公司名称", r: "请选择公司名称", show: true },
        { l: "公司简称", r: "请选择公司简称", show: true },
        { l: "付款方", r: "请选择付款方", show: true },
        { l: "付款方简称", r: "普通户" },
        { l: "客户负责人", r: "请输入负责人", value: "" },
        { l: "负责人电话", r: "请输入负责人电话", value: "" },
        { l: "客户详细地址", r: "请输入客户详细地址", value: "" },
      ],
      rowindex: -1,
      bottomList: [],
      bottomList0: [],
      bottomList1: [],
      bottomList2: [],
      bottomList3: [],
      listtitle: "",
      form2: {
        backendSystem: "",
        ccorpCode: "",
        ccorpName: "",
        ccorpjc: "",
        ccustCode_PY: "",
        ccustJc_PY: "普通户",
        ccustName_PY: "",
        csqdAddress: "",
        csqdManager: "",
        csqdManagerTel: "",
        gmCode: "",
        saleCustCode: "",
        saleCustName: "",
        status: null,
        userCode: "",
        userName: "",
      },
      com: [
        { name: "RRS", show: false },
        { name: "A", show: false },
        { name: "DQ", show: false },
        { name: "JDE", show: false },
        { name: "SHR", show: false },
      ],
      posInformationList: {},
      form: {
        saleCustCode: "",
        saleOrgCode: "",
      },
    };
  },
  created() {
    console.log(this.tokenUserInf);
    this.form.saleCustCode = this.saleInfo.customerCode;
    this.form.saleOrgCode = this.saleInfo.salesGroupCode;
    this.getposinformationlist();
  },
  methods: {
    async getposinformationlist() {
      const { code, data } = await this.accountService.posInformationList(
        this.form
      );
      this.posInformationList = data;
      if (this.posInformationList === undefined) {
        this.posInformationList = { saleGroupList: [], fukuanNameList: [] };
      }
      console.log(this.posInformationList);
    },
    select(i) {
      i.show = !i.show;
    },
    savenewpos() {
      this.form2.ccorpCode = this.saleInfo.salesGroupCode;
      if (!this.newposinformation[0].newlist) {
        this.form2.ccorpName = "";
      } else {
        this.form2.ccorpName = this.newposinformation[0].newlist.toString();
      }
      if (!this.newposinformation[1].newlist) {
        this.form2.ccorpjc = "";
      } else {
        this.form2.ccorpjc = this.newposinformation[1].newlist.toString();
      }
      console.log(this.form2);
    },
    formconfirm() {
      if (this.rowindex === 0) {
        this.bottomList3 = this.bottomList.map((item) => {
          if (item.show) return item.saleGroupName;
          else return null;
        });
      } else if (this.rowindex === 1) {
        this.bottomList3 = this.bottomList.map((item) => {
          if (item.show) return item.name;
          else return null;
        });
      } else {
        this.bottomList3 = this.bottomList.map((item) => {
          if (item.show) return item.optionName;
          else return null;
        });
      }
      console.log(this.bottomList3);
      for (let i = 0; i < this.bottomList3.length; i++) {
        if (!this.bottomList3[i]) {
          this.bottomList3.splice(i, 1);
          i--;
        }
      }
      if (this.bottomList3.length !== 0) {
        this.newposinformation[this.rowindex].show = false;
      } else {
        this.newposinformation[this.rowindex].show = true;
      }
      this.$set(
        this.newposinformation[this.rowindex],
        "newlist",
        this.bottomList3
      );
      console.log(this.bottomList3);
      console.log(this.newposinformation);
    },
    opencomselect(i) {
      this.rowindex = i;
      if (i === 0) {
        this.listtitle = "公司名称";
        if (this.bottomList0.length === 0) {
          this.bottomList = [];
          for (
            let n = 0;
            n < this.posInformationList.saleGroupList.length;
            n++
          ) {
            this.$set(this.posInformationList.saleGroupList[n], "show", false);
            this.$set(
              this.bottomList,
              n,
              this.posInformationList.saleGroupList[n]
            );
          }
          console.log(this.bottomList);
        } else {
          this.bottomList = this.bottomList0;
        }
        this.bottomList0 = this.bottomList;
      } else if (i === 1) {
        this.listtitle = "公司简称";
        if (this.bottomList1.length === 0) {
          this.bottomList = [];
          for (let n = 0; n < this.com.length; n++) {
            this.$set(this.bottomList, n, this.com[n]);
          }
        } else {
          this.bottomList = this.bottomList1;
        }
        this.bottomList1 = this.bottomList;
      } else {
        this.listtitle = "付款方";
        if (this.bottomList2.length === 0) {
          this.bottomList = [];
          for (
            let n = 0;
            n < this.posInformationList.fukuanNameList.length;
            n++
          ) {
            this.$set(this.posInformationList.fukuanNameList[n], "show", false);
            this.$set(
              this.bottomList,
              n,
              this.posInformationList.fukuanNameList[n]
            );
          }
        } else {
          this.bottomList = this.bottomList2;
        }
        this.bottomList2 = this.bottomList;
      }
      console.log(this.bottomList);
      this.$refs.popbottom.open();
    },
  },
  components: {
    uniPopup,
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO,
      tokenUserInf: USER.GET_TOKEN_USER,
    }),
  },
};
</script>

<style>
</style>
