<template>
  <el-dialog
    v-model="visible"
    title="提交资料"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" ref="dataFormRef" label-width="120px">
      <el-collapse>
        <el-collapse-item v-for="(item, index) in dataForm.businessTypeList" :key="index">
          <template #title>{{ getDictLabel("businessType", item.businessType) }}：{{ item.brandName }}</template>
          <el-form-item label="LOGO" :prop="'businessTypeList.' + index + '.logo'">
            <el-button v-if="!item.logo" @click="uploadHandle(item, 'logo', 'img')">上传图片</el-button>
            <FileImgPreview
              v-else
              fileType="img"
              :url="item.logo"
              delete
              :deleteParams="{ id: item.id, filePath: item.logo, fieldName: 'logo', type: 2 }"
              @deleteFileImg="item.logo = ''"
            />
          </el-form-item>
          <el-form-item label="身份证" :prop="'businessTypeList.' + index + '.idcard'">
            <el-button v-if="!item.idcard" @click="uploadHandle(item, 'idcard', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.idcard"
              delete
              :deleteParams="{ id: item.id, filePath: item.idcard, fieldName: 'idcard', type: 2 }"
              @deleteFileImg="item.idcard = ''"
            />
          </el-form-item>
          <el-form-item label="申请书" :prop="'businessTypeList.' + index + '.applyBook'">
            <el-button v-if="!item.applyBook" @click="uploadHandle(item, 'applyBook', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.applyBook"
              delete
              :deleteParams="{ id: item.id, filePath: item.applyBook, fieldName: 'applyBook', type: 2 }"
              @deleteFileImg="item.applyBook = ''"
            />
          </el-form-item>
          <el-form-item
            label="委托书"
            :prop="'businessTypeList.' + index + '.commission'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.commission" @click="uploadHandle(item, 'commission', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.commission"
              delete
              :deleteParams="{ id: item.id, filePath: item.commission, fieldName: 'commission', type: 2 }"
              @deleteFileImg="item.commission = ''"
            />
          </el-form-item>
          <el-form-item
            label="营业执照"
            :prop="'businessTypeList.' + index + '.businessLicense'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.businessLicense" @click="uploadHandle(item, 'businessLicense', 'file')">
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.businessLicense"
              delete
              :deleteParams="{ id: item.id, filePath: item.businessLicense, fieldName: 'businessLicense', type: 2 }"
              @deleteFileImg="item.businessLicense = ''"
            />
          </el-form-item>
          <el-form-item
            label="盖章合同"
            :prop="'businessTypeList.' + index + '.sealedContract'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.sealedContract" @click="uploadHandle(item, 'sealedContract', 'file')">
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.sealedContract"
              delete
              :deleteParams="{ id: item.id, filePath: item.sealedContract, fieldName: 'sealedContract', type: 2 }"
              @deleteFileImg="item.sealedContract = ''"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
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
import { nextTick, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import Upload from "@/components/Upload.vue";
import FileImgPreview from "@/components/FileImgPreview.vue";
import useUtils from "@/hooks/useUtils";
const { getDictLabel } = useUtils();

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const currentObj: any = reactive({
  item: {},
  key: ""
});
const currentFileType = ref("img"); //img file

const dataForm: any = reactive({
  id: "",
  businessTypeList: [
    // {
    //   businessType: "商标注册",
    //   logo: "",
    //   idcard: "",
    //   applyBook: "",
    //   commission: "",
    //   businessLicense: "",
    //   sealedContract: ""
    // }
  ]
});

const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
  dataForm.businessTypeList = [];
  emit("refreshDataList");
};
const init = (detail: any) => {
  visible.value = true;
  const { id, businessTypeList } = detail;

  dataForm.id = id;
  dataForm.businessTypeList = businessTypeList.map((item: any) => {
    const { id, businessType, brandName, logo, idcard, applyBook, commission, businessLicense, sealedContract } = item;
    return {
      id,
      orderId: dataForm.id,
      businessType,
      brandName,
      logo,
      idcard,
      applyBook,
      commission,
      businessLicense,
      sealedContract
    };
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
const uploadHandle = (item: any, key: any, fileType: any) => {
  currentObj.item = item;
  currentObj.key = key;

  currentFileType.value = fileType;

  nextTick(() => {
    uploadRef.value.init();
  });
};
// 设置上传的内容
const setDataForm = (value: any) => {
  currentObj.item[currentObj.key] = value;
};
defineExpose({
  init
});
</script>

<style lang="less"></style>
