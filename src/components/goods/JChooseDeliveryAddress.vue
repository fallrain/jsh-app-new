<template>
  <view>
    <uni-drawer
      ref="jChooseDeliveryAddressDrawer"
      mode="right"
      @change="drawerChange"
    >
      <view class="jChooseDeliveryAddressDrawer">
        <view class="jChooseDeliveryAddressDrawer-head">
          <text>配送至</text>
          <view
            class="j-common-icon-close-wrap"
            @tap="hide"
          >
            <view
              class="iconfont iconcross"
            ></view>
          </view>
        </view>
        <view class="jChooseDeliveryAddressDrawer-search-wrap">
          <j-search-input
            @change="search"
            @search="search"
            placeholder="请输入搜索信息"
            v-model="filterForm.name"
          ></j-search-input>
        </view>
        <scroll-view
          :scroll-into-view="activeItemName"
          :scroll-y="true"
          class="jChooseDeliveryAddressDrawer-list"
        >
          <view
            :class="['jChooseDeliveryAddressDrawer-item',item.checked && 'active']"
            v-for="(item,index) in listTemp"
            :id="'item'+item.customerCode"
            :key="index"
            @tap="check(item)"
          >
            <view
              class="jChooseDeliveryAddressDrawer-item-check"
            >
              <i
                v-if="item.checked"
                class="iconfont icontick"
              ></i>
            </view>
            <view class="jChooseDeliveryAddressDrawer-item-cnt">({{item.addressCode}}){{item.address}}</view>
          </view>
        </scroll-view>
      </view>
    </uni-drawer>
  </view>
</template>

<script>
import JSearchInput from '../form/JSearchInput';

export default {
  name: 'JChooseDeliveryAddress',
  components: {
    JSearchInput,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // 数据列表
    list: {
      type: Array,
      default: () => []
    },
    // 当前选中的item
    curItem: {
      type: Object,
      default: () => {
      }
    },
    // 默认在视口内的item
    activeItemName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filterForm: {
        // 配送至的地址名
        name: ''
      },
      listTemp: [...this.list]
    };
  },
  watch: {
    show(val) {
      /* 打开抽屉 */
      const jChooseDeliveryAddressDrawer = this.$refs.jChooseDeliveryAddressDrawer;
      if (val) {
        jChooseDeliveryAddressDrawer.open();
      } else {
        jChooseDeliveryAddressDrawer.close();
      }
    },
    list(val) {
      this.listTemp = [...val];
    }
  },
  methods: {
    drawerChange(val) {
      /* 回馈抽屉值，修改props.show */
      this.$emit('update:show', val);
    },
    check(item) {
      /* 选中一个条目 */
      this.list.forEach((v) => {
        v.checked = false;
      });
      item.checked = true;
      this.$emit('change', this.list, item);
    },
    hide() {
      this.$emit('update:show', false);
    },
    search() {
      /* 搜索 */
      this.$u.throttle(() => {
        const val = this.filterForm.name.trim();
        if (val === '') {
          this.listTemp = this.list;
          return;
        }
        this.listTemp = this.list.filter(({
          address,
          addressCode
        }) => {
          if (address.includes(val) || addressCode.includes(val)) {
            return true;
          }
          return false;
        });
      }, 250, false);
    }
  }
};
</script>

<style lang="scss">
  .jChooseDeliveryAddressDrawer {
    height: 100%;
    padding: 56px 24px;
    padding-right: 0;
  }

  .jChooseDeliveryAddressDrawer-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    font-weight: 600;
    color: #333;
    font-size: 30px;
    padding-right: 24px;

    .iconfont {
      color: #ED2856;
      font-weight: 400;
      font-size: 30px;
    }
  }

  .jChooseDeliveryAddressDrawer-list {
    padding-top: 18px;
    height: calc(100% - 100px);
  }

  .jChooseDeliveryAddressDrawer-item {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    padding-left: 0;
    color: #666;
    border-bottom: 1px solid #F0F0F0;

    &.active {
      color: #ED2856;
      padding-left: 0;
    }
  }

  .jChooseDeliveryAddressDrawer-item-cnt {
    font-size: 28px;
    line-height: 48px;
  }

  .jChooseDeliveryAddressDrawer-item-check {
    width: 52px;
    margin-right: 18px;

    .iconfont {
      font-size: 36px;
    }
  }

  .jChooseDeliveryAddressDrawer-search-wrap {
    width: 100%;
    margin-top: 40px;
    padding-right: 44px;
  }
</style>
