<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="path" label="权限名称"> </el-table-column>
        <el-table-column prop="authName" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  computed: {},
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      // console.log(res);
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
</style>