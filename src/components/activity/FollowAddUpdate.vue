<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="operateType" label="跟进类型">
        <ren-select v-model="dataForm.operateType" dict-type="operateType"></ren-select>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <el-input v-model="dataForm.content" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
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
import { useAppStore } from "@/store";
const props = defineProps(["associationId", "activityType"]);
const emit = defineEmits(["refreshDataList"]);
const store = useAppStore();

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  activityType: props.activityType,
  operateType: "",
  content: ""
});

const rules = ref({
  content: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};

const init = (item?: any) => {
  visible.value = true;

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (item) {
    getInfo(item);
  }
};

// 获取信息
const getInfo = (item: any) => {
  Object.assign(dataForm, item);
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    let params: any = { ...dataForm, associationId: props.associationId };
    params.creator = store.state.user.id;
    params.createName = store.state.user.username;
    const fn = params.id ? baseService.post("/activity/update", params) : baseService.post("/activity/create", params);
    fn.then((res) => {
      ElMessage.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          close();
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
