<template>
  <el-card>
    <el-button type="primary" @click="useAddDialog"> 新增动态 </el-button>
    <el-table :data="list" border stripe>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="封面">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 60px"
            :src="scope.row.banner"
            :preview-src-list="[scope.row.banner]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="scope">
          <span class="content" v-if="scope.row.content">{{
            scope.row.content | toText
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间"></el-table-column>
      <el-table-column prop="updated" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="useEditCondition(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="useDeleteCondition(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        layout="prev, pager, next"
        background
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 文章 -->
    <el-dialog title="文章管理" :visible.sync="dialogVisible" width="70%">
      <span>
        <el-form
          label-position="right"
          label-width="100px"
          :model="conditionForm"
          ref="conditionRef"
          :rules="conditionRules"
          class="demo-ruleForm"
        >
          <!-- <el-form-item label="类型" prop="type">
            <el-select v-model="conditionForm.type" placeholder="请选择分类">
              <el-option :value="1" label="企业动态"></el-option>
              <el-option :value="2" label="行业资讯"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="标题" prop="title">
            <el-input v-model="conditionForm.title"></el-input>
          </el-form-item>
          <el-form-item label="封面图片" prop="banner">
            <el-upload
              :action="BASE_API"
              class="upload-demo"
              drag
              auto-upload
              :on-success="handlesuccess"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-error="uploadError"
              :limit="1"
              :file-list="fileList"
              list-type="picture"
              :headers="{ Authorization: token }"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽上传或 <em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">
                  上传头像图片只能是 jpg、png、jpeg 格式! 且不超过2MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容">
            <Edit
              @getContent="getContent"
              :contentText="conditionForm.content"
            ></Edit>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="useAddCondition">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addCondition,
  getCondition,
  editCondition,
  deleteCondition,
} from "@api/condition";
import Edit from "@/components/Edit/Edit.vue";
import { getToken } from "@/utils/auth";

export default {
  name: "Condition",
  props: { type: Number },
  components: {
    Edit,
  },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API + "/upload",
      token: getToken("token"),
      queryInfo: {
        type: this.type,
        page: 1,
        pageSize: 10,
      },
      list: [],
      total: null,
      conditionForm: {
        type: this.type,
        banner: "",
      },
      fileList: [],
      bannerUrl: "",
      dialogVisible: false,
      conditionRules: {
        // type: [
        //   { required: true, message: '必填项', trigger: 'blur' },
        // ],
        title: [
          { required: true, message: "必填项，长度255字以内", trigger: "blur" },
        ],
        banner: [{ required: true, message: "必填项", trigger: "change" }],
      },
      isAddConditionForm: true,
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.useGetCondition();
  },
  methods: {
    async useGetCondition() {
      const res = await getCondition(this.queryInfo);
      this.list = res.data;
      this.total = res.total;
    },
    useAddDialog() {
      this.conditionForm = {
        type: this.type,
        banner: "",
      };
      this.fileList = [];
      this.dialogVisible = true;
      this.isAddConditionForm = true;
    },
    async useAddCondition() {
      if (this.isAddConditionForm) {
        this.$refs.conditionRef.validate(async (valid) => {
          if (!valid) return this.$message.error("请填写必填项");
          const res = await addCondition(this.conditionForm);
          console.log(res);
          if (res.code !== 200) return this.$message.error("添加失败");
          this.$message.success("添加成功");
          this.useGetCondition();
          this.dialogVisible = false;
        });
      } else {
        const res = await editCondition(this.conditionForm);
        if (res.code !== 200) return this.$message.error("编辑失败");
        this.$message.success("编辑成功");
        this.useGetCondition();
        this.dialogVisible = false;
      }
    },
    useEditCondition(row) {
      console.log(row);
      this.isAddConditionForm = false;
      this.conditionForm = row;
      this.fileList = row.banner
        ? [
            {
              name: "封面图",
              url: row.banner,
            },
          ]
        : [];
      this.dialogVisible = true;
    },
    useDeleteCondition(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteCondition({ id });
          if (res.code !== 200) return this.$message.error("删除失败");
          this.useGetCondition();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    beforeUpload(file) {
      if (!this.conditionForm.type && !this.conditionForm.title) {
        this.$message.error("请先选择分类");
        return false;
      }
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isGif = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPEG && !isJPG && !isGif) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg、gif 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
    },
    async handleRemove(file, fileList) {
      this.conditionForm.banner = "";
    },
    handlesuccess(response, file) {
      // console.log(response)
      this.conditionForm.banner = response.data;
      //   console.log(file)
    },
    uploadError() {
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true,
      });
    },
    getContent(content) {
      this.conditionForm.content = content;
    },
    cancel() {
      this.dialogVisible = false;
      if (!this.isAddConditionForm) {
        this.conditionForm = {
          type: this.type,
          banner: "",
        };
        this.fileList = [];
      }
    },
    // handleSizeChange(size){
    //     this.queryInfo.pageSize = size
    //     this.useGetCondition()
    // },
    handleCurrentChange(page) {
      this.queryInfo.page = page;
      this.useGetCondition();
    },

    
  },
};
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.el-button {
  margin: 20px 5px;
}
.page {
  text-align: center;
  margin: 20px 0;
}
</style>
