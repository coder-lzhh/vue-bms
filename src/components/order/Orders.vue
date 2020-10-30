<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20" class="elrow">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px">
        </el-table-column>
        <el-table-column label="下单时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- <template> -->
          <template>
            <!-- {{scope.row}} -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="openLogisticalDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="paramInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderListTotal"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="物流信息"
      :visible.sync="logisticalDialogVisible"
      width="70%"
    >
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      paramInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      orderListTotal: 0,
      logisticalDialogVisible: false,
      logisticalmsg: [],
    };
  },
  created() {
    this.getOrderList();
  },
  computed: {},
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.paramInfo,
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败！");
        return;
      }
      this.orderList = res.data.goods;
      this.orderListTotal = res.data.total;
      console.log(this.orderList);
    },

    handleSizeChange(newsize) {
      this.paramInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newpage) {
      this.paramInfo.pagenum = newpage;
      this.getOrderList();
    },

    async openLogisticalDialog() {
      const { data: res } = await this.$http.get(`/kuaidi/804909574412544580`);

      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败！");
        return;
      }
      this.logisticalmsg = res.data;
      console.log(this.logisticalmsg);

      this.logisticalDialogVisible = true;
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