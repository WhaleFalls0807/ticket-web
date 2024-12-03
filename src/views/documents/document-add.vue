<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '50%'"
    :title="!dataForm.id ? '上传文件' : '修改文件'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="filePath" label="文件">
        <el-button v-if="!dataForm.filePath" @click="uploadHandle()">上传文件</el-button>
        <FileImgPreview
          v-else
          :fileType="computeFileType(dataForm.filePath)"
          :url="dataForm.filePath"
          delete
          :document="true"
          @deleteFileImg="dataForm.filePath = ''"
        />
      </el-form-item>
      <el-form-item prop="type" label="文书类型">
        <ren-select v-model="dataForm.type" dict-type="documentType"></ren-select>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
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
    :url="`/sys/oss/upload/${dataForm.id || uniqueId}`"
    fileType="file"
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
import useUtils from "@/hooks/useUtils";
import { customAlphabet } from "nanoid";
// 自定义生成器，只包含数字
const generateNumberId = customAlphabet("0123456789", 16);

// 定义一个唯一 ID
const uniqueId = ref(generateNumberId());

const isMobile = useMediaQuery("(max-width: 768px)");
const { computeFileType } = useUtils();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm: any = reactive({
  id: "",
  filePath: "",
  fileName: "",
  type: "",
  remark: ""
});

const rules = ref({
  filePath: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  type: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (detail: any) => {
  visible.value = true;
  if (detail) {
    const { id, fileName, filePath, type, remark } = detail;
    Object.assign(dataForm, {
      id,
      fileName,
      filePath,
      type,
      remark
    });
  }
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/corDocument/upload", dataForm);
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
const uploadHandle = () => {
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm.filePath = value;
  dataForm.fileName = value.substring(value.lastIndexOf("/") + 1);
};

defineExpose({
  init
});
</script>

<style lang="less"></style>
