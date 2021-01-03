<template>
  <ul class="rootApp">
    <!-- 主界面 -->
    <li class="ui-main">
      <header>
        <h1>会议室预约管理系统</h1>
        <div class="right"></div>
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
    };
  },
  created() {
    if (sessionStorage.getItem("logininfo")) {
      this.loginFlag = true;
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
      window.location.href = "http://218.94.154.34:54392/"
    },
    logout() {
      let logininfo = sessionStorage.getItem("logininfo");
      let userinfo = JSON.parse(logininfo).data;
      window.location.href = userinfo.logoutUrl;
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
      }
    }
    & > .img {
       background-image: url("./assets/images/icon12.png");
       height: 300px;
       background-position: center center;
       background-size: auto 100%;
    }
    & > .content {
      margin:-.2rem .5rem 0 .5rem;
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
