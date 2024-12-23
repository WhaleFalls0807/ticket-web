<template>
  <el-dialog
    v-model="visible"
    title="下载文件"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
    width="40%"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="customerName" label="客户公司名">
        <el-input v-model="dataForm.customerName" />
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
import useUtils from "@/hooks/useUtils";
const { downloadFileWithBuffer, store } = useUtils();

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm: any = reactive({
  customerName: ""
});
const file: any = reactive({});

const rules = ref({
  customerName: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (item: any) => {
  visible.value = true;
  Object.assign(file, item);
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    baseService.get(`/corDocument/download`, { fileId: file.id, ...dataForm }).then((res) => {
      close();
      emit("refreshDataList");
      // 文件要已/file开头，代理拦截到9090
      baseService.getBlob("/file" + file.filePath).then((response) => {
        downloadFileWithBuffer(response, res.data);
      });
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
