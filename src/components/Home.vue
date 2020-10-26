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
      console.log(this.$router);
      this.$router.replace("/login");
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
</style>