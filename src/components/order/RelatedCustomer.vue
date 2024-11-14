<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '70%'"
    title="关联客户"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <Customer :selectionRadio="true" ref="customerRef" />
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
import Customer from "@/components/customer/index.vue";
const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["getSelectedCustomer"]);

const visible = ref(false);
const customerRef = ref();
const init = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};
// 表单提交
const dataFormSubmitHandle = () => {
  const customers = customerRef.value.dataListSelections;
  if (customers.length === 0) {
    ElMessage.info("请选择要关联的客户");
  } else {
    emit("getSelectedCustomer", customers[0]);
    close();
  }
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
