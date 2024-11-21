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
