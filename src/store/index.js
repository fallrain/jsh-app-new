import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from '@/lib/vuexPlugin/persistedstate';
import user from '@/store/user';
import order from '@/store/order';

Vue.use(Vuex);
export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        setItem: uni.setStorageSync,
        removeItem: uni.removeStorageSync
      }
    })
  ],
  modules: {
    user,
    order
  }
});
