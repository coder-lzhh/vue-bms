<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="elrow">
        <el-col>
          <el-button type="primary" @click="openAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="openEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="paramInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateListTotal"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="CateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectParentCate"
            :options="parentCateList"
            :props="cascaderProps"
            @change="cascaderCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="CateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      cateList: [],
      cateListTotal: 0,
      paramInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          minWidth: "130px",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      CateRules: {
        cat_name: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      },
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      selectParentCate: [],
      editCateDialogVisible: false,
      editCateForm: {},
      editCateId: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {},
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.paramInfo,
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败！");
        return;
      }
      this.cateList = res.data.result;
      this.cateListTotal = res.data.total;
    },
    handleCurrentChange(newpage) {
      this.paramInfo.pagenum = newpage;
      this.getCateList();
    },
    handleSizeChange(newsize) {
      this.paramInfo.pagesize = newsize;
      this.getCateList();
    },

    addCateClosed() {
      this.$refs.addCateRef.resetFields();
      this.selectParentCate = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );

        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品分类失败");
        }
        this.$message.success("添加商品分类成功");
        this.addCateDialogVisible = false;
        this.getCateList();
      });
    },
    openAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取父级分类数据失败！");
        return;
      }
      this.parentCateList = res.data;
    },
    cascaderCateChange() {
      if (this.selectParentCate.length > 0) {
        this.addCateForm.cat_pid = this.selectParentCate[
          this.selectParentCate.length - 1
        ];
        this.addCateForm.cat_level = this.selectParentCate.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }

      console.log(this.addCateForm);
    },
    async openEditCateDialog(cateId) {
      const { data: res } = await this.$http.get("categories/" + cateId);

      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败！");
        return;
      }
      this.editCateForm = res.data;
      console.log(this.editCateForm);
      this.editCateDialogVisible = true;
    },
    removeCate(cateId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("categories/" + cateId);

          if (res.meta.status !== 200) {
            return this.$message.info("删除角色失败");
          }
          this.getCateList();
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
    editCateClosed() {},
    async editCate() {
      const { data: res } = await this.$http.put(
        "categories/" + this.editCateForm.cat_id,
        {
          cat_name: this.editCateForm.cat_name,
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("修改商品分类失败！");
        return;
      }
      this.$message.success("修改商品分类成功！");
      this.getCateList();
      this.editCateDialogVisible = false;
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.elrow {
  margin-bottom: 15px;
}
</style>