<template>
  <!-- 抢单 -->
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="待办" name="first" v-if="state.hasPermission('order:daiban')">
        <Order type="daiban" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="second" v-if="state.hasPermission('order:yiban')">
        <Order type="yiban" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from "vue";
import Order from "@/components/Order.vue";
import useView from "@/hooks/useView";
const view = reactive({});
const state = reactive({
  ...useView(view),
  ...toRefs(view)
});
const activeName = ref("first");
</script>
