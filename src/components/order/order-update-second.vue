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
      <el-form-item prop="logo" label="logo">
        <el-button v-if="!dataForm.logo" @click="uploadHandle('logo')">上传</el-button>
        <ImgPreview v-else :url="dataForm.logo" :delete="true" @deleteImg="dataForm.logo = ''" />
      </el-form-item>
      <el-form-item prop="idcard" label="身份证">
        <el-button v-if="!dataForm.idcard" @click="uploadHandle('idcard')">上传</el-button>
        <FilePreview
          v-else
          :file="{
            url: dataForm.idcard,
            fileName: dataForm.idcard.substring(dataForm.idcard.lastIndexOf('/') + 1)
          }"
          :download="false"
          :delete="true"
          @deleteFile="dataForm.idcard = ''"
        />
      </el-form-item>
      <el-form-item prop="applyBook" label="申请书">
        <el-button v-if="!dataForm.applyBook" @click="uploadHandle('applyBook')">上传</el-button>
        <FilePreview
          v-else
          :file="{
            url: dataForm.applyBook,
            fileName: dataForm.applyBook.substring(dataForm.applyBook.lastIndexOf('/') + 1)
          }"
          :download="false"
          :delete="true"
          @deleteFile="dataForm.applyBook = ''"
        />
      </el-form-item>
      <el-form-item prop="commission" label="委托书">
        <el-button v-if="!dataForm.commission" @click="uploadHandle('commission')">上传</el-button>
        <FilePreview
          v-else
          :file="{
            url: dataForm.commission,
            fileName: dataForm.commission.substring(dataForm.commission.lastIndexOf('/') + 1)
          }"
          :download="false"
          :delete="true"
          @deleteFile="dataForm.commission = ''"
        />
      </el-form-item>
      <el-form-item prop="businessLicense" label="营业执照">
        <el-button v-if="!dataForm.businessLicense" @click="uploadHandle('businessLicense')">上传</el-button>
        <FilePreview
          v-else
          :file="{
            url: dataForm.businessLicense,
            fileName: dataForm.businessLicense.substring(dataForm.businessLicense.lastIndexOf('/') + 1)
          }"
          :download="false"
          :delete="true"
          @deleteFile="dataForm.businessLicense = ''"
        />
      </el-form-item>
      <el-form-item prop="sealedContract" label="盖章合同">
        <el-button v-if="!dataForm.sealedContract" @click="uploadHandle('sealedContract')">上传</el-button>
        <FilePreview
          v-else
          :file="{
            url: dataForm.sealedContract,
            fileName: dataForm.sealedContract.substring(dataForm.sealedContract.lastIndexOf('/') + 1)
          }"
          :download="false"
          :delete="true"
          @deleteFile="dataForm.sealedContract = ''"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>

  <!-- 上传文件 -->
  <Upload ref="uploadRef" :url="`/sys/oss/upload/${dataForm.id}`" @refreshDataList="setDataForm"></Upload>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import SelectRelative from "@/components/SelectRelative.vue";
import Upload from "@/components/Upload.vue";
import ImgPreview from "@/components/ImgPreview.vue";
import FilePreview from "@/components/FilePreview.vue";
import app from "@/constants/app";

const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const currentUploadType = ref("");

const dataForm: any = reactive({
  id: "",
  logo: "",
  idcard: "",
  applyBook: "",
  commission: "",
  businessLicense: "",
  sealedContract: ""
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
const init = (detail: any) => {
  visible.value = true;
  const { id, logo, idcard, applyBook, commission, businessLicense, sealedContract } = detail;
  Object.assign(dataForm, { id, logo, idcard, applyBook, commission, businessLicense, sealedContract });
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
const uploadHandle = (type: any) => {
  currentUploadType.value = type;
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm[currentUploadType.value] = value;
};
defineExpose({
  init
});
</script>

<style lang="less"></style>
