<template>
  <div v-if="isEdit" class="edit-box">
    <el-input v-model="model" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
    <div class="mt10">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="save" :loading="loading">保存</el-button>
    </div>
  </div>
  <div v-else class="content-box">
    <div class="content">{{ model }}</div>
    <svg-icon class="edit-icon" name="icon-edit-fill" @click="handleEdit"></svg-icon>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const emit = defineEmits(["save"]);
const model = defineModel();
let oldData = model.value;
const isEdit = ref(false);
const loading = ref(false);
const handleEdit = () => {
  isEdit.value = true;
};
// 取消
const cancel = () => {
  isEdit.value = false;
  model.value = oldData;
};
// 保存
const save = () => {
  loading.value = true;
  emit("save", (result: any) => {
    if (result.status) {
      ElMessage.success({
        message: result.msg
      });
      //修改成功给旧值重新赋值
      oldData = model.value;
    } else {
      ElMessage.error({
        message: result.msg
      });
      //修改失败恢复为旧值
      model.value = oldData;
    }
    loading.value = false;
    isEdit.value = false;
  });
};
</script>

<style scoped lang="less">
.edit-box {
  width: 100%;
}
.content-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover .edit-icon {
    display: block;
  }

  .content {
    width: 95%;
  }
  .edit-icon {
    display: none;
  }
}
</style>
