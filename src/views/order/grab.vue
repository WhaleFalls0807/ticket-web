<template>
  <el-card class="grab-contianer">
    <h1>抢单倒计时</h1>
    <CountDown :nextTime="Date.now() + 5000" />
    <el-button type="primary" @click="grabOrder" class="grab-btn">抢单</el-button>
  </el-card>

  <el-descriptions :column="1" border>
    <el-descriptions-item label="已抢单次数" label-align="right" align="center" width="50">
      <el-tag>{{ form.count }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="剩余抢单次数" label-align="right" align="center" width="50">
      <el-tag>{{ form.count }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="总抢单次数" label-align="right" align="center">
      <el-tag>{{ form.allCount }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="抢单刷新时间" label-align="right" align="center">
      <ren-select v-model="form.refreshTime" dict-type="refreshTime"></ren-select>
    </el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
import CountDown from "@/components/CountDown.vue";
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import { useAppStore } from "@/store";
import { reactive } from "vue";

const store = useAppStore();

let form = reactive({
  count: 10,
  allCount: 100,
  refreshTime: "3"
});
// 抢单
const grabOrder = (customerName?: string, id?: string) => {
  baseService
    .post(`/order/choose`, {
      userId: store.state.user.id
    })
    .then((res) => {
      ElMessage.success({
        message: "抢单成功",
        duration: 500
      });
    })
    .catch(() => {
      ElMessage.error({
        message: "抢单失败",
        duration: 500
      });
    });
};
</script>

<style scoped lang="less">
.grab-contianer {
  text-align: center;
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
</style>
