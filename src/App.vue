<template>
  <ul class="rootApp">
    <!-- 主界面 -->
    <li class="ui-main">
      <header>
        <h1>会议室预约管理系统</h1>
        <div class="right" @click="topBtnFlag=!topBtnFlag">
          <ul v-show='topBtnFlag'>
            <li @click="login" v-if="!loginFlag">登录系统</li>
            <li @click="logout" v-if="loginFlag">登出系统</li>
            <li v-if="loginFlag">用户：{{logininfo.data.userName}}</li>
            <li>管理规定</li>
          </ul>
        </div>
      </header>
      <div class="img"></div>
      <div class="content">
        <router-view></router-view>
      </div>
      <footer>
        Copyright©苏州大学 2020 All Rights Reserved
        <br />
        服务中心联系电话：0512-65221621
      </footer>
    </li>

    <!-- 弹框界面 -->
    <li class="ui-dialog">
      <div
        @click.stop="$store.state.closeDialog()"
        class="view shade"
        v-if="
          $store.state.dialogs.length > 0 &&
          !$store.state.dialogs[$store.state.dialogs.length - 1].shade
        "
      >
        <!-- 统一遮罩 -->
      </div>
      <div
        class="view"
        v-for="(dialog, index) in $store.state.dialogs"
        :key="index"
      >
        <div @click.stop="doIt()">
          <component
            v-bind:is="all_dialog[dialog.id]"
            v-bind:data="dialog.data"
          ></component>
        </div>
      </div>
    </li>

    <div class="loading" v-if="$store.state.loading">
      <img src="./assets/images/loading.gif" />
    </div>
  </ul>
</template>
<script>
// 引入弹框页面
import dialogs from "./dialogs/index";
export default {
  data() {
    return {
      // 全部弹框
      all_dialog: dialogs,
      loginFlag: false,
      topBtnFlag:false
    };
  },
  created() {
    // if (sessionStorage.getItem("logininfo")) {
    //   this.username = JSON.parse(sessionStorage.getItem("logininfo")).data.userName
    //   this.loginFlag = true;
    // }
    this.getLoginStatus()
  },
  watch:{
    logininfo(newv){
      this.getLoginStatus()
    }
  },
  computed: {
    logininfo(){
      return this.$store.state.logininfo
    }
  },
  methods: {
    getLoginStatus() {
      // todo
      if(this.logininfo && this.logininfo.data){
        this.loginFlag = true
      }else{
        this.loginFlag = false
      }
    },
    // 个人中心
    goBespeak() {
      this.$router.push("bespeak");
    },
    login() {
      let loginUrl = sessionStorage.getItem('loginUrl')
      location.href = loginUrl
    },
    logout() {
      let logininfo = sessionStorage.getItem("logininfo");
      let userinfo = JSON.parse(logininfo).data;
      location.href = userinfo.logoutUrl;
      this.$store.state.logininfo = {}
      sessionStorage.removeItem('logininfo')
    },
    handleConfirm() {},
  },
};
</script>
<style lang="scss">
.rootApp {
  // 弹框界面
  & > .ui-dialog {
    & > .view {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      &:not(.shade) {
        pointer-events: none;
        & > * {
          pointer-events: all;
        }
      }
      &:last-child {
        z-index: 3;
      }
      &.shade {
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.4);
      }
      &:not(.shade):not(:last-child) {
        display: none;
      }
    }
  }
  & > .ui-main {
    & > header {
      background-color: #ffffff;
      padding: 0 calc(50vw - 6rem);
      line-height: 0.65rem;
      height: 0.65rem;
      position: relative;
      white-space: nowrap;
      & > h1 {
        background-image: url("./assets/images/icon3.png");
        background-size: auto 75%;
        font-size: 0.22rem;
        padding-left: 2.5rem;
        background-repeat: no-repeat;
        background-position: 0.5rem center;
        color: #333333;
        font-weight: 400;
        letter-spacing: 0.01rem;
      }
      & > .right {
        right: 0.5rem;
        top: 0;
        position: absolute;
        width: 0.65rem;
        text-align: right;
        height: 0.65rem;
        background-image: url("./assets/images/icon20.png");
        background-size: 40% auto;
        background-repeat: no-repeat;
        background-position: right center;
        & > ul {
          background-color: #534f4f;
          position: absolute;
          padding: 0.1rem 0.2rem;
          border-radius: 0.15rem;
          top: 80px;
          right: -20px;
          &::before {
            content: " ";
            display: inline-block;
            background-color: #534f4f;
            position: absolute;
            top: -10px;
            width: 20px;
            height: 20px;
            transform: rotate(45deg);
            right: 20px;
          }
          & > li {
            background-repeat: no-repeat;
            background-position: 10px center;
            padding-left: 0.6rem;
            color: #ffffff;
            font-size: 0.18rem;
            &:first-child {
              background-image: url("./assets/images/icon26.png");
            }
            &:last-child {
              background-image: url("./assets/images/icon25.png");
            }
          }
        }
      }
    }
    & > .img {
      background-image: url("./assets/images/icon12.png");
      height: 300px;
      background-position: center center;
      background-size: auto 100%;
    }
    & > .content {
      margin: -0.2rem 0.5rem 0 0.5rem;
    }
    & > footer {
      text-align: center;
      color: #b2a3a3;
      line-height: 1.5em;
      padding: 0.25rem 0;
      font-size: 0.14rem;
    }
  }
  .loading {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    background: #000;
    opacity: 0.5;
    z-index: 999;
    img {
      position: absolute;
      top: 45%;
      left: 48%;
      width: 60px;
    }
  }
}
</style>
