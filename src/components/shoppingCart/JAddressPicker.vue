<template>
  <uni-popup
    ref="jAddressPickerPop"
    type="bottom"
    @change="change"
  >
    <view class="jAddressPicker">
      <view class="jAddressPicker-head">
        <text class="jAddressPicker-head-title">配送至</text>
        <view
          class="iconfont iconcross jAddressPicker-head-close"
          @tap="close"
        ></view>
      </view>
      <scroll-view
        :scroll-y="true"
        class="jAddressPicker-cnt"
      >
        <template
          v-for="(item,index) in pickerList"
        >
          <view
            :class="['jAddressPicker-cnt-item',item.checked && 'active']"
            :key="index"
            v-if="!item.isHide"
          >
            <view
              class="jAddressPicker-cnt-item-head"
            >
              <view
                :class="['jAddressPicker-cnt-item-check iconfont',item.checked && 'icontick']"
              ></view>
              <text
                @tap="choose(item,index)"
                class="jAddressPicker-cnt-item-text"
              >{{item.name}}</text>
              <view
                :class="['jAddressPicker-cnt-item-head-icon iconfont iconxia', expandIndexMap[index] && 'active']"
                @tap="toggleExpand(index)"
                v-if="item.children"
              ></view>
            </view>
            <block
              v-if="item.children && expandIndexMap[index]"
            >
              <view class="jAddressPicker-search-wrap">
                <j-search-input
                  @change="search(item,index)"
                  @search="search(item,index)"
                  placeholder="请输入搜索信息"
                  v-model="item.searchValue"
                ></j-search-input>
              </view>
              <view
                class="jAddressPicker-cnt-detail"
              >
                <template
                  v-for="(detail,dIndex) in item.children"
                >
                  <template v-if="!detail.isHide">
                    <view
                      :class="[
                        'jAddressPicker-cnt-detail-item',
                        detail.checked && 'active',
                        item.childrenType==='short' && 'short'
                      ]"
                      :key="dIndex"
                      @tap.stop="checkDetail(detail,item.children,item,index,dIndex)"
                    >
                      <view
                        class="jVersionSpecifications-pop-detail-item-check"
                        v-if="detail.checked"
                      >
                        <view class="jVersionSpecifications-pop-detail-item-check-icon iconfont icontick"></view>
                      </view>
                      <view class="jAddressPicker-cnt-detail-item-inf">{{detail.name}}</view>
                    </view>
                  </template>
                </template>
              </view>
            </block>
          </view>
        </template>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
import {
  produce
} from 'immer';
import JSearchInput from '../form/JSearchInput';
import './css/jAddressPicker.scss';

export default {
  name: 'JAddressPicker',
  components: {
    JSearchInput,
  },
  props: {
    // 显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    // picker数据
    // 数据示例：
    // pickerList: [
    //   {
    //     name: '云仓',
    //     checked: false,
    //     // 是否无子元素
    //     isSingle:true,
    //     // 是否支持搜索
    //     isShowSearch: true,
    //     搜索的值
    //     searchValue:''
    //     用来搜索的key
    //     searchKeys: ['keyName1', 'keyName2'],
    //   },
    //   {
    //     name: '异地云仓',
    //     childrenType: 'short',
    //     // 是否能被点击
    //     isCanBeCheck: false,
    //     checked: false,
    //     // 是否支持搜索
    //     isShowSearch: true,
    //     children: [
    //       {
    //         id: 'ccc',
    //         name: '北京云仓',
    //         checked: false,
    //       }
    //     ]
    //   },
    //   {
    //     name: '配送至',
    //     checked: false,
    //     childrenType: 'long',
    //     // 是否支持搜索
    //     isShowSearch: true,
    //     children: [
    //       {
    //         id: 'ccc',
    //         name: '(88003222）山东省青岛市崂山区长宁路街道长宁路173号',
    //         checked: false,
    //       }
    //     ]
    //   },
    // ]
    pickerList: {
      type: Array,
      default: () => []
    },
    beforeCheckParent: {
      type: Function
    },
    beforeCheck: {
      type: Function
    },
    // 扩展的条目的下标
    expandIndexMap: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.jAddressPickerPop.open();
      } else {
        this.$refs.jAddressPickerPop.close();
      }
    }
  },
  methods: {
    change({ show }) {
      this.$emit('update:show', show);
    },
    close() {
      this.$emit('update:show', false);
    },
    choose(item, index) {
      /* 选中一个item */
      // @isCanBeCheck 能被点才能点击
      // @isSingle 是否没子元素
      if (item.isCanBeCheck === undefined || item.isCanBeCheck) {
        if (this.beforeCheckParent && !this.beforeCheckParent.bind(this.$parent)(item, index)) {
          return;
        }
        this.reset(index);
        item.checked = true;
        this.$emit('change', JSON.parse(JSON.stringify(this.pickerList)), null, item, !item.isSingle);
      }
    },
    reset(index) {
      /* 重置 */
      this.pickerList.forEach((v, i) => {
        v.checked = false;
        // 存在children 且不是当前的item
        if (v.children && index !== undefined && index !== i) {
          v.children.forEach((child) => {
            child.checked = false;
          });
        }
      });
    },
    checkDetail(item, list, parent, parIndex) {
      /* 选中一个人详细地址 */
      if (this.beforeCheck && !this.beforeCheck.bind(this.$parent)({
        item,
        list,
        parent,
        parIndex
      })) {
        return;
      }
      list.forEach((v) => {
        v.checked = false;
      });
      item.checked = true;
      this.reset(parIndex);
      // 选中上级
      if (this.isCanBeCheck && !parent.checked) {
        this.choose(parent, parIndex);
      }
      this.$emit('change', produce(this.pickerList, () => {
      }), item, parent);
    },
    toggleExpand(index) {
      /* 展开收起 */
      const expandIndexMap = {
        ...this.expandIndexMap
      };
      expandIndexMap[index] = !expandIndexMap[index];
      this.$emit('update:expandIndexMap', expandIndexMap);
      // this.$emit('change', this.pickerList, null, item, true, 'expand');
    },
    search(item) {
      /* 搜索功能 */
      this.$u.throttle(() => {
        const {
          searchValue,
          searchKeys,
          children
        } = item;
        if (searchValue === '') {
          children.forEach((v) => {
            this.$set(v, 'isHide', false);
          });
          return;
        }
        children.forEach((v) => {
          const isContain = !!searchKeys.find(key => v[key].includes(searchValue));
          this.$set(v, 'isHide', !isContain);
        });
      }, 500, false);
    }
  }
};
</script>

<style scoped>

</style>
