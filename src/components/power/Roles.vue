<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="elrow">
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'rowbb', index === 0 ? 'rowtop' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="closeRoleRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['vcenter', index2 === 0 ? '' : 'rowtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeRoleRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeRoleRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-etid"
              @click="getRoleUser(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="setRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form
        :model="addRoleForm"
        :rules="RoleRules"
        ref="addRoleRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <el-form
        :model="editRoleForm"
        :rules="RoleRules"
        ref="editRoleRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightClosed"
    >
      <el-tree
        :data="rightsTree"
        :props="TreeProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKeys"
        ref="rightTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
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
      rolesList: [],
      addRoleDialogVisible: false,
      RoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRoleForm: {},
      editRoleDialogVisible: false,
      setRightDialogVisible: false,
      rightsTree: {},
      TreeProps: {
        label: "authName",
        children: "children",
      },
      checkedKeys: [],
      setRightId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  computed: {},
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }

      this.rolesList = res.data;
      console.log(res);
    },

    addRoleClosed() {
      this.$refs.addRoleRef.resetFields();
    },

    addRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        const { data: res } = await this.$http.post("roles", this.addRoleForm);

        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.addRoleDialogVisible = false;
        this.getRolesList();
      });
    },

    async getRoleUser(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("获取用户信息失败");
        return;
      }
      this.editRoleForm = res.data;
      console.log(res.data);
      this.editRoleDialogVisible = true;
    },

    removeRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);

          if (res.meta.status !== 200) {
            return this.$message.info("删除角色失败");
          }
          this.getRolesList();
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

    editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        console.log(this.editRoleForm);
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新角色失败");
          return;
        }
        this.editRoleDialogVisible = false;
        this.getRolesList();
        this.$message.success("更新角色成功");
      });
    },
    editRoleClosed() {
      this.$refs.editRoleRef.resetFields();
    },

    closeRoleRight(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );

          if (res.meta.status !== 200) {
            return this.$message.info("删除权限失败");
          }

          role.children = res.data;
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

    async setRightDialog(role) {
      this.setRightId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsTree = res.data;
      console.log(this.rightsTree);
      this.checkedLeafKeys(role, this.checkedKeys);
      this.setRightDialogVisible = true;
    },
    checkedLeafKeys(role, arr) {
      if (!role.children) {
        return arr.push(role.id);
      }
      role.children.forEach((element) => {
        this.checkedLeafKeys(element, arr);
      });
    },
    setRightClosed() {
      this.checkedKeys = [];
    },
    async setRight() {
      const keys = [
        ...this.$refs.rightTree.getCheckedKeys(),
        ...this.$refs.rightTree.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.setRightId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }

      this.getRolesList();
      this.$message.success("分配权限成功");
      this.setRightDialogVisible = false;
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.elrow {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.rowtop {
  border-top: 1px solid #eee;
}
.rowbb {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>