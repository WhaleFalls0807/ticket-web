<template>
  <div>
    <el-form :inline="true" :model="state.dataForm">
      <el-form-item>
        <el-input v-model="state.dataForm.customerName" placeholder="客户名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('sys:schedule:pause')" type="primary" @click="grabOrder()">抢单</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('sys:schedule:resume')" type="danger" @click="seas()">放回公海</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('sys:schedule:run')" type="danger" @click="assign()">指派</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <CountDown :nextTime="1731124800000" /> -->
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
      <el-table-column
        prop="customerName"
        label="客户名称"
        show-overflow-tooltip
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column prop="type" label="类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="priority" label="优先级" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.priority === 1" size="small">1</el-tag>
          <el-tag v-else size="small" type="danger">其他</el-tag>
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
      <el-table-column prop="" label="客户详情" header-align="center" align="center">
        <template v-slot="scope">
          <el-button @click="showDetail(scope.row.id, scope.row.customerName)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        header-align="center"
        align="center"
        width="248"
        v-if="Object.values(showOperate).some((item) => item === true)"
      >
        <template v-slot="scope">
          <el-button
            v-if="showOperate.grab"
            type="primary"
            link
            @click="grabOrder(scope.row.customerName, scope.row.id)"
          >
            抢单
          </el-button>
          <el-button v-if="showOperate.seas" type="primary" link @click="seas(scope.row.customerName, scope.row.id)">
            放回公海
          </el-button>
          <el-button
            v-if="showOperate.assign"
            type="primary"
            link
            @click="assign(scope.row.customerName, scope.row.id)"
          >
            指派
          </el-button>
          <el-button
            v-if="showOperate.approve"
            type="primary"
            link
            @click="approve(scope.row.customerName, scope.row.id)"
          >
            审批
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
    <!-- 指派 -->
    <Assign ref="assignRef" @refreshDataList="state.getDataList" />
    <!-- 审批 -->
    <Approve ref="approveRef" @refreshDataList="state.getDataList" />
    <!-- 详情 -->
    <CustomerDetails
      ref="detailRef"
      @refreshDataList="state.getDataList"
      :showOperate="showOperate"
      @grabOrder="grabOrder"
      @seas="seas"
      @assign="assign"
      @approve="approve"
    />
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { computed, reactive, ref, toRefs } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import Assign from "./Assign.vue";
import Approve from "./Approve.vue";
import CustomerDetails from "./CustomerDetails.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CountDown from "./CountDown.vue";
const props = defineProps(["type"]);
const emit = defineEmits(["refreshDataList"]);

const view = reactive({
  getDataListURL: "/sys/oss/page",
  getDataListIsPage: true,
  dataForm: {
    type: props.type,
    customerName: ""
  }
});

const state = reactive({
  ...useView(view),
  ...toRefs(view),
  dataList: [
    {
      id: "123qwe",
      customerName: "test",
      type: "test-type",
      priority: 1,
      createDate: "2024"
    }
  ]
});
const showOperate = computed(() => {
  return {
    grab:
      (props.type === "daiban" && state.hasPermission("order:grab")) ||
      (props.type === "gonghai" && state.hasPermission("seas:grab")),
    seas:
      (props.type === "daiban" && state.hasPermission("order:seas")) ||
      (props.type === "yiban" && state.hasPermission("order:seas")) ||
      (props.type === "daishenpi" && state.hasPermission("approve:seas")),
    assign:
      (props.type === "daiban" && state.hasPermission("order:assign")) ||
      (props.type === "yiban" && state.hasPermission("order:assign")) ||
      (props.type === "gonghai" && state.hasPermission("approve:assign")),
    approve: props.type === "daishenpi" && state.hasPermission("approve:approve")
  };
});
// 抢单
const grabOrder = (customerName?: string, id?: string) => {
  if (!id && state.dataListSelections && state.dataListSelections.length <= 0) {
    return ElMessage({
      message: "请选择操作项",
      type: "warning",
      duration: 500
    });
  }
  ElMessageBox.confirm("确定进行[抢单]操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      baseService
        .put(
          "/sys/schedule/pause",
          id ? [id] : state.dataListSelections && state.dataListSelections.map((item: IObject) => item.id)
        )
        .then((res) => {
          ElMessage.success({
            message: "抢单成功",
            duration: 500,
            onClose: () => {
              state.getDataList();
            }
          });
        })
        .catch(() => {
          ElMessage.error({
            message: "抢单失败",
            duration: 500
          });
        });
    })
    .catch(() => {
      //
    });
};
// 放回公海
const seas = (customerName?: string, id?: string) => {
  if (!id && state.dataListSelections && state.dataListSelections.length <= 0) {
    return ElMessage({
      message: "请选择操作项",
      type: "warning",
      duration: 500
    });
  }
  ElMessageBox.confirm("确定进行[放回公海]操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      baseService
        .put(
          "/sys/schedule/pause",
          id ? [id] : state.dataListSelections && state.dataListSelections.map((item: IObject) => item.id)
        )
        .then((res) => {
          ElMessage.success({
            message: "放回公海成功",
            duration: 500,
            onClose: () => {
              state.getDataList();
            }
          });
        })
        .catch(() => {
          ElMessage.error({
            message: "放回公海失败",
            duration: 500
          });
        });
    })
    .catch(() => {
      //
    });
};
// 指派
const assignRef = ref();
const assign = (customerName?: string, id?: string) => {
  assignRef.value.init(id);
};
// 审批
const approveRef = ref();
const approve = (customerName?: string, id?: string) => {
  approveRef.value.init(id);
};
// 查看详情
const detailRef = ref();
const showDetail = (id: string, customerName: string) => {
  detailRef.value.init(id, customerName);
};
</script>
