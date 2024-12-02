<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '70%'"
    title="提交资料"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="payType" label="支付类型">
        <el-button v-if="!dataForm.payType" @click="uploadHandle('payType', 'img')">上传图片</el-button>
        <FileImgPreview v-else fileType="img" :url="dataForm.payType" delete @deleteFileImg="dataForm.payType = ''" />
      </el-form-item>
      <el-form-item prop="contract" label="原始合同">
        <el-button v-if="!dataForm.contract" @click="uploadHandle('contract', 'file')">上传文件</el-button>
        <FileImgPreview
          v-else
          fileType="file"
          :url="dataForm.contract"
          delete
          @deleteFileImg="dataForm.contract = ''"
        />
      </el-form-item>
      <el-form-item prop="aprice" label="甲方承担金额">
        <el-input-number v-model="dataForm.aprice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="bprice" label="乙方承担金额">
        <el-input-number v-model="dataForm.bprice" :min="0" :precision="2" :step="0.1" />
      </el-form-item>
      <el-form-item prop="businessName" label="业务名称">
        <el-input v-model="dataForm.businessName" />
      </el-form-item>
      <el-form-item prop="applyMethod" label="申请方式">
        <el-input v-model="dataForm.applyMethod" />
      </el-form-item>
      <el-table :data="dataForm.businessTypeList" border class="mt20 mb20">
        <el-table-column label="业务类型" width="180">
          <template v-slot="scope">
            <el-form-item
              label-width="0"
              :prop="'businessTypeList.' + scope.$index + '.businessType'"
              :rules="{
                required: true,
                message: '必填项不能为空',
                trigger: 'blur'
              }"
            >
              <ren-select v-model="scope.row.businessType" dict-type="businessType"></ren-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="商标名称" width="180">
          <template v-slot="scope">
            <el-form-item
              label-width="0"
              :prop="'businessTypeList.' + scope.$index + '.brandName'"
              :rules="{
                required: true,
                message: '必填项不能为空',
                trigger: 'blur'
              }"
            >
              <el-input v-model="scope.row.brandName" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="官费" width="180">
          <template v-slot="scope">
            <el-form-item
              label-width="0"
              :prop="'businessTypeList.' + scope.$index + '.officialPrice'"
              :rules="{
                required: true,
                message: '必填项不能为空',
                trigger: 'blur'
              }"
            >
              <el-input-number
                v-model="scope.row.officialPrice"
                :min="0"
                :precision="2"
                :step="0.1"
                @input="computedTotal(scope.row)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="代理费" width="180">
          <template v-slot="scope">
            <el-form-item
              label-width="0"
              :prop="'businessTypeList.' + scope.$index + '.agencyPrice'"
              :rules="{
                required: true,
                message: '必填项不能为空',
                trigger: 'blur'
              }"
            >
              <el-input-number
                v-model="scope.row.agencyPrice"
                :min="0"
                :precision="2"
                :step="0.1"
                @input="computedTotal(scope.row)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="总费用" width="180">
          <template v-slot="scope">
            <el-input-number v-model="scope.row.totalPrice" :min="0" :precision="2" :step="0.1" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <el-button @click="deleteRow(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="add">添加</el-button>
      <el-form-item prop="totalPrice" label="总费用">
        <el-input-number v-model="dataForm.totalPrice" :min="0" :precision="2" :step="0.1" disabled />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>

  <!-- 上传文件 -->
  <Upload
    ref="uploadRef"
    :url="`/sys/oss/upload/${dataForm.id}`"
    :fileType="currentFileType"
    @refreshDataList="setDataForm"
  ></Upload>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import Upload from "@/components/Upload.vue";
import FileImgPreview from "@/components/FileImgPreview.vue";
const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const currentUploadKey = ref("");
const currentFileType = ref("img"); //img file

const dataForm: any = reactive({
  id: "",
  payType: "",
  contract: "",
  aprice: 0,
  bprice: 0,
  businessName: "",
  applyMethod: "",
  businessTypeList: [
    // {
    //   businessType: "商标复审",
    //   brandName: "",
    //   officialPrice: 0,
    //   agencyPrice: 0,
    //   totalPrice: 0
    // }
  ],
  totalPrice: 0,
  remark: ""
});
const totalPrice = computed(() => {
  return dataForm.businessTypeList.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
});

watch(
  () => totalPrice.value,
  (value) => {
    dataForm.totalPrice = value;
  }
);
const computedTotal = (row: any) => {
  row.totalPrice = row.agencyPrice + row.officialPrice;
};
const add = () => {
  dataForm.businessTypeList.push({
    orderId: dataForm.id,
    businessType: "",
    brandName: "",
    officialPrice: 0,
    agencyPrice: 0,
    totalPrice: 0
  });
};
const deleteRow = (row: any) => {
  const index = dataForm.businessTypeList.findIndex((item: any) => item === row);
  console.log(index);
  dataForm.businessTypeList.splice(index, 1);
};
const rules = ref({
  payType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  contract: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  aprice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  bprice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  businessName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  applyMethod: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  totalPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (detail: any) => {
  visible.value = true;
  const { id, payType, contract, aprice, bprice, businessName, applyMethod, businessTypeList, totalPrice, remark } =
    detail;
  Object.assign(dataForm, {
    id,
    payType,
    contract,
    aprice,
    bprice,
    businessName,
    applyMethod,
    totalPrice,
    remark
  });
  dataForm.businessTypeList = businessTypeList.map((item: any) => {
    const { id, businessType, brandName, officialPrice, agencyPrice, totalPrice } = item;
    if (id) {
      return { id, orderId: dataForm.id, businessType, brandName, officialPrice, agencyPrice, totalPrice };
    } else {
      return { orderId: dataForm.id, businessType, brandName, officialPrice, agencyPrice, totalPrice };
    }
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/order/info/add", dataForm);
    fn.then((res) => {
      ElMessage.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          close();
          emit("refreshDataList");
        }
      });
    });
  });
};

// 上传文件
const uploadRef = ref();
const uploadHandle = (key: any, fileType: any) => {
  currentUploadKey.value = key;
  currentFileType.value = fileType;
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm[currentUploadKey.value] = value;
};
defineExpose({
  init
});
</script>

<style lang="less">
.el-table .el-form-item {
  margin-bottom: 0 !important;
}
</style>
