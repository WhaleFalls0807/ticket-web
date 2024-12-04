<template>
  <el-drawer v-model="drawer" :size="isMobile ? '90%' : '50%'" class="drawer-custom">
    <template #header>
      <div class="customer-name">
        {{ detail.orderName }}
      </div>
      <div class="mr10">
        <el-button v-if="showOperate.commit && detail.orderStatus === 7" type="primary" @click="completedOrder">
          成单
        </el-button>
        <el-button v-if="showOperate.grab" type="primary" link @click="emit('grabOrder', detail.id)">抢单</el-button>
        <el-button v-if="showOperate.seas" type="primary" link @click="emit('seas', detail.id)">放回公海</el-button>
        <el-button v-if="showOperate.assign" type="primary" link @click="emit('assign', detail.id)">指派</el-button>
        <el-button type="danger" v-if="showOperate.delete" link @click="emit('deleteHandle', detail.id)">
          删除
        </el-button>
      </div>
    </template>
    <template #default>
      <template v-if="loading">
        <el-skeleton :rows="5" animated />
      </template>
      <template v-else>
        <div class="drawer-header">
          <el-descriptions direction="vertical" :column="3" border>
            <el-descriptions-item label="创建时间" width="160px">{{ detail.createDate }}</el-descriptions-item>
            <el-descriptions-item label="状态" width="100px">
              {{ getDictLabel("orderStatus", detail.orderStatus) }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detail.ownerUsername" label="负责人" width="100px">
              {{ detail.ownerUsername }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detail.reviewUsername" label="审批人" width="100px">
              {{ detail.reviewUsername }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detail.reviewDate" label="审批时间" width="160px">
              {{ detail.reviewDate }}
            </el-descriptions-item>
            <el-descriptions-item v-if="detail.dealDate" label="成单时间" width="160px">
              {{ detail.dealDate }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="drawer-main">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="详细资料" name="first">
              <el-form label-width="100" :label-position="isMobile ? 'top' : 'left'">
                <div>
                  <!-- 基本信息 -->
                  <div>
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">基本信息</div>
                      </div>
                      <!-- <el-button class="fr" type="primary" v-if="showOperate.update" @click="addOrUpdateHandle">
                        编辑
                      </el-button> -->
                      <el-button class="fr" type="primary" v-if="showOperate.update" @click="relativeCustomer">
                        关联客户
                      </el-button>
                    </div>
                    <el-form-item label="客户名称">
                      <span>{{ detail.customerName }}</span>
                    </el-form-item>
                    <el-form-item label="手机号">
                      <span>{{ detail.phone }}</span>
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <span>{{ detail.email }}</span>
                    </el-form-item>
                    <el-form-item label="客户行业">
                      <span>{{ getDictLabel("industry", detail.industry) }}</span>
                    </el-form-item>
                  </div>
                  <!-- 提交 -->
                  <div>
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">首次提交资料</div>
                      </div>
                      <el-space>
                        <el-button
                          class="fr"
                          type="primary"
                          @click="addFirst"
                          v-if="showOperate.update && (detail.orderStatus == 1 || detail.orderStatus == 4)"
                        >
                          填写
                        </el-button>
                        <el-button
                          v-if="showOperate.commit && (detail.orderStatus == 1 || detail.orderStatus == 4)"
                          type="primary"
                          @click="submitOrder(1)"
                        >
                          提交审核
                        </el-button>
                        <el-button
                          v-if="showOperate.approve && (detail.orderStatus == 2 || detail.orderStatus == 4)"
                          type="primary"
                          @click="emit('approve', detail.id)"
                        >
                          审批
                        </el-button>
                      </el-space>
                    </div>
                    <el-form-item label="支付类型">
                      <span v-if="!detail.payType">暂无数据</span>
                      <FileImgPreview
                        v-else
                        fileType="img"
                        :url="detail.payType"
                        :delete="showOperate.delete"
                        :deleteParams="{ id: detail.id, filePath: detail.payType, fieldName: 'payType', type: 1 }"
                        @deleteFileImg="detail.payType = ''"
                      />
                    </el-form-item>
                    <el-form-item label="原始合同">
                      <span v-if="!detail.contract">暂无数据</span>
                      <FileImgPreview
                        v-else
                        fileType="file"
                        :url="detail.contract"
                        download
                        :delete="showOperate.delete"
                        :deleteParams="{ id: detail.id, filePath: detail.contract, fieldName: 'contract', type: 1 }"
                        @deleteFileImg="detail.contract = ''"
                      />
                    </el-form-item>
                    <el-form-item label="甲方承担金额">
                      <span>{{ convertCurrency(detail.aprice) }}</span>
                    </el-form-item>
                    <el-form-item label="乙方承担金额">
                      <span>{{ convertCurrency(detail.bprice) }}</span>
                    </el-form-item>
                    <el-form-item label="业务名称">
                      <span>{{ detail.businessName }}</span>
                    </el-form-item>
                    <el-form-item label="申请方式">
                      <span>{{ detail.applyMethod }}</span>
                    </el-form-item>
                    <el-table :data="detail.businessTypeList" border show-overflow-tooltip class="mt20 mb20">
                      <el-table-column prop="businessType" label="业务类型" width="180">
                        <template v-slot="scope">
                          {{ getDictLabel("businessType", scope.row.businessType) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="brandName" label="商标名称" width="180">
                        <template v-slot="scope">
                          {{ scope.row.brandName }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="officialPrice" label="官费" width="180">
                        <template v-slot="scope">
                          {{ convertCurrency(scope.row.officialPrice) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="agencyPrice" label="代理费" width="180">
                        <template v-slot="scope">
                          {{ convertCurrency(scope.row.agencyPrice) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalPrice" label="总费用" width="180">
                        <template v-slot="scope">
                          {{ convertCurrency(scope.row.totalPrice) }}
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-form-item label="总费用">
                      <span>{{ convertCurrency(detail.totalPrice) }}</span>
                    </el-form-item>
                    <el-form-item prop="content" label="备注">
                      <span>{{ detail.content }}</span>
                    </el-form-item>
                  </div>
                  <!-- 提交 -->
                  <div>
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">二次提交资料</div>
                      </div>
                      <el-space>
                        <el-button
                          class="fr"
                          type="primary"
                          @click="addSecond"
                          v-if="showOperate.update && (detail.orderStatus == 3 || detail.orderStatus == 6)"
                        >
                          填写
                        </el-button>
                        <el-button
                          v-if="showOperate.commit && (detail.orderStatus == 3 || detail.orderStatus == 6)"
                          type="primary"
                          @click="submitOrder(2)"
                        >
                          提交审核
                        </el-button>
                        <el-button
                          v-if="showOperate.approve && (detail.orderStatus == 5 || detail.orderStatus == 6)"
                          type="primary"
                          @click="emit('approve', detail.id)"
                        >
                          审批
                        </el-button>
                      </el-space>
                    </div>

                    <el-collapse class="mt20 mb20">
                      <div v-for="(item, index) in detail.businessTypeList" :key="index">
                        <el-collapse-item>
                          <template #title>
                            {{ getDictLabel("businessType", item.businessType) }}
                          </template>
                          <el-form-item label="logo">
                            <span v-if="!item.logo">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="img"
                              :url="item.logo"
                              :delete="showOperate.delete"
                              :deleteParams="{ id: item.id, filePath: item.logo, fieldName: 'logo', type: 2 }"
                              @deleteFileImg="item.logo = ''"
                            />
                          </el-form-item>
                          <el-form-item label="身份证">
                            <span v-if="!item.idcard">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.idcard"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{ id: item.id, filePath: item.idcard, fieldName: 'idcard', type: 2 }"
                              @deleteFileImg="item.idcard = ''"
                            />
                          </el-form-item>
                          <el-form-item label="申请书">
                            <span v-if="!item.applyBook">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.applyBook"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{ id: item.id, filePath: item.applyBook, fieldName: 'applyBook', type: 2 }"
                              @deleteFileImg="item.applyBook = ''"
                            />
                          </el-form-item>
                          <el-form-item label="委托书">
                            <span v-if="!item.commission">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.commission"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.commission,
                                fieldName: 'commission',
                                type: 2
                              }"
                              @deleteFileImg="item.commission = ''"
                            />
                          </el-form-item>
                          <el-form-item label="营业执照">
                            <span v-if="!item.businessLicense">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.businessLicense"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.businessLicense,
                                fieldName: 'businessLicense',
                                type: 2
                              }"
                              @deleteFileImg="item.businessLicense = ''"
                            />
                          </el-form-item>
                          <el-form-item label="盖章合同">
                            <span v-if="!item.sealedContract">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.sealedContract"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.sealedContract,
                                fieldName: 'sealedContract',
                                type: 2
                              }"
                              @deleteFileImg="item.sealedContract = ''"
                            />
                          </el-form-item>
                        </el-collapse-item>
                      </div>
                    </el-collapse>
                  </div>
                  <!-- 回传资料 -->
                  <div v-if="detail.orderStatus === 8 || detail.orderStatus === 10">
                    <div class="section-header">
                      <div class="flex align-center">
                        <div class="section-mark"></div>
                        <div class="section-title">回传资料</div>
                      </div>
                      <el-button class="fr" type="primary" @click="addThird" v-if="showOperate['upload-admin']">
                        填写
                      </el-button>
                    </div>

                    <el-collapse class="mt20 mb20">
                      <div v-for="(item, index) in detail.businessTypeList" :key="index">
                        <el-collapse-item>
                          <template #title>
                            {{ getDictLabel("businessType", item.businessType) }}
                          </template>
                          <el-form-item label-width="140" label="回执文件">
                            <span v-if="!item.regiAppReceipt">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.regiAppReceipt"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.regiAppReceipt,
                                fieldName: 'regiAppReceipt',
                                type: 2
                              }"
                              @deleteFileImg="item.regiAppReceipt = ''"
                            />
                          </el-form-item>
                          <el-form-item label-width="140" label="受理通知书">
                            <span v-if="!item.regiAppAcceptNotice">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.regiAppAcceptNotice"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.regiAppAcceptNotice,
                                fieldName: 'regiAppAcceptNotice',
                                type: 2
                              }"
                              @deleteFileImg="item.regiAppAcceptNotice = ''"
                            />
                          </el-form-item>
                          <el-form-item label-width="140" label="初步审定公告通知书">
                            <span v-if="!item.regiAppPreApproveNotice">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.regiAppPreApproveNotice"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.regiAppPreApproveNotice,
                                fieldName: 'regiAppPreApproveNotice',
                                type: 2
                              }"
                              @deleteFileImg="item.regiAppPreApproveNotice = ''"
                            />
                          </el-form-item>
                          <el-form-item label-width="140" label="注册证">
                            <span v-if="!item.regiCertificate">暂无数据</span>
                            <FileImgPreview
                              v-else
                              fileType="file"
                              :url="item.regiCertificate"
                              download
                              :delete="showOperate.delete"
                              :deleteParams="{
                                id: item.id,
                                filePath: item.regiCertificate,
                                fieldName: 'regiCertificate',
                                type: 2
                              }"
                              @deleteFileImg="item.regiCertificate = ''"
                            />
                          </el-form-item>
                        </el-collapse-item>
                      </div>
                    </el-collapse>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="跟进记录" name="second">
              <Activity :associationId="detail.id" :activityType="3" v-if="activeName === 'second'" />
            </el-tab-pane>
            <el-tab-pane label="操作记录" name="third">
              <Activity :associationId="detail.id" :activityType="1" v-if="activeName === 'third'" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </template>
  </el-drawer>
  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update ref="addOrUpdateRef" @refreshDataList="getInfo(detail.id)"></add-or-update>
  <OrderUpdateFirst ref="addFirstRef" @refreshDataList="getInfo(detail.id)" />
  <OrderUpdateSecond ref="addSecondRef" @refreshDataList="getInfo(detail.id)" />
  <OrderUpdateThird ref="addThirdRef" @refreshDataList="getInfo(detail.id)" />

  <!-- 提交审核 -->
  <SubmitApprove ref="submitApproveRef" @refreshDataList="getInfo(detail.id)" />

  <!-- 关联客户 -->
  <Relative v-if="relativeVisible" ref="relativeRef" type="customer" @getSelected="getSelected" />
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, toRefs, computed } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import baseService from "@/service/baseService";
import FileImgPreview from "@/components/FileImgPreview.vue";
import { useMediaQuery } from "@vueuse/core";
import OrderUpdateFirst from "./order-update-first.vue";
import OrderUpdateSecond from "./order-update-second.vue";
import OrderUpdateThird from "./order-update-third.vue";
import Activity from "@/components/activity/index.vue";
import useUtils from "@/hooks/useUtils";
import SubmitApprove from "./SubmitApprove.vue";
import AddOrUpdate from "./order-update.vue";
import Relative from "@/components/Relative.vue";
const { getDictLabel, convertCurrency } = useUtils();

const isMobile = useMediaQuery("(max-width: 768px)");

const props = defineProps(["showOperate"]);
const emit = defineEmits(["refreshDataList", "grabOrder", "seas", "assign", "approve", "deleteHandle"]);
const drawer = ref(false);
let loading = ref(false);
const detail: any = reactive({
  id: "",
  customerId: "",
  customerName: "",
  industry: "",
  phone: "",

  // first
  payType: "",
  contract: "",
  aprice: 0,
  bprice: 0,
  businessName: "",
  applyMethod: "",
  businessTypeList: [
    {
      businessType: "",
      brandName: "",
      officialPrice: 0,
      agencyPrice: 0,
      totalPrice: 0,

      // second
      logo: "",
      // 身份证
      idcard: "",
      // 申请书
      applyBook: "",
      // 委托书
      commission: "",
      // 营业执照
      businessLicense: "",
      // 盖章合同
      sealedContract: ""
    }
  ],
  totalPrice: 0,
  content: ""
});
const activeName = ref("first");
// 添加或编辑
const addOrUpdateRef = ref();
const addOrUpdateHandle = () => {
  addOrUpdateRef.value.init(detail);
};
// 关联客户
const relativeVisible = ref(false);
const relativeRef = ref();
const relativeCustomer = () => {
  relativeVisible.value = true;
  nextTick(() => {
    if (!detail.customerId) {
      const { customerName, phone, email, industry } = detail;
      const params = {
        customerName,
        phone,
        email,
        industry
      };
      localStorage.setItem("addCustomerParams", JSON.stringify(params));
      relativeRef.value.init();
    } else {
      relativeRef.value.init();
    }
  });
};
// 获取关联的客户信息
const getSelected = (s: any) => {
  const fn = baseService.post("/order/info/add", { id: detail.id, customerId: s.id });
  fn.then((res) => {
    ElMessage.success({
      message: "关联成功",
      duration: 500,
      onClose: () => {
        getInfo(detail.id);
      }
    });
  });
};
// 首次提交
const addFirstRef = ref();
const addFirst = () => {
  addFirstRef.value.init(detail);
};

// 二次提交
const addSecondRef = ref();
const addSecond = () => {
  addSecondRef.value.init(detail);
};

// 回传资料
const addThirdRef = ref();
const addThird = () => {
  addThirdRef.value.init(detail);
};

// 提交审核
const submitApproveRef = ref();
const submitOrder = (type: any) => {
  // if (detail.orderStatus == 1 || detail.orderStatus == 2 || detail.orderStatus == 4") {
  //   ElMessage.error("点击下方“填写资料”按钮，把需要的资料填写完整后再提交审核！");
  // 首次提交按钮
  // }
  let errors: any = [];
  if (type == 1) {
    const { customerName, payType, contract, aprice, bprice, businessName, applyMethod, businessTypeList, totalPrice } =
      detail;
    const validateObj = {
      customerName,
      payType,
      contract,
      aprice,
      bprice,
      businessName,
      applyMethod,
      businessTypeList: businessTypeList.map((item: any) => {
        const { businessType, brandName, officialPrice, agencyPrice, totalPrice } = item;
        return { businessType, brandName, officialPrice, agencyPrice, totalPrice };
      }),
      totalPrice
    };
    errors = validateDetail(validateObj);
  } else if (type == 2) {
    const { businessTypeList } = detail;
    const validateObj = {
      businessTypeList: businessTypeList.map((item: any) => {
        const { logo, idcard, applyBook, commission, businessLicense, sealedContract } = item;
        return { logo, idcard, applyBook, commission, businessLicense, sealedContract };
      })
    };
    errors = validateDetail(validateObj);
  }
  if (errors.length) {
    ElNotification({
      title: "提示",
      dangerouslyUseHTMLString: true,
      message: "请填写以下内容:<br/>" + errors.join("<br/>"),
      duration: 5000
    });
  } else {
    submitApproveRef.value.init(detail.id);
  }
};
const validateDetail = (detail: any) => {
  const keyName: any = {
    customerName: "客户名称",
    payType: "支付类型",
    contract: "原始合同",
    aprice: "甲方承担金额",
    bprice: "乙方承担金额",
    businessName: "业务名称",
    applyMethod: "申请方式",
    businessType: "业务类型",
    brandName: "商标名称",
    officialPrice: "官费",
    agencyPrice: "代理费",
    totalPrice: "总费用",
    logo: "LOGO",
    idcard: "身份证",
    applyBook: "申请书",
    commission: "委托书",
    businessLicense: "营业执照",
    sealedContract: "盖章合同"
  };
  const errors = [];
  for (const key in detail) {
    if (key === "businessTypeList" && Array.isArray(detail[key])) {
      detail[key].forEach((item, index) => {
        for (const subKey in item) {
          if (!item[subKey]) {
            errors.push(`业务类型列表第 ${index + 1} 项的 ` + keyName[subKey] + ` 需要填写`);
          }
        }
      });
    } else if (!detail[key] && detail[key] !== 0) {
      errors.push(`${keyName[key]} 需要填写`);
    }
  }

  return errors;
};

// 成单
const completedOrder = () => {
  ElMessageBox.confirm("确定进行[成单]操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      baseService
        .post("/order/status/change", {
          orderId: detail.id,
          operateType: 3
        })
        .then((res) => {
          ElMessage.success({
            message: "已成单",
            duration: 500,
            onClose: () => {
              emit("refreshDataList");
              close();
            }
          });
        })
        .catch(() => {
          ElMessage.error({
            message: "操作失败",
            duration: 500
          });
        });
    })
    .catch(() => {
      //
    });
};
const close = () => {
  drawer.value = false;
  activeName.value = "first";
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
  init,
  close
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
