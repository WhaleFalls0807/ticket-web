<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '50%'"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="120px">
      <el-form-item prop="zhifuleixing" label="支付类型">
        <el-button v-if="!dataForm.zhifuleixing" @click="uploadHandle">上传</el-button>
        <ImgPreview v-else url="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
      </el-form-item>
      <el-form-item prop="officialPrice" label="官费">
        <el-input v-model="dataForm.officialPrice" />
      </el-form-item>
      <el-form-item prop="officialPrice" label="代理费">
        <el-input v-model="dataForm.officialPrice" />
      </el-form-item>
      <el-form-item prop="totalPrice" label="总费用">
        <el-input v-model="dataForm.totalPrice" />
      </el-form-item>
      <el-form-item prop="yuanshihetong" label="原始合同">
        <el-button v-if="!dataForm.yuanshihetong" @click="uploadHandle">上传</el-button>
        <FilePreview v-else :file="{ url: 'xx', fileName: 'hhahahaahahhahhahaha' }" />
      </el-form-item>
      <el-form-item prop="jia_price" label="甲方成单金额">
        <el-input v-model="dataForm.jia_price" />
      </el-form-item>
      <el-form-item prop="yi_price" label="乙方成单金额">
        <el-input v-model="dataForm.yi_price" />
      </el-form-item>
      <el-form-item prop="yewu_name" label="业务名称">
        <el-input v-model="dataForm.yewu_name" />
      </el-form-item>
      <el-form-item prop="applyMethod" label="申请方式">
        <el-input v-model="dataForm.applyMethod" />
      </el-form-item>
      <el-form-item prop="yewu_type" label="业务类型">
        <el-input v-model="dataForm.yewu_type" />
      </el-form-item>
      <el-form-item prop="shangbiao_name" label="商标名称">
        <el-input v-model="dataForm.shangbiao_name" />
      </el-form-item>
      <el-form-item prop="leibie" label="类别">
        <el-input v-model="dataForm.leibie" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>

  <!-- 上传文件 -->
  <Upload ref="uploadRef" :url="`/sys/oss/upload`" @refreshDataList="setDataForm"></Upload>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import SelectRelative from "@/components/SelectRelative.vue";
import Upload from "@/components/Upload.vue";
import ImgPreview from "@/components/ImgPreview.vue";
import FilePreview from "@/components/FilePreview.vue";

const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
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
  leibie: ""
});

const rules = ref({
  orderName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  content: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  payType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  officialPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  agencyPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  totalPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  applyMethod: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  commitOption: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});
const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (id) {
    getInfo(id);
  }
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/`).then((res) => {
    Object.assign(dataForm, res.data);
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
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

// 上传文件
const uploadRef = ref();
const uploadHandle = () => {
  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  dataForm.zhifuleixing = value;
};
defineExpose({
  init
});
</script>

<style lang="less"></style>
