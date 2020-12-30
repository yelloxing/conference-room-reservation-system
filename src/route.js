import Vue from 'vue';
import VueRouter from 'vue-router';

import axios from 'axios';

Vue.use(VueRouter);

// 配置路由
const router = new VueRouter({
  routes: [
    {

      // 主页
      path: '/home',
      component: resolve => require(['./pages/home.vue'], resolve)

    },
    {

      // 我的预约
      path: '/bespeak',
      component: resolve => require(['./pages/bespeak.vue'], resolve)

    },
    {

      // 会议室详情
      path: '/detail',
      component: resolve => require(['./pages/detail.vue'], resolve)

    },
    {
      path: '/*',
      redirect: 'home'
    }]
});

router.beforeEach((to, from, next) => {
    axios.post('/_apigateway/sso/api/v1/info.rst',{}).then(res=>{
      if(res.data.resultCode == 0 || res.data.code == 0){
        sessionStorage.setItem('logininfo',JSON.stringify(res.data.result))
      }
    })
  next()
})


export default router;
