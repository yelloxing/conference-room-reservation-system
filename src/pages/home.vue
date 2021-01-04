<template>
  <div class="home-view">
    <!-- 查询头 -->
    <div class="item search">
      <div class="input">
        <input type="text" placeholder="搜索会议室" v-model="keywords" />
        <button @click="queryMeetingRoomInfo"></button>
      </div>
      <div class="button">
        <span> 地点： </span>
        <div>
          <button :class="{ selected: !addressId }" @click="changeAddress">
            全部
          </button>
          <button
            v-for="(row, index) in addressList"
            :key="index"
            :class="{ selected: addressId == row.id }"
            @click="changeAddress(row)"
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
            <h2>{{ item.name }}</h2>
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
          <div class="left select-frame">
            <span class="title">预约情况</span>
            <input
              type="text"
              v-model="item.appointDate"
              v-calendar
              @input="changeDate"
            />
          </div>
          <span class="to" v-togger-view>点击查看预约的情况</span>
        </div>
        <div class="bottom">
          <div class="btns">
            <button class="left" @click="preWeek(item)">左边</button>
            <button class="right" @click="nextWeek(item)">右边</button>
          </div>
          <div class="time">
            <!-- 外面的日期 -->
            <span
              v-for="(date, i) in item.dates"
              :key="i"
              :class="{ selected: item.activeDateId == i }"
              @click="activeDate(item, i)"
            >
              {{ date.desc }}

              <!-- 里面的时间 -->
              <div class="time-btns" v-show="item.activeDateId == i">
                <span
                  v-for="(value, ind) in date.times"
                  :key="ind"
                  @click="preselectClick(value, item)"
                >
                  <div>{{ value.time }}</div>

                  <!-- 小格子选中的话： <div class='active'></div> -->

                  <div
                    :class="{
                      active: value.active,
                      preselect: value.preselect,
                    }"
                  ></div>
                </span>

                <!-- 最后一个是辅助对齐的 -->
                <span></span>
              </div>
            </span>
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
import {
  getFutureWeekDay,
  millisecondToDateStr,
  dateToStr,
  numToTime,
  dateBetween,
  getExpectDate,
} from "../services/dateUtil";
export default {
  data() {
    return {
      today: new Date(), //今天日期
      dateList: ["今天", "明天", "12-17", "选择的", "12-18", "12-19", "12-20"], //一周日期列表
      timeList: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      keyword: "", //会议室名称搜索框
      addressList: [], //会议室地点列表
      departmentList: [], //部门数组
      addressId: "", //选中的会议室id
      keywords: "", //搜索会议室名称关键字
      activeMeetingRoomName: "", //选中的会议室名称
      meetingRoomInfoList: [{}, {}, {}, {}], //会议室列表
      activeDateId: 0, //当前选中的日期
      preselectList: [], //预选列表
    };
  },

  created() {
    this.queryAllMeetingRomm();
    // this.appointDate = this.today  //默认为今天
    // this.appointDate = "2021-01-01";
  },

  methods: {
    //查询所有会议室及部门
    queryAllMeetingRomm() {
      this.$axios
        .post("_apigateway/roombooking/api/view/v1/basedata.rst", {
          domainId: 2,
        })
        .then((res) => {
          if (res.data.resultCode == 0) {
            this.addressList = res.data.result.data.addresses;
            this.departmentList = res.data.result.data.departments;
            this.queryMeetingRoomInfo(); //查询会议室详情
          }
        });
    },
    //查询会议室详情
    queryMeetingRoomInfo() {
      let options = {
        method: "POST",
        params: {
          domainId: 2,
          projectId: 12,
          addressId: this.addressId,
          keywords: this.keywords,
        },
        url: "_apigateway/roombooking/api/view/v1/rooms.rst",
      };
      this.$axios(options).then((res) => {
        if (res.data.code == 0) {
          this.meetingRoomInfoList = res.data.data;

          this.queryAppointInfo();
        }
      });
    },

    //查询会议室预约详细记录
    queryAppointInfo() {
      let that = this;
      this.meetingRoomInfoList.forEach((item, index1) => {
        item.activeDateId = 0;
        item.appointDate = item.appointDate || this.today;
        item.dates = getFutureWeekDay(dateToStr(item.appointDate));
        item.dates.forEach((date) => {
          date.times = that.timeList.map((time) => {
            let param = {
              time: numToTime(time),
              fullTime: `${date.fullDate} ${numToTime(time)}`,
              beginTime: `${date.fullDate} ${numToTime(time)}`,
              endTime: `${date.fullDate} ${numToTime(time + 1)}`,
            };
            let millisecond = new Date(
              param.fullTime.replace(/-/g, "/")
            ).getTime();

            item.appointments &&
              item.appointments.forEach((appointment) => {
                if (
                  millisecond >= appointment.beginTime &&
                  millisecond < appointment.endTime
                ) {
                  param.active = true;
                  return;
                }
              });

            return param;
          });
        });
      });
    },

    //切换日期id
    activeDate(item, i) {
      item.activeDateId = i;
      this.meetingRoomInfoList = JSON.parse(
        JSON.stringify(this.meetingRoomInfoList)
      );
    },

    //日历日期切换
    changeDate() {
      this.queryAppointInfo();
    },

    //前一周
    preWeek(item) {
      let preDate = getExpectDate(dateToStr(item.appointDate), -7);
      item.appointDate = preDate;
      this.meetingRoomInfoList = JSON.parse(
        JSON.stringify(this.meetingRoomInfoList)
      );

      this.queryAppointInfo();
    },
    //后一周
    nextWeek(item) {
      let preDate = getExpectDate(dateToStr(item.appointDate), 7);
      item.appointDate = preDate;
      this.meetingRoomInfoList = JSON.parse(
        JSON.stringify(this.meetingRoomInfoList)
      );
      this.queryAppointInfo();
    },
    preselectClick(value, item) {
      if (value.active) {
        return;
      }

      let daysBetween = dateBetween(this.today, value.beginTime); //当前预约的点与现在的差值天数
      let timesBetween = dateBetween(this.today, value.beginTime, true); //当前预约的点与现在的差值小时数

      if (timesBetween < 0) {
        this.$store.state.openDialog("alert", {
          errorMsg: "请选择当前时间之后的时间进行预约",
        });
        return;
      }

      if (
        item.maxPreTime != undefined &&
        item.maxPreTime != 0 &&
        daysBetween > item.maxPreTime
      ) {
        //选定的天数差 大于 最大预约天数
        this.$store.state.openDialog("alert", {
          errorMsg: "预约时间大于该资源最大预约天数:" + item.maxPreTime + "天",
        });
        return;
      }

      if (
        item.maxStopTime &&
        item.maxStopTime != 0 &&
        timesBetween < item.maxStopTime
      ) {
        //选定的小时差 小于 最大停止预约时间
        this.$store.state.openDialog("alert", {
          errorMsg: "当前时间已过最大停止预约时间:" + item.maxStopTime + "小时",
        });
        return;
      }

      let i;
      let select = this.preselectList.find((row, index) => {
        if (row.fullTime == value.fullTime) {
          i = index;
          return true;
        }
        return false;
      });

      if (select) {
        this.preselectList.splice(i, 1);
        this.$set(value, "preselect", false);
      } else {
        this.preselectList.push(value);
        this.$set(value, "preselect", true);
      }
      this.meetingRoomInfoList = JSON.parse(
        JSON.stringify(this.meetingRoomInfoList)
      );
    },

    //切换地点
    changeAddress(row) {
      this.addressId = row ? row.id : "";
      this.queryMeetingRoomInfo();
    },

    //  会议室介绍
    goDetail(item) {
      window.location.href = item.infoUrl;
    },
    remind(item) {
      if (!sessionStorage.getItem("logininfo")) {
        this.$store.state.loginFlag = true;
        this.$store.state.openDialog("alert", {
          errorMsg: "请先登录",
        });
        return;
      }

      if (this.preselectList.length == 0) {
        this.$store.state.openDialog("alert", {
          errorMsg: "请先选择预约时间",
        });
        return;
      }

      let arr = this.preselectList.sort(function(a, b) {
        return (
          new Date(a.beginTime.replace(/-/g,'/')).getTime() - new Date(b.beginTime.replace(/-/g,'/')).getTime()
        );
      });

      if (
        dateBetween(arr[0].beginTime, arr[arr.length - 1].beginTime, true) !=
        arr.length - 1
      ) {
        this.$store.state.openDialog("alert", {
          errorMsg: "请选择连续的时间",
        });
        return;
      }

      //计算连续的时间段是否超过最大预约时长
      let beginTime = arr[0].beginTime;
      let endTime = arr[arr.length - 1].endTime;
      let between = dateBetween(beginTime, endTime, true);

      if (
        item.maxUseTime &&
        item.maxUseTime != 0 &&
        between > item.maxUseTime
      ) {
        this.$store.state.openDialog("alert", {
          errorMsg:
            "预约时间段大于该资源最大预约时长:" + this.form.maxUseTime + "小时",
        });
        return;
      }

      let param = {
        departments: this.departmentList, //部门
        date:
          arr[0].beginTime + "-" + arr[arr.length - 1].endTime.split(" ")[1],
        meetingRoomName: item.name,
        meetingRoomId: item.id,
        maxStopTime: item.maxStopTime,
        maxPreTime: item.maxPreTime,
        maxUseTime: item.maxUseTime,
      };

      this.$router.push({ name: "bespeak", params: param });
      this.preselectList = []
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
              color: transparent;
            }
          }
        }
        & > .bottom {
          height: 0;
          overflow: hidden;
          transition-duration: 1s;
          transition-property: height;
          & > .time {
            text-align: center;
            white-space: nowrap;
            margin: 0 0.25rem;
            line-height: 3em;
            border-bottom: 1px solid #555555;
            position: relative;
            & > span {
              display: inline-block;
              width: 13%;
              &.selected {
                color: #dc1c19;
                &::before {
                  content: " ";
                  display: inline-block;
                  width: 7px;
                  height: 7px;
                  background-color: #dc1c19;
                  border-radius: 50%;
                  position: absolute;
                  margin-left: 22px;
                }
              }
              & > .time-btns {
                text-align: center;
                padding-top: 1em;
                position: absolute;
                left: 0;
                top: 0.45rem;
                width: 6rem;
                white-space: normal;
                color: #333333;
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
                    &.preselect {
                      border: 1px solid #dc1c19;
                      box-sizing: border-box;
                    }
                  }
                }
              }
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
        border-top: 1px solid #e0e0e0;
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
