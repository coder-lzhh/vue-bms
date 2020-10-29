<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodForm"
        :rules="addGoodRules"
        label-position="top"
        ref="addGoodRef"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTagLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addGoodForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="cascaderCateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
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
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodForm.goods_introduce"> </quill-editor>
            <el-button class="elbtn" type="primary" @click="addGoods">
              添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewdialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      activeIndex: "0",
      addGoodForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addGoodRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      cateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      manyData: [],
      onlyData: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewdialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2];
      }
      return null;
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
      // console.log(this.cateList);
    },
    cascaderCateChange() {
      if (this.addGoodForm.goods_cat.length !== 3) {
        this.addGoodForm.goods_cat = [];
      }
    },
    beforeTagLeave(act, old) {
      if (old === "0" && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },

    async tabClick() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );

        res.data.forEach((element) => {
          element.attr_vals = element.attr_vals
            ? element.attr_vals.split(" ")
            : [];
        });

        if (res.meta.status !== 200) {
          this.$message.error("获取参数列表失败！");
          return;
        }
        this.manyData = res.data;
        console.log(this.manyData);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("获取参数列表失败！");
          return;
        }
        this.onlyData = res.data;
        console.log(this.onlyData);
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewdialogVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addGoodForm.pics.findIndex((x) => x.pic === filePath);
      this.addGoodForm.pics.splice(index, 1);
    },
    uploadPic(res) {
      let picObj = {
        pic: res.data.tmp_path,
      };
      this.addGoodForm.pics.push(picObj);
      // console.log(this.addGoodForm)
    },
    addGoods() {
      this.$refs.addGoodRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填入合法的表单");

        this.manyData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addGoodForm.attrs.push(newInfo);
        });

        this.onlyData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addGoodForm.attrs.push(newInfo);
        });

        let form = JSON.parse(JSON.stringify(this.addGoodForm));
        form.goods_cat = form.goods_cat.join(",");

        console.log(form);

        const { data: res } = await this.$http.post("goods", form);

        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");

        this.$router.replace("/goods");
      });
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.el-steps,
.elbtn {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>