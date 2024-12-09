<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="selectTime"
          type="datetimerange"
          value-format="x"
          :shortcuts="shortcuts"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getData()">查询</el-button>
      </el-form-item>
    </el-form>
    <Charts v-if="dataForm.chartVisible" :chartsData="dataForm.chartsData" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import baseService from "@/service/baseService";
import Charts from "./charts.vue";
const props = defineProps(["type", "getDataListURL", "dataForm"]);
const emit = defineEmits(["refreshDataList"]);

const selectTime = ref([new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date().getTime()]);

const shortcuts = [
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return [start, end];
    }
  },
  {
    text: "近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    }
  },
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return [start, end];
    }
  }
];

const dataForm: any = reactive({
  startTime: selectTime.value ? selectTime.value[0] : "",
  endTime: selectTime.value ? selectTime.value[1] : "",
  chartsData: {},
  chartVisible: false
});
watch(selectTime, () => {
  dataForm.startTime = selectTime.value ? selectTime.value[0] : "";
  dataForm.endTime = selectTime.value ? selectTime.value[1] : "";
});
const getData = () => {
  baseService
    .get(`/userPortrait/grapedCount`, {
      startTime: dataForm.startTime,
      endTime: dataForm.endTime
    })
    .then((res) => {
      dataForm.chartVisible = true;
      dataForm.chartsData.seriesData = res.data.count;
      dataForm.chartsData.yAxisData = res.data.username;
    });
};
onMounted(() => {
  getData();
});
</script>
