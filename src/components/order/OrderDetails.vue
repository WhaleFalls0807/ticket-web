<template>
  <el-drawer v-model="drawer" :size="isMobile ? '90%' : '50%'" class="drawer-custom">
    <template #header>
      <div class="customer-name">
        {{ detail.orderName }}
      </div>
      <div class="mr10">
        <el-button type="primary" v-if="showOperate.update" @click="emit('addOrUpdateHandle', detail.id)">
          编辑
        </el-button>
        <el-button type="danger" v-if="showOperate.delete" @click="emit('deleteHandle', detail.id)">删除</el-button>

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
                <el-form-item label="名称">
                  <span>{{ detail.orderName }}</span>
                </el-form-item>
                <el-form-item label="商标内容">
                  <span>{{ detail.content }}</span>
                </el-form-item>
                <el-form-item label="支付类型">
                  <span>{{ detail.payType }}</span>
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
                <el-form-item label="申请方式">
                  <span>{{ detail.applyMethod }}</span>
                </el-form-item>
                <el-form-item label="提交选项">
                  <span>{{ detail.commitOption }}</span>
                </el-form-item>
                <el-form-item label="附件列表">
                  <el-button type="primary" @click="uploadHandle()">上传附件</el-button>
                  <ul class="file-list">
                    <li v-for="item in detail.fileList" :key="item.url" class="file-list-item">
                      <template v-if="item.fileName.endsWith('.xslx')">
                        <span class="file-name one-line">{{ item.fileName }}</span>
                        <svg-icon class="download-icon" name="icon-download" @click="state.exportHandle()"></svg-icon>
                      </template>
                      <template v-else-if="item.fileName.endsWith('.png')">
                        <ImgPreview :url="item.url" />
                      </template>
                    </li>
                  </ul>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="跟进记录">123</el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </template>
  </el-drawer>
  <!-- 上传文件 -->
  <Upload ref="uploadRef" :url="`/sys/oss/upload/${detail.id}`" @refreshDataList="getInfo(detail.id)"></Upload>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, toRefs } from "vue";
import { ElMessage } from "element-plus";
import baseService from "@/service/baseService";
import SvgIcon from "@/components/base/svg-icon";
import Upload from "@/components/Upload.vue";
import ImgPreview from "@/components/ImgPreview.vue";
import useView from "@/hooks/useView";
import { useMediaQuery } from "@vueuse/core";
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
  orderName: "xxx",
  content: "",
  payType: "",
  officialPrice: "",
  agencyPrice: "",
  totalPrice: "",
  applyMethod: "",
  commitOption: "",
  fileList: [
    // {
    //   fileName: "哈哈啊哈这是客户详情哈哈啊哈这是客户详情哈哈啊哈这是.xslx",
    //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
    // }
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
    uploadRef.value.init(detail.id);
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
  }
}
.file-list {
  width: 100%;
  .file-list-item {
    min-height: 40px;
    display: flex;
    align-items: center;
    color: @--color-primary;
    cursor: pointer;
    margin-top: 5px;
    background-color: #f8faff;

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
