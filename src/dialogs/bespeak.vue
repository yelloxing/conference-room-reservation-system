<template>
  <div class="bespeak-view">
    <h2>
      会议室预约
      <div class="close" @click="$store.state.closeDialog()"></div>
    </h2>
    <div class="container">
      <div class="row">
        <div class="col-size-12">
          <label> 会议室名称：</label>
          <span> 红楼105 </span>
        </div>
        <div class="col-size-6">
          <label> 申请单位：</label>
          <input type="text" placeholder="请输入申请单位" />
        </div>
        <div class="col-size-6 select-frame">
          <label>使用日期：</label>
          <input type="text" v-calendar placeholder="请输入使用日期" />
        </div>
        <div class="col-size-6">
          <label> 预订人：</label>
          <input type="text" placeholder="请输入预订人姓名" />
        </div>
        <div class="col-size-6">
          <label> 联系方式：</label>
          <input type="text" placeholder="请输入预订人联系方式" />
        </div>
        <div class="col-size-6">
          <label> 联系人：</label>
          <input type="text" placeholder="请输入联系人姓名" />
        </div>
        <div class="col-size-6">
          <label> 联系方式：</label>
          <input type="text" placeholder="请输入联系人联系方式" />
        </div>
        <div class="col-size-6">
          <label> 出席领导：</label>
          <input type="text" placeholder="请输入出席领导姓名" />
        </div>
        <div class="col-size-6">
          <label> 出席人数：</label>
          <input type="text" placeholder="请输入出席人数" />
        </div>
        <div class="col-size-12">
          <label> 申请事由：</label>
          <input type="text" placeholder="请输入申请事由" />
        </div>
        <div class="col-size-6">
          <label> 添加附件：</label>
          <input type="file" placeholder="请选择添加的附件" />
        </div>
        <div class="col-size-6" style="color: #555555">
          附件格式（zip压缩文件、Word文档）
        </div>
        <div class="col-size-12">
          <label> 备注：</label>
          <textarea placeholder="请输入备注" />
        </div>
      </div>
    </div>
    <div class="btn-list">
      <button>保存</button>
      <button>重置</button>
      <button>确认预约</button>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.bespeak-view {
  background-color: #ffffff;
  width: 9rem;
  margin: auto;
  margin-top: 1rem;
  & > h2 {
    text-align: center;
    border-bottom: 1px solid #a7a4a4;
    padding: 0.2rem 0;
    font-size: 0.16rem;
    margin-bottom: 0.2rem;
    position: relative;
    & > .close {
      position: absolute;
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      background-image: url("../assets/images/icon6.png");
      background-size: 0.15rem auto;
      background-repeat: no-repeat;
      background-position: center center;
      top: 0rem;
      right: 0rem;
      cursor: pointer;
    }
  }
  & > .container {
    font-size: 0.14rem;
    & > .row {
      & > div {
        padding-left: 0.4rem;
        margin: 0.05rem 0;
        & > * {
          vertical-align: top;
        }

        & > label {
          display: inline-block;
          width: 1rem;
        }
        & > input,
        & > textarea {
          outline: none;
          border-radius: 0.05rem;
          padding: 0 0.05rem;
          border: 1px solid #b2b2bd;
        }
        & > input {
          width: 2.8rem;
          height: 2em;
        }
        & > textarea {
          width: 7.2rem;
          resize: none;
          height: 0.7rem;
          padding-top: 0.05rem;
        }
      }
    }
  }
  & > .btn-list {
    text-align: center;
    padding: 0.1rem 0 0.2rem 0;
    & > button {
      margin: 0.1rem;
      cursor: pointer;
      border: 1px solid #dc1c19;
      background-color: #ffffff00;
      color: #dc1c19;
      border-radius: 0.05rem;
      width: 7em;
      padding: 0.05rem 0;
      &:last-child {
        background-color: #dc1c19;
        color: #ffffff;
      }
    }
  }
}
</style>