<template>
  <div class="bespeak-view">
    <header></header>
    <div>
      <h2>我的预约</h2>
      <div class="container">
        <div class="row">
          <div class="col-size-6">
            <label> 会议室：</label>
            <input type="text" placeholder="搜索会议室" v-model="params.keywords" @keydown.enter="getInfo"/>
          </div>
          <div class="col-size-6 select-frame">
            <label> 时间：</label>
            <el-date-picker
            v-model="params.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate">
          </el-date-picker>
          </div>
          <div class="col-size-6 select-frame">
            <label> 状态：</label>
            <select v-model="status" @change="changeStatus">
              <option value="">全部</option>
              <option v-for="(key,value) in statusList" :key="key" :value="value">{{key}}</option>
            </select>
          </div>
          <div class="col-size-12">
            <label> 地点： </label>
            <button :class="{'selected':!activeMeetingRoomId}" @click="selectMeetingRoom()">全部</button>
            <button v-for="(row,index) in meetingRoomList" :key="index" @click="selectMeetingRoom(row.id)" :class="{'selected':activeMeetingRoomId == row.id}">
              {{row.name}}
            </button>
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
          <tr v-for="(item,index) in list" :key="index">
            <td>{{item.resourceName}}</td>
            <td>{{item.subject}}</td>
            <td>{{item.contact}}</td>
            <td>{{item.contactPhone}}</td>
            <td>{{item.address}}</td>
            <td>{{item.fullTime}}</td>
            <td :style="styleObj(item.status)">{{statusList[item.status]}}</td>
            <td>
              <div class="edit" :class="{'disabled':item.status != -1}" @click="edit(item)"></div>
              <div class="delete" :class="{'disabled':item.status != -1}" @click="deleteThis(item)"></div>
              <div class="cancle" :class="{'disabled':item.status == 3 || item.status == 2}" @click="cancle(item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {dateDiff, dateToStr,millisecondToHm,millisecondToStr} from '../services/dateUtil'
export default {
  data(){
    return{
      list:[],
      params:{
        "resourceId":"",
        "beginTime":"",
        "endTime":""
      },
      "meetingRoomList":[],
      "departmentList":[],
      "activeMeetingRoomId":"",
      "status":'',
      "statusList":{
        "0":"待审核",
        "1":"审核通过",
        "2":"审核不通过",
        "3":"已取消",
        "-1":"草稿"
      }
    }
  },
  created(){
    this.searchAll()
    this.getInfo()
  },
  computed:{
    styleObj(){
      return function(status){
        let color
        switch(status){
          case -1:
          case 1:
            color = '#2c68d5'
            break
          case 0:
            color = '#f2b310'
            break
          case 2:
          case 3:
            color = '#dc1c19'
            break
        }
        return {
          'color':color
        }
      }
    }
  },
  mounted() {},
  methods:{

    //查询我的预约
    getInfo(){
      let options = {
        method: 'POST',
        params: {
          "domainId":2,
          "projectId":12,
          "keywords":this.params.keywords,
          "addressId":this.activeMeetingRoomId,
          "status":this.status,
          "beginTime":this.params.beginTime,
          "endTime":this.params.endTime  
        },
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/v1/myrooms.rst',
      }; 
      this.$axios(options).then(res=>{
        this.list = res.data.data
        if(this.list.length > 0){
          for(let i = 0; i < this.list.length;i++){
            this.list[i].date = dateToStr(new Date(this.list[i].beginTime),'-')
            this.list[i].fullTime =  millisecondToStr(this.list[i].beginTime) + '-' + millisecondToHm(this.list[i].endTime)
            this.list[i].beginTime = millisecondToStr(this.list[i].beginTime)
            this.list[i].endTime = millisecondToStr(this.list[i].endTime)
          }
        }
      })
    },

    //查询地点
    searchAll(){
      let options = {
        method: 'POST',
        params: {
          "domainId":2
        },
        url:this.$axios_baseUrl+'_apigateway/roombooking/api/view/v1/basedata.rst',
      };
      this.$axios(options).then(res=>{
        this.meetingRoomList = res.data.result.data.addresses
        this.departmentList = res.data.result.data.departments
      })
    },

    //选择会议室地点
    selectMeetingRoom(id){
      this.activeMeetingRoomId = id || ''
      this.getInfo()
    },

    //日期切换
    changeDate(){ 
      if(this.params.date){
        this.params.beginTime = dateToStr(this.params.date[0],'-')
        this.params.endTime = dateToStr(this.params.date[1],'-')
        
      }else{
        this.params.beginTime = ''
        this.params.endTime = ''
      }
      this.getInfo()
    },


    //状态切换
    changeStatus(){
      this.getInfo()
    },

    //编辑
    edit(item){
      if(item.status != '-1'){
        return
      }
      // item是传递给弹框的数据
        this.$store.state.openDialog("bespeak",{
          ...item,
          date:item.fullTime,
          meetingRoomList:this.meetingRoomList,
          meetingRoomName:item.resourceName,
          departmentList:this.departmentList,
          flag:"modify",
          recordId:item.id
        }, (data) => {
          if(data){
            if(data.auditStatus == '1'){
              this.$store.state.dialogVisible = true
              this.$store.state.message = "预约信息已提交，待审核"
            }else if(data.auditStatus == '0'){
              this.$store.state.dialogVisible = true
              this.$store.state.message = "预约成功"
            }
          }
          // 弹框关闭以后的回调
          this.getInfo()
        });
    },

    //取消记录
    cancle(item){
      if(item.status == '2' || item.status =='3'){
        return
      }
      if(item.status == '1'){
        let between = dateDiff(new Date(),new Date(item.beginTime),true)
        if(between < 0){
          this.$store.state.dialogVisible = true; //错误弹框
          this.$store.state.message='已超过预约开始时间'; //错误信息
          return
        }else if(item.maxCancleTime && item.maxCancleTime != 0 && between < item.maxCancleTime){
          this.$store.state.dialogVisible = true; //错误弹框
          this.$store.state.message='已超过允许取消时间'+item.maxCancleTime + '小时'; //错误信息
          return
        }
      }
      if(confirm('确定取消此条记录？')){
        let options = {
          method: 'POST',
          params: {
            "domainId":2,
            "recordIds":item.id
          },
          url:this.$axios_baseUrl+'_apigateway/roombooking/api/v1/cancel.rst',
        };
        this.$axios(options).then(res=>{
          this.getInfo()
        })
      }
    },

    //删除记录
    deleteThis(item){
      if(item.status != '-1'){
        return
      }
      if(confirm('确定删除此条记录？')){
        let options = {
          method: 'POST',
          params: {
            "domainId":2,
            "recordIds":item.id
          },
          url:this.$axios_baseUrl+'_apigateway/roombooking/api/v1/delete.rst',
        };
        this.$axios(options).then(res=>{
          this.getInfo()
        })
      }
    }
  }
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
            background: #fff;
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

        .el-date-editor{
          width: 2.8rem;
          height: 2em;
          padding: 0 10px;

         
        }
          /deep/ .el-range-separator{
            width: 10% !important;
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
          text-align: center;
          &:last-child{
            display: flex;
            justify-content: space-around;
          }
        }
      }

      .edit {
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/images/icon19.png');

        &.disabled {
          background: url('../assets/images/icon17.png');
        }
      }

      .delete{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/images/icon18.png');
        
        &.disabled{
          background: url('../assets/images/icon16.png');
        }
      }
      .cancle{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/images/cancle.png');
        
        &.disabled{
          background: url('../assets/images/cancle1.png');
        }
      }
    }
  }
}
</style>