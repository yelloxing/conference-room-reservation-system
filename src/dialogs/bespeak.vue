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
            <el-input
              type="text"
              placeholder="请输入使用日期"
              v-model="form.date"
              disabled
            />
          </el-form-item>
          <el-form-item
            label="使用日期："
            class="col-size-6 select-frame"
            v-else
            prop="date"
          >
            <el-input
              type="text"
              placeholder="请输入使用日期"
              v-model="form.date"
            />
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
              v-model="form.filename"
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
          <el-form-item
            class="col-size-6"
            style="color: #555555; text-align: left"
          >
            附件格式（zip压缩文件、Word文档）
          </el-form-item>
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
      file: "",
      flag: "",
      rules: {
        name: [
          { required: true, message: "请输入预定人姓名", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入预定人联系方式", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "请输入联系人联系方式", trigger: "blur" },
        ],
        subject: [
          { required: true, message: "请输入申请事由", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let data = this.$store.state.dialogs[0].data;
    this.$set(this.form, "meetingRoomName", data.meetingRoomName);
    this.$set(this.form, "meetingRoomList", data.meetingRoomList);
    this.$set(this.form, "departmentId", data.meetingRoomList[0].id);
    this.$set(this.form, "date", data.date);
    // this.form.departmentId = this.form.meetingRoomList[0].id
    this.flag = data.flag || "add";
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

    //重置表单
    reset() {
      this.$nextTick(() => {
        // this.form = {
        //   meetingRoomName: this.form.meetingRoomName,
        //   meetingRoomList: this.form.meetingRoomList,
        //   departmentId: this.form.meetingRoomList[0].id,
        //   date: this.form.date,
        // };

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
        this.form.date = this.form.date;

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
          if (this.flag == "add") {
            url = "/_apigateway/roombooking/api/v1/create.rst";
          } else {
            url = "/_apigateway/roombooking/api/v1/update.rst";
          }

          if (this.file) {
            //存在文件，先执行文件上传，再执行提交
            let ext = this.file.name
              .substr(this.file.name.lastIndexOf("."))
              .toLowerCase();
            if (ext != ".docx" && ext != ".doc" && ext != ".zip") {
              //文件格式需为word或者zip
              alert("请上传word文档或者zip压缩文件");
              return;
            }

            let param = new FormData(); //创建form对象
            param.append("file", this.file); //通过append向form对象添加数据

            let config = {
              headers: { "Content-Type": "multipart/form-data" },
            }; //添加请求头

            this.$axios.post("/_fileup", param, config).then((res) => {
              if (res.data.result) {
                let params = {
                  domainId: 2,
                  productId: 12,
                  departmentId: this.form.departmentId,
                  beginTime: this.form.beginTime,
                  endTime: this.form.endTime,
                  name: this.form.name,
                  phone: this.form.phone,
                  contact: this.form.contact,
                  contactPhone: this.form.contactPhone,
                  attendLeaders: this.form.attendLeaders,
                  attendUsers: this.form.attendUsers,
                  resourceId: this.form.meetingRoomId,
                  subject: this.form.subject,
                  remark: this.form.remark,
                  status: save ? "0" : "-1",
                  fileKey: res.data.result.data[0].fileKey,
                };
                this.$axios.post(url, params).then((res) => {
                  if (res.data && res.data.resultCode == 0) {
                    _this.$store.state.closeDialog();
                  }
                });
              }
            });
          } else {
            let params = {
              domainId: 2,
              projectId: 12,
              departmentId: this.form.departmentId,
              beginTime: this.form.beginTime,
              endTime: this.form.endTime,
              name: this.form.name,
              phone: this.form.phone,
              contact: this.form.contact,
              contactPhone: this.form.contactPhone,
              attendLeaders: this.form.attendLeaders,
              attendUsers: this.form.attendUsers,
              resourceId: this.form.meetingRoomId,
              subject: this.form.subject,
              status: save ? "0" : "-1",
              remark: this.form.remark,
            };
            this.$axios.post(url, params).then((res) => {
              if (res.data.resultCode == 0) {
                _this.$store.state.closeDialog();
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
}
</style>