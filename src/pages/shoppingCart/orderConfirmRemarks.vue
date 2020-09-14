<template>
  <view class="orderConfirmRemarks">
    <view class="orderConfirmRemarks-group p24 fs30">
      <radio-group @change="radioChange">
        <label class="radio mr20" v-for="(item, index) in showType" :key="index">
          <radio color="#ED2856" :value="item.value" :checked="item.checked" />
          {{item.name}}
        </label>
      </radio-group>
    </view>
    <view
      @tap="chooseAdd"
      class="orderConfirmRemarks-group mt24">
      <j-cell
        title="备注地址"
        class="br-b-n"
      >
        <template #right>
          <view
            class="orderConfirmRemarks-icon iconfont iconyou"
          ></view>
        </template>
      </j-cell>
      <view v-if="JSON.stringify(choosedAdd)=== '{}'" class="address-style">请选择地址</view>
      <view v-else class="address-style">
        {{choosedAdd.province}}{{choosedAdd.city}}{{choosedAdd.area}} &nbsp;&nbsp;
        {{choosedAdd.address}}
      </view>
    </view>
    <view class="orderConfirmRemarks-group mt24">
      <j-cell
        title="姓名"
      >
        <input
          class="orderConfirmRemarks-ipt"
          placeholderClass="orderConfirmRemarks-placeholder"
          type="text"
          placeholder="请输入联系人姓名"
          v-model="form.userName"
        >
      </j-cell>
      <j-cell
        title="手机号"
      >
        <input
          class="orderConfirmRemarks-ipt"
          placeholderClass="orderConfirmRemarks-placeholder"
          type="text"
          placeholder="请输入联系人电话"
          v-model="form.iphoneNo"
        >
      </j-cell>
      <j-cell
        title="身份证号"
      >
        <input
          class="orderConfirmRemarks-ipt"
          placeholderClass="orderConfirmRemarks-placeholder"
          type="text"
          placeholder="请输入身份证号"
          v-model="form.idcardNo"
        >
      </j-cell>
    </view>
    <view v-if="status === 'zfyd'" class="orderConfirmRemarks-group mt24">
      <j-cell
        title="所在地区"
      >
        <input
          @tap="getLocation()"
          disabled
          class="orderConfirmRemarks-ipt"
          placeholderClass="orderConfirmRemarks-placeholder"
          type="text"
          placeholder="请选择所在地区"
          v-model="form.addressName"
        >
        <template #right>
          <view
            class="orderConfirmRemarks-icon iconfont iconlocal"
          ></view>
        </template>
      </j-cell>
      <view class="orderConfirmRemarks-ta-wrap">
        <j-cell
          title="详细地址"
        >
          <view>
            <j-textarea
              placeholderClass="orderConfirmRemarks-placeholder"
              placeholder="请输入详细地址时，请具体到门牌号"
              v-model="form.address"
            ></j-textarea>
          </view>
        </j-cell>
      </view>
    </view>
    <view class="orderConfirmRemarks-group orderConfirmRemarks-group-crossRegion mt24">
      <j-cell
        title="异地跨区域配送"
        :titleWrap="false"
      >
        <template #right>
          <j-switch
            @change="changeSwitchYD"
            :active.sync="form.deliveryYd"
          ></j-switch>
        </template>
      </j-cell>
    </view>
    <view v-if="status === 'zfyd'" class="orderConfirmRemarks-group orderConfirmRemarks-group-crossRegion mt24">
      <j-cell
        title="收藏地址"
        :titleWrap="false"
      >
        <template #right>
          <j-switch
            @change="changeSwitchSC"
            :active.sync="form.isCollectionAddress"
          ></j-switch>
        </template>
      </j-cell>
    </view>
    <view
      @tap="sureRemark"
      class="sure-btn">
      确定
    </view>
    <j-address-picker
      indicatorStyle=""
      :addressData="addressData"
      :show.sync="addressPickerShow"
      v-model="resultAdds"
      @changeData="changeData"
      @sureVal="sureVal"
    ></j-address-picker>
    <j-pop-picker
      title="地址列表"
      :show.sync="addressListShow"
      :options="addressOption"
      :choseKeys.sync="choosedAddressOption"
    ></j-pop-picker>
  </view>
</template>

<script>
import JCell from '../../components/form/JCell';
import JAddressPicker from '../../components/form/JAddressPicker';
import JTextarea from '../../components/form/JTextarea';
import JSwitch from '../../components/form/JSwitch';
import JPopPicker from '../../components/form/JPopPicker';
import './css/orderConfirmRemarks.scss';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';


export default {
  name: 'orderConfirmRemarks',
  components: {
    JCell,
    JTextarea,
    JSwitch,
    JAddressPicker,
    JPopPicker
  },
  data() {
    return {
      goodInfo: {},
      addressData: {
        province: [],
        city: [],
        area: []
      },
      currentAdds: [0, 0, 0],
      resultAdds: [0, 0, 0],
      status: 'zfyd',
      showType: [
        {
          value: 'zfyd',
          name: '直发异地',
          checked: true
        },
        {
          value: 'jdyd',
          name: '京东异地',
          checked: false
        }
      ],
      addressPickerShow: false,
      addressListShow: false,
      addressOption: [], // 地址列表
      choosedAddressOption: [], // 选中的地址
      choosedAdd: {},
      currentAdd: {},
      form: {
        orderIndex: '',
        productIndex: '',
        userName: '',
        iphoneNo: '',
        idcardNo: '',
        province: '',
        city: '',
        area: '',
        areaCode: '',
        address: '',
        addressName: '',
        isCollectionAddress: false,
        deliveryYd: false,
        jdWarehouseId: ''
      }
    };
  },
  onLoad(option) {
    this.goodInfo = JSON.parse(option.goodInfo);
    if (this.goodInfo.address && JSON.stringify(this.goodInfo.address) != '{}') {
      this.initCurrentAdd();
    }
    console.log(this.goodInfo);
    this.form.orderIndex = option.orderIndex;
    this.form.productIndex = option.productIndex;
    if (this.goodInfo.isCollectionAddress === '2') {
      this.form.isCollectionAddress = true;
    } else {
      this.form.isCollectionAddress = false;
    }
    if (this.goodInfo.deliveryYd === '1') {
      this.form.deliveryYd = true;
    } else {
      this.form.deliveryYd = false;
    }
    this.initAddress();
    this.getAddListZFYD();
  },
  computed: {
    ...mapGetters({
      sendToInf: USER.GET_DEFAULT_SEND_TO,
      saleInf: USER.GET_SALE,
    }),
  },
  watch: {
    currentAdds(newVal, oldVal) {
      console.log(newVal);
      console.log(oldVal);
      if (!newVal) {
        this.resultAdds = [0, 0, 0];
        return;
      } if (!newVal[0]) {
        this.resultAdds[0] = 0;
        if (!newVal[1]) {
          // 只改变区
          this.resultAdds[1] = 0;
          this.resultAdds[2] = newVal[2];
          return;
        }
      }
      if (oldVal[0] !== newVal[0]) {
        this.resultAdds[0] = newVal[0];
        this.resultAdds[1] = 0;
        this.resultAdds[2] = 0;
        // 省发生变化，更新市数据
        const codeData = this.addressData.province[newVal[0]].laid;
        (async () => {
          await this.getCity(codeData);
          await this.getArea(this.addressData.city[0].laid);
        })();
      } else if (oldVal[1] != newVal[1]) {
        this.resultAdds[0] = newVal[0];
        this.resultAdds[1] = newVal[1];
        this.resultAdds[2] = 0;
        // 市发生了变化
        const codeData = this.addressData.city[newVal[1]].laid;
        this.getArea(codeData);
      } else {
        this.resultAdds = newVal;
      }
    },
    choosedAddressOption(val) {
      this.addressOption.forEach((item) => {
        if (item.id === val[0]) {
          this.choosedAdd = item;
        }
      });
      console.log(this.choosedAdd);
      this.form.userName = this.choosedAdd.userName;
      this.form.province = this.choosedAdd.province;
      this.form.city = this.choosedAdd.city;
      this.form.area = this.choosedAdd.area;
      this.form.areaCode = this.choosedAdd.areaCode;
      this.form.address = this.choosedAdd.address;
      this.form.idcardNo = this.choosedAdd.idcardNo;
      this.form.iphoneNo = this.choosedAdd.iphoneNo;
      this.form.addressName = `${this.choosedAdd.province}${this.choosedAdd.city}${this.choosedAdd.area}`;
    }
  },
  methods: {
    initCurrentAdd() {
      this.choosedAdd.address = this.goodInfo.address;
      this.choosedAdd.addressName = this.goodInfo.addressName;
      this.choosedAdd.area = this.goodInfo.area;
      this.choosedAdd.areaCode = this.goodInfo.areaCode;
      this.choosedAdd.city = this.goodInfo.city;
      this.choosedAdd.province = this.goodInfo.province;
      this.choosedAdd.idcardNo = this.goodInfo.idCardNo;
      this.choosedAdd.iphoneNo = this.goodInfo.iphoneNo;
      this.choosedAdd.userName = this.goodInfo.userName;
      this.choosedAdd.jdWarehouseId = this.goodInfo.jdWarehouseId;

      this.form = {
        ...this.choosedAdd,
        isCollectionAddress: false,
        deliveryYd: false
      };
      if (this.goodInfo.deliveryYd === '0') {
        this.form.deliveryYd = false;
      } else {
        this.form.deliveryYd = true;
      }
    },
    changeSwitchSC(val) {
      console.log(val);
    },
    changeSwitchYD(val) {
      console.log(val);
    },
    // 直发异地地址列表
    async getAddListZFYD() {
      const { code, data } = await this.orderService.getCollectRemarkAddr({
        address: '',
        area: '',
        areaCode: '',
        city: '',
        idCardNo: '',
        iphoneNo: '',
        province: '',
        saletoCode: this.saleInf.customerCode,
        userName: ''
      });
      if (code === '1') {
        data.forEach((item) => {
          item.key = item.id;
          item.value = item.province + item.city + item.area + item.address;
        });
        this.addressOption = data;
      }
    },
    // 京东异地地址列表
    async getAddListJDYD() {
      const { code, data } = await this.orderService.queryJDAddr();
      if (code === '1') {
        data.forEach((item) => {
          item.key = item.id;
          item.value = item.province + item.city + item.area + item.address;
        });
        this.addressOption = data;
      }
    },
    chooseAdd() {
      this.addressListShow = true;
    },
    async initAddress() {
      await this.getProvince();
      await this.getCity(this.addressData.province[0].laid);
      await this.getArea(this.addressData.city[0].laid);
    },
    changeData(val) {
      this.currentAdds = val;
    },
    sureVal() {
      if (!this.resultAdds[0]) {
        this.resultAdds[0] = 0;
      } else if (!this.resultAdds[1]) {
        this.resultAdds[1] = 0;
      } else if (!this.resultAdds[2]) {
        this.resultAdds[2] = 0;
      }
      this.currentAdd = {
        province: this.addressData.province[this.resultAdds[0]],
        city: this.addressData.city[this.resultAdds[1]],
        area: this.addressData.area[this.resultAdds[2]]
      };
      console.log(this.currentAdd);
      console.log(this.resultAdds);
      this.form.province = this.currentAdd.province.laname;
      this.form.city = this.currentAdd.city.laname;
      this.form.area = this.currentAdd.area.laname;
      this.form.areaCode = this.currentAdd.area.lacountyid;
      this.form.addressName = `${this.currentAdd.province.laname}${this.currentAdd.city.laname}${this.currentAdd.area.laname}`;
    },
    // 显示地址选择
    getLocation() {
      this.addressPickerShow = true;
    },
    // 获取省市区
    async getProvince() {
      const { code, data } = await this.orderService.getProvince();
      if (code === '1') {
        this.addressData.province = data;
      }
    },
    async getCity(codeData) {
      const { code, data } = await this.orderService.getCity(codeData);
      if (code === '1') {
        this.addressData.city = data;
      }
    },
    async getArea(codeData) {
      const { code, data } = await this.orderService.getArea(codeData);
      if (code === '1') {
        this.addressData.area = data;
      }
    },
    sureRemark() {
      if (this.form.userName || this.form.iphoneNo || this.form.idcardNo
        || this.form.area || this.form.address
      ) {
        if (!this.form.userName || !this.form.iphoneNo || !this.form.idcardNo
          || !this.form.area || !this.form.address) {
          uni.showToast({
            title: '信息不全，请补全信息提交！',
            icon: 'none'
          });
        }
      }

      const obj = JSON.parse(JSON.stringify(this.form));
      if (obj.deliveryYd === true) {
        obj.deliveryYd = '1';
      } else {
        obj.deliveryYd = '0';
      }
      if (obj.isCollectionAddress === true) {
        obj.isCollectionAddress = '2';
      } else {
        obj.isCollectionAddress = '1';
      }
      console.log(obj);
      uni.$emit('confirmremarks', JSON.stringify(obj));
      uni.navigateBack();
    },
    radioChange(e) {
      this.form = {
        orderIndex: '',
        productIndex: '',
        userName: '',
        iphoneNo: '',
        idcardNo: '',
        province: '',
        city: '',
        area: '',
        areaCode: '',
        address: '',
        addressName: '',
        isCollectionAddress: false,
        deliveryYd: false,
        jdWarehouseId: ''
      };
      if (e.target.value === 'jdyd') {
        this.form.jdWarehouseId = 1;
        this.getAddListJDYD();
      } else {
        this.form.jdWarehouseId = '';
        this.getAddListZFYD();
      }
      this.status = e.target.value;
      this.showType.forEach((item) => {
        if (item.value === e.target.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
  }
};
</script>
