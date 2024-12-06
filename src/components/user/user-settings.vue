<template>
  <el-dialog
    v-model="visible"
    title="抢单配置"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="40%"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="totalCount" label="抢单次数">
        <div class="flex">
          <el-input-number v-model="dataForm.gap" :min="0" :step="1" :controls="false" class="mr10" />
          <el-select v-model="dataForm.grain" class="mr10">
            <el-option v-for="item in grainList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input-number v-model="dataForm.totalCount" :min="0" :step="1" :controls="false" class="mr10" />
          <span>次</span>
        </div>
      </el-form-item>
      <el-form-item prop="grabGap" label="抢单时间间隔">
        <div class="flex">
          <el-input-number v-model="dataForm.grabGap" :min="0" :step="1" :controls="false" class="mr10" />
          <span>分钟/次</span>
        </div>
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

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  userId: "",
  username: "",
  gap: 1,
  grain: 3,
  totalCount: 30,
  grabGap: 10
});
const grainList = [
  {
    label: "月",
    value: 1
  },
  {
    label: "周",
    value: 2
  },
  {
    label: "天",
    value: 3
  }
];
const rules = ref({
  gap: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  grain: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  totalCount: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  grabGap: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const init = (user: any) => {
  visible.value = true;
  dataForm.userId = user.id;
  dataForm.username = user.username;

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  getCount();
};
const getCount = () => {
  baseService.get("/orderGrab/config/" + dataForm.userId).then((res) => {
    const { gap, grain, totalCount, grabGap } = res.data;
    Object.assign(dataForm, { gap, grain, totalCount, grabGap });
  });
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
