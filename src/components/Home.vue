<template>
  <div><el-button type="info" @click="out">退出</el-button></div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {
    out() {
      window.sessionStorage.clear();

      this.$message.success("退出成功");
      this.$router.replace("/login");
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
</style>