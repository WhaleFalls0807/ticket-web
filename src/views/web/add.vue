<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '40%'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <template v-slot:title>
      <h1 class="title">商标免费查询</h1>
    </template>
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-position="top" label-width="120px" size="large">
      <el-form-item prop="orderName" label="商标名称">
        <el-input v-model="dataForm.orderName" />
      </el-form-item>
      <el-form-item prop="customerName" label="客户名称">
        <el-input v-model="dataForm.customerName" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="dataForm.phone" />
      </el-form-item>
      <el-form-item prop="industry" label="行业">
        <el-select v-model="dataForm.industry">
          <el-option v-for="item in industryList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="btn-wrap">
          <el-button type="danger" size="large" @click="dataFormSubmitHandle()">免费查询</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import { isMobile as isPhone } from "@/utils/utils";

const isMobile = useMediaQuery("(max-width: 768px)");

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);

const dataFormRef = ref();
const dataForm = reactive({
  orderName: "",
  customerName: "",
  phone: "",
  industry: ""
});
const industryList: any = ref([
  {
    label: "餐饮行业",
    value: "餐饮行业",
    icon: "canyin",
    scope: "餐厅饭店、 酒吧、食品销售、酒店住宿等",
    recommend: "29类 食品/ 230类 方便食品/ 231类 种籽果蔬/232类材料加工/ 233类 酒/ 243类 餐饮住宿",
    suggestion: "35类-广告销售"
  },
  {
    label: "珠宝行业",
    value: "珠宝行业",
    icon: "zhubao",
    scope: "贵金属、 珠宝首饰、钟表、珠宝加工、维修等",
    recommend: "14类 珠宝钟表/ 37类 建筑修理/ 40类 材料加工/41类教育娱乐",
    suggestion: "35类-广 告销售/ 39类 运输贮藏"
  },
  {
    label: "化妆品行业",
    value: "化妆品行业",
    icon: "huazhuangpin",
    scope: "日化清洁、美容护肤、化妆用品,以及相关用具等",
    recommend: "03类日化用品/05类医药/10类医疗器械/21类厨房洁具",
    suggestion: "35类- 广告销售/ 40类 材料加工"
  },
  {
    label: "电子行业",
    value: "电子行业",
    icon: "dianzi",
    scope: "电子设备、 通讯设备、电子仪器等",
    recommend: "09类-科学仪器/ 16类-办公用品",
    suggestion: "35类-广告销售/ 37类-建筑修理/ 42类-网站服务"
  },
  {
    label: "健身行业",
    value: "健身行业",
    icon: "jianshen",
    scope: "乐器、乐器用品、乐器维修养护，以及乐器培训服务等健身器材、健身培训、健康养生保健，以及疗养康复服务等",
    recommend: "28类 健身器材/ 41类教育娱乐/ 44类 医疗园艺",
    suggestion: "35类 广告销售/ 43类 餐饮住宿"
  },
  {
    label: "能源行业",
    value: "能源行业",
    icon: "nengyuan",
    scope: "工业化学品、制剂、工业原料、燃料,光能、热能、核反应相关包括其相关加工、设备等",
    recommend: "01类 化学原料/ 04类 燃料油脂/ 11类 灯具空调/40类材料加工",
    suggestion: "35类-广告销售/ 39类 运输则藏"
  },
  {
    label: "食品行业",
    value: "食品行业",
    icon: "shipin",
    scope: "食品、 零食、蔬菜、生鲜、调料等，包括其加工与生产",
    recommend: "29类 食品/ 30类方便食品/ 31类 种籽果蔬/32类材料加工",
    suggestion: "35类-广 告销售/ 39类 运输贮藏"
  },
  {
    label: "家居行业",
    value: "家居行业",
    icon: "jiaju",
    scope: "建筑装修、 家具用品、厨房洁具,家居维修 ，包括其相关生产",
    recommend: "19类建筑材料/ 20类家具/ 21类-厨房洁具/37类建筑修理",
    suggestion: "35类-广 告销售/ 40类材料加工"
  },
  {
    label: "互联网行业",
    value: "互联网行业",
    icon: "hulianwang",
    scope: "酒店住宿、 旅行安排、旅游培训、旅游咨询等",
    recommend: "09类 科学仪器/ 38类 通讯服务/ 42类 网站服务",
    suggestion: "35类-广告销售/ 41类 教育娱乐"
  },
  {
    label: "机械行业",
    value: "机械行业",
    icon: "jixie",
    scope: "机械设备、 部件,手工器械部件,包括其加工与生产",
    recommend: "07类-机械设备/ 08类-手 工器械/ 12类-运输工具",
    suggestion: "40类-材料加工/ 42类-网站服务"
  },
  {
    label: "乐器行业",
    value: "乐器行业",
    icon: "yueqi",
    scope: "乐器、 乐器用品、乐器维修养护,以及乐器培训服务等",
    recommend: "15类 乐器/ 37类 建筑修理/ 41类 教育娱乐",
    suggestion: "35类-广告销售/ 39类 运输贮藏"
  },
  {
    label: "化工行业",
    value: "化工行业",
    icon: "huagong",
    scope: "化学原料、 颜料、燃油、油漆涂料,金属材料等",
    recommend: "01类 化学原料/ 02类 颜料油漆/ 04类 燃料油脂/06类金属材料",
    suggestion: "35类-广告销售/ 42类 网站服务"
  },
  {
    label: "服装行业",
    value: "服装行业",
    icon: "fuzhuang",
    scope: "布艺、 家纺、服装(含婴儿纺织品)、鞋帽、饰品配件等",
    recommend: "24类 布料床单/ 25类 服装鞋帽/ 26类 钮扣拉链",
    suggestion: "30类 方便食品/ 35类-广 告销售/ 42类 网站服务"
  },
  {
    label: "电器行业",
    value: "电器行业",
    icon: "dianqi",
    scope: "家电、 灯具、电器设备、电器材料,以及相关维修养护等",
    recommend: "09类 科学仪器/ 11类 灯具空调/ 37类 建筑修理",
    suggestion: "35类-广 告销售/ 39类 运输贮藏"
  },
  {
    label: "安防行业",
    value: "安防行业",
    icon: "anfang",
    scope: "安全检测、 防护仪器与设备,安全救护,人身安全保护等服务",
    recommend: "09类 科学仪器/ 11类 灯具空调/ 45类 社会服务",
    suggestion: "35类-广告销售/ 38类-通讯服务/ 42类-网站服务"
  },
  // { label: "装修行业", value: "装修行业", scope: "", recommend: "", suggestion: "" },
  {
    label: "汽车行业",
    value: "汽车行业",
    icon: "qiche",
    scope: "汽车销售 ,汽车零部件以及维修、广告宣传等",
    recommend: "12类-运输工具/ 35类-广 告销售/ 37类-建筑修理",
    suggestion: "06类-金属材料/ 39类-运输贮藏"
  },
  {
    label: "建材行业",
    value: "建材行业",
    icon: "jiancai",
    scope: "木材、 施工材料，金属材料、建筑施工I ,包括相关材料加工",
    recommend: "06类 金属材料/ 17类 橡胶制品/ 19类 建筑材料/37类建筑修理/ 40类材料加工",
    suggestion: "35类 广 告销售"
  },
  {
    label: "纺织行业",
    value: "纺织行业",
    icon: "fangzhi",
    scope: "纤维、 毛线、地摊、等纺织物",
    recommend: "22类 绳网袋篷/ 23类 纱线丝/ 24类 布料床单/27类地毯席垫",
    suggestion: "35类-广告销售/ 40类 材料加工/ 42类 网站服务"
  },
  // { label: "医疗行业", value: "医疗行业", scope: "", recommend: "", suggestion: "" },
  {
    label: "文化行业",
    value: "文化行业",
    icon: "wenhua",
    scope: "印刷、 电视广播、出版、文娱、活动演出等",
    recommend: "16类 办公用品/ 35类-广 告销售/ 38类 通讯服务/41类教育娱乐",
    suggestion: "42类 网站服务"
  },
  {
    label: "旅游行业",
    value: "旅游行业",
    icon: "luyou",
    scope: "酒店住宿、旅行安排、旅游培训、旅游咨询等",
    recommend: "39类运输贮藏 / 41类教育娱乐",
    suggestion: "35类-广 告销售/ 45类社会服务"
  },
  {
    label: "钢铁行业",
    value: "钢铁行业",
    icon: "gangtie",
    scope: "金属材料 ,以及材料加工生产,包括材料运输等",
    recommend: "06类-金属材料/ 39类-运输贮藏/ 40类-材料加工",
    suggestion: "35类-广告销售/ 42类-网站服务"
  },
  {
    label: "地产行业",
    value: "地产行业",
    icon: "dichan",
    scope: "建筑工程、 装潢装饰、不动产相关等",
    recommend: "19类 建筑材料/ 36类 金融物管/ 37类 建筑修理",
    suggestion: "35类-广告销售/ 40类-材料加工/ 42类-网站服务"
  },
  // { label: "通讯行业", value: "通讯行业", scope: "", recommend: "", suggestion: "" },
  {
    label: "摄影行业",
    value: "摄影行业",
    icon: "sheying",
    scope: "影视、录像、广告、剧本创作等",
    recommend: "35类-广告销售/ 41类教育娱乐",
    suggestion: "25类服装鞋帽/ 40类-材料加工/ 45类社会服务"
  },
  { label: "其他行业", value: "其他行业", scope: "", recommend: "", suggestion: "" }
]);
const validatePhone = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isPhone(value)) {
    return callback(new Error("手机号格式错误"));
  }
  callback();
};

const rules = ref({
  orderName: [{ required: true, message: "请输入商标名称", trigger: "blur" }],
  customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
  ],
  industry: [{ required: true, message: "请选择行业", trigger: "blur" }]
});
// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const fn = baseService.post("/order/save/byUser", dataForm);
    fn.then((res) => {
      ElMessage.success({
        message: "提交成功",
        duration: 500
      });
      close();
    });
  });
};

const close = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};
const init = () => {
  visible.value = true;
};

defineExpose({
  init
});
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

.title {
  text-align: center;
  color: red;
}
.btn-wrap {
  margin: 0 auto;
  width: 30%;
  .el-button {
    background-color: red;
    border-color: red;
    width: 100%;
    font-size: 25px;
  }
}
</style>
