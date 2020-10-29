<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20" class="elrow">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            v-model="paramInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- <template> -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditGoodsDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
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
        :total="goodsListTotal"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="编辑分类"
      :visible.sync="editGoodsDialogVisible"
      width="70%"
      @close="editGoodsClosed"
    >
      <el-form
        :model="editGoodsForm"
        :rules="GoodsRules"
        ref="editGoodsRef"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input
            v-model="editGoodsForm.goods_price"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input
            v-model="editGoodsForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input
            v-model="editGoodsForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <quill-editor v-model="editGoodsForm.goods_introduce"> </quill-editor>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="uploadPic"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
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
      goodsList: [],
      goodsListTotal: 0,
      paramInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      editGoodsDialogVisible: false,
      editGoodsForm: {},
      GoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入重量", trigger: "blur" },
        ],
      },
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      pics: [],
    };
  },
  created() {
    this.getGoodsList();
  },
  computed: {},
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.paramInfo,
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败！");
        return;
      }
      this.goodsList = res.data.goods;
      this.goodsListTotal = res.data.total;
      console.log(this.goodsList);
    },

    handleSizeChange(newsize) {
      this.paramInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.paramInfo.pagenum = newpage;
      this.getGoodsList();
    },
    removeGoods(goodsId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("goods/" + goodsId);

          if (res.meta.status !== 200) {
            return this.$message.info("删除商品失败");
          }
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除商品成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goAddGoodsPage() {
      this.$router.push("/goods/add");
    },

    editGoodsClosed() {},
    async openEditGoodsDialog(row) {
      const { data: res } = await this.$http.get("goods/" + row.goods_id);

      if (res.meta.status !== 200) {
        this.$message.error("获取商品数据失败！");
        return;
      }
      this.editGoodsForm = res.data;
      console.log(this.editGoodsForm);
      this.editGoodsDialogVisible = true;
    },
    editGoods() {
      this.$refs.editGoodsRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        let form = {
          goods_name: this.editGoodsForm.goods_name,
          goods_price: this.editGoodsForm.goods_price,
          goods_number: this.editGoodsForm.goods_number,
          goods_weight: this.editGoodsForm.goods_weight,
          goods_introduce: this.editGoodsForm.goods_introduce,
          attrs: this.editGoodsForm.attrs,
          pics: this.pics,
          goods_cat: this.editGoodsForm.goods_cat,
        };

        const { data: res } = await this.$http.put(
          "goods/" + this.editGoodsForm.goods_id,
          form
        );
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("更新商品失败");
          return;
        }
        this.editGoodsDialogVisible = false;
        this.getGoodsList();
        this.$message.success("更新商品成功");
      });
    },
    handlePreview() {},
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.pics.findIndex((x) => x.pic === filePath);
      this.pics.splice(index, 1);
    },
    uploadPic(res) {
      let picObj = {
        pic: res.data.tmp_path,
      };
      this.pics.push(picObj);
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