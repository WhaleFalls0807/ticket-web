<template>
  <div>
    <el-form :inline="true" :model="state.dataForm">
      <el-form-item>
        <el-input v-model="state.dataForm.keyword" placeholder="关键字" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="state.dataForm.hasOwnProperty('orderStatus')">
        <ren-select v-model="state.dataForm.orderStatus" dict-type="orderStatus" placeholder="订单状态"></ren-select>
      </el-form-item>
      <el-form-item label="负责人" v-if="state.dataForm.hasOwnProperty('ownerId')">
        <el-select v-model="state.dataForm.ownerId">
          <el-option v-for="item in ownerUserList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="selectTime"
          type="datetimerange"
          value-format="x"
          :shortcuts="shortcuts"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
        <el-button v-if="showOperate.seas" type="danger" @click="seas()">放回公海</el-button>
        <el-button v-if="showOperate.assign" type="danger" @click="assign()">指派</el-button>
        <el-button v-if="showOperate.approve" type="danger" @click="approve()">审批</el-button>
        <el-button v-if="showOperate.delete" type="danger" @click="state.deleteHandle()">删除</el-button>
      </el-form-item>
      <el-form-item v-if="showOperate.grab">
        <CountDown :nextTime="Date.now() + 5000" />
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
      <el-table-column prop="orderStatus" label="订单状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("orderStatus", scope.row.orderStatus) }}
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
      <el-table-column prop="" label="详情" header-align="center" align="center">
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
    <!-- 指派 -->
    <Assign ref="assignRef" @refreshDataList="state.getDataList" />
    <!-- 审批 -->
    <Approve ref="approveRef" @refreshDataList="state.getDataList" />
    <!-- 详情 -->
    <OrderDetails
      ref="detailRef"
      @refreshDataList="state.getDataList"
      :showOperate="showOperate"
      @grabOrder="grabOrder"
      @seas="seas"
      @assign="assign"
      @approve="approve"
      @deleteHandle="state.deleteHandle"
      @addOrUpdateHandle="addOrUpdateHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { computed, reactive, ref, toRefs, onMounted } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import Assign from "./Assign.vue";
import Approve from "./Approve.vue";
import OrderDetails from "./OrderDetails.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddOrUpdate from "./order-update.vue";
import CountDown from "@/components/CountDown.vue";
const props = defineProps(["type", "getDataListURL", "dataForm"]);
const emit = defineEmits(["refreshDataList"]);
const selectTime = ref("");
const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return [start, end];
    }
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    }
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return [start, end];
    }
  }
];

const dataForm: any = {
  keyword: "",
  ownerId: "",
  orderStatus: "",
  startDate: selectTime.value ? selectTime.value[0] : "",
  endDate: selectTime.value ? selectTime.value[1] : ""
};
if (props.type === "grab" || props.type === "seas") {
  dataForm.deal = 0;
  delete dataForm.ownerId;
} else if (props.type === "todo") {
  dataForm.deal = 1;
} else if (props.type === "completed") {
  dataForm.deal = 2;
} else if (props.type === "awaitingApproval") {
  dataForm.reviewType = 1;
} else if (props.type === "approved") {
  dataForm.reviewType = 2;
}
const view = reactive({
  getDataListURL: props.getDataListURL,
  getDataListIsPage: true,
  deleteURL: "/order/delete",
  deleteIsBatch: true,
  dataForm: { ...dataForm }
  // dataForm: {
  // keyword: "",
  // ownerId: "",
  // startDate: selectTime.value ? selectTime.value[0] : "",
  // endDate: selectTime.value ? selectTime.value[1] : "",
  // orderStatus: "",
  // deal: 0,
  // reviewType: 0
  // }
});

const state: any = reactive({
  ...useView(view),
  ...toRefs(view)
});
const ownerUserList: any = ref([]);

// 获取负责人列表
const getOwnerUserList = () => {
  let permission = "";
  if (
    props.type === "todo" ||
    props.type === "completed" ||
    props.type === "awaitingApproval" ||
    props.type === "approved"
  ) {
    permission = "todo:list,todo:info";
  }
  if (permission) {
    baseService
      .get(`/sys/user/list/byPerm`, {
        permission: permission
      })
      .then((res) => {
        ownerUserList.value = res.data;
      });
  }
};
onMounted(() => {
  getOwnerUserList();
});
const showOperate = computed(() => {
  return {
    grab:
      (props.type === "grab" && state.hasPermission("grab:grab")) ||
      (props.type === "seas" && state.hasPermission("seas:grab")),
    seas: props.type === "grab" && state.hasPermission("grab:seas"),
    assign:
      (props.type === "grab" && state.hasPermission("grab:assign")) ||
      (props.type === "todo" && state.hasPermission("toto:assign")) ||
      (props.type === "seas" && state.hasPermission("seas:assign")),
    approve: props.type === "awaitingApproval" && state.hasPermission("approve:approve"),
    delete:
      (props.type === "grab" && state.hasPermission("grab:delete")) ||
      (props.type === "todo" && state.hasPermission("todo:delete")) ||
      (props.type === "completed" && state.hasPermission("completed:delete")) ||
      (props.type === "awaitingApproval" && state.hasPermission("approve:delete")) ||
      (props.type === "approved" && state.hasPermission("approve:delete")) ||
      (props.type === "seas" && state.hasPermission("seas:delete")),
    update: props.type === "todo" && state.hasPermission("todo:update")
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
        .post(`/order/choose`, {
          userId: state.user.id,
          orderIds: id ? [id] : state.dataListSelections && state.dataListSelections.map((item: IObject) => item.id)
        })
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
  if (!id && state.dataListSelections && state.dataListSelections.length <= 0) {
    return ElMessage({
      message: "请选择操作项",
      type: "warning",
      duration: 500
    });
  }
  assignRef.value.init(
    id ? [id] : state.dataListSelections && state.dataListSelections.map((item: IObject) => item.id)
  );
};
// 审批
const approveRef = ref();
const approve = (customerName?: string, id?: string) => {
  if (!id && state.dataListSelections && state.dataListSelections.length <= 0) {
    return ElMessage({
      message: "请选择操作项",
      type: "warning",
      duration: 500
    });
  }
  approveRef.value.init(
    id ? [id] : state.dataListSelections && state.dataListSelections.map((item: IObject) => item.id)
  );
};
// 查看详情
const detailRef = ref();
const showDetail = (id: string, customerName: string) => {
  detailRef.value.init(id, customerName);
};
// 添加或编辑
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id);
};
</script>
