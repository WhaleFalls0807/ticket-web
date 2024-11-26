<template>
  <div class="container">
    <div class="header">
      <div class="left">您好！欢迎访问商标服务官方网站！</div>
      <div class="right">
        <span>全国统一免费服务热线 xxx</span>
      </div>
    </div>
    <div class="banner1">
      <h1>保护品牌 从注册开始</h1>
      <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-position="top" label-width="120px" size="large">
        <el-form-item prop="orderName" label="商标名称">
          <el-input v-model="dataForm.orderName" />
        </el-form-item>
        <el-form-item prop="customerName" label="客户名称">
          <el-input v-model="dataForm.customerName" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="dataForm.email" />
        </el-form-item>
        <el-form-item prop="industry" label="行业">
          <el-select v-model="dataForm.industry">
            <el-option
              v-for="item in industryList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <!-- <ren-select v-model="dataForm.industry" dict-type="industry"></ren-select> -->
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
        </el-form-item>
        <el-form-item>
          <div class="btn-wrap">
            <el-button type="danger" size="large" @click="dataFormSubmitHandle()">免费查询</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="banner2"></div>
    <div class="footer">
      <div class="item">
        <div class="title">团队专，服务专</div>
        <div class="sub_title">一对一，专家服务</div>
      </div>
      <div class="item">
        <div class="title">响应快，定稿快</div>
        <div class="sub_title">撰写高效，递交快捷</div>
      </div>
      <div class="item">
        <div class="title">质量好，保密好</div>
        <div class="sub_title">授权率高，安全性强</div>
      </div>
      <div class="item">
        <div class="title">省费用，省心力</div>
        <div class="sub_title">全程托管，进度可查</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { isMobile as isPhone, isEmail } from "@/utils/utils";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";

const dataFormRef = ref();

const dataForm = reactive({
  orderName: "",
  customerName: "",
  phone: "",
  email: "",
  industry: "",
  remark: ""
});

const industryList = ref([
  { label: "餐饮行业", value: "餐饮行业" },
  { label: "珠宝行业", value: "珠宝行业" },
  { label: "化妆品行业", value: "化妆品行业" },
  { label: "电子行业", value: "电子行业" },
  { label: "健身行业", value: "健身行业" },
  { label: "能源行业", value: "能源行业" },
  { label: "食品行业", value: "食品行业" },
  { label: "家居行业", value: "家居行业" },
  { abel: "互联网行业", value: "互联网行业" },
  { label: "机械行业", value: "机械行业" },
  { label: "乐器行业", value: "乐器行业" },
  { label: "化工行业", value: "化工行业" },
  { label: "服装行业", value: "服装行业" },
  { label: "电器行业", value: "电器行业" },
  { label: "安防行业", value: "安防行业" },
  { label: "装修行业", value: "装修行业" },
  { label: "汽车行业", value: "汽车行业" },
  { label: "建材行业", value: "建材行业" },
  { label: "纺织行业", value: "纺织行业" },
  { label: "医疗行业", value: "医疗行业" },
  { label: "文化行业", value: "文化行业" },
  { label: "旅游行业", value: "旅游行业" },
  { label: "钢铁行业", value: "钢铁行业" },
  { label: "地产行业", value: "地产行业" },
  { label: "通讯行业", value: "通讯行业" },
  { label: "摄影行业", value: "摄影行业" },
  { label: "其他行业", value: "其他行业" }
]);
const validatePhone = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isPhone(value)) {
    return callback(new Error("手机号格式错误"));
  }
  callback();
};
const validateEmail = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isEmail(value)) {
    return callback(new Error("邮箱格式错误"));
  }
  callback();
};
const rules = ref({
  orderName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  customerName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
  ],
  email: [{ validator: validateEmail, trigger: "blur" }],
  industry: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/order/save/byUser", dataForm);
    fn.then((res) => {
      ElMessage.success({
        message: "提交成功",
        duration: 500
      });
      close();
    });
  });
};
</script>
<style lang="less" scoped>
.container {
  .header {
    background-color: #fff;
    height: 60px;
    line-height: 60px;
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
  }
  .banner1 {
    min-height: 120vh;
    background: url(../../assets/images/bg.png) no-repeat;
    background-size: 100% 100%;
    color: #fff;
    padding: 60px 0;
    h1 {
      text-align: center;
      transform: scale(2);
    }
    .el-form {
      width: 50%;
      background: #fff;
      padding: 20px;
      margin: 0 auto;
      margin-top: 60px;

      border-radius: 20px;

      .btn-wrap {
        margin: 0 auto;
        width: 30%;
        .el-button {
          background-color: red;
          border-color: red;
          width: 100%;
          font-size: 25px;
        }
      }
    }
  }
  .banner2 {
    min-height: 100vh;
  }
  .footer {
    padding: 0 10%;
    min-height: 100px;
    background-color: #333;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    .item {
      .title {
        font-size: 20px;
      }
      .sub_title {
        font-size: 16px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .banner1 {
    h1 {
      transform: scale(1) !important;
    }
    .el-form {
      width: 90% !important;
    }
  }
  .footer {
    padding: 20px;
    flex-direction: column;
    .item {
      margin-bottom: 20px;
    }
  }
}
</style>
