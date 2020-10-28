<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert
        show-icon
        :closable="false"
        title="只允许第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>

      <el-row class="elrow">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCate"
            :options="cateList"
            :props="cascaderProps"
            @change="cascaderCateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            class="elbutton"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="primary"
                  @close="removeAttr(index, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-etid"
                  @click="openEditDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            class="elbutton"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="primary"
                  @close="removeAttr(index, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-etid"
                  @click="openEditDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + TitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClosed"
    >
      <el-form :model="addForm" :rules="Rules" ref="addRef" label-width="100px">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + TitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClosed"
    >
      <el-form
        :model="editForm"
        :rules="Rules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
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
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      selectCate: [],
      activeName: "many",
      paramsList: [],
      manyData: [],
      onlyData: [],
      addDialogVisible: false,
      addForm: {},
      Rules: {
        attr_name: {
          required: true,
          message: "请输入添加名称",
          trigger: "blur",
        },
      },
      editDialogVisible: false,
      editForm: {},
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCate.length === 3) {
        return false;
      }
      return true;
    },
    cateId() {
      if (this.selectCate.length === 3) {
        return this.selectCate[2];
      }
      return null;
    },
    TitleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败！");
        return;
      }
      this.cateList = res.data;
    },
    cascaderCateChange() {
      this.getParamsList();
    },

    handleTabClick() {
      this.getParamsList();
    },

    async getParamsList() {
      if (this.selectCate.length !== 3) {
        this.selectCate = [];
        this.manyData = [];
        this.onlyData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("获取参数列表失败！");
        return;
      }
      res.data.forEach((element) => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(" ")
          : [];
        element.inputVisible = false;
        element.inputValue = "";
      });

      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }
    },

    addClosed() {
      this.$refs.addRef.resetFields();
    },
    async add() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 201) {
        return this.$message.error("添加失败");
      }

      this.getParamsList();
      this.$message.success("添加成功");
      this.addDialogVisible = false;
    },

    remove(attrId) {
      this.$confirm("此操作将永久删除参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrId}`
          );

          if (res.meta.status !== 200) {
            return this.$message.info("删除失败");
          }
          this.getParamsList();
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

    editClosed() {
      this.$refs.editRef.resetFields();
    },
    edit() {
      this.$refs.editRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("修改失败！");
          return;
        }
        this.$message.success("修改成功！");
        this.getParamsList();
        this.editDialogVisible = false;
      });
    },
    async openEditDialogVisible(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("获取参数失败！");
        return;
      }
      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }

      row.attr_vals.push(row.inputValue);
      row.inputValue = "";
      this.setAttr(row);
      row.inputVisible = false;
    },
    async setAttr(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_sel: row.attr_sel,
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(" "),
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("修改参数失败！");
        return;
      }
      this.$message.success("修改参数成功！");
    },
    removeAttr(index, row) {
      row.attr_vals.splice(index, 1);
      this.setAttr(row);
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.elrow {
  margin: 15px 0;
}
.elbutton {
  margin-bottom: 15px;
}
.el-tag,
.button-new-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>