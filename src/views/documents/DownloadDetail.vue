<template>
  <el-dialog v-model="visible" title="查看下载详情" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
      <el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.success === 1" type="success">下载成功</el-tag>
          <span v-if="scope.row.success !== 1" type="success">{{ scope.row.failedReason }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="下载时间"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="state.pageSizeChangeHandle"
      @current-change="state.pageCurrentChangeHandle"
    ></el-pagination>
    <template v-slot:footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";

import useView from "@/hooks/useView";

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);

const view = reactive({
  getDataListURL: "/corDocument/download/page",
  getDataListIsPage: true,
  dataForm: {
    associationId: ""
  }
});

const state: any = reactive({ ...useView(view), ...toRefs(view) });

const init = (id: any) => {
  visible.value = true;
  state.dataForm.associationId = id;
};
watch(
  () => state.dataForm.associationId,
  () => {
    state.getDataList();
  }
);
defineExpose({
  init
});
</script>
