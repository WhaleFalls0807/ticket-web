<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '50%'"
    title="回传资料"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form :model="dataForm" ref="dataFormRef" label-width="120px">
      <el-collapse>
        <el-collapse-item v-for="(item, index) in dataForm.businessTypeList" :key="index" :title="item.businessType">
          <el-form-item
            label="aaa"
            :prop="'businessTypeList.' + index + '.aaa'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.aaa" @click="uploadHandle(item, 'aaa', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.aaa"
              delete
              :deleteParams="{ id: item.id, filePath: item.aaa, fieldName: 'aaa', type: 2 }"
              @deleteFileImg="item.aaa = ''"
            />
          </el-form-item>
          <el-form-item
            label="bbb"
            :prop="'businessTypeList.' + index + '.bbb'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.bbb" @click="uploadHandle(item, 'bbb', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.bbb"
              delete
              :deleteParams="{ id: item.id, filePath: item.bbb, fieldName: 'bbb', type: 2 }"
              @deleteFileImg="item.bbb = ''"
            />
          </el-form-item>
          <el-form-item
            label="ccc"
            :prop="'businessTypeList.' + index + '.ccc'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.ccc" @click="uploadHandle(item, 'ccc', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.ccc"
              delete
              :deleteParams="{ id: item.id, filePath: item.ccc, fieldName: 'ccc', type: 2 }"
              @deleteFileImg="item.ccc = ''"
            />
          </el-form-item>
          <el-form-item
            label="ddd"
            :prop="'businessTypeList.' + index + '.ddd'"
            :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur'
            }"
          >
            <el-button v-if="!item.ddd" @click="uploadHandle(item, 'ddd', 'file')">上传文件</el-button>
            <FileImgPreview
              v-else
              fileType="file"
              :url="item.ddd"
              delete
              :deleteParams="{ id: item.id, filePath: item.ddd, fieldName: 'ddd', type: 2 }"
              @deleteFileImg="item.ddd = ''"
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
import { useMediaQuery } from "@vueuse/core";
import Upload from "@/components/Upload.vue";
import FileImgPreview from "@/components/FileImgPreview.vue";

const isMobile = useMediaQuery("(max-width: 768px)");

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
    //   aaa: "",
    //   bbb: "",
    //   ccc: "",
    //   ddd: ""
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
    const { id, businessType, aaa, bbb, ccc, ddd } = item;
    return {
      id,
      orderId: dataForm.id,
      businessType,
      aaa,
      bbb,
      ccc,
      ddd
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
