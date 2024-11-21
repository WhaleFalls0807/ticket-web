<template>
  <div class="grab-contianer">
    <div class="left">
      <div class="flex align-center">
        <span class="mr10">总单数</span>
        <el-tag class="mr10">{{ state.totalCount }}</el-tag>
        <span class="mr10">/</span>
        <span class="mr10">剩余单数</span>
        <el-tag>{{ state.remainCount }}</el-tag>
      </div>
      <div class="flex align-center mt30">
        <p class="mr10" style="white-space: nowrap">设置刷新时间</p>
        <ren-select v-model="state.refreshTime" dict-type="refreshTime" :clearable="false"></ren-select>
      </div>
    </div>
    <div class="right">
      <div class="flex align-center">
        <span class="mr10">已抢单数量</span>
        <el-tag>{{ state.grapedCount }}</el-tag>
      </div>
      <el-button type="primary" @click="grabOrder" class="grab-btn" :loading="loading">抢单</el-button>
    </div>
  </div>
  <Order type="grab" getDataListURL="/order/all/page" />
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import { reactive, ref, onMounted, onBeforeUnmount, watch } from "vue";
import Order from "@/components/order/Order.vue";

const loading = ref(false);
let state: any = reactive({
  remainCount: "",
  grapedCount: 10,
  totalCount: 100,
  refreshTime: "3",
  timerId: ""
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
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  .right {
    text-align: center;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 30px;
  }
  .grab-btn {
    font-size: 20px;
    margin-top: 30px;
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
