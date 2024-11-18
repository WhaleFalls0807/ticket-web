<template>
  <el-drawer v-model="drawer" :size="isMobile ? '90%' : '50%'" class="drawer-custom">
    <template #header>
      <div class="customer-name">
        {{ detail.customerName }}
      </div>
      <div class="mr10">
        <el-button type="primary" v-if="showOperate.update" @click="emit('addOrUpdateHandle', detail.id)">
          编辑
        </el-button>
        <el-button type="danger" v-if="showOperate.delete" @click="emit('deleteHandle', detail.id)">删除</el-button>
      </div>
    </template>
    <template #default>
      <template v-if="loading">
        <el-skeleton :rows="5" animated />
      </template>
      <template v-else>
        <div class="drawer-header">
          <div>
            <el-descriptions direction="vertical" :column="5">
              <el-descriptions-item label="创建时间" width="100px">{{ detail.createDate }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <div class="drawer-main">
          <el-tabs type="border-card">
            <el-tab-pane label="详细资料">
              <el-form label-width="100" :label-position="isMobile ? 'top' : 'left'">
                <el-form-item label="客户名称">
                  <span>{{ detail.customerName }}</span>
                </el-form-item>
                <el-form-item label="公司名称">
                  <span>{{ detail.company }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ state.getDictLabel("enterprise", detail.enterprise) }}</span>
                </el-form-item>
                <el-form-item label="客户来源">
                  <span>{{ state.getDictLabel("source", detail.source) }}</span>
                </el-form-item>
                <el-form-item label="客户网站首页">
                  <span>{{ detail.website }}</span>
                </el-form-item>
                <el-form-item label="客户地址">
                  <span>{{ detail.address }}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <span>{{ detail.phone }}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <span>{{ detail.email }}</span>
                </el-form-item>
                <el-form-item label="是否微信建联">
                  <span>{{ state.getDictLabel("wechat", detail.wechat) }}</span>
                </el-form-item>
                <el-form-item label="客户行业">
                  <span>{{ state.getDictLabel("industry", detail.industry) }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ detail.remark }}</span>
                </el-form-item>
                <el-form-item label="负责人">
                  <span>{{ detail.ownerUserName }}</span>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, toRefs } from "vue";
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import SvgIcon from "@/components/base/svg-icon";
import Upload from "@/components/Upload.vue";
import useView from "@/hooks/useView";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps(["showOperate", "ownerUserList"]);
const emit = defineEmits(["deleteHandle", "addOrUpdateHandle"]);

const drawer = ref(false);
let loading = ref(false);
const detail: any = reactive({
  id: "",
  creator: 0,
  createDate: "",
  customerName: "",
  enterprise: 0,
  company: "",
  industry: "",
  source: 1,
  website: "",
  address: "",
  phone: "",
  email: "",
  wechat: 0,
  remark: "",
  ownerUserId: 0,
  ownerUserName: "",
  dealStatus: 0,
  dealTime: "",
  nextTime: "",
  lastTime: "",
  lastContent: "",
  poolTime: "",
  receiveTime: "",
  preUserId: 0,
  updateDate: ""
});
const view = reactive({});
const state = reactive({ ...useView(view), ...toRefs(view) });
const isMobile = useMediaQuery("(max-width: 768px)");

const init = (id: string) => {
  drawer.value = true;
  detail.id = id;

  getInfo(id);
};
// 获取信息
const getInfo = (id: string) => {
  loading.value = true;
  baseService
    .get(`/customer/queryById/${id}`)
    .then((res) => {
      loading.value = false;
      Object.assign(detail, res.data);
      const owner = props.ownerUserList.find((item: any) => item.id === detail.ownerUserId);
      if (owner.username) {
        detail.ownerUserName = owner.username;
      }
    })
    .catch(() => {
      loading.value = false;
    });
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

:deep(.el-form-item__content) {
  line-height: 24px !important;
}
</style>
