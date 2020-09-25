import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from '@/lib/vuexPlugin/persistedstate';
import user from '@/store/user';
import order from '@/store/order';
import transfer from '@/store/transfer';
import vehicle from '@/store/vehicle';
import commodity from '@/store/commodity';
import goodsList from '@/store/goodsList';
import shoppingCart from '@/store/shoppingCart';
import activity from '@/store/activity';


Vue.use(Vuex);
export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
        removeItem: uni.removeStorageSync
      }
    })
  ],
  modules: {
    user,
    order,
    transfer,
    vehicle,
    commodity,
    goodsList,
    shoppingCart,
    activity
  }
});
