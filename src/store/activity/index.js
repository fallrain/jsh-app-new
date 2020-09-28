import Vuex from 'vuex';
import Vue from 'vue';
import {
  ACTIVITY
} from '../mutationsTypes';

Vue.use(Vuex);
export default {
  state: {
    activityDetail: { // 订单详情页面信息，由订单列表页传入
    }
  },
  mutations: {
    /* eslint注释请不要删除 */
    /* eslint-disable no-unused-expressions */
    [ACTIVITY.UPDATE_ACTIVITY](state, data) {
      state.activityDetail = data;
    }
  },
  getters: {
    [ACTIVITY.GET_ACTIVITY](state) {
      /* 订单详情信息 */
      return state.activityDetail;
    }
  }
};
