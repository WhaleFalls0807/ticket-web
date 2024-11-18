<template>
  <el-form :model="dataForm" ref="dataFormRef" label-width="120px" style="width: 50%">
    <el-form-item prop="refreshTime" label="抢单刷新时间">
      <ren-select v-model="dataForm.refreshTime" dict-type="refreshTime"></ren-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  refreshTime: "3"
});

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
</script>

<style lang="less"></style>
