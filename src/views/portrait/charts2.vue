<template>
  <div :id="chartsData.id" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { reactive, onMounted, computed, watch, ref } from "vue";
const props = defineProps(["chartsData"]);

let myChart: any;

const option = reactive({
  title: {
    text: props.chartsData.name
  },
  // legend: {},
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "",
      data: [],
      type: "bar",
      barMaxWidth: "40"
    }
  ]
});
watch(
  () => props.chartsData,
  () => {
    option.xAxis[0].data = props.chartsData.xAxisData;
    option.series[0].data = props.chartsData.seriesData;
    option.series[0].name = props.chartsData.name;

    myChart.setOption(option);
  },
  {
    deep: true
  }
);

onMounted(() => {
  myChart = echarts.init(document.getElementById(`${props.chartsData.id}`));
  myChart.setOption(option);

  window.addEventListener("resize", myChart.resize);
});
</script>

<style></style>
