<template>
  <div>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
      class="quill-edit"
    ></quill-editor>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor, Quill } from "vue-quill-editor";
import { addQuillTitle } from "@/utils/quill-title";

import { ImageExtend, QuillWatch } from "quill-image-extend-module";

import { getToken } from "@/utils/auth";

Quill.register("modules/ImageExtend", ImageExtend);

export default {
  name: "QuillText",
  props: { contentText: String },
  components: {
    quillEditor,
  },
  data() {
    return {
      // 富文本数据
      content: "",
      // 富文本编辑器配置
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "file",
            size: 2,
            action: process.env.VUE_APP_BASE_API + "/upload",
            response: (res) => {
              return res.data;
              // console.log(res);
            },
            headers: (xhr, formData) => {
              xhr.setRequestHeader("Authorization", getToken("token"));
            }, // 可选参数 设置请求头部
            // change: (xhr, formData) => {
            //   formData.append(
            //     "token",
            //     window.sessionStorage.getItem("qiniuToken")
            //   );
            //   formData.append(
            //     "key",
            //     `upload_pic_${new Date().getTime()}_huahan`
            //   );
            // },
            sizeError: () => {
              return this.$message.error("图片超过5M");
            }, // 图片超过大小的回调
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 几级标题
              [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
              [{ script: "sub" }, { script: "super" }], // 下角标，上角标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文字输入方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 颜色选择
              [{ font: [] }], // 字体
              [{ align: [] }], // 居中
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
        },
      },
    };
  },
  watch: {
    contentText: {
      handler() {
        this.content = this.contentText;
      },
      immediate: true,
    },
  },
  mounted() {
    addQuillTitle();
  },
  methods: {
    // 富文本框事件
    //失去焦点事件
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    //获得焦点事件
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    //内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text);
      this.content = html;
      this.$emit("getContent", this.content);
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .quill-edit .ql-editor {
  height: 300px;
}
</style>