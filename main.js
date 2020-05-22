import '@/static/pc'
import Vue from 'vue';
import App from './App';
import { Utils } from "./common/utils/utils.js";
import { Imports } from "./common/service/imports";
import { config } from "./common/config/config";
import { IMGURL } from "./common/config/ImgURL";
Vue.config.productionTip = false;

Vue.prototype.$utils = new Utils();
Vue.prototype.$http = new Imports();
Vue.prototype.$config = config;
Vue.prototype.$img = IMGURL;

import store from './store'
Vue.prototype.$store = store

App.mpType = 'app';

const app = new Vue({
	...App,
	store
});

app.$mount();