<template>
  <!-- 公海 -->
  <div>
    <Order type="seas" getDataListURL="/order/all/page" />
  </div>
</template>

<script lang="ts" setup>
import Order from "@/components/order/Order.vue";
</script>
