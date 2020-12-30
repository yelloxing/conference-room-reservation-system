import Vue from 'vue';

// 兼容文件
import 'promise-polyfill/src/polyfill';

// 引入启动界面
import App from './App.vue';

// 引入路由文件
import router from './route';

// $rootScope
import store from './services/store';

// 引入基础样式
import '@hai2007/style/normalize.css';
import '@hai2007/style/rasterize.css'
import './assets/styles/common.scss';

// 引入日历
import "./directives/calendar";
import "./assets/styles/calendar.scss";

// 引入title
import './directives/title';

//引入axios
import './services/axios'

//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


//根对象
window.vm = new Vue({

    //挂载点
    el: document.getElementById('root'),

    // 启用路由
    router,

    // 启用store
    store,

    // 启动vue
    render: createElement => createElement(App)
});