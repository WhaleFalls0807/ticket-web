<template>
  <div class="img-preview" @click="handlePicturePreview(url)">
    <img :src="url" alt="" />
    <svg-icon class="zoomin-icon" name="icon-zoomin" @click="handlePicturePreview(url)"></svg-icon>
  </div>
  <!-- 展示图片 -->
  <el-dialog v-model="dialogVisible" :width="isMobile ? '90%' : '50%'">
    <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SvgIcon from "@/components/base/svg-icon";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps(["url"]);
const isMobile = useMediaQuery("(max-width: 768px)");

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePicturePreview = (url: string) => {
  dialogImageUrl.value = url!;
  dialogVisible.value = true;
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
  .zoomin-icon {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    color: #fff;
  }
  &:hover .zoomin-icon {
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
