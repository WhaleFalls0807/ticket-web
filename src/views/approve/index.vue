<template>
  <!-- 审批 -->
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="待审批" name="first" v-if="state.hasPermission('approve:daishenpi')">
        <Order type="daishenpi" />
      </el-tab-pane>
      <el-tab-pane label="已审批" name="second" v-if="state.hasPermission('approve:yishenpi')">
        <Order type="yishenpi" />
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
