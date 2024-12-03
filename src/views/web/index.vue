<template>
  <div class="container">
    <div class="header">
      <div class="left">您好！欢迎访问商标服务官方网站！</div>
      <div class="right">
        <span>全国统一免费服务热线 xxx</span>
      </div>
    </div>
    <div class="banner1">
      <h1>保护品牌 从注册开始</h1>
      <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-position="top" label-width="120px" size="large">
        <el-form-item prop="orderName" label="商标名称">
          <el-input v-model="dataForm.orderName" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item prop="industry" label="行业">
          <el-select v-model="dataForm.industry">
            <el-option
              v-for="item in industryList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <!-- <ren-select v-model="dataForm.industry" dict-type="industry"></ren-select> -->
        </el-form-item>
        <el-form-item>
          <div class="btn-wrap">
            <el-button type="danger" size="large" @click="dataFormSubmitHandle()">免费查询</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="banner2 banner">
      <div class="text-center">
        <h1 class="mb20">如何注册不同行业的商标</h1>
        <h4 class="mb70">全行业覆盖，为您量身定制商标注册方案 保护品牌不再等</h4>
      </div>
      <div class="wrapper">
        <div class="left">
          <div
            v-for="(item, index) in industryList.slice(0, industryList.length - 1)"
            :key="item.value"
            class="left-item"
            :class="{ active: state.activeIndustry === index }"
            @click="changeCurrentIndustry(item, index)"
          >
            <svg-icon :name="item.icon" class="icon"></svg-icon>
            <span class="ml10">{{ item.label }}</span>
          </div>
          <div class="left-item">
            <el-button type="primary" @click="add">咨询更多</el-button>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <svg-icon :name="state.currentIndustry.icon" class="icon"></svg-icon>
            <p>{{ state.currentIndustry.label }}</p>
          </div>
          <div class="desc">
            <dl>
              <dt>&nbsp;&nbsp;【行业范围】</dt>
              <dd>
                <p>{{ state.currentIndustry.scope }}</p>
              </dd>
            </dl>
            <dl>
              <dt>&nbsp;&nbsp;【推荐必要注册】</dt>
              <dd>
                <p>{{ state.currentIndustry.recommend }}</p>
              </dd>
            </dl>
            <dl>
              <dt>&nbsp;&nbsp;【建议保护注册】</dt>
              <dd>
                <p>{{ state.currentIndustry.suggestion }}</p>
              </dd>
            </dl>
          </div>
          <div class="text-center mt40">
            <el-button type="primary" size="large" @click="add">免费查询</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="banner3 banner">
      <div class="text-center white">
        <h1 class="mb20">了解商标注册流程</h1>
        <h4 class="mb70">让商标注册简单易懂</h4>
      </div>
      <div class="steps">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step-item"
          :class="{ 'arrow-icon': index !== steps.length - 1 }"
        >
          <svg-icon :name="item.icon" class="icon"></svg-icon>
          <div class="title">{{ item.title }}</div>
          <div>{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <div class="banner4 banner">
      <div class="text-center divider">
        <h1 class="mb20">常见问题</h1>
        <h4 class="mb70">你是否存在以下疑惑？欢迎咨询！</h4>
      </div>
      <ul class="questions">
        <li v-for="(item, index) in questions" :key="index" class="question-item">
          <span class="one-line">{{ item.qustion }}</span>
          <el-button size="small" @click="add">立即咨询</el-button>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="item">
        <div class="title">专业团队，专属服务</div>
        <div class="sub_title">一对一专属专家服务，确保每个细节都精准到位。</div>
      </div>
      <div class="item">
        <div class="title">快速响应，迅速定稿</div>
        <div class="sub_title">高效撰写，快捷递交，让您随时掌控进度。</div>
      </div>
      <div class="item">
        <div class="title">高品质，严密保密</div>
        <div class="sub_title">卓越质量保障，严格保密措施，您的安全，我们时刻守护。</div>
      </div>
      <div class="item">
        <div class="title">节省成本，省心省力</div>
        <div class="sub_title">全程托管，进度可查，轻松省钱更省心。</div>
      </div>
    </div>

    <Add ref="addRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { isMobile as isPhone } from "@/utils/utils";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import SvgIcon from "@/components/base/svg-icon";
import Add from "./add.vue";

const dataFormRef = ref();
const dataForm = reactive({
  orderName: "",
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
const steps = ref([
  {
    icon: "zhunbei",
    title: "准备阶段",
    desc: "10分钟"
  },
  {
    icon: "shenbao",
    title: "申报阶段",
    desc: "8小时左右"
  },
  {
    icon: "shencha",
    title: "商标局形式审查",
    desc: "2-5个工作日"
  },
  {
    icon: "tongzhishu",
    title: "受理通知书下发",
    desc: "1个月左右"
  },
  {
    icon: "shishen",
    title: "商标局实质审查",
    desc: "6个月左右"
  },
  {
    icon: "chushen",
    title: "初审公告",
    desc: "3个月"
  },
  {
    icon: "zhuce",
    title: "注册成功",
    desc: "8-11个月左右"
  }
]);
const questions: any = ref([
  {
    qustion: "怎么选择商标的行业分类？"
  },
  {
    qustion: "商标注册成功率如何估算？"
  },
  {
    qustion: "商标分类有哪些？"
  },
  {
    qustion: "商标注册成功后如何规避商标撤三风险?"
  },
  {
    qustion: "个人可以注册商标吗？"
  },
  {
    qustion: "申请和别人在同一天怎么办？"
  },
  {
    qustion: "资料有专人审查吗？"
  },
  {
    qustion: "收到补证通知书后多久再次提交？"
  },
  {
    qustion: "商标下证后还可能遇到哪些风险？"
  }
]);
const validatePhone = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isPhone(value)) {
    return callback(new Error("手机号格式错误"));
  }
  callback();
};
const rules = ref({
  orderName: [{ required: true, message: "请输入商标名称", trigger: "blur" }],
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

let state: any = reactive({
  activeIndustry: 0,
  currentIndustry: { ...industryList.value[0] }
});
const changeCurrentIndustry = (item: any, index: any) => {
  state.activeIndustry = index;
  state.currentIndustry = { ...item };
};
const addRef = ref();
const add = () => {
  addRef.value.init();
};
</script>
<style lang="less" scoped>
@import url("@/assets/theme/base.less");

.container {
  .header {
    background-color: #fff;
    height: 60px;
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .banner1 {
    min-height: 100vh;
    // background: url(../../assets/images/bg.png) no-repeat;
    // background: url(../../assets/images/bg.webp) no-repeat;
    background: url(../../assets/images/bg3.webp) no-repeat;
    background-size: 100% 100%;
    color: #fff;
    padding: 60px 0;
    h1 {
      text-align: center;
      font-size: 72px;
    }
    .el-form {
      width: 50%;
      background: #fff;
      padding: 20px;
      margin: 0 auto;
      margin-top: 60px;

      border-radius: 20px;

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
    }
  }
  .banner {
    min-height: 100vh;
    padding: 100px 60px;
  }
  .banner2 {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .wrapper {
      flex: 1;
      display: flex;
      .left {
        width: 60%;
        // background-color: #ccc;
        border-top: 1px solid var(--el-border-color-light);
        border-left: 1px solid var(--el-border-color-light);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(6, 1fr);
        .left-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid var(--el-border-color-light);
          border-right: 1px solid var(--el-border-color-light);
          cursor: pointer;
          min-height: 120px;
          &:hover {
            color: @--color-primary;
            border: 1px solid @--color-primary;
          }

          .icon {
            width: 32px !important;
            height: 32px;
            margin-bottom: 5px;
          }
        }
        .active {
          color: @--color-primary;
          border: 1px solid @--color-primary;
        }
      }
      .right {
        flex: 1;
        // background-color: red;
        border-top: 1px solid var(--el-border-color-light);
        border-right: 1px solid var(--el-border-color-light);
        border-bottom: 1px solid var(--el-border-color-light);
        padding: 20px;

        .title {
          border-bottom: 1px solid @--color-primary;
          padding-bottom: 5px;
          display: flex;
          font-size: 20px;
          font-weight: 700;
          align-items: center;

          .icon {
            margin-right: 15px;
            width: 20px;
            height: 20px;
          }
        }
        .desc {
          margin-top: 50px;
          dl {
            margin: 20px 10px;
            position: relative;
            dt::before {
              content: "";
              display: block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: @--color-primary;
              position: absolute;
              top: 7px;
            }
            dd {
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
  .banner3 {
    min-height: 80vh;
    background: url(../../assets/images/building.webp) no-repeat;
    background-size: 100% 100%;
    background-color: rgba(0, 0, 0, 0.5);
    background-blend-mode: overlay;

    .steps {
      display: flex;
      justify-content: space-around;
      margin-top: 90px;
      .step-item {
        position: relative;
        width: 120px;
        height: 120px;
        background-color: #fff;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .icon {
          width: 30px;
          height: 30px;
        }
        .title {
          margin-top: 10px;
          margin-bottom: 5px;
          font-weight: 700;
        }
        &:hover {
          color: @--color-primary;
          border: 1px solid @--color-primary;
        }
      }
      .arrow-icon::before {
        content: "";
        display: block;
        border: 6px solid #fff;
        position: absolute;
        left: 91%;
        top: 50%;
        transform: rotate(45deg) translateY(-50%);
      }
    }
  }
  .banner4 {
    background-color: #fff;
    min-height: 70vh;
    .questions {
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .question-item {
        width: 30%;
        height: 40px;
        line-height: 40px;

        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 10px;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          color: @--color-primary;
          background: var(--el-border-color-light);
        }
      }
    }
  }

  .divider {
    position: relative;
    &::before,
    &::after {
      content: "";
      display: block;
      width: 100px;
      height: 1px;
      background-color: var(--color-primary);
      position: absolute;
      left: 32%;
      top: 50%;
    }
    &::before {
      left: 32%;
    }
    &::after {
      left: 62%;
    }
  }

  .footer {
    padding: 0 10%;
    min-height: 100px;
    background-color: #333;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    .item {
      .title {
        font-size: 18px;
      }
      .sub_title {
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .container {
    .header {
      padding: 0 10px;
    }
    .banner1 {
      .el-form {
        width: 90%;
        .btn-wrap {
          width: 100%;
        }
      }
    }
    .banner2 {
      .wrapper {
        flex-direction: column;
        .left {
          width: 100%;
          grid-template-columns: repeat(3, 1fr);
        }
        .right {
          border: 1px solid var(--el-border-color-light);
        }
      }
    }
    .banner3 {
      .steps {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin-top: 90px;
        .step-item {
          margin-bottom: 25px;
        }
        .arrow-icon::before {
          left: 50%;
          top: 98%;
          transform: rotate(45deg) translateX(-50%);
        }
      }
    }
    .banner4 {
      .questions {
        width: 100%;

        flex-direction: column;
        .question-item {
          width: 100%;
        }
      }
    }

    .divider {
      &::before,
      &::after {
        width: 80px;
        left: 32%;
        top: 50%;
      }
      &::before {
        left: -12%;
      }
      &::after {
        left: 80%;
      }
    }
    .footer {
      padding: 20px;
      flex-direction: column;
      .item {
        text-align: center;
      }
      .item + .item {
        margin-top: 20px;
      }
    }
  }
}
</style>
