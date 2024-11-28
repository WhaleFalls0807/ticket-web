<template>
  <div class="grab-contianer">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>池组</span>
        </div>
      </template>
      <div class="item">
        <div class="left">
          <span class="mr10">总单数</span>
          <el-tag class="mr10">{{ state.totalCount }}</el-tag>
          <span class="mr10">/</span>
          <span class="mr10">剩余可抢单数</span>
          <el-tag>{{ state.remainCount }}</el-tag>
        </div>
        <div class="right">
          <span class="mr10">已抢单数量</span>
          <el-tag>{{ state.grapedCount }}</el-tag>
        </div>
      </div>
    </el-card>

    <el-card shadow="hover" class="mt20">
      <template #header>
        <div class="card-header">
          <span>{{ store.state.user.username }}</span>
        </div>
      </template>
      <div class="item">
        <div class="left">
          <span class="mr10">总单数</span>
          <el-tag class="mr10">{{ state.userTotalCount }}</el-tag>
          <span class="mr10">/</span>
          <span class="mr10">剩余可抢单数</span>
          <el-tag>{{ state.userRemainCount }}</el-tag>
        </div>
        <div class="right">
          <span class="mr10">已抢单数量</span>
          <el-tag>{{ state.userGrapedCount }}</el-tag>
        </div>
      </div>
    </el-card>
    <div class="mt20 item">
      <div class="item-left">
        <p class="mr10" style="white-space: nowrap">设置刷新时间</p>
        <ren-select
          v-model="state.refreshTime"
          dict-type="refreshTime"
          :clearable="false"
          style="width: 160px"
        ></ren-select>
      </div>
      <div class="item-right">
        <el-button
          type="primary"
          @click="grabOrder"
          class="grab-btn"
          :loading="loading"
          :disabled="state.userRemainCount == 0"
        >
          抢单
        </el-button>
      </div>
    </div>
  </div>
  <div>
    <template v-if="hasPermission('sys:user:page')">
      <Order type="grab" getDataListURL="/order/all/page" />
    </template>
    <template v-else>
      <el-table :data="state.virtualTableData" border style="width: 100%">
        <el-table-column label="工单名称" prop="orderName" header-align="center" align="center"></el-table-column>
        <el-table-column label="客户名称" prop="customerName" header-align="center" align="center"></el-table-column>
        <el-table-column label="手机号" prop="phone" header-align="center" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" header-align="center" align="center"></el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElNotification } from "element-plus";
import baseService from "@/service/baseService";
import { reactive, ref, onMounted, onBeforeUnmount, watch, h } from "vue";
import Order from "@/components/order/Order.vue";
import useUtils from "@/hooks/useUtils";
const { hasPermission, store } = useUtils();
const loading = ref(false);
let state: any = reactive({
  remainCount: 0,
  grapedCount: 0,
  totalCount: 0,

  userGrapedCount: 0,
  userRemainCount: 0,
  userTotalCount: 0,

  refreshTime: "3",
  timerId: "",
  virtualTableData: []
});
// 抢单
const grabOrder = () => {
  loading.value = true;
  baseService
    .get(`/order/grab`)
    .then((res) => {
      loading.value = false;
      ElMessage.success({
        message: "抢单成功",
        duration: 500
      });
      state.virtualTableData[0] = {
        orderName: res.data.orderName,
        customerName: res.data.customerName,
        phone: res.data.phone,
        remark: res.data.content
      };
      // ElNotification({
      //   title: "工单信息",
      //   dangerouslyUseHTMLString: true,
      //   message: `<strong>商标名称：${res.data.orderName}<br/>客户名称：${res.data.customerName}<br/>手机号：${res.data.phone}<br/>备注：${res.data.content}</strong>`
      // });
      getCount();
    })
    .catch(() => {
      loading.value = false;
      ElMessage.error({
        message: "抢单失败",
        duration: 500
      });
    });
};
const getCount = () => {
  baseService
    .get(`/orderGrab/count`)
    .then((res) => {
      state.remainCount = res.data.remainCount;
      state.grapedCount = res.data.grapedCount;
      state.totalCount = res.data.totalCount;

      state.userGrapedCount = res.data.userGrapedCount;
      state.userRemainCount = res.data.userRemainCount;
      state.userTotalCount = res.data.userTotalCount;
    })
    .catch(() => {});
};
watch(
  () => state.refreshTime,
  () => {
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      getCount();
    }, Number(state.refreshTime) * 1000);
  }
);
onMounted(() => {
  getCount();
  state.timerId = setInterval(() => {
    getCount();
  }, Number(state.refreshTime) * 1000);
});
onBeforeUnmount(() => {
  clearInterval(state.timerId);
});
</script>

<style scoped lang="less">
.grab-contianer {
  width: 50%;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  // display: flex;
  // justify-content: space-between;
  font-size: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 30px;
  }
  .grab-btn {
    font-size: 20px;
    width: 140px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-left {
    display: flex;
  }
}

.el-descriptions {
  width: 50%;
  margin: 30px auto;
}

.el-tag {
  font-size: 22px;
}
</style>
