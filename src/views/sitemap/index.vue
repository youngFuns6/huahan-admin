<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      drag
      :action="`${url}/upload/sitemap`"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-error="error"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "Sitemap",
  components: {},
  data() {
    return {
      url: process.env.VUE_APP_BASE_API
    };
  },
  methods: {
    beforeUpload(file){
      console.log(file)
      if(file.type !== 'text/xml') {this.$message.error('必须上传xml类型文件'); return false};
      if(file.name !== 'sitemap.xml') {this.$message.error('文件名必须为sitemap.xml'); return false};
      return true
    },
    success(res, file, fileList){
      this.$message.success('上传成功')
    },
    error(){
      this.$message.error('上传失败')
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