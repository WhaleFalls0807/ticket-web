<template>
  <el-dialog
    v-model="visible"
    title="审批"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef">
      <el-form-item prop="remark" label="备注：">
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          placeholder="通过/驳回/删除 原因"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="dataFormSubmitHandle(3)" :loading="loading3">删除</el-button>
      <el-button type="danger" @click="dataFormSubmitHandle(2)" :loading="loading2">驳回</el-button>
      <el-button type="success" @click="dataFormSubmitHandle(1)" :loading="loading1">通过</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const dataFormRef = ref();

const dataForm: any = reactive({
  orderId: [],
  remark: "",
  pass: 1
});

const rules = ref({
  // remark: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (ids: string[]) => {
  visible.value = true;
  dataForm.orderId = ids;
};

// 表单提交
const dataFormSubmitHandle = (status: number) => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    if (status === 1) {
      loading1.value = true;
    } else if (status === 2) {
      loading2.value = true;
    } else {
      loading3.value = true;
    }
    const fn = baseService.post("/order/review", { ...dataForm, pass: status });
    fn.then((res) => {
      ElMessage.success({
        message: "操作成功",
        duration: 500
      });

      if (status === 1) {
        loading1.value = false;
      } else if (status === 2) {
        loading2.value = false;
      } else {
        loading3.value = false;
      }
      emit("refreshDataList");
      // 关闭页面
      close();
    }).catch(() => {
      if (status === 1) {
        loading1.value = false;
      } else if (status === 2) {
        loading2.value = false;
      } else {
        loading3.value = false;
      }
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
