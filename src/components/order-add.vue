<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '50%'"
    title="创建工单"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
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
      <el-form-item prop="industry" label="客户行业">
        <ren-select v-model="dataForm.industry" dict-type="industry"></ren-select>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import { isMobile as isPhone, isEmail } from "@/utils/utils";

const isMobile = useMediaQuery("(max-width: 768px)");

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  orderName: "",
  customerName: "",
  phone: "",
  email: "",
  industry: "",
  remark: ""
});

const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim === "") {
    callback(new Error("必填项不能为空"));
  } else {
    baseService
      .get(`/customer/name/check`, {
        orderName: value
      })
      .then((res) => {
        if (res.data) {
          callback();
        } else {
          callback(new Error("名称已存在！"));
        }
      });
  }
};
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
  orderName: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validateName, trigger: "blur" }
  ],
  customerName: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validateName, trigger: "blur" }
  ],
  phone: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
  ],
  email: [{ validator: validateEmail, trigger: "blur" }],
  industry: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (id?: number) => {
  visible.value = true;

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/order/save/inner", dataForm);
    fn.then((res) => {
      ElMessage.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
        }
      });
      close();
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
