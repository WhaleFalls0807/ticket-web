<template>
  <el-select
    v-model="value"
    @change="$emit('update:modelValue', $event)"
    @clear="$emit('update:modelValue', '')"
    :placeholder="placeholder"
    :clearable="clearable"
  >
    <el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value="data.dictValue">
      {{ data.dictLabel }}
    </el-option>
  </el-select>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { getDictDataList } from "@/utils/utils";
import { useAppStore } from "@/store";
export default defineComponent({
  name: "RenSelect",
  props: {
    modelValue: [Number, String],
    dictType: String,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const store = useAppStore();
    return {
      value: computed(() => `${props.modelValue}`),
      dataList: getDictDataList(store.state.dicts, props.dictType)
    };
  }
});
</script>
