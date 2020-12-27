<template>
  <div class="bespeak-view">
    <header></header>
    <div>
      <h2>我的预约</h2>
      <div class="container">
        <div class="row">
          <div class="col-size-6">
            <label> 会议室：</label>
            <input type="text" placeholder="搜索会议室" />
          </div>
          <div class="col-size-6 select-frame">
            <label> 时间：</label>
            <input type="text" placeholder="请选择时间" v-calendar />
          </div>
          <div class="col-size-6">
            <label> 状态：</label>
            <select>
              <option
                selected="selected"
                disabled="disabled"
                style="display: none; color: #666666"
                value=""
              >
                请选择状态
              </option>
              <option value="1">草稿</option>
              <option value="2">审核中</option>
              <option value="3">成功</option>
              <option value="4">失败</option>
            </select>
          </div>
          <div class="col-size-6">
            <label> 关键词：</label>
            <input type="text" placeholder="请输入关键字" />
          </div>
          <div class="col-size-12">
            <label> 地点： </label>
            <button class="selected">全部</button>
            <button>红楼会议中心</button>
            <button>阳澄湖校区</button>
            <button>敬贤堂</button>
            <button>炳麟馆学术报告厅</button>
            <button>绿楼</button>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>会议室</th>
            <th>事由</th>
            <th>联系人</th>
            <th>电话</th>
            <th>地点</th>
            <th>预约时间</th>
            <th>状态</th>
            <th>功能键</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in 7" :key="item">
            <td>红楼105</td>
            <td>一些说明事由XXXXXX</td>
            <td>王-----</td>
            <td>123455678901</td>
            <td>这是一个地址哦xxxxxxx</td>
            <td>2020-12-20</td>
            <td>失败</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
};
</script>
<style lang="scss" scoped>
.bespeak-view {
  & > header {
    height: 3.8rem;
    background-image: url("../assets/images/icon4.jpg");
    background-size: auto 180%;
    background-position: center top;
  }
  & > div {
    width: 12rem;
    background-color: #ffffff;
    margin: auto;
    box-shadow: 0 0 0.03rem 0.01rem #e4dede;
    border-radius: 0.03rem;
    margin-top: -0.2rem;
    margin-bottom: 0.2rem;
    min-height: 3rem;
    padding-bottom: 0.1rem;
    & > h2 {
      border-bottom: 1px solid #d2c8c8;
      padding: 0.2rem 0;
      text-align: center;
    }
    & > .container {
      padding: 0.1rem;
      border-bottom: 1px solid #d2c8c8;
      & > .row {
        & > div {
          padding-left: 0.4rem;
          margin: 0.05rem 0;
          & > label {
            display: inline-block;
            width: 1rem;
          }
          & > input,
          & > select {
            outline: none;
            border-radius: 0.05rem;
            padding: 0 0.05rem;
            border: 1px solid #b2b2bd;
            width: 2.8rem;
            height: 2em;
          }
          & > button {
            border-radius: 0.05rem;
            border: none;
            background-color: #ffffff00;
            color: #666666;
            cursor: pointer;
            outline: none;
            &.selected {
              background-color: #dc1c19;
              color: #ffffff;
            }
          }
        }
      }
    }
    & > table {
      width: calc(100% - 0.4rem);
      margin: 0.2rem;
      & > thead {
        text-align: center;
        background-color: #fdf3f3;
        & > tr {
          & > th {
            border-width: 1px 1px 1px 1px;
          }
        }
      }
      & > tbody {
        & > tr {
          & > td {
            border-width: 0 1px 1px 0;
            &:first-child {
              border-width: 0 1px 1px 1px;
            }
          }
        }
      }
      tr {
        & > th,
        & > td {
          padding: 0.1rem;
          border-style: solid;
          border-color: #c1bcbc;
        }
      }
    }
  }
}
</style>