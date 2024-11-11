<template>
  <el-drawer v-model="drawer" :size="isMobile ? '90%' : '50%'">
    <template #header>
      <div class="customer-name">
        {{ detail.customerName }}
      </div>
    </template>
    <div class="drawer-header">
      <!-- <div class="customer-name">
        {{ detail.customerName }}
      </div> -->
      <div>
        <el-descriptions direction="vertical" :column="5">
          <el-descriptions-item label="类型" width="100px">test-type</el-descriptions-item>
          <el-descriptions-item label="优先级" width="100px">1</el-descriptions-item>
          <el-descriptions-item label="创建时间" width="100px">2024</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="drawer-main">
      <template v-if="loading">
        <el-skeleton :rows="5" animated />
      </template>
      <template v-else>
        <el-tabs type="border-card">
          <el-tab-pane label="客户信息">
            <el-form label-width="100" :label-position="isMobile ? 'top' : 'left'">
              <el-form-item label="联系方式">
                <span>{{ detail.phone }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <EditContent v-model="detail.desc" @save="saveDesc" />
              </el-form-item>
              <el-form-item label="附件列表">
                <ul class="file-list">
                  <li v-for="item in detail.fileList" :key="item.id" class="file-list-item">
                    <span class="file-name one-line">{{ item.fileName }}</span>
                    <svg-icon class="download-icon" name="icon-download" @click="state.exportHandle()"></svg-icon>
                  </li>
                </ul>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="操作">
            <el-space>
              <el-button type="primary" @click="uploadHandle()">上传附件</el-button>
              <el-button
                v-if="showOperate.grab"
                type="primary"
                link
                @click="emit('grabOrder', detail.customerName, detail.id)"
              >
                抢单
              </el-button>
              <el-button
                v-if="showOperate.seas"
                type="primary"
                link
                @click="emit('seas', detail.customerName, detail.id)"
              >
                放回公海
              </el-button>
              <el-button
                v-if="showOperate.assign"
                type="primary"
                link
                @click="emit('assign', detail.customerName, detail.id)"
              >
                指派
              </el-button>
              <el-button
                v-if="showOperate.approve"
                type="primary"
                link
                @click="emit('approve', detail.customerName, detail.id)"
              >
                审批
              </el-button>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <!-- 上传文件 -->
    <Upload ref="uploadRef" url="xxx" @refreshDataList="getDetail"></Upload>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, toRefs } from "vue";
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import SvgIcon from "@/components/base/svg-icon";
import EditContent from "./EditContent.vue";
import Upload from "./Upload.vue";
import useView from "@/hooks/useView";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps(["showOperate"]);
const emit = defineEmits(["refreshDataList", "grabOrder", "seas", "assign", "approve"]);

const drawer = ref(false);
let loading = ref(false);
const detail = reactive({
  id: "",
  customerName: "",
  phone: "18711111111",
  desc: "哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是客户详情",
  fileList: [
    {
      id: "1",
      fileName: "哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是"
    },
    {
      id: "2",
      fileName: "哈哈啊哈这是哈哈啊哈这是哈哈啊哈这是哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是"
    }
  ]
});
const view = reactive({
  exportURL: "/xx"
});

const state = reactive({ ...useView(view), ...toRefs(view) });
const isMobile = useMediaQuery("(max-width: 768px)");
// 上传文件
const uploadRef = ref();
const uploadHandle = () => {
  nextTick(() => {
    uploadRef.value.init();
  });
};
const saveDesc = (callback: any) => {
  // baseService
  //   .post("/xx")
  //   .then((res) => {
  //     callback({
  //       status: 1,
  //       msg: "修改成功"
  //     });
  //   })
  //   .catch(() => {
  //     callback({
  //       status: 0,
  //       msg: "修改失败"
  //     });
  //   });

  setTimeout(() => {
    // callback({
    //   status: 1,
    //   msg: "修改成功"
    // });
    callback({
      status: 0,
      msg: "修改失败"
    });
  }, 1000);
};
const init = (id: string, customerName: string) => {
  drawer.value = true;
  detail.id = id;
  detail.customerName = customerName;
  getDetail(id);
};
// 获取信息
const getDetail = (id: string) => {
  // loading.value = true;
  // baseService
  //   .get(`/sys/schedule/page`)
  //   .then((res) => {
  //     loading.value = false;
  //     Object.assign(detail, { ...res.data });
  //   })
  //   .catch(() => {
  //     loading.value = false;
  //   });
};
defineExpose({
  init
});
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

.customer-name {
  font-size: 16px;
  font-weight: 700;
  color: @--color-primary;
}
.el-tabs {
  height: 100%;
  :deep(.el-tabs__content) {
    height: calc(100% - 40px) !important;
    overflow: auto;
  }
}
.file-list {
  width: 100%;
  .file-list-item {
    display: flex;
    align-items: center;
    color: @--color-primary;
    cursor: pointer;
    .file-name {
      width: 90%;
    }
    .download-icon {
      display: none;
    }
    &:hover .download-icon {
      display: block;
    }
  }
}

:deep(.el-form-item__content) {
  line-height: 24px !important;
}
</style>
