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
      <el-form-item prop="customerName" label="客户名称">
        <el-input v-model="dataForm.customerName" />
      </el-form-item>
      <el-form-item prop="company" label="公司名称">
        <el-input v-model="dataForm.company" />
      </el-form-item>
      <el-form-item prop="enterprise" label="类型">
        <ren-select v-model="dataForm.enterprise" dict-type="enterprise"></ren-select>
      </el-form-item>
      <el-form-item prop="source" label="客户来源">
        <ren-select v-model="dataForm.source" dict-type="source"></ren-select>
      </el-form-item>
      <el-form-item prop="website" label="客户网站首页">
        <el-input v-model="dataForm.website" />
      </el-form-item>
      <el-form-item prop="address" label="客户地址">
        <el-input v-model="dataForm.address" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="dataForm.phone" />
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="dataForm.email" />
      </el-form-item>
      <el-form-item prop="wechat" label="是否微信建联">
        <ren-radio-group v-model="dataForm.wechat" dict-type="wechat"></ren-radio-group>
      </el-form-item>
      <el-form-item prop="industry" label="客户行业">
        <ren-select v-model="dataForm.industry" dict-type="industry"></ren-select>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
      <el-form-item prop="ownerUserId" label="负责人" v-if="hasPermission('sys:user:page')">
        <el-select v-model="dataForm.ownerUserId">
          <el-option v-for="item in ownerUserList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="ownerUserId" label="负责人">
        <SelectRelative v-model="dataForm.ownerUserId" />
      </el-form-item> -->
    </el-form>
    <template v-slot:footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import SelectRelative from "@/components/SelectRelative.vue";
import { isMobile as isPhone, isEmail } from "@/utils/utils";
import useUtils from "@/hooks/useUtils";
const { hasPermission } = useUtils();
const isMobile = useMediaQuery("(max-width: 768px)");

const props = defineProps(["ownerUserList"]);
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

let oldCustomerName = "";
const dataForm: any = reactive({
  id: "",
  customerName: "",
  company: "",
  enterprise: 1,
  source: "",
  website: "",
  address: "",
  phone: "",
  email: "",
  wechat: 0,
  industry: "",
  remark: "",
  ownerUserId: ""
});

const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim === "") {
    callback(new Error("必填项不能为空"));
  } else if (dataForm.id && value === oldCustomerName) {
    callback();
  } else {
    baseService
      .get(`/customer/name/check`, {
        customerName: value
      })
      .then((res) => {
        if (res.data) {
          callback(new Error("名称已存在！"));
        } else {
          callback();
        }
      });
  }
};
const validatePhone = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isPhone(value)) {
    return callback(new Error("手机号格式错误"));
  }
  callback();
};
const validateEmail = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isEmail(value)) {
    return callback(new Error("邮箱格式错误"));
  }
  callback();
};
const rules = ref({
  customerName: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validateName, trigger: "blur" }
  ],
  source: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
  ],
  email: [{ validator: validateEmail, trigger: "blur" }]
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
  } else {
    let str = localStorage.getItem("addCustomerParams");
    if (str) {
      const params: any = JSON.parse(str);
      Object.assign(dataForm, params);
    }
  }
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/customer/queryById/${id}`).then((res) => {
    Object.assign(dataForm, res.data);
    oldCustomerName = res.data.customerName;
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/customer/saveOrUpdate", dataForm);
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

defineExpose({
  init
});
</script>

<style lang="less"></style>
