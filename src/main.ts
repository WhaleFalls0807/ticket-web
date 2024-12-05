import "@/assets/icons/iconfont/iconfont.js";
import RenDeptTree from "@/components/ren-dept-tree";
import RenRadioGroup from "@/components/ren-radio-group";
import RenRegionTree from "@/components/ren-region-tree";
import RenSelect from "@/components/ren-select";
import SvgIcon from '@/components/base/svg-icon'
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/index.css";
import locale from "element-plus/es/locale/lang/zh-cn";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIcons from "@element-plus/icons-vue";

import axios from "axios";
import "virtual:svg-icons-register";
import appConstans from "@/constants/app";

const app = createApp(App);
Object.keys(ElementPlusIcons).forEach((iconName) => {
  app.component(iconName, ElementPlusIcons[iconName as keyof typeof ElementPlusIcons]);
});

app
  .use(createPinia())
  .use(router)
  .use(RenRadioGroup)
  .use(RenSelect)
  .use(SvgIcon)
  .use(RenDeptTree)
  .use(RenRegionTree)
  .use(ElementPlus, { size: "default", locale: locale })
  .mount("#app");

window.axios = axios;

document.title = appConstans.companyName;
