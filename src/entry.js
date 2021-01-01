import Vue from 'vue';

// 兼容文件
import 'promise-polyfill/src/polyfill';

// 引入启动界面
import App from './App.vue';

// 引入路由文件
import router from './route';

// $rootScope
import store from './services/store';

// 引入样式
import '@hai2007/style/normalize.css';
import '@hai2007/style/rasterize.css'
import './assets/styles/common.scss';

// 引入指令
// 引入title
import './directives/toggerView';

//引入axios
import './services/axios';

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
