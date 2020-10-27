<template>
  <el-container class="home-container">
    <el-header>
      <div class="header">
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isMenuColl ? '64px' : '200px'">
        <div class="coll" @click="iscoll">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#ffffff"
          class="el-menu-vertical-demo"
          unique-opened
          :collapse="isMenuColl"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savePath('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isMenuColl: false,
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  computed: {},
  methods: {
    out() {
      window.sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.replace("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.success(res.meta.msg);
      this.menuList = res.data;
      console.log(res.data);
    },
    iscoll() {
      this.isMenuColl = !this.isMenuColl;
    },
    savePath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.home-container {
  height: 100%;
  .el-header {
    background: #363d3f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header {
      height: 100%;
      img {
        height: 100%;
      }
      span {
        color: white;
      }
    }
  }
  .el-aside {
    background: #313743;
    .coll {
      background: #465262;
      color: white;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      letter-spacing: 0.2em;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background: #e9edf0;
  }
}
.iconfont {
  padding-right: 5px;
}
</style>