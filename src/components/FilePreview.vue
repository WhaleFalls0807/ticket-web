<template>
  <ul class="file-list">
    <li class="file-list-item">
      <span class="file-name one-line">{{ file.fileName }}</span>
      <svg-icon class="download-icon" name="icon-download" @click="exportHandle()"></svg-icon>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import SvgIcon from "@/components/base/svg-icon";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import qs from "qs";

const props = defineProps(["file"]);

const exportHandle = () => {
  window.location.href = `${app.api}${props.file.url}?${qs.stringify({
    token: getToken()
  })}`;
};
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

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
