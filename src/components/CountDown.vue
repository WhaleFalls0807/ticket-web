<template>
  <div class="container">
    <span class="countdown" :key="state.d">{{ state.d }}</span>
    天
    <span class="countdown" :key="state.h">{{ state.h }}</span>
    时
    <span class="countdown" :key="state.m">{{ state.m }}</span>
    分
    <span class="countdown" :key="state.s">{{ state.s }}</span>
    秒
  </div>
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
  return (props.nextTime - state.nowTime) / 1000; //总秒数
});

const countdown = (totalSeconds) => {
  state.d = parseInt(totalSeconds.value / 60 / 60 / 24);
  state.h = parseInt((totalSeconds.value / 60 / 60) % 24);
  state.m = parseInt((totalSeconds.value / 60) % 60);
  state.s = parseInt(totalSeconds.value % 60);
};
onMounted(() => {
  state.timerId = setInterval(() => {
    countdown(totalSeconds.value);
    // totalSeconds -= 1
    state.nowTime += 1000;
  }, 1000);
});
watch(totalSeconds, (value) => {
  if (value <= 0) {
    clearInterval(state.timerId);
  }
});
onUnmounted(() => {
  clearInterval(state.timerId);
});
</script>

<style lang="less">
.container {
  display: flex;
  align-items: center;
}
.countdown {
  width: 30px;
  height: 30px;
  background-color: pink;
  color: #fff;
  text-align: center;
  line-height: 30px;
  border-radius: 10px;
  position: relative;
}
.countdown::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #fff;
  animation: topToBottom 0.5s forwards;
}
@keyframes topToBottom {
  0% {
    height: 2px;
  }
  100% {
    height: 100%;
    opacity: 0;
  }
}
</style>
