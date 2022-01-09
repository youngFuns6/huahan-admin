<template>
  <el-card>
    <el-table :data='feedbackList' border stripe>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="address" label="联系地址"></el-table-column>
      <el-table-column prop="service" label="需求"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" type="danger" @click="useDelte(scope.row.id)">删除</el-button>
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
  </el-card>
</template>

<script>
import {getFeedback, deleteFeedback} from '@/api/feedback'

export default {
  data() {
    return {
     queryInfo: {
       page: 1,
       pageSize: 10
     },
     feedbackList: [],
     total: null
    }
  },
  created() {
    this.useGetFeedback()
  },
  methods: {
   async useGetFeedback(){
     const res = await getFeedback(this.queryInfo)
     if(res.code !== 200) return this.$message.error("获取信息失败");
     this.feedbackList = res.data
     this.total = res.total
   },
   useDelte(id){
     this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteFeedback(id);
          if (res.code !== 200) return this.$message.error("删除失败");
          this.useGetFeedback();
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
      this.useGetFeedback();
    }
  }
}
</script>

<style scoped>
.page{
  text-align: center;
  margin: 20px 0;
}
</style>

