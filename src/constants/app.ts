import { getValueByKeys } from "@/utils/utils";
import appPack from "../../package.json";
/**
 * app系统配置
 */
export default {
  /**
   * 系统版本号，自动读取package.json中的version字段
   */
  version: appPack.version,

  /**
   * 系统默认语言
   */
  defaultLang: "zh-CN",

  /**
   * api请求地址，这里读取env环境变量中的VITE_APP_API，优先使用全局变量window.SITE_CONFIG.apiURL钩子，支持在index.html中配置
   */
  api: getValueByKeys(window, "SITE_CONFIG.apiURL") || import.meta.env.VITE_APP_API,
  api_img_file: import.meta.env.VITE_APP_API_IMG_FILE,

  /**
   * 启用logo图标，logo尺寸32*32，存放路径@/assets/images/logo.jpg
   */
  enabledLogo: false,

  /**
   * 开启页面缓存
   */
  enabledKeepAlive: false,

  /**
   * 网络请求超时时间，单位毫秒
   */
  requestTimeout: 30000,

  /**
   * 全屏渲染的页面
   */
  fullscreenPages: ["/", "/login"],
  /**
   * 公司名称
   */
  companyName: "江苏嘉泽知识产权代理有限公司"
  // companyName: "xx"
};
