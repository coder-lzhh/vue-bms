<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));

    var options = {
      title: {
        text: "用户来源",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: { data: ["华东", "华南", "华北", "西部", "其他"] },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      yAxis: [
        {
          type: "value",
        },
      ],
      xAxis: [
        {
          data: [
            "2017-12-27",
            "2017-12-28",
            "2017-12-29",
            "2017-12-30",
            "2017-12-31",
            "2018-1-1",
          ],
          boundaryGap: false,
          type: "category",
        },
      ],
      series: [
        {
          name: "华东",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [2999, 3111, 4100, 3565, 3528, 6000],
        },
        {
          name: "华南",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [5090, 2500, 3400, 6000, 6400, 7800],
        },
        {
          name: "华北",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [6888, 4000, 8010, 12321, 13928, 12984],
        },
        {
          name: "西部",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [9991, 4130, 7777, 12903, 13098, 14028],
        },
        {
          name: "其他",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [15212, 5800, 10241, 14821, 15982, 14091],
        },
      ],
    };
    myChart.setOption(options);
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>

<style  scoped lang='less'>
</style>