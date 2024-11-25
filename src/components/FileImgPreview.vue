<template>
  <div v-if="url" class="img-preview" @click="handlePicturePreview(url)">
    <img :src="app.api_img_file + url" alt="" />
    <div class="icon">
      <svg-icon class="zoomin-icon" name="icon-zoomin" @click="handlePicturePreview(url)"></svg-icon>
      <svg-icon v-if="delete" class="ml10" name="icon-delete-fill" @click="emit('deleteFileImg')"></svg-icon>
    </div>
  </div>
  <ul v-if="file" class="file-list">
    <li class="file-list-item">
      <span class="file-name one-line">{{ file.fileName }}</span>
      <svg-icon v-if="download" class="download-icon" name="icon-download" @click="downloadFile(file.url)"></svg-icon>
      <svg-icon v-if="delete" class="svg-icon ml10" name="icon-delete-fill" @click="emit('deleteFileImg')"></svg-icon>
    </li>
  </ul>

  <!-- 展示图片 -->
  <el-dialog v-model="dialogVisible" :width="isMobile ? '90%' : '50%'">
    <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SvgIcon from "@/components/base/svg-icon";
import { useMediaQuery } from "@vueuse/core";
import app from "@/constants/app";
import useUtils from "@/hooks/useUtils";

const { downloadFile } = useUtils();

const props = defineProps({
  url: {
    type: String,
    default: ""
  },
  delete: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object,
    default: {
      url: "",
      fileName: ""
    }
  },
  download: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["deleteFileImg"]);
const isMobile = useMediaQuery("(max-width: 768px)");

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePicturePreview = (url: string) => {
  dialogImageUrl.value = app.api_img_file + url;
  dialogVisible.value = true;
};
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

.img-preview {
  width: 146px;
  height: 146px;
  position: relative;
  img {
    width: 100%;
  }
  .icon {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 20px;
    text-align: center;
    color: #fff;
  }
  &:hover .icon {
    display: block;
    z-index: 999;
  }
  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
}
.file-list {
  width: 100%;
  .file-list-item {
    min-height: 40px;
    display: flex;
    align-items: center;
    color: @--color-primary;
    cursor: pointer;
    padding: 0 12px;
    background-color: #f8faff;

    .file-name {
      width: 90%;
    }
    .download-icon {
      display: none;
    }
    &:hover .download-icon {
      display: block;
    }
  }
}
</style>
