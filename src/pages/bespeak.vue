<template>
  <div class="bespeak-view container select-frame">
    <h2>会议室预约</h2>
    <form name="bespeakform" autocomplete="off" novalidate>
      <div>
        <label>会议室名称：</label>
        <span>{{ form.meetingRoomName }}</span>
      </div>
      <div>
        <label>使用日期：</label>
        <input
          type="text"
          v-input-check="[form.date, 'required']"
          placeholder="请选择使用日期"
          v-model="form.date"
          v-calendar2
          @input="changeDate"
        />
      </div>
      <div>
        <label>申请单位：</label>
        <!-- <input type="text" placeholder="请输入申请单位" /> -->
        <select v-model="form.departmentId">
          <option
            v-for="(row, index) in form.departments"
            :key="index"
            :value="row.id"
          >
            {{ row.name }}
          </option>
        </select>
      </div>
      <div>
        <label>预订人：</label>
        <input
          type="text"
          v-input-check="[form.name, 'required']"
          placeholder="请输入预订人姓名"
          v-model="form.name"
        />
      </div>
      <div>
        <label>联系方式：</label>
        <input
          type="text"
          placeholder="请输入预订人联系方式"
          v-input-check="[form.phone, 'required']"
          v-model="form.phone"
        />
      </div>
      <div>
        <label>联系人：</label>
        <input
          type="text"
          placeholder="请输入联系人姓名"
          v-input-check="[form.contact, 'required']"
          v-model="form.contact"
        />
      </div>
      <div>
        <label>联系方式：</label>
        <input
          type="text"
          placeholder="请输入联系人联系方式"
          v-input-check="[form.contactPhone, 'required']"
          v-model="form.contactPhone"
        />
      </div>
      <div>
        <label>出席领导：</label>
        <input
          type="text"
          placeholder="请输入出席领导姓名"
          v-model="form.addendLeaders"
        />
      </div>
      <div>
        <label>出席人数：</label>
        <input
          type="text"
          placeholder="请输入出席人数"
          v-model="form.attendUsers"
        />
      </div>
      <div>
        <label>当前事由：</label>
        <textarea
          placeholder="请输入申请事由"
          v-model="form.subject"
          v-input-check="[form.subject, 'required']"
        ></textarea>
      </div>
      <div>
        <label>添加附件：</label>
        <input
          type="file"
          placeholder="请选择添加的文件"
          ref="clearFile"
          id="fileid"
          @change="getFile($event)"
        />
        <label for="fileid" class="file-btn add" v-if="!form.filename"
          >请选择添加的文件</label
        >
        <label
          @click="deleteFile"
          class="file-btn delete"
          v-if="form.filename"
          >{{ form.filename }}</label
        >
      </div>
      <div>
        <label>&nbsp;</label>
        <span style="color: gray">附件格式（zip压缩文件、Word文档）</span>
      </div>
      <div>
        <label>备注：</label>
        <input type="text" placeholder="请输入备注" v-model="form.remark" />
      </div>
      <div class="btn-list row">
        <div class="col-size-4">
          <button @click.prevent="commit('form', '-1')">保存</button>
        </div>
        <div class="col-size-4">
          <button @click.prevent="reset">重置</button>
        </div>
        <div class="col-size-4">
          <button @click.prevent="commit('form','0')" v-if="form.auditStatus != 0">确认预约</button>
          <button @click.prevent="commit('form','1')" v-if="form.auditStatus == 0">确认预约</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { dateBetween } from '../services/dateUtil';
export default {
  data() {
    return {
      form: {
        meetingRoomName:"",
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
      fullTime: "",
      file: "",
    };
  },
  created() {
    this.startupParams();
  },
  methods: {
    //获取路由传参
    startupParams() {
      // this.form = this.$route.params;
      console.log(this.$route.params);
      this.form.departments = this.$route.params.departments;
      this.form.meetingRoomName = this.$route.params.meetingRoomName;
      this.form.departmentId = this.$route.params.departments.length > 0 ? this.$route.params.departments[0].id : '';
      this.form.meetingRoomId = this.$route.params.meetingRoomId;
      this.form.date = this.$route.params.date;
      this.form.beginTime = this.form.date.split(' ')[0] + ' ' + this.form.date.split(' ')[1].split('-')[0]
      this.form.endTime = this.form.date.split(' ')[0] + ' ' + this.form.date.split(' ')[1].split('-')[1]
      
      this.form.name = this.$route.params.name;
      this.form.phone = this.$route.params.phone;
      this.form.contact = this.$route.params.contact;
      this.form.contactPhone = this.$route.params.contactPhone;
      this.form.attendLeaders = this.$route.params.attendLeaders;
      this.form.attendUsers = this.$route.params.attendUsers;
      this.form.subject = this.$route.params.subject;
      this.form.remark = this.$route.params.remark;
      this.form.filename = this.$route.params.filename;


      this.form.maxPreTime = this.$route.params.maxPreTime
      this.form.maxUseTime = this.$route.params.maxUseTime
      this.form.maxStopTime = this.$route.params.maxStopTime
      this.form.auditStatus = this.$route.params.auditStatus;
    },
    //日期切换
    changeDate() {  

      let date = this.form.date.split(' ')[0]
      let beginTime = date + ' ' +  this.form.date.split(' ')[1].split('-')[0]
      let endTime = date + ' ' +  this.form.date.split(' ')[1].split('-')[1]

      let daysBetween =  dateBetween(new Date(),beginTime)   //当前预约的点与现在的差值天数
      let timesBetween =  dateBetween(new Date(),beginTime,true) //当前预约的点与现在的差值小时数
      let betweens = dateBetween(beginTime,endTime,true) //预约时长
      if(timesBetween < 0){
        this.$store.state.openDialog('alert',{
          errorMsg:'请选择当前时间之后的时间进行预约'
        })
         this.form.date = this.form.beginTime + '-' + this.form.endTime.split(' ')[1].split('-')[1]
      }

      if(betweens <= 0){
        this.$store.state.openDialog('alert',{
          errorMsg:'结束时间需大于开始时间'
        })
         this.form.date = this.form.beginTime + '-' + this.form.endTime.split(' ')[1]
         return
      }


      if(this.form.maxPreTime && this.form.maxPreTime != 0 && daysBetween > this.form.maxPreTime){  //选定的天数差 大于 最大预约天数
          this.$store.state.openDialog('alert',{
          errorMsg:'预约时间大于该资源最大预约天数:'+this.form.maxPreTime + '天'
        })
        this.form.date = this.form.beginTime + '-' + this.form.endTime.split(' ')[1]
        return
      }

      if(this.form.maxStopTime && this.form.maxStopTime != 0 && timesBetween < this.form.maxStopTime){ //选定的小时差 小于 最大停止预约时间 
        this.$store.state.openDialog('alert',{
          errorMsg:'当前时间已过最大停止预约时间:'+this.form.maxStopTime + '小时'
        })
       this.form.date = this.form.beginTime + '-' + this.form.endTime.split(' ')[1]
        return
      }

      if(this.form.maxUseTime && this.form.maxUseTime != 0 && betweens > this.form.maxUseTime){ 
        this.$store.state.openDialog('alert',{
          errorMsg:'预约时间段大于该资源最大预约时长:'+this.form.maxUseTime + '小时'
        })
        this.form.date = this.form.beginTime + '-' + this.form.endTime.split(' ')[1]
        return
      }
      

      this.form.beginTime = this.form.date.split(' ')[0] + ' ' + this.form.date.split(' ')[1].split('-')[0]

      this.form.endTime = this.form.date.split(' ')[0] + ' ' + this.form.date.split(' ')[1].split('-')[1]


      console.log(this.form.date);
    },
    //文件上传
    getFile(event) {
      this.file = event.target.files[0];
      this.form.filename = this.file.name;
    },
    //删除文件
    deleteFile() {
      this.form.filename = "";
      this.file = "";
      this.$refs.clearFile.value = "";
    },
    reset() {
      this.startupParams();
      this.filename = "";
      this.file = "";
    },
    commit(form, status) {
      let ERROR = this.$error("bespeakform");
      let _this = this;
      // 如果表单不合法
      if (!ERROR.isValiadte()) {
        let first = ERROR.first();
        this.$store.state.openDialog("alert", {
          errorMsg: first.$error,
        });
        first.$el.focus();
        return;
      }

      let dateArray1 = _this.form.date.split(" ");
      let dateArray2 = dateArray1[1].split("-");

      if (_this.file) {
        //存在文件，先执行文件上传，再执行提交
        let ext = _this.file.name
          .substr(_this.file.name.lastIndexOf("."))
          .toLowerCase();
        if (ext != ".docx" && ext != ".doc" && ext != ".zip") {
          //文件格式需为word或者zip
          this.$store.state.openDialog("alert",{
            errorMsg:"请上传word文档或者zip压缩文件"
          });
          return;
        }
        let param = new FormData(); //创建form对象
        param.append("file", _this.file); //通过append向form对象添加数据
        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        }; //添加请求头

        _this.$axios.post(this.$axios_baseUrl + "_fileup", param, config).then((res) => {
          if (res.data.result) {
            let params = {
              domainId: 2,
              projectId: 12,
              departmentId: _this.form.departmentId,
              beginTime: dateArray1[0] + " " + dateArray2[0],
              endTime: dateArray1[0] + " " + dateArray2[1],
              name: _this.form.name,
              phone: _this.form.phone,
              contact: _this.form.contact,
              contactPhone: _this.form.contactPhone,
              attendLeaders: _this.form.attendLeaders,
              attendUsers: _this.form.attendUsers,
              resourceId: _this.form.meetingRoomId,
              id: _this.form.recordId,
              subject: _this.form.subject,
              remark: _this.form.remark,
              status: status,
              fileKey: res.data.result.data[0].fileKey,
              fileName: res.data.result.data[0].fileName,
            };
            _this.$axios.post(this.$axios_baseUrl + "_apigateway/roombooking/api/v1/create.rst", params).then(res => {
                if (res.data && res.data.resultCode == 0) {
                  _this.$store.state.commitFlag = true;
                  if(_this.form.auditStatus == 0){
                    _this.$store.state.openDialog('alert',{
                      errorMsg:'预约成功'
                    },()=>{
                      _this.$router.push("home");
                    })
                  }else{
                    _this.$store.state.openDialog('alert',{
                      errorMsg:'预约信息已提交，待审核'
                    },()=>{
                      _this.$router.push("home");
                    })
                  }
                }
              });
          }
        });
      } else {
        let params = {
          domainId: 2,
          projectId: 12,
          departmentId: _this.form.departmentId, //
          beginTime: dateArray1[0] + " " + dateArray2[0],
          endTime: dateArray1[0] + " " + dateArray2[1],
          name: _this.form.name,
          phone: _this.form.phone,
          contact: _this.form.contact,
          contactPhone: _this.form.contactPhone,
          attendLeaders: _this.form.attendLeaders,
          attendUsers: _this.form.attendUsers,
          resourceId: _this.form.meetingRoomId, //
          id: _this.form.recordId,
          subject: _this.form.subject,
          status: status,
          remark: _this.form.remark,
          fileKey: "",
          fileName: "",
        };
        _this.$axios
          .post(this.$axios_baseUrl + "_apigateway/roombooking/api/v1/create.rst", params)
          .then(res => {
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.$store.state.commitFlag = true;
              if(_this.form.auditStatus == 0){
                _this.$store.state.openDialog('alert',{
                  errorMsg:'预约成功'
                },()=>{
                  _this.$router.push("home");
                })
              }else{
                _this.$store.state.openDialog('alert',{
                  errorMsg:'预约信息已提交，待审核'
                },()=>{
                  _this.$router.push("home");
                })
              }
            }
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bespeak-view {
  background-color: #ffffff;
  border-radius: 0.03rem;
  position: relative;
  & > h2 {
    text-align: center;
    line-height: 4em;
    columns: #555555;
    border-bottom: 1px solid #b2b2bd;
  }
  & > form {
    & > div {
      margin-top: 0.2rem;
      &.required-red-star {
        &::before {
          content: "*";
          position: absolute;
          left: 12px;
          color: red;
        }
      }
      & > label {
        display: inline-block;
        width: 1.4rem;
        padding-left: 0.25rem;
        &.file-btn {
          color: gray;
          position: absolute;
          left: 145px;
          width: 4.8rem;
          background-color: white;
          line-height: 0.4rem;
          border: 1px dashed gray;
          border-radius: 0.05rem;
          padding-left: 0.05rem;
          font-size: 14px;
          background-position: 453px center;
          background-size: auto 50%;
          background-repeat: no-repeat;
          &.add {
            background-image: url("../assets/images/icon8.png");
          }
          &.delete {
            background-image: url("../assets/images/icon18.png");
          }
        }
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
        &.v-invalid {
          border: 1px solid red;
        }
      }
      & > select {
        width: 4.8rem;
        height: 3em;
        border-radius: 0.05rem;
        padding: 0 0.05rem;
        border: 1px solid #b2b2bd;
        background: #fff;
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