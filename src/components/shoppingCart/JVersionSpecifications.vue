<template>
  <u-popup
    :safe-area-inset-bottom="true"
    mode="bottom"
    v-model="selfIsShow"
  >
    <view class="jVersionSpecifications-pop">
      <view class="jVersionSpecifications-head j-flex-aic">
        <view class="jVersionSpecifications-head-title">{{title}}</view>
        <view
          class="jVersionSpecifications-head-title-icon j-common-icon-close-wrap"
          @tap="close"
        >X
        </view>
      </view>
      <slot name="head"></slot>
      <scroll-view
        :scroll-y="true"
        class="jVersionSpecifications-pop-detail-wrap"
      >
        <template v-for="(item,index) in versionData">
          <view
            :key="index"
            class="jVersionSpecifications-pop-detail"
            v-if="!item.isHide"
          >
            <view class="jVersionSpecifications-pop-detail-head">
              <text class="jVersionSpecifications-pop-detail-head-title">{{item.title}}</text>
              <view
                :class="{
                  'jVersionSpecifications-pop-detail-head-title-arrow iconfont iconxia':true,
                  'active': !item.isExpand
                }"
                @tap="toggleExpand(item,index)"
              >
              </view>
            </view>
            <view
              class="jVersionSpecifications-pop-detail-list"
              v-show="item.isExpand"
            >
              <view
                :class="['jVersionSpecifications-pop-detail-item',version.checked && 'active']"
                :key="vIndex"
                @tap="handleClick(version,item.list,index,vIndex)"
                v-for="(version,vIndex) in item.list"
              >
                <view
                  class="jVersionSpecifications-pop-detail-item-check"
                  v-show="version.checked"
                >
                  <view class="jVersionSpecifications-pop-detail-item-check-icon iconfont icontick"></view>
                </view>
                <view
                  class="jVersionSpecifications-pop-detail-item-name-wrap mb8"
                  v-if="version.name"
                >
                  <view class="jVersionSpecifications-pop-detail-item-name">名称：</view>
                  <view class="jVersionSpecifications-pop-detail-item-val-type1">{{version.name}}</view>
                </view>
                <view
                  class="jVersionSpecifications-pop-detail-item-name-wrap mb8"
                  v-if="version.price"
                >
                  <view class="jVersionSpecifications-pop-detail-item-name">价格：</view>
                  <view class="jVersionSpecifications-pop-detail-item-val-type2">¥ {{version.price}}</view>
                </view>
                <view
                  class="jVersionSpecifications-pop-detail-item-name-wrap"
                  v-if="version.time"
                >
                  <view class="jVersionSpecifications-pop-detail-item-name">有效期：</view>
                  <view class="jVersionSpecifications-pop-detail-item-val-type3">{{version.time}}</view>
                </view>
                <view
                  class="jVersionSpecifications-pop-detail-item-name-wrap"
                  v-if="version.num"
                >
                  <view class="jVersionSpecifications-pop-detail-item-name">数量：</view>
                  <view class="jVersionSpecifications-pop-detail-item-val-type3">{{version.num}}</view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </scroll-view>
      <view class="jVersionSpecifications-btn-wrap">
        <button
          type="button"
          class="goodsList-drawer-btn-confirm"
          @tap="confirm"
        >{{confirmBtnText}}
        </button>
        <button
          type="button"
          class="goodsList-drawer-btn-reset"
          @tap="cancel"
        >{{cancelBtnText}}
        </button>
      </view>
    </view>
  </u-popup>
</template>

<script>
import {
  produce
} from 'immer';
import './css/jVersionSpecifications.scss';

export default {
  name: 'JVersionSpecifications',
  components: {
  },
  props: {
    // 显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 版本数据
    versionData: {
      type: Array,
      default: () => []
    },
    // 类型: radio(单选) checkbox（多选）custom（自定义）
    type: {
      type: String,
      default: 'checkbox'
    },
    // 是否启用自定义check函数
    customCheckFun: {
      type: Boolean,
      default: false
    },
    // 确认按钮文字
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    // 取消按钮文字
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      // 内部三方组件显示隐藏
      selfIsShow: this.show
    };
  },
  watch: {
    show(val) {
      this.selfIsShow = val;
      if (!val) {
        this.$emit('close');
      }
    },
    selfIsShow(val) {
      this.$emit('update:show', val);
    }
  },
  methods: {
    close() {
      /* 关闭弹层 */
      this.$emit('update:show', false);
    },
    handleClick(version, list, parIndex, vIndex) {
      /* 选择版本 */
      if (this.type === 'custom') {
        this.$emit('customCheck', this.versionData, list, parIndex, vIndex);
        return;
      }
      const newVersionData = produce(this.versionData, (versionData) => {
        const curChecked = version.checked;
        // 除了当前版本，其他版本的选择都取消
        versionData.forEach((v, index) => {
          // checkbox模式下可在当前版本里多选
          if (this.type === 'checkbox') {
            if (parIndex !== index) {
              v.list.forEach((otherItem) => {
                otherItem.checked = false;
              });
            }
          } else {
            // radio模式下，只能单选
            v.list.forEach((otherItem) => {
              otherItem.checked = false;
            });
          }
        });
        // 设置选中或者取消
        versionData[parIndex].list[vIndex].checked = !curChecked;
      });

      this.$emit('change', newVersionData);
    },
    toggleExpand(item, index) {
      /* 选择规格展开or收起 */
      const newVersionData = produce(this.versionData, (versionData) => {
        versionData[index].isExpand = !item.isExpand;
      });
      this.$emit('change', newVersionData);
    },
    confirm() {
      /* 确定 */
      const checkedList = [];
      this.versionData.forEach((version) => {
        version.list.forEach((v, index) => {
          if (v.checked) {
            checkedList.push({
              ...v,
              $parentId: version.id,
              $choseIndex: index
            });
          }
        });
      });
      // 选中的版本列表数据
      this.$emit('confirm', checkedList);
      this.$emit('update:show', false);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
