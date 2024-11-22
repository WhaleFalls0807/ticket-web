<template>
  <div>
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item label="关键字">
        <el-input v-model="state.dataForm.keyword" placeholder="名称" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="成交状态">
        <ren-select v-model="state.dataForm.dealStatus" dict-type="dealStatus"></ren-select>
      </el-form-item> -->
      <el-form-item label="负责人" v-if="state.hasPermission('approve:info')">
        <el-select v-model="state.dataForm.ownerId">
          <el-option v-for="item in ownerUserList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
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
      @selection-change="selectionChange"
      @sort-change="state.dataListSortChangeHandle"
      style="width: 100%"
      ref="tableRef"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" header-align="center" align="center">
        <template v-slot="scope">
          <el-link type="primary" @click="showDetail(scope.row.id)">{{ scope.row.customerName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="enterprise" label="类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("enterprise", scope.row.enterprise) }}
        </template>
      </el-table-column>
      <el-table-column prop="source" label="客户来源" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("source", scope.row.source) }}
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="客户行业" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("industry", scope.row.industry) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
      <!-- <el-table-column prop="" label="客户详情" header-align="center" align="center">
        <template v-slot="scope">
          <el-button @click="showDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="showOperate.update" type="primary" link @click="addOrUpdateHandle(scope.row.id)">
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
    <!-- 详情 -->
    <CustomerDetails
      ref="detailRef"
      :showOperate="showOperate"
      :ownerUserList="ownerUserList"
      @deleteHandle="state.deleteHandle"
      @addOrUpdateHandle="addOrUpdateHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdateRef"
      :ownerUserList="ownerUserList"
      @refreshDataList="state.getDataList"
    ></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import baseService from "@/service/baseService";
import useView from "@/hooks/useView";
import { reactive, ref, toRefs, computed, onMounted } from "vue";
import AddOrUpdate from "./customer-add-or-update.vue";
import CustomerDetails from "./CustomerDetails.vue";
import type { TableInstance } from "element-plus";

const props = defineProps({
  selectionRadio: {
    type: Boolean,
    default: false
  }
});
const view = reactive({
  getDataListURL: "/customer/page",
  getDataListIsPage: true,
  deleteURL: "/customer/del",
  deleteIsBatch: true,
  dataForm: {
    keyword: "",
    dealStatus: 1,
    ownerId: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });
console.log("state", state);
const tableRef = ref<TableInstance>();
const selected = ref();
const selectionChange = (val: any) => {
  console.log("val", val);
  if (props.selectionRadio && val.length > 1) {
    tableRef.value!.clearSelection();
    const lastObj = val[val.length - 1];
    tableRef.value!.toggleRowSelection(lastObj, true);
    state.dataListSelectionChangeHandle([lastObj]);
    selected.value = [lastObj];
  } else {
    selected.value = val;
    state.dataListSelectionChangeHandle(val);
  }

  setTimeout(() => {
    console.log("state.dataListSelections", state.dataListSelections);
  });
};
const ownerUserList: any = ref([]);

// 获取负责人列表
const getOwnerUserList = () => {
  baseService
    .get(`/sys/user/list/byPerm`, {
      permission: "approve:info"
    })
    .then((res) => {
      ownerUserList.value = res.data;
    });
};
onMounted(() => {
  getOwnerUserList();
});
const showOperate = computed(() => {
  return {
    save: state.hasPermission("customer:save"),
    delete: state.hasPermission("customer:delete"),
    update: state.hasPermission("customer:update")
  };
});

// 查看详情
const detailRef = ref();
const showDetail = (id: string) => {
  detailRef.value.init(id);
};
// 添加或编辑
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id);
};

defineExpose({
  dataListSelections: selected
});
</script>
