<template>
  <div>
    <el-tag v-if="relativeObj.id" closable :disable-transitions="false" @close="deleteRelative">
      {{ relativeObj.name }}
    </el-tag>
    <svg-icon v-else name="icon-plus-circle-fill" @click="selectRelative"></svg-icon>
  </div>

  <Relative ref="relativeRef" v-if="relativeVisible" @getSelected="getSelected" type="customer" />
</template>

<script lang="ts" setup>
import { nextTick, ref, reactive } from "vue";
import Relative from "@/components/Relative.vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "getName"]);

const relativeVisible = ref(false);
const relativeRef = ref();
const relativeObj = reactive({
  id: props.modelValue,
  name: ""
});
const selectRelative = () => {
  relativeVisible.value = true;
  nextTick(() => {
    relativeRef.value.init();
  });
};
const getSelected = (s: any) => {
  relativeObj.id = s.id;
  relativeObj.name = s.name;

  emit("update:modelValue", relativeObj.id);
  emit("getName", relativeObj.name);
};
const deleteRelative = () => {
  relativeObj.id = "";
  relativeObj.name = "";
};
</script>

<style lang="less"></style>
