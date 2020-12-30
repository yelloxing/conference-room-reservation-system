<template>
  <div class="home-view">
    <header>
      <div>
        <h2>会议室网上预约管理规定</h2>
        <p>
          为规范和加强报告厅、会议室使用与管理，提高使用效率，报告厅、会议室实行网上预约管理，特制订本规定如下：
        </p>
        <p>1、报告厅、会议室实行网上预约使用与管理。</p>
        <p>
          2、报告厅、会议室预约时段为：7:00-12:00，14:00-18:00，
          19:00-22:00，超时段使用应在预约登记时做好备注说明。(提示：预约时间必须落在系统划定时间段内，时间需按照系统原有时间格式输入）
        </p>
        <p>
          3、如报告厅、会议室多媒体设备使用前发生故障、损坏或配件丢失，要及时上报党政综合办公室，未及时上报发现后责任一律由最后使用人承担。
        </p>
        <p>
          4、其他特殊情况或特殊需要用户可联系服务中心，联系电话：0512-65221621。
        </p>
        <a href="javascript:void(0)">了解更多</a>
      </div>
    </header>

    <!-- 查询头 -->
    <div class="item search">
      <div class="input">
        <span> 会议室 </span>
        <input type="text" placeholder="搜索会议室" v-model="searchName" @keydown.enter="searchByCondition(searchName)"/>
      </div>
      <div class="button">
        <span> 地点： </span>
        <button :class="{'selected':!activeMeetingRoomId}" @click="selectMeetingRoom()">全部</button>
        <button v-for="(row,index) in meetingRoomList" :key="index" @click="selectMeetingRoom(row.id)" :class="{'selected':activeMeetingRoomId == row.id}">
          {{row.name}}
        </button>
      </div>
    </div>

    <!-- 具体的会议室在这里v-for显示 -->
    <div class="item container" v-for="(item,index) in meetingRoomInfoList" :key="index">
      <div class="left">
        <div class="room">
          <h2>{{item.name}}</h2>
          <p>
            <span>容纳人数：</span>
            <span> {{item.peopleNum}}人 </span>
          </p>
          <p>
            <span> 所在校区：</span>
            <span> {{item.address}} </span>
          </p>
          <p>
            <span> 主要设备：</span>
            <span> {{item.device}} </span>
          </p>
        </div>
        <div class="button-list">
          <button @click="goDetail(item)">会议室介绍</button>
          <button @click="remind">立即预约</button>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <h2>预约情况</h2>
          <div class="toRight">
            <span>
              <i></i>
              可预约
            </span>
            <span>
              <i></i>
              已预约
            </span>
          </div>
        </div>
        <div class="times">
          <span class="calendar select-frame">
            <input type="text" v-calendar v-model="item.startDate" @input="changeDate(item,item.startDate,index)"/>
          </span>
          <span class="time" v-for="time in timeList" :key="time">{{time|numToTime}}</span>
        </div>
        <div class="items">
          <div class="left">
            <div v-for="(row,index) in item.dateList" :key="index">
              {{row.filter}}
            </div>
          </div>
          <div class="right">
            <div class="row" v-for="(row,outerIndex) in item.appointmentList" :key="outerIndex">
              <!-- 如果是已预约，class='item active' -->
              <div class="item" v-for="(time,innerIndex) in row" :key="time.active?innerIndex+'预约人：'+time.name+'#预约时间：'+time.fullTime:innerIndex" v-title="time.active?'预约人：'+time.name+'#预约时间：'+time.fullTime:''" :class="{'active':time.active}" @click="dialogBespeak(item,time)">
                {{time.date}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getFutureWeekDay,dateToStr,numToTime,dateDiff} from '../services/dateUtil'
export default {
  data(){
    return {
      today:'',  //今天日期
      // dateList:[], //一周日期列表 
      timeList:[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
      searchName:'',   //会议室搜索框
      meetingRoomList:[],   //会议室地点列表
      activeMeetingRoomId:'', //选中的会议室id
      activeMeetingRoomName:'',  //选中的会议室名称
      meetingRoomInfoList:[],  //会议室详情
    }
  },
  filters:{
    numToTime
  },
  created(){
    this.today = new Date()
    this.searchAll()  //初始化查询
  },
  methods: {
    changeDate(item,date,index){
      let row = this.meetingRoomInfoList[index]
      this.queryAppointment(row,date)
    },
    searchAll(){
      let _this = this
      let options = {
        method: 'POST',
        params: {
          "domainId":2
        },
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/v1/basedata.rst',
      };
      this.$axios(options).then(res=>{
        _this.meetingRoomList = res.data.result.data.addresses
        _this.searchByCondition()
      })
    },
    searchByCondition(searchName,date,index){
      let _this = this
      let param = {
        "domainId":2,
        "projectId":12,
        "addressId":searchName ? '' :this.activeMeetingRoomId,
        "keywords":searchName
      }
      let options = {
        method: 'POST',
        params: param,
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/v1/rooms.rst',
      };
      this.$axios(options).then(res=>{
        _this.meetingRoomInfoList = res.data.data
        for(let k = 0; k < _this.meetingRoomInfoList.length; k++){
          let item = _this.meetingRoomInfoList[k]
          this.queryAppointment(item,date)
        }
      })
    },
    queryAppointment(item,date){
      item.appointmentList = []
      item.dateList = getFutureWeekDay(dateToStr(date || this.today))
      for(let i = 0; i < item.dateList.length;i ++){
        item.appointmentList.push([])
        for(let j = 0;j < this.timeList.length; j++){
          item.appointmentList[i].push({
            "date":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j]) + '-' + numToTime(this.timeList[j] + 1),
            "fullDate":item.dateList[i].fullDate,
            "beginTime":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j]),
            "endTime":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j] + 1),
            "time":numToTime(this.timeList[j]) + '-' + numToTime(this.timeList[j] + 1),
            "fullTime":item.dateList[i].fullDate + ' ' +numToTime(this.timeList[j]) +  ":00"
          })
        }
      }

      for(let i = 0;i < item.appointmentList.length;i++){
        for(let j = 0;j < item.appointmentList[i].length;j++){
          let time = item.appointmentList[i][j]
          for(let k = 0; k < item.appointments.length;k++){
            let row = item.appointments[k]
            let fullTime = time.fullTime
            let fullTimeStamp = new Date(fullTime).getTime()
            if(row.beginTime <= fullTimeStamp && row.endTime > fullTimeStamp){
              time.active = true
              time.id = row.id
              time.name = row.name
            }
          }
        }
      }


    },
    selectMeetingRoom(id){
      this.activeMeetingRoomId = id || ''
      this.searchByCondition()
    },
    // 会议室介绍
    goDetail(item) {
      // this.$router.push("detail");
      window.location.href = item.infoUrl
    },
    // 立即预约
    dialogBespeak(item,time) {
      if(!sessionStorage.getItem('logininfo')){
        alert('请先登录')
        return
      }
      if(!time.active){
        //time.beginTime   time.endTime   today
        let daysBetween =  dateDiff(this.today,time.beginTime)
        let timesBetween =  dateDiff(this.today,time.beginTime,true)
        if(item.maxPreTime && daysBetween > item.maxPreTime){
           this.$store.state.dialogVisible = true; //错误弹框
           this.$store.state.message='预约时间大于该资源最大预约天数:'+item.maxPreTime + '天';//错误信息
          return
        }

        if( item.maxStopTime && timesBetween < item.maxStopTime){
          this.$store.state.dialogVisible = true; //错误弹框
          this.$store.state.message='当前时间已过最大停止预约时间:'+item.maxStopTime + '小时'; //错误信息
          return
        }

        // item是传递给弹框的数据
        this.$store.state.openDialog("bespeak", {
          "meetingRoomList":this.meetingRoomList,
          "meetingRoomName":item.name,
          "addressId":item.addressId,
          "meetingRoomId":item.id,
          ...time
        }, (data) => {
          this.searchAll()
        });
      }
    },
    remind(){
      if(!sessionStorage.getItem('logininfo')){
        alert('请先登录！')
      }else{
        alert('请选择右侧时间段进行预约！')
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home-view {
  & > header {
    height: 3.8rem;
    background-image: url("../assets/images/icon12.jpg");
    background-size: auto 100%;
    background-position: right center;
    & > div {
      width: 650px;
      color: #ffffff;
      line-height: 1.2em;
      height: 3.8rem;
      padding-left: calc(50vw - 6rem);
      padding-right: 2.3rem;
      background-image: url("../assets/images/icon11.png");
      background-position: right center;
      background-size: auto 100%;

      & > * {
        margin-left: 0.1rem;
      }

      & > h2 {
        font-size: 0.16rem;
        padding: 0.25rem 0 0.12rem 0;
      }
      & > p {
        font-size: 0.12rem;
        margin-bottom: 0.12rem;
      }
      & > a {
        color: #ffffff;
        border: 1px solid #ffffff;
        font-size: 0.12rem;
        padding: 0.05rem 0.1rem;
        border-radius: 0.05rem;
      }
    }
  }
  & > .item {
    width: 12rem;
    background-color: #ffffff;
    margin: auto;
    box-shadow: 0 0 0.03rem 0.01rem #e4dede;
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
          & > input {
            background-color: #efefef;
            border: none;
            padding: 0 0.13rem;
            outline: none;
            height: 0.26rem;
            line-height: 1em;
            border-radius: 0.13rem;
            background-image: url("../assets/images/icon13.png");
            background-position: right center;
            background-repeat: no-repeat;
          }
        }
        &.button {
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
    &.container {
      margin-top: 0.3rem;
      font-size: 0;
      white-space: nowrap;
      &:last-child {
        margin-bottom: 0.3rem;
      }
      & > div {
        height: 3.2rem;
        display: inline-block;
        white-space: normal;
        vertical-align: top;
        padding: 0.2rem;
        font-size: 0.14rem;
        &.left {
          width: 4.4rem;
          & > .room {
            padding-left: 2rem;
            height: 2.3rem;
            background-image: url("../assets/images/icon14.png");
            background-repeat: no-repeat;
            background-position: left top;
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
          & > .button-list {
            text-align: center;
            & > button {
              width: 1.22rem;
              height: 0.4rem;
              border: 1px solid #dc1c19;
              outline: none;
              border-radius: 0.05rem;
              font-weight: 800;
              cursor: pointer;
              &:first-child {
                color: #dc1c19;
                background-color: #ffffff;
              }
              &:last-child {
                background-color: #dc1c19;
                color: #ffffff;
                margin-left: 0.8rem;
              }
            }
          }
        }
        &.right {
          width: 7.6rem;
          background-color: #fbe8e8;
          color: #666666;
          & > .top {
            margin-bottom: 0.15rem;
            position: relative;
            & > h2 {
              color: #333333;
              font-size: 0.15rem;
              padding-left: 0.2rem;
            }
            & > .toRight {
              position: absolute;
              top: 0.02rem;
              right: 0;
              font-size: 0.12rem;
              & > span {
                & > i {
                  display: inline-block;
                  width: 1em;
                  height: 1em;
                  vertical-align: top;
                  margin-right: 0.05em;
                  margin-left: 1em;
                }
                &:first-child > i {
                  background-color: #f5bfbf;
                }
                &:last-child > i {
                  background-color: #dc1c19;
                }
              }
            }
          }
          & > .times,
          & > .items {
            font-size: 0.12rem;
            & > :first-child {
              width: 0.6rem;
            }
          }
          & > .times {
            white-space: nowrap;
            font-size: 0;
            & > span {
              display: inline-block;
              width: 0.44rem;
              text-align: center;
              font-size: 0.12rem;
              line-height: 0.2rem;
              &.calendar {
                background-image: url("../assets/images/icon15.png");
                height: 0.2rem;
                background-repeat: no-repeat;
                background-position: right center;
                vertical-align: bottom;
                background-size: auto 100%;
                position: relative;
                cursor: pointer;
                & > input {
                  width: 2em;
                  margin-left: 0.4rem;
                  background-image: none;
                  background-color: transparent;
                  outline: none;
                  border: none;
                  color: transparent;
                  opacity: 0;
                }
              }
            }
          }
          & > .items {
            white-space: nowrap;
            & > div {
              display: inline-block;
              vertical-align: top;
              white-space: normal;
              &.left {
                text-align: right;
                & > div {
                  height: 0.32rem;
                  line-height: 0.32rem;
                  &:first-child {
                    color: #dc1c19;
                  }
                }
              }
              &.right {
                & > .row {
                  & > .item {
                    display: inline-block;
                    width: 0.36rem;
                    height: 0.2rem;
                    margin: 0.06rem 0.04rem;
                    background-color: #f5bfbf;
                    border-radius: 0.05rem;
                    &.active {
                      background-color: #dc1c19;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>