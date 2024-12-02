<template>
  <el-dialog
    v-model="visible"
    title="上传文件"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-upload
      :action="uploadUrl"
      :file-list="fileList"
      drag
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      class="text-center"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或点击上传</div>
      <template v-slot:tip>
        <div class="el-upload__tip">{{ tips }}</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
import app from "@/constants/app";
import { ElMessage } from "element-plus";
const props = defineProps(["url", "fileType"]);
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const num = ref(0);
const fileList = ref<IObject[]>();

const uploadUrl = computed(() => {
  return `${app.api}${props.url}?token=${getToken()}`;
});
const imgTypes = ["image/jpg", "image/jpeg", "image/png"];
const imgTypesTips = "只支持 jpg、png 格式文件！";
const fileTypes = [
  "application/pdf",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // "text/plain",
  // "application/zip"
];
// const fileTypesTips = "只支持 pdf、docx、txt、zip 格式文件！";
const fileTypesTips = "只支持 pdf 格式文件！";
const tips = computed(() => {
  if (props.fileType === "img") {
    return imgTypesTips;
  } else if (props.fileType === "file") {
    return fileTypesTips;
  } else {
    return "";
  }
});
const init = () => {
  visible.value = true;
  num.value = 0;
  fileList.value = [];
};
const close = () => {
  visible.value = false;
  num.value = 0;
  fileList.value = [];
};
// 上传之前
const beforeUploadHandle = (file: IObject) => {
  if (props.fileType === "img") {
    if (!imgTypes.includes(file.type)) {
      ElMessage.error(imgTypesTips);
      return false;
    }
  } else if (props.fileType === "file") {
    if (!fileTypes.includes(file.type)) {
      ElMessage.error(fileTypesTips);
      return false;
    }
  }

  // if (file.size / 1024 / 1024 > 20) {
  //   ElMessage.error("文件大小不能超过 20MB!");
  //   return false;
  // }
  num.value++;
};

// 上传成功
const successHandle = (res: IObject, file: IObject, list: IObject[]) => {
  if (res.code !== 0) {
    return ElMessage.error(res.msg);
  }

  fileList.value = list;
  num.value--;
  if (num.value === 0) {
    ElMessage.success({
      message: "成功",
      duration: 500,
      onClose: () => {
        close();
        emit("refreshDataList", res.data);
      }
    });
  }
};

defineExpose({
  init
});
</script>
