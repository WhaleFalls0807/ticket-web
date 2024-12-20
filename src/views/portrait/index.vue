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
    <Charts :chartsData="dataForm.chartsData" v-if="hasPermission('portrait:graped')" class="mt20" />
    <Charts2 :chartsData="dataForm.chartsData2" v-if="hasPermission('portrait:invoice')" class="mt20" />
    <Charts3 :chartsData="dataForm.chartsData3" v-if="hasPermission('portrait:wechat_and_phone')" class="mt20" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import baseService from "@/service/baseService";
import useUtils from "@/hooks/useUtils";
import Charts from "./charts.vue";
import Charts2 from "./charts2.vue";
import Charts3 from "./charts3.vue";
const props = defineProps(["type", "getDataListURL", "dataForm"]);
const emit = defineEmits(["refreshDataList"]);
const { hasPermission } = useUtils();
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

  chartsData: {
    yAxisData: [],
    seriesData: [],
    seriesData2: [],
    name: "抢单数/成单数",
    id: "graped"
  },
  chartsData2: {
    xAxisData: [],
    seriesData: [],
    name: "开票金额",
    id: "invoice"
  },
  chartsData3: {
    yAxisData: [],
    seriesData: [],
    seriesData2: [],
    name: "沟通次数",
    id: "communicate"
  }
});
watch(selectTime, () => {
  dataForm.startTime = selectTime.value ? selectTime.value[0] : "";
  dataForm.endTime = selectTime.value ? selectTime.value[1] : "";
});
// 抢单数
const getGrapedCount = () => {
  baseService
    .get(`/userPortrait/grapedCount`, {
      startTime: dataForm.startTime,
      endTime: dataForm.endTime
    })
    .then((res) => {
      dataForm.chartsData.yAxisData = res.data.username;
      dataForm.chartsData.seriesData = res.data.graped;
      dataForm.chartsData.seriesData2 = res.data.complete;
    });
};
// 开票金额
const getTotalInvoice = () => {
  baseService
    .get(`/userPortrait/totalInvoice`, {
      startTime: dataForm.startTime,
      endTime: dataForm.endTime
    })
    .then((res) => {
      dataForm.chartsData2.xAxisData = res.data.username;
      dataForm.chartsData2.seriesData = res.data.invoice;
    });
};
// 沟通次数
const getCommunicate = () => {
  baseService
    .get(`/userPortrait/wechatCount`, {
      startTime: dataForm.startTime,
      endTime: dataForm.endTime
    })
    .then((res) => {
      dataForm.chartsData3.yAxisData = res.data.username;
      dataForm.chartsData3.seriesData = res.data.wechat;
      dataForm.chartsData3.seriesData2 = res.data.phone;
    });
};
const getData = () => {
  // 抢单数
  hasPermission("portrait:graped") && getGrapedCount();

  // 开票金额
  hasPermission("portrait:invoice") && getTotalInvoice();

  // 沟通次数
  hasPermission("portrait:wechat_and_phone") && getCommunicate();
};
onMounted(() => {
  getData();
});
</script>
