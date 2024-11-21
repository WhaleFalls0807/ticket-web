<template>
  <ul class="file-list">
    <li class="file-list-item">
      <span class="file-name one-line">{{ file.fileName }}</span>
      <svg-icon v-if="download" class="download-icon" name="icon-download" @click="downloadFile(file.url)"></svg-icon>
      <svg-icon v-if="delete" class="svg-icon ml10" name="icon-delete-fill" @click="deleteFile()"></svg-icon>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import SvgIcon from "@/components/base/svg-icon";
import useUtils from "@/hooks/useUtils";
const { downloadFile } = useUtils();
const props = defineProps({
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
  },
  delete: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["deleteFile"]);

const deleteFile = () => {
  emit("deleteFile");
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
