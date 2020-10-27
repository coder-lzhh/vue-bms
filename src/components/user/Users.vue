<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20" class="elrow">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="paramInfo.query"
            clearable
            @clear="searchUser"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- <template> -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>

            <el-tooltip
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="paramInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserClosed"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="editUserClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUserRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      userList: [],
      paramInfo: { query: "", pagenum: 1, pagesize: 2 },
      total: 0,
      addUserDialogVisible: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      editUserDialogVisible: false,
      editUserForm: {},
      editUserRules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  computed: {},
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.paramInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    searchUser() {
      this.paramInfo.pagenum = 1;
      this.paramInfo.pagesize = 2;
      this.getUserList();
    },
    handleSizeChange(newSize) {
      this.paramInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      this.paramInfo.pagenum = newpage;
      this.getUserList();
    },
    async userStateChange(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        this.$message.error("更新用户状态失败");
        return;
      }
      this.$message.success("更新用户状态成功");
    },
    addUserClosed() {
      this.$refs.addUserRef.resetFields();
    },
    addUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        const { data: res } = await this.$http.post("users", this.addUserForm);

        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addUserDialogVisible = false;
        this.getUserList();
      });
    },
    async getEditUser(id) {
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("获取用户信息失败");
        return;
      }
      this.editUserForm = res.data;
      this.editUserDialogVisible = true;
    },
    editUserClosed() {
      this.$refs.editUserRef.resetFields();
    },
    editUser() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新用户失败");
        }
        this.editUserDialogVisible = false;
        this.getUserList();
        this.$message.success("更新用户成功");
      });
    },
    removeUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);

          if (res.meta.status !== 200) {
            return this.$message.info("删除用户失败");
          }
          this.getUserList();
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
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.elbreadcrumb {
  margin-bottom: 15px;
}
.box-card {
  box-shadow: 0 0 2px rgba(00, 00, 00, 0.1) !important;
  .elrow {
    margin-bottom: 15px;
  }
}
</style>