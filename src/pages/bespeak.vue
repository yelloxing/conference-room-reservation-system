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
            <td>{{item.beginTime}}</td>
            <td>{{item.status}}</td>
            <td>
              <div class="edit" :class="{'disabled':item.status != -1}" @click="edit(item)"></div>
              <div class="delete" :class="{'disabled':item.status != -1}" @click="deleteThis(item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {dateToStr} from '../services/dateUtil'
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
      "activeMeetingRoomId":""
    }
  },
  created(){
    this.searchAll()
    this.getInfo()
  },
  mounted() {},
  methods:{
    //查询我的预约
    getInfo(){
      this.$axios.post('/_apigateway/roombooking/api/v1/myrooms.rst',{
        "domainId":2,
        "projectId":12,
        "keywords":this.params.keywords,
        "addressId":this.activeMeetingRoomId,
        "beginTime":this.params.beginTime,
        "endTime":this.params.endTime
      }).then(res=>{
        this.list = res.data.data
      })
    },
    //查询地点
    searchAll(){
      let options = {
        method: 'POST',
        params: {
          "domainId":2
        },
        url:'/_apigateway/roombooking/api/v1/basedata.rst',
      };
      this.$axios(options).then(res=>{
        this.meetingRoomList = res.data.result.data.addresses
      })
    },
    //选择会议室地点
    selectMeetingRoom(id){
      this.activeMeetingRoomId = id || ''
      this.getInfo()
    },
    changeDate(){  //日期切换
      if(this.params.date){
        this.params.beginTime = dateToStr(this.params.date[0],'-')
        this.params.endTime = dateToStr(this.params.date[1],'-')
      }else{
        this.params.beginTime = ''
        this.params.endTime = ''
      }
      this.getInfo()
    },
    edit(item){
      if(item.status != '-1'){
        return
      }
      this.$store.state.openDialog('base-view',item,(data) => {

      })
    },
    delete(item){
      if(item.status != '-1'){
        return
      }
      confirm('确定删除此条记录？',function(){
        let options = {
          method: 'POST',
          params: {
            "domainId":2,
            "recordIds":item.id
          },
          url:'/_apigateway/roombooking/api/v1/delete.rst',
        };
        this.$axios(options).then(res=>{
          this.getInfo()
        })
      })
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

          &:last-child{
            display: flex;
            justify-content: space-around;
          }
        }
      }

      .edit {
        width: 20px;
        height: 20px;
        background: url('../assets/images/icon19.png');

        &.disabled {
          background: url('../assets/images/icon17.png');
        }
      }

      .delete{
        width: 20px;
        height: 20px;
        background: url('../assets/images/icon18.png');
        
        &.disabled{
          background: url('../assets/images/icon16.png');
        }
      }
    }
  }
}
</style>