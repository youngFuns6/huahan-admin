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
        <el-form-item label="浮框电话号码">
          <el-input
            v-model="form.phone"
            placeholder="多个手机号之间请用‘/’隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="form.message"
            placeholder="例：李先生：18226939989/王女士：17788884545"
          ></el-input>
        </el-form-item>
        <el-form-item label="荣誉图片上传">
          <el-upload
            ref="honorRef"
            action=""
            class="upload-demo"
            :auto-upload="false"
            :on-change="handleChangeHonor"
            :on-remove="handleRemoveHonor"
            :on-error="uploadError"
            :file-list="fileCompListHonorr"
            :http-request="imgRequest"
            :on-exceed="exceedHandle"
            :limit="20"
            multiple
            :headers="{
              Authorization: token,
              ContentType: 'multipart/form-data',
            }"
          >
            <el-button size="small" type="primary">选取文件</el-button>

            <div slot="tip" class="el-upload__tip">
              只能上传jpg、png、jpeg文件，且不超过512kb 可多图片上传
              一次最大上传20张图片
            </div>
          </el-upload>
          <el-button size="small" type="success" @click="submitUpload"
            >上传到服务器</el-button
          >
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
import { uploadHonorImages } from "@/api/upload";
import _ from "lodash";

export default {
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API + "/upload",
      token: getToken("token"),
      form: {
        compImg: "",
        qrCode: "",
        honorImgs: [],
      },
      rules: {
        webTitle: [{ required: true, message: "必填项", trigger: "blur" }],
        webKeyWords: [{ required: true, message: "必填项", trigger: "blur" }],
        webDesc: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      fileCompList: [],
      fileCompListQr: [],
      fileCompListHonorr: [],
      imgFileList: new FormData(),
      arr: [],
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
      this.fileCompList = res.data.compImg
        ? [{ name: "展示大图", url: res.data.compImg }]
        : [];
      this.fileCompListQr = res.data.qrCode
        ? [{ name: "微信二维码", url: res.data.qrCode }]
        : [];
      if (res.data.honorImgs.length) {
        this.fileCompListHonorr = res.data.honorImgs
          .split(",")
          .map((item, index) => {
            return {
              name: index + 1,
              url: item,
            };
          });
      }
    },

    beforeUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isGif = file.type === "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isPNG && !isJPEG && !isJPG && !isGif) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg、gif 格式!");
        return false;
      }
      if (!isLt5M) {
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

    handleRemoveQr() {
      this.form.qrCode = "";
    },
    handlesuccessQr(response) {
      // console.log(response)
      this.form.qrCode = response.data;
      //   console.log(file)
    },
    handlesuccessHonor(res) {},
    handleRemoveHonor() {},
    handleChangeHonor(file, fileList) {
      console.log(fileList);
      // const reader = new FileReader(); //首先要先定义一下读取文件
      // reader.readAsDataURL(file.raw); // 这里要注意一下：readAsDataURL读取的是blob格式，直接用res会报错，res对象内的raw是我们需要的blob格式的文件
      // // 因为文件读取是一个耗时操作， 所以它要在回调函数中，才能够拿到读取的结果
      // reader.onload = () => {
      //   // reader.result就是转译过后的图片地址
      //   // this.fileCompListHonorr.push(reader.result);
      // };
      // this.form.honorImgs.push(...this.fileCompListHonorr)

      const isPNG = file.raw.type === "image/png";
      const isJPEG = file.raw.type === "image/jpeg";
      const isJPG = file.raw.type === "image/jpg";
      const isGif = file.raw.type === "image/gif";
      const isLt5M = file.raw.size / 1024 / 1024 < 0.5;
      if (!isPNG && !isJPEG && !isJPG && !isGif) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg、gif 格式!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 512KB!");
        return false;
      }

      console.log(this.fileCompListHonorr);
      fileList.forEach((file) => {
        if (file.raw !== undefined) {
          this.imgFileList.append("file", file.raw);
        }
      });
      // this.arr = _.cloneDeep(this)
    },
    imgRequest() {
      // this.imgFileList.append("file", file.raw)
      // formData数据格式需要append方法传入数据，file.file是传给后端的blob数据
      // 注意：这里要定义一下imgFileList = new FormData()；否则会报错说append is not a function
      // this.imgFileList.append("file", file.file);
    },

    exceedHandle(files, fileList) {
      if (fileList.length > 20) {
        this.$message.error("一次性上传数量不得大于20");
      }
    },

    handleRemoveHonor(file, fileList) {
      console.log(file);
      // console.log(fileList)
      // this.form.honorImgs = fileList
    },

    async submitUpload() {
      console.log(this.fileCompListHonorr);
      // this.$refs.honorRef.submit();
      const res = await uploadHonorImages(this.imgFileList);
      if (res.code === 200) {
        console.log(res.data);
        this.form.honorImgs = res.data;
        this.form.honorImgs.push(...this.fileCompListHonorr);
        this.form.honorImgs = this.form.honorImgs.join(",");
        this.$message.success("上传服务器成功");
      } else {
        this.fileCompListHonorr = [];
        this.$message.error("上传服务器失败");
      }
    },

    useEditWebInfo() {
      // console.log(typeof this.form.honorImgs)
      // if(typeof this.form.honorImgs !== 'string'){
      //   this.form.honorImgs = JSON.stringify(this.fileCompListHonorr)
      // }
      if (typeof this.form.honorImgs !== "string") {
        this.form.honorImgs = this.form.honorImgs.join(",");
      }
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
