<template>
  <div class="img-preview" @click="handlePicturePreview(url)">
    <img :src="app.api_img_file + url" alt="" />
    <div class="icon">
      <svg-icon class="zoomin-icon" name="icon-zoomin" @click="handlePicturePreview(url)"></svg-icon>
      <svg-icon v-if="delete" class="ml10" name="icon-delete-fill" @click="deleteImg()"></svg-icon>
    </div>
  </div>
  <!-- 展示图片 -->
  <el-dialog v-model="dialogVisible">
    <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SvgIcon from "@/components/base/svg-icon";
import app from "@/constants/app";

const props = defineProps({
  url: {
    type: String,
    default: ""
  },
  delete: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["deleteImg"]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePicturePreview = (url: string) => {
  dialogImageUrl.value = app.api_img_file + url;
  dialogVisible.value = true;
};
const deleteImg = () => {
  emit("deleteImg");
};
</script>

<style scoped lang="less">
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
</style>
