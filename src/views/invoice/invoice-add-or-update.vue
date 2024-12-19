<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="customerId" label="客户名称">
        <SelectRelative v-model="dataForm.customerId" @getName="(val:string) => (dataForm.customerName = val)" />
      </el-form-item>
      <el-form-item prop="invoiceDate" label="开票时间">
        <el-date-picker
          v-model="dataForm.invoiceDate"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="x"
        />
      </el-form-item>
      <el-form-item prop="invoicePrice" label="开票金额">
        <el-input-number v-model="dataForm.invoicePrice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="invoiceInfo" label="开票详情">
        <el-input v-model="dataForm.invoiceInfo" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
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
import SelectRelative from "@/components/SelectRelative.vue";
import { isMobile as isPhone, isEmail } from "@/utils/utils";
import useUtils from "@/hooks/useUtils";
const { hasPermission } = useUtils();

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm: any = reactive({
  id: "",
  customerId: "",
  customerName: "",
  invoicePrice: 0,
  invoiceInfo: "",
  invoiceDate: ""
});

const rules = ref({
  customerId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  invoicePrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  invoiceDate: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
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
    const fn = baseService.post("/invoice/saveOrUpdate", dataForm);
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
