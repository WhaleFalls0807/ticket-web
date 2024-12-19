<template>
  <div>
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item label="关键字">
        <el-input v-model="state.dataForm.keyword" placeholder="名称" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showOperate.save" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showOperate.delete" type="danger" @click="state.deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      border
      @sort-change="state.dataListSortChangeHandle"
      style="width: 100%"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" header-align="center" align="center"></el-table-column>
      <el-table-column
        prop="invoiceDate"
        label="开票时间"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column prop="" label="开票金额" header-align="center" align="center">
        <template v-slot="scope">
          <span>{{ convertCurrency(scope.row.invoicePrice) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceInfo" label="开票详情" header-align="center" align="center"></el-table-column>

      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="showOperate.update" type="primary" link @click="addOrUpdateHandle(scope.row)">
            修改
          </el-button>
          <el-button v-if="showOperate.delete" type="primary" link @click="state.deleteHandle(scope.row.id)">
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import baseService from "@/service/baseService";
import useView from "@/hooks/useView";
import { reactive, ref, toRefs, computed, onMounted } from "vue";
import AddOrUpdate from "./invoice-add-or-update.vue";
import type { TableInstance } from "element-plus";
import useUtils from "@/hooks/useUtils";
const { convertCurrency } = useUtils();

const view = reactive({
  getDataListURL: "/invoice/page",
  getDataListIsPage: true,
  deleteURL: "/invoice/del",
  deleteIsBatch: true,
  dataForm: {
    keyword: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const showOperate = computed(() => {
  return {
    save: state.hasPermission("invoice:save"),
    delete: state.hasPermission("invoice:delete"),
    update: state.hasPermission("invoice:update")
  };
});

// 添加或编辑
const addOrUpdateRef = ref();
const addOrUpdateHandle = (item?: any) => {
  addOrUpdateRef.value.init(item);
};
</script>
