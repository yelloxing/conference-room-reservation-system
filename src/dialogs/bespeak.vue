<template>
  <div class="bespeak-view">
    <h2>
      会议室预约
      <div class="close" @click="$store.state.closeDialog()"></div>
    </h2>
    <el-form ref="form" :model="form" :rules="rules">
      <div class="container">
        <div class="row">
          <el-form-item label="会议室名称：" class="col-size-12">
            <span> {{ form.meetingRoomName }} </span>
          </el-form-item>
          <el-form-item
            label="申请单位："
            class="col-size-6"
            prop="departmentId"
          >
            <!-- <input type="text" placeholder="请输入申请单位" /> -->
            <el-select v-model="form.departmentId">
              <el-option
                v-for="option in form.meetingRoomList"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="使用日期："
            class="col-size-6 select-frame"
            v-if="flag == 'add'"
            prop="date"
          >
            <!-- <label>使用日期：</label> -->
            <el-input type="text" placeholder="请输入使用日期" v-model="form.date" disabled/>
          </el-form-item>
          <el-form-item  label="使用日期：" class="col-size-6 select-frame" v-else prop="date">
            <el-date-picker
              v-model="form.date"
              class="date-picker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="预定人：" class="col-size-6" prop="name">
            <el-input
              id="ydr"
              type="text"
              placeholder="请输入预订人姓名"
              v-model="form.name"
            />
          </el-form-item>
          <el-form-item label="联系方式：" class="col-size-6" prop="phone">
            <el-input
              type="text"
              placeholder="请输入预订人联系方式"
              v-model="form.phone"
            />
          </el-form-item>
          <el-form-item label="联系人：" class="col-size-6" prop="contact">
            <el-input
              type="text"
              placeholder="请输入联系人姓名"
              v-model="form.contact"
            />
          </el-form-item>
          <el-form-item
            label="联系方式："
            class="col-size-6"
            prop="contactPhone"
          >
            <el-input
              type="text"
              placeholder="请输入联系人联系方式"
              v-model="form.contactPhone"
            />
          </el-form-item>
          <el-form-item
            label="出席领导："
            class="col-size-6"
            prop="attendLeaders"
          >
            <el-input
              type="text"
              placeholder="请输入出席领导姓名"
              v-model="form.attendLeaders"
            />
          </el-form-item>
          <el-form-item
            label="出席人数："
            class="col-size-6"
            prop="attendUsers"
          >
            <el-input
              type="text"
              placeholder="请输入出席人数"
              v-model="form.attendUsers"
            />
          </el-form-item>
          <el-form-item label="申请事由：" class="col-size-12" prop="subject">
            <el-input
              type="text"
              placeholder="请输入申请事由"
              v-model="form.subject"
            />
          </el-form-item>
          <el-form-item
            label="添加附件："
            class="col-size-6"
            style="position: relative"
          >
            <el-input
              type="text"
              placeholder="请选择添加的附件"
              class="file"
              readonly
            />
            <input
              type="file"
              placeholder="请选择添加的附件"
              class="file-item"
              ref="clearFile"
              @change="getFile($event)"
            />
            
          </el-form-item>
          <div class="col-size-6 file-tip">
              附件格式（zip压缩文件、Word文档）
              <span>{{form.filename}}</span>
              <img src="../assets/images/icon18.png" v-if="form.filename" @click="deleteFile"/> 
          </div>
          
          <el-form-item label="备注：" class="col-size-12" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              v-model="form.remark"
            />
          </el-form-item>
        </div>
      </div>
      <div class="btn-list">
        <button @click.prevent="commit('form', 'save')">保存</button>
        <button @click.prevent="reset">重置</button>
        <button @click.prevent="commit('form')">确认预约</button>
      </div>
    </el-form>
  </div>
</template>
<script>
import qs from "qs";
import {dateDiff} from '../services/dateUtil'
export default {
  data() {
    return {
      form: {
        departmentId: "",
        date: "",
        name: "",
        phone: "",
        contact: "",
        contactPhone: "",
        attendLeaders: "",
        attendUsers: "",
        subject: "",
        remark: "",
        filename: "",
      },
      file:'',
      flag:'',
      rules:{
        name:[{required:true,message:'请输入预定人姓名',trigger:'blur'}],
        date:[{required:true,message:'请选择使用日期',trigger:'change'}],
        phone:[{required:true,message:'请输入预定人联系方式',trigger:'blur'}],
        contact:[{required:true,message:'请输入联系人姓名',trigger:'blur'}],
        contactPhone:[{required:true,message:'请输入联系人联系方式',trigger:'blur'}],
        subject:[{required:true,message:'请输入申请事由',trigger:'blur'}],
      }
    }
  },
  created(){
    let data = this.$store.state.dialogs[0].data
    this.$set(this.form,'meetingRoomName',data.meetingRoomName)
    this.$set(this.form,'meetingRoomList',data.meetingRoomList)
    this.$set(this.form,'departmentId',data.meetingRoomList[0].id)
    this.$set(this.form,'name',data.name)
    this.$set(this.form,'phone',data.phone)
    this.$set(this.form,'contact',data.contact)
    this.$set(this.form,'contactPhone',data.contactPhone)
    this.$set(this.form,'attendLeaders',data.attendLeaders)
    this.$set(this.form,'attendUsers',data.attendUsers)
    this.$set(this.form,'subject',data.subject)
    this.$set(this.form,'remark',data.remark)

    this.flag = data.flag || 'add'
    if(this.flag == 'add'){
      this.$set(this.form,'date',data.date)
      this.$set(this.form,'beginTime',data.beginTime)
      this.$set(this.form,'endTime',data.endTime)
      this.$set(this.form,'resourceId',data.meetingRoomId)
    }else{
      this.$set(this.form,'date',[data.beginTime,data.endTime])
      this.$set(this.form,'recordId',data.recordId)
      this.$set(this.form,'fileKey',data.fileKey)
      this.$set(this.form,'fileName',data.fileName)
      this.$set(this.form,'resourceId',data.resourceId)
      this.$set(this.form,'maxPreTime',data.maxPreTime)
      this.$set(this.form,'maxStopTime',data.maxStopTime)
      this.$set(this.form,'maxUseTime',data.maxUseTime)
    }
    
  },
  methods: {
    trigger(dom, eventType) {
      //创建event的对象实例。
      if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        dom.fireEvent("on" + eventType, document.createEventObject());
      }

      // 其他标准浏览器使用dispatchEvent方法
      else {
        let _event = document.createEvent("HTMLEvents");
        // 3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为
        _event.initEvent(eventType, true, false);
        dom.dispatchEvent(_event);
      }
    },
    //文件上传
    getFile(event) {
      this.file = event.target.files[0];

      this.$nextTick(() => {
        this.form.filename = this.file.name;
      });
    },

    //删除文件
    deleteFile(){
      this.form.filename = "";
      this.file = "";
      this.$refs.clearFile.value = "";
    },
    //重置表单
    reset() {
      this.$nextTick(() => {
        this.form.name = "";
        this.form.phone = "";
        this.form.contact = "";
        this.form.contactPhone = "";
        this.form.attendLeaders = "";
        this.form.attendUsers = "";
        this.form.subject = "";
        this.form.remark = "";
        this.form.filename = "";

        this.form.meetingRoomName = this.form.meetingRoomName;
        this.form.meetingRoomList = this.form.meetingRoomList;
        this.form.departmentId = this.form.meetingRoomList[0].id;
        let data = this.$store.state.dialogs[0].data
        if(this.flag == 'add'){
          this.form.date = data.date
          this.form.beginTime = data.beginTime
          this.form.endTime = data.endTime
        }else{
          this.form.date = data.date = [data.beginTime,data.endTime]
        }
        this.filename = "";
        this.file = "";
        this.$refs.clearFile.value = "";
      });
    },

    //提交表单   存在save则为保存，不存在save则为提交
    commit(form, save) {
      let _this = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          let url;
          if(_this.flag == 'add'){
            url = this.$axios_baseUrl+'_apigateway/roombooking/api/v1/create.rst'
          }else{
            url = this.$axios_baseUrl+'_apigateway/roombooking/api/v1/update.rst'
            let daysBetween =  dateDiff(new Date(),this.form.date[0])
            let timesBetween =  dateDiff(new Date(),this.form.date[0],true)
            let between = dateDiff(this.form.date[0],this.form.date[1],true)

            if(timesBetween < 0){
              this.$store.state.dialogVisible = true; //错误弹框
              this.$store.state.message='请选择当前时间之后的时间进行预约'; //错误信息
              return
            }

            if( this.form.maxUseTime && this.form.maxUseTime != 0 && between > this.form.maxUseTime){
              this.$store.state.dialogVisible = true; //错误弹框
              this.$store.state.message='预约时间段大于该资源最大预约时长:'+this.form.maxUseTime + '小时'; //错误信息
              return
            }

            if(this.form.maxPreTime && this.form.maxPreTime != 0 && daysBetween > this.form.maxPreTime){
              this.$store.state.dialogVisible = true; //错误弹框
              this.$store.state.message='预约时间大于该资源最大预约天数:'+this.form.maxPreTime + '天';//错误信息
              return
            }

            if( this.form.maxStopTime && this.form.maxStopTime != 0 && timesBetween < item.maxStopTime){
              this.$store.state.dialogVisible = true; //错误弹框
              this.$store.state.message='当前时间已过最大停止预约时间:'+this.form.maxStopTime + '小时'; //错误信息
              return
            }

          }

          if(_this.file){  //存在文件，先执行文件上传，再执行提交
            let ext = _this.file.name.substr(_this.file.name.lastIndexOf(".")).toLowerCase();
            if(ext != '.docx' && ext != '.doc' && ext != '.zip'){  //文件格式需为word或者zip
              alert('请上传word文档或者zip压缩文件')
              return
            }

            let param = new FormData(); //创建form对象
            param.append('file',_this.file);//通过append向form对象添加数据

            let config = {
              headers: { "Content-Type": "multipart/form-data" },
            }; //添加请求头
            
            _this.$axios.post(this.$axios_baseUrl+'_fileup',param,config).then(res=>{
              if(res.data.result){
                let params = {
                  domainId:2,
                  projectId:12,
                  departmentId:_this.form.departmentId,
                  beginTime:_this.flag == 'add' ? _this.form.beginTime : _this.form.date[0],
                  endTime:_this.flag == 'add' ? _this.form.endTime : _this.form.date[1],
                  name:_this.form.name,
                  phone:_this.form.phone,
                  contact:_this.form.contact,
                  contactPhone:_this.form.contactPhone,
                  attendLeaders:_this.form.attendLeaders,
                  attendUsers:_this.form.attendUsers,
                  resourceId:_this.flag == 'add' ? _this.form.meetingRoomId : _this.form.resourceId,
                  id:_this.form.recordId,
                  subject:_this.form.subject,
                  remark:_this.form.remark,
                  status:save ? '-1' : '0',
                  fileKey:res.data.result.data[0].fileKey,
                  fileName:res.data.result.data[0].fileName,
                }
                _this.$axios.post(url,params).then(res => {
                  if(res.data && res.data.resultCode == 0){
                    _this.$store.state.closeDialog()
                  }
                });
              }
            });
          } else {
            let params = {
                domainId:2,
                projectId:12,
                departmentId:_this.form.departmentId,
                beginTime:_this.flag == 'add' ? _this.form.beginTime : _this.form.date[0],
                endTime:_this.flag == 'add' ? _this.form.endTime : _this.form.date[1],
                name:_this.form.name,
                phone:_this.form.phone,
                contact:_this.form.contact,
                contactPhone:_this.form.contactPhone,
                attendLeaders:_this.form.attendLeaders,
                attendUsers:_this.form.attendUsers,
                resourceId: _this.form.resourceId,
                id:_this.form.recordId,
                subject:_this.form.subject,
                status:save ? '-1' : '0',
                remark:_this.form.remark,
                fileKey:_this.flag == 'add' ? '' : _this.form.fileKey,
                fileName:_this.flag == 'add' ? '' : _this.form.fileName
            }
            _this.$axios.post(url,params).then(res => {
              if(res.data.resultCode == 0){
                _this.$store.state.closeDialog()
              }
            });
          }
        }
      });
    },
  },
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
    border-bottom: 1px solid #e0e0e0;
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
        margin: 0.1rem 0;
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

        .file {
          background: url("../assets/images/file.png") right center no-repeat;
          background-position: 2.5rem center;
          background-size: 14px;
        }

        &.file-tip{
          color: #aaa;
          margin-left: -40px;
          margin-top: 18px;
          padding: 0;
          font-size:12px ;

          span{
            font-size: 14px;
            color: #555;
            vertical-align: text-top;
          }
          img{
            cursor: pointer;
          }
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

  /deep/.el-select {
    width: 100%;
  }

  /deep/.el-form-item__label {
    width: 100px;
  }
  /deep/.el-form-item__content {
    margin-left: 100px;
    margin-right: 60px;

    & .file-item {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      height: 100%;
    }
  }
  .date-picker{
    width: 100%;
    
    /deep/.el-range-separator{
      width: 10%;
    }
  }
}
</style>





{
  attendLeaders: ""
  attendUsers: ""
  beginTime: "2020-12-30 14:00"
  contact: "测试12331"
  contactPhone: "18822223333"
  departmentId: 12
  domainId: 2
  endTime: "2020-12-30 15:00"
  fileKey: "fe98f33f-33fb-4a5c-a194-af48c5b1facb"
  id: 43
  name: "测试123"
  phone: "17711112222"
  productId: 12
  remark: ""
  resourceId: 8
  status: "-1"
  subject: "开会"
}