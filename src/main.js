import Vue from 'vue';
import App from './App';
import store from './store';
import '@/assets/font/iconfont.css';
import '@/assets/css/base.scss';
import '@/assets/css/comone.scss';


Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});
app.$mount();
