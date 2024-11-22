<template>
  <el-dialog
    v-model="visible"
    title="提交审核"
    :width="isMobile ? '90%' : '50%'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="reviewUserId" label="审核人">
        <el-select v-model="dataForm.reviewUserId">
          <el-option v-for="item in options" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const loading = ref();
const dataForm: any = reactive({
  orderId: [],
  reviewUserId: "",
  remark: ""
});

const options: any = ref([]);
const rules = ref({
  // reviewUserId: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (id: string[]) => {
  visible.value = true;
  dataForm.orderId = [id];

  getAssign();
};

// 获取信息
const getAssign = () => {
  baseService
    .get(`/sys/user/list/byPerm`, {
      permission: "approve:list"
    })
    .then((res) => {
      options.value = res.data;
    });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    loading.value = true;
    baseService
      .post("/order/commit", dataForm)
      .then((res) => {
        ElMessage.success({
          message: "成功",
          duration: 500,
          onClose: () => {
            close();
            emit("refreshDataList");
          }
        });
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
