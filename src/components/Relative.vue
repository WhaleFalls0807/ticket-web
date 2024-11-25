<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '70%'"
    :title="relative?.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <component :is="relative?.componentName" :selectionRadio="true" ref="componentRef"></component>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import Customer from "@/components/customer/index.vue";
import User from "@/components/user/index.vue";

const isMobile = useMediaQuery("(max-width: 768px)");

const props = defineProps(["type"]);
const emit = defineEmits(["getSelected"]);

const relative = computed(() => {
  if (props.type === "customer") {
    return {
      title: "客户",
      componentName: Customer
    };
  } else if (props.type === "user") {
    return {
      title: "用户",
      componentName: User
    };
  }
});
const visible = ref(false);
const componentRef = ref();
const init = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
  localStorage.removeItem("addCustomerParams");
};
// 表单提交
const dataFormSubmitHandle = () => {
  const Selections = componentRef.value.dataListSelections;
  if (Selections.length === 0) {
    ElMessage.info(`请选择${relative.value?.title}`);
  } else {
    const params = {
      id: "",
      name: ""
    };
    if (props.type === "customer") {
      params.id = Selections[0].id;
      params.name = Selections[0].customerName;
    } else if (props.type === "user") {
      params.id = Selections[0].userId;
      params.name = Selections[0].userName;
    }
    emit("getSelected", params);
    close();
  }
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
