<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '50%'"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="orderName" label="名称">
        <el-input v-model="dataForm.orderName" />
      </el-form-item>
      <el-form-item prop="customerId" label="关联客户">
        <SelectRelative v-model="dataForm.customerId" />
      </el-form-item>
      <el-form-item prop="content" label="商标内容">
        <el-input v-model="dataForm.content" />
      </el-form-item>
      <el-form-item prop="payType" label="支付类型">
        <el-input v-model="dataForm.payType" />
      </el-form-item>
      <el-form-item prop="officialPrice" label="官费">
        <el-input v-model="dataForm.officialPrice" />
      </el-form-item>
      <el-form-item prop="agencyPrice" label="代理费">
        <el-input v-model="dataForm.agencyPrice" />
      </el-form-item>
      <el-form-item prop="totalPrice" label="总费用">
        <el-input v-model="dataForm.totalPrice" />
      </el-form-item>
      <el-form-item prop="applyMethod" label="申请方式">
        <el-input v-model="dataForm.applyMethod" />
      </el-form-item>
      <el-form-item prop="commitOption" label="提交选项">
        <el-input v-model="dataForm.commitOption" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import SelectRelative from "@/components/SelectRelative.vue";
const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  customerId: "",
  orderName: "",
  content: "",
  payType: "",
  officialPrice: "",
  agencyPrice: "",
  totalPrice: "",
  applyMethod: "",
  commitOption: ""
});

const rules = ref({
  orderName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  content: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  payType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  officialPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  agencyPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  totalPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  applyMethod: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  commitOption: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (id) {
    getInfo(id);
  }
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/`).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/order/info/add", dataForm);
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
