<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      drag
      :action="`${url}/upload/sitemap`"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-error="error"
      :headers="{ Authorization: token }"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传文件名为 sitemap.xml 的文件
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "Sitemap",
  components: {},
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      token: getToken("token"),
    };
  },
  methods: {
    beforeUpload(file){
      console.log(file)
      if(file.type !== 'text/xml' || file.type !== 'text/txt') {this.$message.error('必须上传xml/txt类型文件'); return false};
      // if(file.name !== 'sitemap.xml') {this.$message.error('文件名必须为sitemap.xml'); return false};
      return true
    },
    success(res, file, fileList){
      this.$message.success('上传成功')
    },
    error(err){
      if(JSON.parse(err.message).code === -3006){
        this.$router.replace('/login')
        return this.$message.error(JSON.parse(err.message).message)
      }
      this.$message.error('上传失败')
  
      console.log(JSON.parse(err.message).code)
    }
  },
  computed: {},
};
</script>

<style lang='scss' scoped>
.upload {
  margin: 100px;
  .el-select {
    margin-bottom: 20px;
  }
}
</style>