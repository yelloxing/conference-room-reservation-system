<template>
  <div class="home-view">
    <!-- 查询头 -->
    <div class="item search">
      <div class="input">
        <input type="text" placeholder="搜索会议室" v-model="searchName" />
        <button></button>
      </div>
      <div class="button">
        <span> 地点： </span>
        <div>
          <button :class="{ selected: !activeMeetingRoomId }">全部</button>
          <button
            v-for="(row, index) in meetingRoomList"
            :key="index"
            :class="{ selected: activeMeetingRoomId == row.id }"
          >
            {{ row.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 具体的会议室在这里v-for显示 -->
    <div
      class="item container"
      v-for="(item, index) in meetingRoomInfoList"
      :key="index"
    >
      <div class="top">
        <div class="header">
          <div class="room">
            <h2>{{ item.name }}红楼105</h2>
            <p>
              <span>容纳人数：</span>
              <span> {{ item.peopleNum }}人 </span>
            </p>
            <p>
              <span> 所在校区：</span>
              <span> {{ item.address }} </span>
            </p>
            <p>
              <span> 主要设备：</span>
              <span> {{ item.device }} </span>
            </p>
          </div>
        </div>
      </div>
      <div class="select-calendar">
        <div class="top">
          <div class="left">
            <span class="title">预约情况</span>
            <input type="text" />
          </div>
          <span class="to" v-togger-view>点击查看预约的情况</span>
        </div>
        <div class="bottom">
          <div class="btns">
            <button class="left">左边</button>
            <button class="right">右边</button>
          </div>
          <div class="time">
            <span>今天</span>
            <span>昨天</span>
            <span>明天</span>
            <span>12:17</span>
            <span>12:18</span>
            <span>12:19</span>
            <span>12:20</span>
          </div>
          <div class="time-btns">
            <span v-for="value in timeList" :key="value">
              <div>{{ value }}:00</div>
              <!-- class='active' -->
              <div></div>
            </span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="button-list">
        <button @click="goDetail(item)">会议室介绍</button>
        <button @click="remind(item)">立即预约</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      today: "", //今天日期
      // dateList:[], //一周日期列表
      timeList: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      searchName: "", //会议室搜索框
      meetingRoomList: [
        { name: "红楼会议中心", id: "1" },
        { name: "红楼会议中心", id: "1" },
        { name: "红楼会议中心", id: "1" },
        { name: "红楼会议中心", id: "1" },
        { name: "绿楼", id: "2" },
        { name: "一个学数辉煌的", id: "3" },
        { name: "5广泛大概", id: "4" },
        { name: "法大师傅", id: "5" },
      ], //会议室地点列表
      departmentList: [], //部门数组
      activeMeetingRoomId: "", //选中的会议室id
      activeMeetingRoomName: "", //选中的会议室名称
      meetingRoomInfoList: [1, 2, 3, 4, 5, 6], //会议室详情
      preselectList: [], //预选列表
    };
  },
  methods: {
    goDetail() {
      this.$router.push("detail");
    },
    remind() {
      this.$router.push("bespeak");
    },
  },
};
</script>
<style lang="scss" scoped>
.home-view {
  & > .item {
    width: 100%;
    background-color: #ffffff;
    border-radius: 0.03rem;
    &.search {
      padding: 0.1rem;
      margin-top: -0.2rem;
      & > div {
        margin: 0.1rem;
        & > span:first-child {
          padding-right: 0.1rem;
          color: #333333;
          font-weight: 800;
        }
        &.input {
          white-space: nowrap;
          & > input {
            background-color: #efefef;
            border: none;
            padding: 0 0.13rem;
            outline: none;
            height: 0.26rem;
            line-height: 1em;
            border-radius: 0.13rem;
            vertical-align: top;
            width: calc(100% - 0.6rem);
          }
          & > button {
            width: 0.5rem;
            height: 0.26rem;
            border: none;
            outline: none;
            background-color: #dc1c19;
            border-radius: 0.13rem;
            background-image: url("../assets/images/icon13.png");
            background-position: center center;
            background-size: auto 50%;
            background-repeat: no-repeat;
            vertical-align: top;
          }
        }
        &.button {
          white-space: nowrap;
          & > div {
            display: inline-block;
            width: calc(100% - 0.6rem);
            white-space: normal;
            vertical-align: top;
            & > button {
              border-radius: 0.05rem;
              border: none;
              background-color: transparent;
              color: #666666;
              cursor: pointer;
              outline: none;
              margin-bottom: 0.1rem;
              &.selected {
                background-color: #dc1c19;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
    &.container {
      margin-top: 0.3rem;
      & > .top {
        padding: 0.25rem;
        padding-bottom: 0;
        & > .header {
          & > .room {
            padding-right: 3rem;
            min-height: 2.3rem;
            background-image: url("../assets/images/icon14.png");
            background-repeat: no-repeat;
            background-position: right top;
            background-size: 2.8rem auto;
            & > h2 {
              color: #333333;
              margin-bottom: 0.2rem;
            }
            & > p {
              color: #666666;
              white-space: nowrap;
              & > span {
                white-space: normal;
                display: inline-block;
                vertical-align: top;
                line-height: 2em;
                &:last-child {
                  width: 1.3rem;
                }
              }
            }
          }
        }
      }
      & > .select-calendar {
        text-align: center;
        & > .top {
          position: relative;
          & > .to {
            background-image: url("../assets/images/icon22.png");
            background-repeat: no-repeat;
            background-position: right center;
            background-size: auto 40%;
            color: #333333;
            font-size: 0.12rem;
            padding-right: 0.3rem;
            line-height: 0.4rem;
            height: 0.4rem;
            display: inline-block;
          }
          & > .left {
            position: absolute;
            top: 0;
            left: 0.25rem;
            display: none;
            & > .title {
              line-height: 0.4rem;
            }
            & > input {
              width: 0.3rem;
              height: 0.4rem;
              border: none;
              outline: none;
              background-color: transparent;
              background-image: url("../assets/images/icon15.png");
              background-size: 60% auto;
              background-position: center center;
              background-repeat: no-repeat;
            }
          }
        }
        & > .bottom {
          height: 0;
          overflow: hidden;
          transition-duration: 1s;
          transition-property: height;
          & > .time-btns {
            text-align: center;
            padding-top: 1em;
            & > span {
              display: inline-block;
              width: 12%;
              line-height: 2em;
              & > div:last-child {
                display: inline-block;
                width: 0.36rem;
                height: 0.36rem;
                margin: 0.06rem 0.04rem;
                background-color: #f5bfbf;
                border-radius: 0.05rem;
                &.active {
                  background-color: #dc1c19;
                }
              }
            }
          }
          & > .time {
            text-align: center;
            white-space: nowrap;
            margin: 0 0.25rem;
            line-height: 3em;
            border-bottom: 1px solid #555555;
            & > span {
              display: inline-block;
              width: 13%;
            }
          }
          & > .btns {
            text-align: left;
            & > button {
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 70% auto;
              width: 0.2rem;
              height: 0.2rem;
              font-size: 0;
              background-color: rgb(235, 168, 179);
              border-radius: 50%;
              border: none;
              outline: none;
              margin: 0 0.25rem;
              &.left {
                background-image: url("../assets/images/icon23.png");
              }
              &.right {
                float: right;
                background-image: url("../assets/images/icon24.png");
              }
            }
          }
        }
        &.open {
          & > .top {
            & > .to {
              background-image: url("../assets/images/icon21.png");
              font-size: 0;
            }
            & > .left {
              display: block;
            }
          }
          & > .bottom {
            height: 2.7rem;
          }
        }
      }
      & > .button-list {
        white-space: nowrap;
        font-size: 0;
        border-top: 1px solid #555555;
        & > button {
          width: 50%;
          font-size: 0.14rem;
          cursor: pointer;
          line-height: 4em;
          outline: none;
          border: none;
          &:first-child {
            color: #333333;
            background-color: #ffffff;
          }
          &:last-child {
            background-color: #dc1c19;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>