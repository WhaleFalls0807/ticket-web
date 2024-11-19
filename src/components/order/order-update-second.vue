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
        <el-button v-if="!dataForm.logo" @click="uploadHandle">上传</el-button>
        <ImgPreview v-else url="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
      </el-form-item>
      <el-form-item prop="shenfenzheng" label="身份证">
        <el-button v-if="!dataForm.shenfenzheng" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
      <el-form-item prop="shenqingshu" label="申请书">
        <el-button v-if="!dataForm.shenqingshu" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
      <el-form-item prop="weituoshu" label="委托书">
        <el-button v-if="!dataForm.weituoshu" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
      <el-form-item prop="yingyezhizhao" label="营业执照">
        <el-button v-if="!dataForm.yingyezhizhao" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
      <el-form-item prop="gaizhanghetong" label="盖章合同">
        <el-button v-if="!dataForm.gaizhanghetong" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>

  <!-- 上传文件 -->
  <Upload ref="uploadRef" :url="`/sys/oss/upload`" @refreshDataList="setDataForm"></Upload>
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

const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  logo: "",
  shenfenzheng: {
    url: "xxx",
    fileName: "xxx"
  },
  shenqingshu: {
    url: "xxx",
    fileName: "xxx"
  },
  weituoshu: {
    url: "xxx",
    fileName: "xxx"
  },
  yingyezhizhao: {
    url: "xxx",
    fileName: "xxx"
  },
  gaizhanghetong: {
    url: "xxx",
    fileName: "xxx"
  }
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

// 上传文件
const uploadRef = ref();
const uploadHandle = () => {
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm.logo = value;
};
defineExpose({
  init
});
</script>

<style lang="less"></style>
