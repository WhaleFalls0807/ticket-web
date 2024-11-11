<template>
  <el-dialog
    v-model="visible"
    title="指派"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="assignId" label="指派给：">
        <el-select v-model="dataForm.assignId" placeholder="Select" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  assignId: ""
});

const options = ref([
  {
    value: "Option1",
    label: "Option1"
  }
]);
const rules = ref({
  assignId: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (id: string) => {
  visible.value = true;
  dataForm.id = id;

  getAssign();
};

// 获取信息
const getAssign = () => {
  // baseService.get(`/sys/schedule/page`).then((res) => {
  //   options.value = res.data;
  // });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = !dataForm.id ? baseService.post("/sys/schedule", dataForm) : baseService.put("/sys/schedule", dataForm);
    fn.then((res) => {
      ElMessage.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
