import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
/**
 * 全局变量
 * -------------------------
 * yelloxing 2020/12/27
 *
 * 使用方法：
 * this.$store.state.XX
 */

Vue.use(Vuex);

let state = {
    loading:false, //loading
    dialogVisible:false, //错误弹框
    message:'', //错误信息
    loginFlag:false,  //是否跳转登录
    logininfo:{},
    // 记录当前打开的弹框
    dialogs: [],
    commitFlag:false  //提交记录
};

//  打开弹框
state.openDialog = function (id, initdata, callback, noShade) {
    if (typeof callback == 'boolean') {
        noShade = callback;
        callback = undefined;
    }
    state.dialogs.push({
        id: id,
        data: initdata,
        callback: callback,
        shade: noShade || false
    });
};

//  关闭弹框
state.closeDialog = function (data) {
    // 从数组中删除即可关闭
    let will_close_dialog = state.dialogs.pop();

    // 如果有回调，回调
    if (will_close_dialog && typeof will_close_dialog.callback === "function") {
        will_close_dialog.callback(data);
    }
};



const store = new Vuex.Store({
    state
});

export default store;
