<!-- 企业文书 -->
<template>
  <div class="mod-oss__oss">
    <el-form :inline="true" :model="state.dataForm">
      <el-form-item v-if="state.hasPermission('documents:upload')">
        <el-button type="primary" @click="uploadHandle()">上传文件</el-button>
      </el-form-item>
      <el-form-item v-if="state.hasPermission('documents:delete')">
        <el-button type="danger" @click="state.deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      border
      @selection-change="state.dataListSelectionChangeHandle"
      @sort-change="state.dataListSortChangeHandle"
      style="width: 100%"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="url" label="URL地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="count" label="下载次数" header-align="center" align="center"></el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" link @click="state.exportHandle()">导出</el-button>
          <el-button type="primary" link @click="state.deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="primary" link @click="downloadDetail(scope.row.id)">查看下载详情</el-button>
        </template>
      </el-table-column>
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
    <!-- 弹窗, 上传文件 -->
    <upload v-if="state.uploadVisible" ref="uploadRef" @refreshDataList="state.getDataList" url="/xxx"></upload>
    <DownloadDetail v-if="state.downloadVisible" ref="downloadRef"></DownloadDetail>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import DownloadDetail from "./DownloadDetail.vue";
import Upload from "@/components/Upload.vue";

const uploadRef = ref();
const downloadRef = ref();

const view = reactive({
  getDataListURL: "/sys/oss/page",
  getDataListIsPage: true,
  deleteURL: "/sys/oss",
  deleteIsBatch: true,
  exportURL: "/sys/log/error/export",
  dataForm: {},
  uploadVisible: false,
  downloadVisible: false
});

const state = reactive({ ...useView(view), ...toRefs(view) });

// 上传文件
const uploadHandle = () => {
  state.uploadVisible = true;
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 查看下载详情
const downloadDetail = (id: any) => {
  state.downloadVisible = true;
  nextTick(() => {
    downloadRef.value.init(id);
  });
};
</script>
