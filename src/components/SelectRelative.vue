<template>
  <div>
    <el-tag v-if="relativeObj.id" closable :disable-transitions="false" @close="deleteRelative">
      {{ relativeObj.name }}
    </el-tag>
    <svg-icon v-else name="icon-plus-circle-fill" @click="selectRelative"></svg-icon>
  </div>

  <Relative ref="relativeRef" v-if="relativeVisible" @getSelected="getSelected" />
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import Relative from "@/components/Relative.vue";
import SvgIcon from "@/components/base/svg-icon";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const relativeVisible = ref(false);
const relativeRef = ref();
const relativeObj = computed(() => {
  return {
    id: props.modelValue,
    name: ""
  };
});
const selectRelative = () => {
  relativeVisible.value = true;
  nextTick(() => {
    relativeRef.value.init();
  });
};
const getSelected = (s: any) => {
  relativeObj.value.id = s.id;
  relativeObj.value.name = s.name;

  emit("update:modelValue", relativeObj.value.id);
};
const deleteRelative = () => {
  relativeObj.value.id = "";
  relativeObj.value.name = "";
};
</script>

<style lang="less"></style>
