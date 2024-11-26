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
      <el-form-item prop="orderName" label="商标名称">
        <el-input v-model="dataForm.orderName" />
      </el-form-item>
      <el-form-item prop="businessType" label="业务类型">
        <ren-select v-model="dataForm.businessType" dict-type="businessType"></ren-select>
      </el-form-item>
      <el-form-item prop="applyMethod" label="申请方式">
        <el-input v-model="dataForm.applyMethod" />
      </el-form-item>
      <el-form-item prop="payType" label="支付类型">
        <el-button v-if="!dataForm.payType" @click="uploadHandle('payType', 'img')">上传图片</el-button>
        <FileImgPreview v-else fileType="img" :url="dataForm.payType" delete @deleteFileImg="dataForm.payType = ''" />
      </el-form-item>
      <el-form-item prop="officialPrice" label="官费">
        <el-input-number v-model="dataForm.officialPrice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="officialPrice" label="代理费">
        <el-input-number v-model="dataForm.agencyPrice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="totalPrice" label="总费用">
        <el-input-number v-model="dataForm.totalPrice" disabled />
      </el-form-item>
      <el-form-item prop="contract" label="原始合同">
        <el-button v-if="!dataForm.contract" @click="uploadHandle('contract', 'file')">上传文件</el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.contract"
          delete
          @deleteFileImg="dataForm.contract = ''"
        />
      </el-form-item>
      <el-form-item prop="aprice" label="甲方承担金额">
        <el-input-number v-model="dataForm.aprice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="bprice" label="乙方承担金额">
        <el-input-number v-model="dataForm.bprice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <!-- <el-form-item prop="yewu_name" label="业务名称">
        <el-input v-model="dataForm.yewu_name" />
      </el-form-item> -->
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>

  <!-- 上传文件 -->
  <Upload
    ref="uploadRef"
    :url="`/sys/oss/upload/${dataForm.id}`"
    :fileType="currentFileType"
    @refreshDataList="setDataForm"
  ></Upload>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import Upload from "@/components/Upload.vue";
import FileImgPreview from "@/components/FileImgPreview.vue";
const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const currentUploadKey = ref("");
const currentFileType = ref("img"); //img file

const totalPrice = computed(() => dataForm.officialPrice + dataForm.agencyPrice);
const dataForm: any = reactive({
  id: "",
  payType: "",
  officialPrice: 0,
  agencyPrice: 0,
  totalPrice: 0,
  contract: "",
  aprice: 0,
  bprice: 0,
  // yewu_name: "",
  applyMethod: "",
  businessType: "",
  orderName: ""
});
watch(
  () => totalPrice.value,
  (value) => {
    dataForm.totalPrice = value;
  }
);
const rules = ref({
  payType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  officialPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  agencyPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  totalPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  contract: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  aprice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  bprice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  applyMethod: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  businessType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  orderName: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (detail: any) => {
  visible.value = true;
  const {
    id,
    payType,
    officialPrice,
    agencyPrice,
    totalPrice,
    contract,
    aprice,
    bprice,
    applyMethod,
    businessType,
    orderName
  } = detail;
  Object.assign(dataForm, {
    id,
    payType,
    officialPrice,
    agencyPrice,
    totalPrice,
    contract,
    aprice,
    bprice,
    applyMethod,
    businessType,
    orderName
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
          close();
          emit("refreshDataList");
        }
      });
    });
  });
};

// 上传文件
const uploadRef = ref();
const uploadHandle = (key: any, fileType: any) => {
  currentUploadKey.value = key;
  currentFileType.value = fileType;
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm[currentUploadKey.value] = value;
};
defineExpose({
  init
});
</script>

<style lang="less"></style>
