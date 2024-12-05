<script lang="ts">
import baseService from "@/service/baseService";
import { useFullscreen } from "@vueuse/core";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store";
import userLogo from "@/assets/images/user.png";
import "@/assets/css/header.less";
import { ElMessageBox } from "element-plus";
import AddOrder from "@/components/order-add.vue";
import useUtils from "@/hooks/useUtils";
import Message from "@/components/Message.vue";
interface IExpand {
  userName?: string;
}

/**
 * 顶部右侧扩展区域
 */
export default defineComponent({
  name: "Expand",
  components: { AddOrder, Message },
  props: {
    userName: String
  },
  setup(props: IExpand) {
    const { hasPermission } = useUtils();

    const addOrderRef = ref();
    const router = useRouter();
    const store = useAppStore();
    const { isFullscreen, toggle } = useFullscreen();

    const onClickUserMenus = (path: string) => {
      if (path === "/login") {
        ElMessageBox.confirm("确定进行[退出]操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            baseService.post("/logout").finally(() => {
              router.push(path);
            });
          })
          .catch(() => {
            //
          });
      } else {
        router.push(path);
      }
    };

    const addOrder = () => {
      console.log(addOrderRef.value);
      addOrderRef.value.init();
    };

    // 点击展示消息通知
    const messageRef = ref();
    const showMessage = () => {
      messageRef.value.init();
    };
    return {
      props,
      store,
      isFullscreen,
      userLogo,
      onClickUserMenus,
      toggle,
      addOrderRef,
      addOrder,
      hasPermission,
      showMessage,
      messageRef
    };
  }
});
</script>
<template>
  <div class="rr-header-right-items">
    <div v-if="hasPermission('sys:inner_order:save')">
      <el-button type="success" size="large" @click="addOrder">创建工单</el-button>
    </div>
    <div>
      <el-badge :hidden="store.state.unReadMessage == 0" :value="store.state.unReadMessage" :max="99">
        <span @click="showMessage()">
          <el-icon><BellFilled /></el-icon>
        </span>
      </el-badge>
    </div>
    <!-- <div>
      <a href="https://www.renren.io/community" target="_blank">
        <svg-icon name="icon-earth"></svg-icon>
      </a>
    </div> -->
    <!-- <div>
      <a href="https://gitee.com/renrenio/renren-security" target="_blank">
        <svg-icon name="icon-gitee"></svg-icon>
      </a>
    </div> -->
    <!-- <div @click="toggle" class="hidden-xs-only">
      <span>
        <svg-icon :name="isFullscreen ? 'tuichuquanping' : 'fullscreen2'"></svg-icon>
      </span>
    </div> -->
    <div style="display: flex; justify-content: center; align-items: center">
      <img
        :src="userLogo"
        :alt="props.userName"
        style="width: 30px; height: 30px; border-radius: 50%; margin-top: 3px; margin-right: 5px"
      />
      <el-dropdown @command="onClickUserMenus">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="lock" command="/user/password">修改密码</el-dropdown-item>
            <el-dropdown-item icon="switch-button" divided command="/login">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <span class="el-dropdown-link" style="display: flex">
          {{ props.userName }}
          <el-icon class="el-icon--right" style="font-size: 14px"><arrow-down /></el-icon>
        </span>
      </el-dropdown>
    </div>
  </div>
  <AddOrder ref="addOrderRef" />
  <Message ref="messageRef" />
</template>
