<template>
  <el-card>
    <el-button type="primary" @click="dialogVisible = true">新建分类</el-button>
    <el-table :data="goodsCate" border stripe>
      <el-table-column label="分类名称" prop="cateName"></el-table-column>
      <el-table-column label="创建时间" prop="created"></el-table-column>
      <el-table-column label="更新时间" prop="updated"></el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="
              useEditDialog(scope.row)
            "
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="useDeteteCate(scope.row.type)"
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
    <!-- 添加分类 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-form class="demo-ruleForm" :model="addCateForm" :rules="cateRules" ref="addCateRef">
          <el-form-item label="分类名称" prop="cateName">
            <el-input type="textarea" v-model="addCateForm.cateName"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="编辑商品分类" :visible.sync="dialogEdit" width="30%">
      <span>
        <el-form
          :model="editCateForm"
          :rules="editCateRules"
          ref="editCateRef"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cateName">
            <el-input
              type="textarea"
              v-model="editCateForm.cateName"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="useEditGoodsCate">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getGoodsCate,
  addGoodsCate,
  editGoodsCate,
  deleteGoodsCate,
} from "@/api/goods";

export default {
  name: "Cate",
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
      },
      total: null,
      dialogVisible: false,
      dialogEdit: false,
      goodsCate: [],
      addCateForm: {},
      editCateForm: {},
      cateRules: {
        cateName: [
          { required: true, message: "必填项，长度255字以内", trigger: "blur" },
        ],
      },
      editCateRules: {
        cateName: [
          {
            required: true,
            message: "必填项，长度255字以内",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.useGetGoodsCate();
  },
  methods: {
    async useGetGoodsCate() {
      const res = await getGoodsCate(this.queryInfo);
      if (res.code !== 200) return this.$message.error("获取产品分类失败");
      this.goodsCate = res.data;
      this.total = res.total;
    },

    addGoodsCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必填项");
        const res = await addGoodsCate(this.addCateForm);
        if (res.code !== 200) return this.$message.error("添加产品分类失败");
        this.$message.success("添加产品分类成功");
        this.dialogVisible = false;
        this.addCateForm = {};
        this.useGetGoodsCate();
      });
    },

    useEditDialog(row) {
      this.editCateForm = row;
      this.dialogEdit = true;
    },

    useEditGoodsCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必填项");
        const res = await editGoodsCate(this.editCateForm);
        if (res.code !== 200) return this.$message.error("编辑产品分类失败");
        this.$message.success("编辑产品分类成功");
        this.editCateForm = {};
        this.useGetGoodsCate();
        this.dialogEdit = false;
      });
    },

    useDeteteCate(type) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteGoodsCate(type);
          if (res.code !== 200) return this.$message.error('删除失败')
          this.useGetGoodsCate();
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

    handleCurrentChange(page) {
      this.queryInfo.page = page;
      this.useGetGoodsCate();
      if (res.code !== 200) return this.$message.error("删除产品分类失败");
      this.$message.success("删除产品分类成功");
      this.useGetGoodsCate();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  margin: 20px 5px;
}
.page {
  text-align: center;
  margin: 20px 0;
}
</style>
