<template>
  <div v-if="fileType === 'img'" class="img-preview">
    <img :src="app.api_img_file + url" alt="" />
    <div class="icon">
      <svg-icon class="zoomin-icon" name="icon-zoomin" @click="handlePicturePreview(url)"></svg-icon>
      <svg-icon v-if="delete" class="ml10" name="icon-delete-fill" @click="deleteFile(url)"></svg-icon>
    </div>
  </div>
  <ul v-if="fileType === 'file'" class="file-list">
    <li class="file-list-item">
      <span class="file-name one-line">{{ url.substring(url.lastIndexOf("/") + 1) }}</span>
      <svg-icon v-if="download" class="download-icon" name="icon-download" @click="downloadFile(url)"></svg-icon>
      <svg-icon v-if="delete" class="delete-icon ml10" name="icon-delete-fill" @click="deleteFile(url)"></svg-icon>
    </li>
  </ul>

  <!-- 展示图片 -->
  <el-dialog v-if="fileType === 'img'" v-model="dialogVisible" :width="isMobile ? '90%' : '50%'">
    <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SvgIcon from "@/components/base/svg-icon";
import { useMediaQuery } from "@vueuse/core";
import app from "@/constants/app";
import useUtils from "@/hooks/useUtils";
import baseService from "@/service/baseService";
import { ElMessage, ElMessageBox } from "element-plus";

const { downloadFile } = useUtils();

const props = defineProps({
  url: {
    type: String,
    default: ""
  },
  fileType: {
    type: String
  },
  delete: {
    type: Boolean,
    default: false
  },
  deleteParams: {
    type: Object,
    default: () => {}
  },
  download: {
    type: Boolean,
    default: false
  },
  document: {
    type: Boolean,
    default: false
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

// 删除文件
const deleteFile = (filePath: any) => {
  if (props.document) return emit("deleteFileImg");
  ElMessageBox.confirm("确定删除此文件吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    baseService.post("/order/delete/file", { ...props.deleteParams }).then((res) => {
      if (res.code === 0) {
        ElMessage.success({
          message: "删除成功"
        });
        emit("deleteFileImg");
      }
    });
  });
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
    color: @--color-primary;
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
    .download-icon,
    .delete-icon {
      display: none;
    }
    &:hover {
      .download-icon,
      .delete-icon {
        display: block;
      }
    }
  }
}
</style>
