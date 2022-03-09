<template>
  <el-card>
    <el-button type="primary" @click="useAddDialog"> 新增产品 </el-button>
    <el-select
      @change="cateChange"
      v-model="GoodsForm.type"
      placeholder="请选择分类"
    >
      <el-option
        v-for="item in goodsCate"
        :key="item.type"
        :value="item.type"
        :label="item.cateName"
      ></el-option>
    </el-select>
    <el-button type="primary" v-if="isShowTopBtn" @click="useTop">置顶</el-button>
    <el-button type="danger" v-if="isShowCancelTop" @click="useCancelTop">取消重选</el-button>
    <el-table ref='tableRef' :data="list" border stripe row-key='id' @select='selectTop'>
      <el-table-column reserve-selection :selectable="isDisabled" type="selection" width="55">
      </el-table-column>
      <el-table-column label="所属分类">
        <template #default="scope">
          <span>{{ scope.row.cateName }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="220px">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="useEditGoods(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="useDeleteGoods(scope.row.id)"
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
    <el-dialog
      destroy-on-close
      title="文章管理"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <span>
        <el-form
          label-position="right"
          label-width="100px"
          :model="GoodsForm"
          ref="GoodsRef"
          :rules="GoodsRules"
          class="demo-ruleForm"
        >
          <el-form-item label="类型" prop="type">
            <el-select v-model="GoodsForm.type" placeholder="请选择分类">
              <el-option
                v-for="item in goodsCate"
                :key="item.type"
                :value="item.type"
                :label="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="GoodsForm.title"></el-input>
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
              :contentText="GoodsForm.content"
            ></Edit>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="useAddGoods">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addGoods,
  getGoods,
  editGoods,
  deleteGoods,
  getGoodsCate,
  topGoods,
} from "@api/goods";
import Edit from "@/components/Edit/Edit.vue";
import { getToken } from "@/utils/auth";

export default {
  name: "GoodsList",
  components: {
    Edit,
  },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API + "/upload",
      token: getToken("token"),
      queryInfo: {
        type: null,
        page: 1,
        pageSize: 10,
      },
      list: [],
      goodsCate: [],
      total: null,
      GoodsForm: {
        type: null,
        banner: "",
      },
      fileList: [],
      bannerUrl: "",
      dialogVisible: false,
      GoodsRules: {
        // type: [
        //   { required: true, message: '必填项', trigger: 'blur' },
        // ],
        title: [
          { required: true, message: "必填项，长度255字以内", trigger: "blur" },
        ],
        banner: [{ required: true, message: "必填项", trigger: "change" }],
      },
      isAddGoodsForm: true,
      selectTopList: [],
      isShowTopBtn: false,
      isShowCancelTop: false
    };
  },
  // filters: {
  //   filterCate(val, goodsCate) {
  //     goodsCate.forEach((item) => {
  //       if (val == item.type) {
  //         console.log(item.cateName);
  //         return item.cateName;
  //       }
  //     });
  //   }
  // },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.useGetGoods();
  },
  methods: {
    async useGetGoods() {
      const res = await getGoods(this.queryInfo);
      if (res.code !== 200) {
        return this.$message.error("获取产品列表失败");
      }
      this.total = res.total;
      this.useGetGoodsCate().then((goodsCate) => {
        res.data.res.forEach((item) => {
          goodsCate.forEach((cate) => {
            if (item.type == cate.type) {
              item.cateName = cate.cateName;
            }
          });
        });
        this.list = res.data.res;
        // console.log(this.list);
      });
    },
    useGetGoodsCate() {
      return new Promise(async (resolve, reject) => {
        const res = await getGoodsCate();
        if (res.code !== 200) {
          reject();
          return this.$message.error("获取产品分类失败");
        }
        this.goodsCate = res.data;
        resolve(res.data);
      });
    },
    useAddDialog() {
      this.GoodsForm = {
        type: this.type,
        banner: "",
      };
      this.fileList = [];
      this.dialogVisible = true;
      this.isAddGoodsForm = true;
    },
    async useAddGoods() {
      if (this.isAddGoodsForm) {
        this.$refs.GoodsRef.validate(async (valid) => {
          if (!valid) return this.$message.error("请填写必填项");
          const res = await addGoods(this.GoodsForm);
          console.log(res);
          if (res.code !== 200) return this.$message.error("添加失败");
          this.$message.success("添加成功");
          this.useGetGoods();
          this.GoodsForm = {};
          this.dialogVisible = false;
          noticeApi({bdToken: 'rGs3BN5KF5tgtKGp', urls: `https://www.czhhhb.com/news/content/goods/${res.data.id}.html`}).then(() => {
            this.$message.success('提交百度收录成功')
          }).catch(err => {
            this.$message.error('提交百度收录失败')
          })
        });
      } else {
        const res = await editGoods(this.GoodsForm);
        if (res.code !== 200) return this.$message.error("编辑失败");
        this.$message.success("编辑成功");
        this.useGetGoods();
        this.GoodsForm = {};
        this.dialogVisible = false;
      }
    },
    useEditGoods(row) {
      console.log(row);
      delete row.cateName;
      this.isAddGoodsForm = false;
      this.GoodsForm = row;
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
    useDeleteGoods(id) {
      this.$confirm("此操作将永久删除该产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteGoods({ id });
          if (res.code !== 200) return this.$message.error("删除失败");
          this.useGetGoods();
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
      if (!this.GoodsForm.type && !this.GoodsForm.title) {
        this.$message.error("请先填写分类与标题");
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
      this.GoodsForm.banner = "";
    },
    handlesuccess(response, file) {
      // console.log(response)
      this.GoodsForm.banner = response.data;
      //   console.log(file)
    },
    uploadError() {
      if(JSON.parse(err.message).code === -3006){
        this.$router.replace('/login')
        return this.$message.error(JSON.parse(err.message).message)
      }
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true,
      });
    },
    getContent(content) {
      this.GoodsForm.content = content;
    },
    cancel() {
      this.dialogVisible = false;
      if (!this.isAddGoodsForm) {
        this.GoodsForm = {
          type: this.type,
          banner: "",
        };
        this.fileList = [];
      }
    },
    // handleSizeChange(size){
    //     this.queryInfo.pageSize = size
    //     this.useGetGoods()
    // },
    handleCurrentChange(page) {
      this.queryInfo.page = page;
      this.useGetGoods();
    },
    cateChange(value) {
      this.queryInfo.type = value;
      this.useGetGoods();
    },
    // 置顶
    selectTop(selection, row){
      // console.log(selection, row)
      let index = this.selectTopList.indexOf(row.id)
      if( index === -1){
        this.selectTopList.unshift(row.id)
      }else {
        this.selectTopList.splice(index, 1)
      }
      if(this.selectTopList.length){
        this.isShowTopBtn = true
        if(this.selectTopList.length === 20){
          this.isShowCancelTop = true
        }else {
          this.isShowCancelTop = false
        }
      }else{
        this.isShowTopBtn = false
      }
    },
    isDisabled(){
      if(this.selectTopList.length >= 20){
        return false
      }
      return true
    },

    // 取消置顶
    useCancelTop(){
      this.selectTopList = []
      this.isDisabled()
      this.$refs.tableRef.clearSelection()
      this.isShowCancelTop = false
    },

    // 确认置顶
    async useTop() {
      const res = await topGoods(this.selectTopList);
      if (res.code === 200) {
        this.useCancelTop()
        this.isShowTopBtn = false
        this.$message.success('置顶成功')
        this.useGetGoods();
      }
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

::v-deep .el-table thead .el-table-column--selection .el-checkbox {
  visibility: hidden;
}
</style>
