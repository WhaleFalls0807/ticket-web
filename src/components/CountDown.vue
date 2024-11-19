<template>
  <p>
    <el-tag type="primary">{{ state.d }}</el-tag>
    天
    <el-tag type="primary">{{ state.h }}</el-tag>
    时
    <el-tag type="primary">{{ state.m }}</el-tag>
    分
    <el-tag type="primary">{{ state.s }}</el-tag>
    秒
  </p>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onUnmounted } from "vue";
const props = defineProps(["nextTime"]);
const state = reactive({
  timerId: 0,
  nowTime: Date.now(),
  d: "",
  h: "",
  m: "",
  s: ""
});
const totalSeconds = computed(() => {
  return parseInt((props.nextTime - state.nowTime) / 1000); //总秒数
});

const countdown = (totalSeconds) => {
  state.d = parseInt(totalSeconds / 60 / 60 / 24);
  state.h = parseInt((totalSeconds / 60 / 60) % 24);
  state.m = parseInt((totalSeconds / 60) % 60);
  state.s = parseInt(totalSeconds % 60);
};
onMounted(() => {
  state.timerId = setInterval(() => {
    countdown(totalSeconds.value);
    state.nowTime += 1000;
  }, 1000);
});
watch(totalSeconds, (value) => {
  if (value < 0) {
    clearInterval(state.timerId);
  }
});
onUnmounted(() => {
  clearInterval(state.timerId);
});
</script>

<style scoped lang="less">
.container {
  display: flex;
  align-items: center;
}

.el-tag {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 24px;
}
</style>
