<template>
  <div class="bespeak-view">
    <h2>
      会议室预约
      <div class="close" @click="$store.state.closeDialog()"></div>
    </h2>
    <form name="form">
      <div class="container">
        <div class="row">
          <div class="col-size-12">
            <label> 会议室名称：</label>
            <span> {{params.meetingRoomName}} </span>
          </div>
          <div class="col-size-6">
            <label> 申请单位：</label>
            <!-- <input type="text" placeholder="请输入申请单位" /> -->
            <select v-model="params.departmentId">
              <option v-for="option in params.meetingRoomList" :key="option.id" :value="option.id">
                {{option.name}}
              </option>
            </select>
          </div>
          <div class="col-size-6 select-frame">
            <label>使用日期：</label>
            <input type="text" placeholder="请输入使用日期" v-model="params.date" disabled/>
          </div>
          <div class="col-size-6">
            <label> 预订人：</label>
            <input type="text" placeholder="请输入预订人姓名" v-model="params.name" required/>
          </div>
          <div class="col-size-6">
            <label> 联系方式：</label>
            <input type="text" placeholder="请输入预订人联系方式" v-model="params.phone" required/>
          </div>
          <div class="col-size-6">
            <label> 联系人：</label>
            <input type="text" placeholder="请输入联系人姓名" v-model="params.contact" required/>
          </div>
          <div class="col-size-6">
            <label> 联系方式：</label>
            <input type="text" placeholder="请输入联系人联系方式" v-model="params.contactPhone" required/>
          </div>
          <div class="col-size-6">
            <label> 出席领导：</label>
            <input type="text" placeholder="请输入出席领导姓名" v-model="params.attendLeaders"/>
          </div>
          <div class="col-size-6">
            <label> 出席人数：</label>
            <input type="text" placeholder="请输入出席人数" v-model="params.attendUsers"/>
          </div>
          <div class="col-size-12">
            <label> 申请事由：</label>
            <input type="text" placeholder="请输入申请事由" v-model="params.subject" required/>
          </div>
          <div class="col-size-6" style="position:relative">
            <label> 添加附件：</label>
            <input type="text" placeholder="请选择添加的附件" class="file" v-model="filename">
            <input type="file" placeholder="请选择添加的附件" id="file" @change="getFile($event)"/>
          </div>
          <div class="col-size-6" style="color: #555555">
            附件格式（zip压缩文件、Word文档）
          </div>
          <div class="col-size-12">
            <label style="vertical-align:top;"> 备注：</label>
            <textarea placeholder="请输入备注" v-model="params.remark"/>
          </div>
        </div>
      </div>
      <div class="btn-list">
        <button @click="commit('save')">保存</button>
        <button @click="reset">重置</button>
        <button type="submit" @click="commit">确认预约</button>
      </div>
    </form>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data(){
    return {
      params:{},
      file:'',
      filename:'',
      flag:''
    }
  },
  created(){
    this.params = this.$store.state.dialogs[0].data
    this.params.departmentId = this.params.meetingRoomList[0].id
    this.flag = this.params.flag || 'add'
  },
  methods:{
    //文件上传
    getFile(){
      this.file = event.target.files[0];
      this.filename = this.file.name
    },

    //重置表单
    reset(){
      this.$nextTick(()=>{
        this.params = {
          "meetingRoomName":this.params.meetingRoomName,
          "meetingRoomList":this.params.meetingRoomList,
          "departmentId":this.params.meetingRoomList[0].id,
          "date":this.params.date
        }
        this.filename = ''
        this.file = ''
      })
    },

    //提交表单   存在save则为保存，不存在save则为提交
    commit(save){
      let _this = this

      let url;
      if(this.flag == 'add'){
        url = '/_apigateway/roombooking/api/v1/create.rst'
      }else{
        url = '/_apigateway/roombooking/api/v1/update.rst'
      }

      if(this.file){  //存在文件，先执行文件上传，再执行提交
        let ext = this.file.name.substr(this.file.name.lastIndexOf(".")).toLowerCase();
        if(ext != '.docx' && ext != '.doc' && ext != '.zip'){  //文件格式需为word或者zip
          alert('请上传word文档或者zip压缩文件')
          return
        }

        let param = new FormData(); //创建form对象
        param.append('file',this.file);//通过append向form对象添加数据

        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        }; //添加请求头
        
        this.$axios.post('/_fileup',param,config).then(res=>{
          if(res.data.result){
            let params = {
              domainId:2,
              productId:12,
              departmentId:this.params.departmentId,
              beginTime:this.params.beginTime,
              endTime:this.params.endTime,
              name:this.params.name,
              phone:this.params.phone,
              contact:this.params.contact,
              contactPhone:this.params.contactPhone,
              attendLeaders:this.params.attendLeaders,
              attendUsers:this.params.attendUsers,
              resourceId:this.params.meetingRoomId,
              subject:this.params.subject,
              remark:this.params.remark,
              status:save ? '0' : '-1',
              fileKey:res.data.result.data[0].fileKey
            }
            this.$axios.post(url,params).then(res => {
              if(res.data && res.data.resultCode == 0){
                _this.$store.state.closeDialog()
              }
            })
          }
        })
      }else{
        let params = {
            domainId:2,
            projectId:12,
            departmentId:this.params.departmentId,
            beginTime:this.params.beginTime,
            endTime:this.params.endTime,
            name:this.params.name,
            phone:this.params.phone,
            contact:this.params.contact,
            contactPhone:this.params.contactPhone,
            attendLeaders:this.params.attendLeaders,
            attendUsers:this.params.attendUsers,
            resourceId:this.params.meetingRoomId,
            subject:this.params.subject,
            status:save ? '0' : '-1',
            remark:this.params.remark
        }
        this.$axios.post(url,params).then(res => {
          if(res.data.resultCode == 0){
            _this.$store.state.closeDialog()
          }
        })
      }
    }
  }
};
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
  & .container {
    font-size: 0.14rem;
    & > .row {
      & > div {
        padding-left: 0.4rem;
        margin: 0.05rem 0;
        & > * {
          vertical-align: sub;
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
        & > select {
          width: 2.8rem;
          height: 2em;
          border-color: #b2b2bd;
          border-radius: 4px;
        }

        #file{
          position: absolute;
          right: 25px;
          opacity: 0;
        }

        .file{
          border: 1px dashed #aaa;
          background: url('../assets/images/file.png') right center no-repeat;
          background-position: 2.5rem center;
          background-size: 14px;
        }
      
      }
    }
  }
  & .btn-list {
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