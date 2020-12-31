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
          <button @click="remind(item)">立即预约</button>
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
              <div class="item" v-for="(time,innerIndex) in row" :key="innerIndex" 
                  v-title="time.active?'预约人：'+time.name+'#预约时间：'+time.fullTime:''" 
                  :class="{'active':time.active,'preselect':time.preselect}" 
                  @click="preselectClick(time,item)"> 
                <!-- @click="dialogBespeak(item,time)" -->
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
      preselectList:[] //预选列表
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
    //日期切换
    changeDate(item,date,index){
      let row = this.meetingRoomInfoList[index]   
      this.queryAppointment(row,date)     //切换日期后重新查询日期预约状态
    },
    //进入页面初始化数据
    searchAll(){
      let _this = this
      let options = {
        method: 'POST',
        params: {
          "domainId":2
        },
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/view/v1/basedata.rst',   //查询会议室地点
      };
      this.$axios(options).then(res=>{
        _this.meetingRoomList = res.data.result.data.addresses   
        _this.searchByCondition()   //查询会议室预约详情
      })
    },

    //查询会议室预约详情  
    searchByCondition(searchName,date,index){
      let _this = this
      let param = {
        "domainId":2,
        "projectId":12,
        "addressId":searchName ? '' :this.activeMeetingRoomId,   //地点id
        "keywords":searchName     //关键字 （输入框内的内容）
      }
      let options = {
        method: 'POST',
        params: param,
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/view/v1/rooms.rst',  
      };
      this.$axios(options).then(res=>{
        _this.meetingRoomInfoList = res.data.data 
        for(let k = 0; k < _this.meetingRoomInfoList.length; k++){   //根据查询后的数据计算每个会议室的预约情况
          let item = _this.meetingRoomInfoList[k]
          this.queryAppointment(item,date)
        }
      })
    },
    //组装时间点并进行判断当前时间点的预约情况
    queryAppointment(item,date){
      item.appointmentList = []  //储存每个点的时间点，以及预约的基本内容  （7*15二维数组）
      item.dateList = getFutureWeekDay(dateToStr(date || this.today))  //根据日历选定的日期（默认为今天）获取到此日期未来一周的日期表
        //组装appointmentList数组
      for(let i = 0; i < item.dateList.length;i ++){
        item.appointmentList.push([])
        for(let j = 0;j < this.timeList.length; j++){
          item.appointmentList[i].push({
            "date":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j]) + '-' + numToTime(this.timeList[j] + 1),  //yyyy-MM-dd HH:mm - HH:mm
            "fullDate":item.dateList[i].fullDate,       //yyyy-MM-dd
            "beginTime":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j]),  //yyyy-MM-dd HH:mm
            "endTime":item.dateList[i].fullDate + ' ' + numToTime(this.timeList[j] + 1),  //yyyy-MM-dd HH:mm
            "time":numToTime(this.timeList[j]) + '-' + numToTime(this.timeList[j] + 1), //HH:mm-HH:mm
            "fullTime":item.dateList[i].fullDate + ' ' +numToTime(this.timeList[j]) +  ":00" //yyyy-MM-dd HH:mm:00
          })
        }
      }
      //根据组装的数据判断该数据是否是已预约
      for(let i = 0;i < item.appointmentList.length;i++){
        for(let j = 0;j < item.appointmentList[i].length;j++){
          let time = item.appointmentList[i][j]   //找到具体的时间点
          for(let k = 0; k < item.appointments.length;k++){
            let row = item.appointments[k]
            let fullTime = time.fullTime    
            let fullTimeStamp = new Date(fullTime).getTime()
            if(row.beginTime <= fullTimeStamp && row.endTime > fullTimeStamp){  //将该时间点与appointments中的beginTime和endTime进行比较，在范围内则标记active为true。同时记录预约人
              time.active = true
              time.id = row.id  //会议室id
              time.name = row.name  //预约人
            }
          }
        }
      }
    },

    //预选
    preselectClick(time,item){
      if(time.active){  //已预约的不可预选
        return
      } 
      let daysBetween =  dateDiff(this.today,time.beginTime)   //当前预约的点与现在的差值天数
      let timesBetween =  dateDiff(this.today,time.beginTime,true) //当前预约的点与现在的差值小时数
      
      if(timesBetween < 0){
        this.$store.state.dialogVisible = true; //错误弹框
        this.$store.state.message='请选择当前时间之后的时间进行预约'; //错误信息
        return
      }
      
      if(item.maxPreTime != undefined && item.maxPreTime != 0 &&daysBetween > item.maxPreTime){  //选定的天数差 大于 最大预约天数
          this.$store.state.dialogVisible = true; //错误弹框
          this.$store.state.message='预约时间大于该资源最大预约天数:'+item.maxPreTime + '天';//错误信息
        return
      }

      if(timesBetween < 0){
        this.$store.state.dialogVisible = true; //错误弹框
        this.$store.state.message='请选择当前时间之后的时间进行预约'; //错误信息
        return
      }
      if(item.maxStopTime && item.maxStopTime != 0 && timesBetween < item.maxStopTime){ //选定的小时差 小于 最大停止预约时间 
        this.$store.state.dialogVisible = true; //错误弹框
        this.$store.state.message='当前时间已过最大停止预约时间:'+item.maxStopTime + '小时'; //错误信息
        return
      }


      let ind
      let select = this.preselectList.find((row,index) => {
        if(row.fullDate == time.fullDate){
          ind = index
          return true
        }
        return false
      }) 

      //判断预选列表内是否存在该数据，存在则删除，不存在则添加
      if(select){
        this.preselectList.splice(ind,1)
        this.$set(time,'preselect',false)
      }else{
        this.preselectList.push(time)
        this.$set(time,'preselect',true)
      }
    },

    //选择会议室地点
    selectMeetingRoom(id){
      this.activeMeetingRoomId = id || ''
      this.searchByCondition()  //查询会议室预约详情
    },
    // 会议室介绍
    goDetail(item) {
      window.location.href = item.infoUrl   //跳转链接
    },
    // 立即预约
    dialogBespeak(item,time) {
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
    },

    //立即预约按钮
    remind(item){
      //如果未登录，需先登录
      if(!sessionStorage.getItem('logininfo')){
        alert('请先登录！')
      }else{
        //已登录，未选择时间点
        if(this.preselectList.length == 0){
          alert('请选择右侧时间段进行预约！')
        }else{
          //计算选定的时间点是否是连续的。  
          //计算方式：一个时间点差值是一个小时。先按时间排序，计算最后一条的开始时间和第一条的开始时间差是否等于数组长度，是则连续

          let list = this.preselectList
          list.sort(function(a,b){
            return new Date(a.beginTime).getTime() - new Date(b.beginTime).getTime()
          })
          let len = list.length
          let between = dateDiff(list[0].beginTime,list[len-1].beginTime,true)
          if(between != list.length - 1){
            alert('请选择连续的日期')
          }else{
            
            //计算连续的时间段是否超过最大预约时长
            let beginTime = list[0].beginTime  
            let endTime = list[len-1].endTime
            let between = dateDiff(beginTime,endTime,true)

            if(item.maxUseTime && between > item.maxUseTime){ 
              this.$store.state.dialogVisible = true; //错误弹框
              this.$store.state.message='预约时间段大于该资源最大预约时长:'+this.form.maxUseTime + '小时'; //错误信息
              return
            }

            let param = {
              beginTime:beginTime,
              endTime:endTime,
              date: beginTime+ '-' + endTime.split(' ')[1]
            }
            this.dialogBespeak(item,param)   //符合条件调起预约弹框
          }
        }
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
      width: 4rem;
      box-sizing: content-box;
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
                    &.preselect{
                      background: yellow;
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