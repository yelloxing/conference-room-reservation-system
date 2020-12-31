import Vue from 'vue'
import axios from 'axios'
import store from './store'

// Vue.prototype.$axios_baseUrl='/_customs/suda/appointment/';
Vue.prototype.$axios_baseUrl='/';
Vue.prototype.$axios = axios

const instance = axios.create({
    // baseURL: '/',
    timeout: 1000,
    headers: {
        'Content-type': 'application/json'
    }
  });

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    store.state.loading = true
    return config;
  }, function (error) {
    // 对请求错误做些什么
    store.state.loading = false
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  store.state.loading = false
    if((response.data.resultCode == 1 || response.data.code == 1) && response.config.url.indexOf('info.rst') == '-1'){
      store.state.dialogVisible = true
      store.state.message = response.data.errorMsg
      return
    }
    // 对响应数据做点什么
    return response;
  }, function (error) {
    store.state.loading = false
    // 对响应错误做点什么
    return Promise.reject(error);
  });