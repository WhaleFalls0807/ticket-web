<template>
  <div :id="chartsData.id" style="width: 100%; height: 500px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { reactive, onMounted, watch, ref } from "vue";
const props = defineProps(["chartsData"]);

let myChart: any;

const option = reactive({
  title: {
    text: props.chartsData.name
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: "category",
    data: []
  },
  series: [
    {
      name: "微信沟通次数",
      type: "bar",
      data: [],
      barMaxWidth: 40
    },
    {
      name: "电话沟通次数",
      type: "bar",
      data: [],
      barMaxWidth: 40
    }
  ]
});

watch(
  () => props.chartsData,
  () => {
    option.yAxis.data = props.chartsData.yAxisData;
    option.series[0].data = props.chartsData.seriesData;
    option.series[1].data = props.chartsData.seriesData2;

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
