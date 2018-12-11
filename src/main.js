import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' // 引入axios文件

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import API from './assets/js/url'
import ElementUIExtend from './components/index';
import './theme/index.less';

Vue.prototype.axios = axios
Vue.prototype.API = API

Vue.use(ElementUI);
Vue.use(ElementUIExtend);
new Vue({
  el: '#app',
  render: h => h(App)
})
