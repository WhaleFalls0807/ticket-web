import { IObject, IViewHooks, IViewHooksOptions } from "@/types/interface";

import { checkPermission, getDictLabel } from "@/utils/utils";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import qs from "qs";

const useUtils = () => {
  const router = useRouter();
  const route = useRoute();
  const store = useAppStore();

  const rejectFns = {
    hasPermission(key: string) {
      return checkPermission(store.state.permissions as string[], key);
    },
    getDictLabel(dictType: string, dictValue: number) {
      return getDictLabel(store.state.dicts, dictType, dictValue);
    },
    downloadFile(url: string) {
      window.location.href = `${app.api_img_file}${url}?${qs.stringify({
        token: getToken()
      })}`;
    },
    downloadFileWithBuffer(data: any, name: any) {
      const blob = new Blob([data]);
      var a = document.createElement("a"); // 创建a标签
      var href = window.URL.createObjectURL(blob); // 创建下载的链接
      a.href = href;
      a.download = name; // 下载后文件名
      document.body.appendChild(a);
      a.click(); // 点击下载
      document.body.removeChild(a); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    },
    computeFileType(url: any) {
      const imgSuffix = ["jpg", "jpeg", "png"];
      if (imgSuffix.includes(url.substring(url.lastIndexOf(".") + 1))) {
        return "img";
      } else {
        return "file";
      }
    }
  };
  return {
    router,
    route,
    store,
    ...rejectFns
  };
};

export default useUtils;
