<template>
  <div class="bespeak-view container">
    <h2>会议室预约</h2>
    <form>
      <div>
        <label>会议室名称：</label>
        <span>红楼105</span>
      </div>
      <div>
        <label>使用日期：</label>
        <input type="text" placeholder="请选择使用日期" />
      </div>
      <div>
        <label>申请单位：</label>
        <input type="text" placeholder="请输入申请单位" />
      </div>
      <div>
        <label>预订人：</label>
        <input type="text" placeholder="请输入预订人姓名" />
      </div>
      <div>
        <label>联系方式：</label>
        <input type="text" placeholder="请输入预订人联系方式" />
      </div>
      <div>
        <label>联系人：</label>
        <input type="text" placeholder="请输入联系人姓名" />
      </div>
      <div>
        <label>联系方式：</label>
        <input type="text" placeholder="请输入联系人联系方式" />
      </div>
      <div>
        <label>出席领导：</label>
        <input type="text" placeholder="请输入出席领导姓名" />
      </div>
      <div>
        <label>出席人数：</label>
        <input type="text" placeholder="请输入出席人数" />
      </div>
      <div>
        <label>当前事由：</label>
        <textarea placeholder="请输入申请事由"></textarea>
      </div>
      <div>
        <label>添加附件：</label>
        <input type="file" placeholder="请选择添加的文件" />
      </div>
      <div>
        <label>备注：</label>
        <input type="text" placeholder="请输入备注" />
      </div>
      <div class="btn-list row">
        <div class="col-size-4">
          <button>保存</button>
        </div>
        <div class="col-size-4">
          <button>重置</button>
        </div>
        <div class="col-size-4">
          <button>确认预约</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.bespeak-view {
  background-color: #ffffff;
  border-radius: 0.03rem;
  & > h2 {
    text-align: center;
    line-height: 4em;
    columns: #555555;
    border-bottom: 1px solid #b2b2bd;
  }
  & > form {
    & > div {
      margin-top: 0.2rem;
      & > label {
        display: inline-block;
        width: 1.4rem;
        padding-left: 0.25rem;
      }
      & > input {
        width: 4.8rem;
        height: 3em;
      }
      & > input,
      & > textarea {
        outline: none;
        border-radius: 0.05rem;
        padding: 0 0.05rem;
        border: 1px solid #b2b2bd;
      }
      & > textarea {
        width: 4.8rem;
        resize: none;
        height: 0.7rem;
        padding-top: 0.05rem;
        vertical-align: top;
      }
      &.btn-list {
        text-align: center;
        padding: 0.2rem 0 0.3rem 0;
        & > div {
          & > button {
            width: 1.22rem;
            height: 0.4rem;
            border: 1px solid #dc1c19;
            outline: none;
            border-radius: 0.2rem;
            font-weight: 800;
            cursor: pointer;
            color: #dc1c19;
            background-color: #ffffff;
          }
          &:last-child {
            & > button {
              background-color: #dc1c19;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>