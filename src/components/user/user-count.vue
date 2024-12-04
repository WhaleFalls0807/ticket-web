<template>
  <el-dialog
    v-model="visible"
    title="设置抢单次数"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="30%"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="totalCount" label="抢单次数">
        <el-input-number v-model="dataForm.totalCount" :min="0" :step="1" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
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
  totalCount: 10
});

const rules = ref({
  totalCount: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const init = (user: any) => {
  visible.value = true;
  dataForm.id = user.id;
  dataForm.totalCount = user.totalCount;
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    baseService
      .post("/orderGrab/config/save ", {
        ...dataForm
      })
      .then((res) => {
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

<style lang="less" scoped></style>
