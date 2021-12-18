<template>
  <el-card>
    <el-button type="primary" @click="dialogVisible = true"> 新增动态 </el-button>
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
          <span class="content">{{ scope.row.content | toText }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间"></el-table-column>
      <el-table-column prop="updated" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="useEditCondition(scope.row.id)"
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
    <!-- 编辑 -->
    <el-dialog
      title="文章编辑"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <span>
        <el-form
      label-position="right"
      label-width="100px"
      :model="form"
      ref="addRef"
      :rules="conditionRules"
    >
      <el-form-item label="封面图片">
        <el-upload
          :action="uploadUrl"
          class="upload-demo"
          drag
          auto-upload
          :on-success="handlesuccess"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-error="uploadError"
          :data="uploadData"
          :limit="1"
          :file-list="fileList"
          list-type="picture"
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
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Edit></Edit>
      </el-form-item>
    </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { addCondition, getCondition } from "@api/condition";
import Edit from "@/components/Condition/Edit.vue";

export default {
  name: "Condition",
  components: {
    Edit,
  },
  data() {
    return {
      queryInfo: {
        type: 1,
        page: 1,
        pageSize: 10,
      },
      list: [],
      conditionForm: {},
      dialogVisible: false
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
      console.log(res);
      this.list = res.data;
    },
    useAddCondition() {},

    useEditCondition(id) {},
    useDeleteCondition(id) {},
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
</style>
