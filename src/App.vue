<template>
  <ul class="rootApp">
    <!-- 主界面 -->
    <li class="ui-main">
      <router-view></router-view>
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
      // window.location.href = "/"
      window.open("/");
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
