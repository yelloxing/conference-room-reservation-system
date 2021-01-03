<template>
  <ul class="rootApp">
    <!-- 主界面 -->
    <li class="ui-main">
      <header>
        <h1>会议室预约管理系统</h1>
        <div class="right">
          <a
            href="javascript:void(0)"
            v-if="$route.name == 'bespeak'"
            @click="goHome()"
            >首页</a
          >
          <a href="javascript:void(0)" v-if="loginFlag">用户:{{ userName }}</a>
          <a
            href="javascript:void(0)"
            class="personal-center"
            @click="goBespeak()"
            v-if="loginFlag"
            >我的预约</a
          >
          <a
            href="javascript:void(0)"
            class="exit"
            v-if="loginFlag"
            @click="logout"
            >登出</a
          >
          <a href="javascript:void(0)" class="login" v-else @click="login"
            >登录</a
          >
        </div>
      </header>
      <router-view></router-view>
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

    <el-dialog
      title="提示"
      :visible.sync="$store.state.dialogVisible"
      width="30%"
    >
      <span>{{ $store.state.message }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>

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
      userName: "",
      userinfo: sessionStorage.getItem("logininfo"),
    };
  },
  created() {
    let userinfo = sessionStorage.getItem("logininfo");
    if (userinfo) {
      this.loginFlag = true;
      let data = JSON.parse(userinfo).data;
      this.userName = data.userName;
    }
  },
  methods: {
    doIt() {
      // todo
    },
    // 个人中心
    goBespeak() {
      this.$router.push("bespeak");
    },
    login() {
      // window.open("http://218.94.154.34:54392/")
      let logoutUrl = sessionStorage.getItem("logoutUrl");
      window.open(logoutUrl);
    },
    logout() {
      let logininfo = sessionStorage.getItem("logininfo");
      let userinfo = JSON.parse(logininfo).data;
      window.location.href = userinfo.logoutUrl;
    },
    handleConfirm() {
      this.$store.state.dialogVisible = false;
      if (this.$store.state.loginFlag) {
        this.$store.state.loginFlag = false;
        window.open("http://218.94.154.34:54392/");
      }
    },
    goHome() {
      this.$router.push("/home");
    },
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
    display: inline-block;
    width: 100vw;
    min-width: 12rem;

    // header样式
    & > header {
      background-color: #ffffff;
      padding: 0 calc(50vw - 6rem);
      line-height: 0.65rem;
      height: 0.65rem;
      position: relative;

      & > h1 {
        background-image: url("./assets/images/icon3.png");
        background-size: auto 85%;
        font-size: 0.26rem;
        padding-left: 2.2rem;
        background-repeat: no-repeat;
        background-position: 0.1rem center;
        color: #333333;
        font-weight: 400;
        letter-spacing: 0.01rem;
      }
      & > .right {
        left: 6rem;
        top: -0.65rem;
        position: relative;
        width: 6rem;
        text-align: right;
        padding-right: 0.1rem;
        & > a {
          padding-left: 0.2rem;
          background-repeat: no-repeat;
          color: #000000;
          background-size: 0.14rem auto;
          background-position: left center;
          margin-left: 0.1rem;
          &.personal-center {
            background-image: url("./assets/images/icon1.png");
          }
          &.exit {
            background-image: url("./assets/images/icon2.png");
          }
          &.login {
            background-image: url("./assets/images/icon10.png");
          }
        }
      }
    }

    // footer样式
    & > footer {
      text-align: center;
      color: #ffffff;
      background-color: #dc1c19;
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
