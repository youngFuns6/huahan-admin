<template>
  <div class="app-container">
    <el-card>
      <el-form
        label-position="right"
        label-width="100px"
        :model="form"
        :rules="rules"
        ref="ref"
        class="demo-ruleForm"
      >
        <el-form-item label="网站标题" prop="webTitle">
          <el-input v-model="form.webTitle"></el-input>
        </el-form-item>
        <el-form-item label="网站关键字" prop="webKeyWords">
          <el-input type="textarea" v-model="form.webKeyWords"></el-input>
        </el-form-item>
        <el-form-item label="网站描述" prop="webDesc">
          <el-input type="textarea" v-model="form.webDesc"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.phone" placeholder="多个手机号之间请用‘/’隔开"></el-input>
        </el-form-item>
        <el-form-item label="短信">
          <el-input v-model="form.message"></el-input>
        </el-form-item>
        <el-form-item label="微信二维码">
          <el-upload
            :action="BASE_API"
            class="upload-demo"
            drag
            auto-upload
            :on-success="handlesuccessQr"
            :before-upload="beforeUpload"
            :on-remove="handleRemoveQr"
            :on-error="uploadError"
            :limit="1"
            :file-list="fileCompListQr"
            list-type="picture"
            :headers="{ Authorization: token }"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽上传或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                上传二维码只能是 jpg、png、jpeg 格式! 且不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="form.fax"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="form.emailNum"></el-input>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="公司展示大图">
          <el-upload
            :action="BASE_API"
            class="upload-demo"
            drag
            auto-upload
            :on-success="handlesuccess"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-error="uploadError"
            :on-preview="preview"
            :limit="1"
            :file-list="fileCompList"
            list-type="picture"
            :headers="{ Authorization: token }"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽上传或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                上传图片只能是 jpg、png、jpeg 格式! 且不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="useEditWebInfo">确定</el-button>
        </div>
        <!-- 大图展示 -->
        <el-dialog title="查看" :visible.sync="dialogVisible" width="60%">
          <span>
            <el-image
              style="width: 100%; height: 100%"
              :src="form.compImg"
            ></el-image>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- <el-form-item label="荣誉展示图片">
          <el-upload
            class="upload-demo"
            :action="BASE_API"
            :on-remove="honorRemove"
            :before-upload="beforeHonor"
            :on-error="uploadError"
            multiple
            :limit="3"
             :file-list="fileHonorList"
            :headers="{ Authorization: token }"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              上传头像图片只能是 jpg、png、jpeg 格式! 且不超过500kb
            </div>
          </el-upload>
        </el-form-item> -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getWebInfo, editWebInfo } from "@/api/webInfo";

export default {
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API + "/upload",
      token: getToken("token"),
      form: {
        compImg: "",
        qrCode: ''
      },
      rules: {
        webTitle: [{ required: true, message: "必填项", trigger: "blur" }],
        webKeyWords: [{ required: true, message: "必填项", trigger: "blur" }],
        webDesc: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      fileCompList: [],
      fileCompListQr: [],
      // fileHonorList: [],
      dialogVisible: false,
    };
  },
  created() {
    this.useGetWebInfo();
  },
  methods: {
    async useGetWebInfo() {
      const res = await getWebInfo();
      this.form = res.data;
      this.fileCompList = [{ name: "展示大图", url: res.data.compImg }];
      this.fileCompListQr = [{ name: "微信二维码", url: res.data.qrCode }];
    },

    beforeUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isGif = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isPNG && !isJPEG && !isJPG && !isGif) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg、gif 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
        return false;
      }
    },
    async handleRemove() {
      this.form.compImg = "";
    },
    handlesuccess(response) {
      // console.log(response)
      this.form.compImg = response.data;
      //   console.log(file)
    },
    uploadError() {
      
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true,
      });
    },

    async handleRemoveQr() {
      this.form.qrCode = "";
    },
    handlesuccessQr(response) {
      // console.log(response)
      this.form.qrCode = response.data;
      //   console.log(file)
    },

    useEditWebInfo() {
      this.$refs.ref.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必填项");
        const res = await editWebInfo(this.form);
        if (res.code !== 200) return this.$message.error("更改失败");
        this.$message.success("更改成功");
        this.useGetWebInfo();
      });
    },
    preview() {
      this.dialogVisible = true;
    },

    // honorRemove() {
    //   this.form.honorImg = "";
    // },
    // beforeHonor(file) {
    //   const isPNG = file.type === "image/png";
    //   const isJPEG = file.type === "image/jpeg";
    //   const isJPG = file.type === "image/jpg";
    //   const isGif = file.type === "image/gif";
    //   const isLt2M = file.size / 1024 / 1024 < 0.5;
    //   if (!isPNG && !isJPEG && !isJPG && !isGif) {
    //     this.$message.error("上传头像图片只能是 jpg、png、jpeg、gif 格式!");
    //     return false;
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 500 kB!");
    //     return false;
    //   }
    // },
  },
};
</script>


<style lang='scss' scoped>
.btn {
  text-align: center;
  margin: 20px 0;
}
</style>
