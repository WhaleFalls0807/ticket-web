<template>
  <el-drawer v-model="drawer" :size="isMobile ? '90%' : '50%'" class="drawer-custom">
    <template #header>
      <div class="customer-name">
        {{ detail.orderName }}
      </div>
      <div class="mr10">
        <el-button type="primary" v-if="showOperate.update" link @click="emit('addOrUpdateHandle', detail.id)">
          编辑
        </el-button>
        <el-button v-if="showOperate.submit" type="primary" link @click="submitOrder">提交审核</el-button>
        <el-button type="danger" v-if="showOperate.delete" link @click="emit('deleteHandle', detail.id)">
          删除
        </el-button>
        <el-button v-if="showOperate.grab" type="primary" link @click="emit('grabOrder', detail.orderName, detail.id)">
          抢单
        </el-button>
        <el-button v-if="showOperate.seas" type="primary" link @click="emit('seas', detail.orderName, detail.id)">
          放回公海
        </el-button>
        <el-button v-if="showOperate.assign" type="primary" link @click="emit('assign', detail.orderName, detail.id)">
          指派
        </el-button>
        <el-button v-if="showOperate.approve" type="primary" link @click="emit('approve', detail.orderName, detail.id)">
          审批
        </el-button>
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
                <div>
                  <!-- 基本信息 -->
                  <div>
                    <div class="section-header">
                      <div class="section-mark"></div>
                      <div class="section-title">基本信息</div>
                    </div>
                    <el-form-item label="名称">
                      <span>{{ detail.orderName }}</span>
                    </el-form-item>
                  </div>
                  <!-- 提交 -->
                  <div>
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">资料</div>
                      </div>
                      <el-button
                        class="fr"
                        @click="addFirst"
                        v-if="detail.orderStatus == 1 || detail.orderStatus == 2 || detail.orderStatus == 4"
                      >
                        填写资料
                      </el-button>
                    </div>
                    <el-form-item label="支付类型">
                      <ImgPreview url="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
                    </el-form-item>
                    <el-form-item label="官费">
                      <span>{{ detail.officialPrice }}</span>
                    </el-form-item>
                    <el-form-item label="代理费">
                      <span>{{ detail.agencyPrice }}</span>
                    </el-form-item>
                    <el-form-item label="总费用">
                      <span>{{ detail.totalPrice }}</span>
                    </el-form-item>
                    <el-form-item label="原始合同">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                    <el-form-item label="甲方成单金额">100</el-form-item>
                    <el-form-item label="乙方成单金额">100</el-form-item>
                    <el-form-item label="业务名称">100</el-form-item>
                    <el-form-item label="申请方式">
                      <span>{{ detail.applyMethod }}</span>
                    </el-form-item>
                    <el-form-item label="业务类型">
                      <span>{{ detail.applyMethod }}</span>
                    </el-form-item>
                    <el-form-item label="商标名称">
                      <span>{{ detail.applyMethod }}</span>
                    </el-form-item>
                    <el-form-item label="类别">
                      <span>{{ detail.applyMethod }}</span>
                    </el-form-item>
                  </div>
                  <!-- 提交 -->
                  <div>
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">资料</div>
                      </div>
                      <el-button
                        class="fr"
                        @click="addSecond"
                        v-if="detail.orderStatus == 3 || detail.orderStatus == 5 || detail.orderStatus == 6"
                      >
                        填写资料
                      </el-button>
                    </div>
                    <el-form-item label="logo">
                      <ImgPreview url="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
                    </el-form-item>
                    <el-form-item label="身份证">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                    <el-form-item label="申请书">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                    <el-form-item label="委托书">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                    <el-form-item label="营业执照">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                    <el-form-item label="盖章合同">
                      <FilePreview :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="跟进记录">
              <Activity :associationId="detail.id" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </template>
  </el-drawer>
  <OrderUpdateFirst ref="addFirstRef" />
  <OrderUpdateSecond ref="addSecondRef" />
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, toRefs, computed } from "vue";
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import SvgIcon from "@/components/base/svg-icon";
import Upload from "@/components/Upload.vue";
import ImgPreview from "@/components/ImgPreview.vue";
import useView from "@/hooks/useView";
import { useMediaQuery } from "@vueuse/core";
import FilePreview from "@/components/FilePreview.vue";
import OrderUpdateFirst from "./order-update-first.vue";
import OrderUpdateSecond from "./order-update-second.vue";
import Activity from "@/components/activity/index.vue";
const props = defineProps(["showOperate"]);
const emit = defineEmits([
  "refreshDataList",
  "grabOrder",
  "seas",
  "assign",
  "approve",
  "deleteHandle",
  "addOrUpdateHandle"
]);
const drawer = ref(false);
let loading = ref(false);
const detail: any = reactive({
  id: "",
  // first
  zhifuleixing: "",
  officialPrice: "",
  agencyPrice: "",
  totalPrice: "",
  yuanshihetong: {
    url: "xxx",
    fileName: "xxx"
  },
  jia_price: "",
  yi_price: "",
  yewu_name: "",
  applyMethod: "",
  yewu_type: "",
  shangbiao_name: "",
  leibie: "",
  // second
  logo: "",
  shenfenzheng: {
    url: "xxx",
    fileName: "xxx"
  },
  shenqingshu: {
    url: "xxx",
    fileName: "xxx"
  },
  weituoshu: {
    url: "xxx",
    fileName: "xxx"
  },
  yingyezhizhao: {
    url: "xxx",
    fileName: "xxx"
  },
  gaizhanghetong: {
    url: "xxx",
    fileName: "xxx"
  }
});
const view = reactive({
  exportURL: "/xx"
});
const state = reactive({ ...useView(view), ...toRefs(view) });
const isMobile = useMediaQuery("(max-width: 768px)");

// 首次提交
const addFirstRef = ref();
const addFirst = (id?: number) => {
  addFirstRef.value.init(id);
};

// 二次提交
const addSecondRef = ref();
const addSecond = (id?: number) => {
  addSecondRef.value.init(id);
};

// 提交审核
const submitOrder = () => {
  // if (detail.orderStatus == 1 || detail.orderStatus == 2 || detail.orderStatus == 4") {
  //   ElMessage.error("点击下方“填写资料”按钮，把需要的资料填写完整后再提交审核！");
  // 首次提交按钮
  // }
};

const init = (id: string) => {
  drawer.value = true;
  detail.id = id;
  getInfo(id);
};
// 获取信息
const getInfo = (id: string) => {
  loading.value = true;
  baseService
    .get(`/order/queryById/${id}`)
    .then((res) => {
      loading.value = false;
      Object.assign(detail, res.data);
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

    .el-tab-pane {
      height: 100%;
    }
  }
}

:deep(.el-form-item__content) {
  line-height: 24px !important;
}

.section-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
}
.section-mark {
  border-left-color: @--color-primary;
  border-left-width: 4px;
  border-left-style: solid;
  border-radius: 2px;
  height: 14px;
}
.section-title {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-left: 8px;
}
</style>
