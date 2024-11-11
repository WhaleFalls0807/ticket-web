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
          placeholder="通过/驳回原因"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="danger" @click="dataFormSubmitHandle(false)" :loading="loading2">驳回</el-button>
      <el-button type="success" @click="dataFormSubmitHandle(true)" :loading="loading1">通过</el-button>
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
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  remark: ""
});

const rules = ref({
  // remark: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
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
const dataFormSubmitHandle = (status: Boolean) => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    if (status) {
      loading1.value = true;
    } else {
      loading2.value = true;
    }
    const fn = baseService.post("/sys/schedule", { ...dataForm, status });
    fn.then((res) => {
      ElMessage.success({
        message: "操作成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });

      if (status) {
        loading1.value = false;
      } else {
        loading2.value = false;
      }
      // 关闭页面
      close();
    }).catch(() => {
      if (status) {
        loading1.value = false;
      } else {
        loading2.value = false;
      }
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
