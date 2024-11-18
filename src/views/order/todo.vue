<template>
  <!-- 待成单 -->
  <Order type="todo" getDataListURL="/order/all/page" />
</template>
<script lang="ts" setup>
import Order from "@/components/order/Order.vue";
</script>
