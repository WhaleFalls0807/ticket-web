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
    },
    formatter: function (params: any) {
      if (params.length == 0) {
        return "";
      } else if (params.length == 1) {
        return `
        <div>
          <strong>${params[0].name}</strong><br />
          ${params[0].seriesName}: ${params[0].value}
        </div>
      `;
      } else if (params.length == 2) {
        // 获取抢单数和成单数
        const orderCount = params[0].value; // 假设第一个 series 是抢单数
        const completedCount = params[1].value; // 假设第二个 series 是成单数

        // 计算成单率
        const conversionRate = (completedCount / orderCount) * 100;
        return `
        <div>
          <strong>${params[0].name}</strong><br />
          抢单数: ${orderCount}<br />
          成单数: ${completedCount}<br />
          成单率: ${conversionRate.toFixed(2)}%<br />
        </div>
      `;
      }
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
      name: "抢单数",
      type: "bar",
      data: [],
      barMaxWidth: 40
    },
    {
      name: "成单数",
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
