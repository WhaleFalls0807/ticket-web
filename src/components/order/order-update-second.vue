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
        <el-button v-if="!dataForm.logo" @click="uploadHandle('logo', 'img')">上传图片</el-button>
        <FileImgPreview v-else fileType="img" :url="dataForm.logo" delete @deleteFileImg="dataForm.logo = ''" />
      </el-form-item>
      <el-form-item prop="idcard" label="身份证">
        <el-button v-if="!dataForm.idcard" @click="uploadHandle('idcard', 'file')">上传文件</el-button>
        <FileImgPreview v-else fileType="file" :url="dataForm.idcard" delete @deleteFileImg="dataForm.idcard = ''" />
      </el-form-item>
      <el-form-item prop="applyBook" label="申请书">
        <el-button v-if="!dataForm.applyBook" @click="uploadHandle('applyBook', 'file')">上传文件</el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.applyBook"
          delete
          @deleteFileImg="dataForm.applyBook = ''"
        />
      </el-form-item>
      <el-form-item prop="commission" label="委托书">
        <el-button v-if="!dataForm.commission" @click="uploadHandle('commission', 'file')">上传文件</el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.commission"
          delete
          @deleteFileImg="dataForm.commission = ''"
        />
      </el-form-item>
      <el-form-item prop="businessLicense" label="营业执照">
        <el-button v-if="!dataForm.businessLicense" @click="uploadHandle('businessLicense', 'file')">
          上传文件
        </el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.businessLicense"
          delete
          @deleteFileImg="dataForm.businessLicense = ''"
        />
      </el-form-item>
      <el-form-item prop="sealedContract" label="盖章合同">
        <el-button v-if="!dataForm.sealedContract" @click="uploadHandle('sealedContract', 'file')">上传文件</el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.sealedContract"
          delete
          @deleteFileImg="dataForm.sealedContract = ''"
        />
      </el-form-item>
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
import { nextTick, reactive, ref } from "vue";
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
  logo: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  idcard: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  applyBook: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  commission: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  businessLicense: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  sealedContract: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
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
