import { IObject, IViewHooks, IViewHooksOptions } from "@/types/interface";

import { checkPermission, getDictLabel } from "@/utils/utils";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
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
