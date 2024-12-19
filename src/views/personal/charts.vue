<template>
  <div id="main" style="width: 100%; height: 350px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  components: {},
  props: ["chartsData"],
  data() {
    return {
      option: {
        title: {
          // text: ""
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
            name: "抢单数",
            type: "bar",
            data: []
          }
        ]
      }
    };
  },
  created() {},

  watch: {},
  methods: {},
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    this.option.yAxis.data = this.chartsData.yAxisData;
    this.option.series[0].data = this.chartsData.seriesData;

    myChart.setOption(this.option);
    window.addEventListener("resize", myChart.resize);
  }
};
</script>

<style></style>
