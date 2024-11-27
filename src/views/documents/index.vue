<!-- 企业文书 -->
<template>
  <div class="mod-oss__oss">
    <el-form :inline="true" :model="state.dataForm">
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item v-if="state.hasPermission('documents:upload')">
        <el-button type="primary" @click="addOrUpdate()">上传文件</el-button>
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
      <el-table-column prop="fileName" label="文件" header-align="center" align="center"></el-table-column>
      <el-table-column
        prop="count"
        label="下载次数"
        header-align="center"
        align="center"
        v-if="state.hasPermission('documents:details')"
      >
        <template v-slot="scope">
          <template v-if="scope.row.count == 0">
            <span>
              {{ scope.row.count }}
            </span>
          </template>
          <template v-else>
            <el-link type="primary" @click="downloadDetail(scope.row.id)">{{ scope.row.count }}</el-link>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="文书类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("documentType", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column prop="createName" label="创建者" header-align="center" align="center"></el-table-column>
      <el-table-column prop="updater" label="更新者" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button
            type="primary"
            link
            v-if="state.hasPermission('documents:download')"
            @click="handleDownload(scope.row)"
          >
            导出
          </el-button>
          <el-button type="primary" link v-if="state.hasPermission('documents:update')" @click="addOrUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            type="primary"
            link
            v-if="state.hasPermission('documents:delete')"
            @click="state.deleteHandle(scope.row.id)"
          >
            删除
          </el-button>
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
    <DocumentAdd ref="addOrUpdateRef" @refreshDataList="state.getDataList"></DocumentAdd>
    <DownloadDetail v-if="state.downloadVisible" ref="downloadRef"></DownloadDetail>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import DownloadDetail from "./DownloadDetail.vue";
import DocumentAdd from "./document-add.vue";
import useUtils from "@/hooks/useUtils";
import baseService from "@/service/baseService";

const { downloadFileWithBuffer } = useUtils();
const downloadRef = ref();

const view = reactive({
  getDataListURL: "/corDocument/page",
  getDataListIsPage: true,
  deleteURL: "/corDocument/del",
  deleteIsBatch: true,
  exportURL: "/corDocument/download",
  dataForm: {},
  uploadVisible: false,
  downloadVisible: false
});

const state = reactive({ ...useView(view), ...toRefs(view) });

// 上传文件
const addOrUpdateRef = ref();
const addOrUpdate = (detail?: any) => {
  nextTick(() => {
    addOrUpdateRef.value.init(detail);
  });
};
// 查看下载详情
const downloadDetail = (id: any) => {
  state.downloadVisible = true;
  nextTick(() => {
    downloadRef.value.init(id);
  });
};
// 下载
const handleDownload = (item: any) => {
  baseService.get(`/corDocument/download/${item.id}`).then((res) => {
    state.getDataList();
    // 文件要已/file开头，代理拦截到9090
    baseService.getBlob("/file" + item.filePath).then((response) => {
      console.log("http", response);
      downloadFileWithBuffer(response, res.data);
    });
  });
};
</script>
