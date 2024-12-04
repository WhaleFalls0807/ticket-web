<template>
  <el-dialog
    v-model="visible"
    title="回传资料"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" ref="dataFormRef" label-width="150px">
      <el-collapse>
        <el-collapse-item v-for="(item, index) in dataForm.businessTypeList" :key="index" :title="item.businessType">
          <el-form-item
            label="回执文件"
            :prop="'businessTypeList.' + index + '.regiAppReceipt'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.regiAppReceipt" @click="uploadHandle(item, 'regiAppReceipt', 'file')">
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.regiAppReceipt"
              delete
              :deleteParams="{ id: item.id, filePath: item.regiAppReceipt, fieldName: 'regiAppReceipt', type: 2 }"
              @deleteFileImg="item.regiAppReceipt = ''"
            />
          </el-form-item>
          <el-form-item
            label="受理通知书"
            :prop="'businessTypeList.' + index + '.regiAppAcceptNotice'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.regiAppAcceptNotice" @click="uploadHandle(item, 'regiAppAcceptNotice', 'file')">
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.regiAppAcceptNotice"
              delete
              :deleteParams="{
                id: item.id,
                filePath: item.regiAppAcceptNotice,
                fieldName: 'regiAppAcceptNotice',
                type: 2
              }"
              @deleteFileImg="item.regiAppAcceptNotice = ''"
            />
          </el-form-item>
          <el-form-item
            label="初步审定公告通知书"
            :prop="'businessTypeList.' + index + '.regiAppPreApproveNotice'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button
              v-if="!item.regiAppPreApproveNotice"
              @click="uploadHandle(item, 'regiAppPreApproveNotice', 'file')"
            >
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.regiAppPreApproveNotice"
              delete
              :deleteParams="{
                id: item.id,
                filePath: item.regiAppPreApproveNotice,
                fieldName: 'regiAppPreApproveNotice',
                type: 2
              }"
              @deleteFileImg="item.regiAppPreApproveNotice = ''"
            />
          </el-form-item>
          <el-form-item
            label="注册证"
            :prop="'businessTypeList.' + index + '.regiCertificate'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.regiCertificate" @click="uploadHandle(item, 'regiCertificate', 'file')">
              上传文件
            </el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.regiCertificate"
              delete
              :deleteParams="{ id: item.id, filePath: item.regiCertificate, fieldName: 'regiCertificate', type: 2 }"
              @deleteFileImg="item.regiCertificate = ''"
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
    //   regiAppReceipt: "",
    //   regiAppAcceptNotice: "",
    //   regiAppPreApproveNotice: "",
    //   regiCertificate: ""
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
    const { id, businessType, regiAppReceipt, regiAppAcceptNotice, regiAppPreApproveNotice, regiCertificate } = item;
    return {
      id,
      orderId: dataForm.id,
      businessType,
      regiAppReceipt,
      regiAppAcceptNotice,
      regiAppPreApproveNotice,
      regiCertificate
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
