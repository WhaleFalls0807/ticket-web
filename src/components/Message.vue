<template>
  <el-drawer v-model="drawer" title="通知" :size="isMobile ? '90%' : '40%'" class="message-drawer">
    <div class="infinite-list-wrapper">
      <div v-infinite-scroll="getInfo" :infinite-scroll-disabled="disabled">
        <div
          class="message-cell"
          v-for="message in state.messageList"
          :key="message.id"
          :class="{ 'is-unread': message.isRead === 0 }"
        >
          <div class="content-box">{{ message.content }}</div>
          <div class="right-box">
            <div>{{ message.createTime }}</div>
            <div class="handle">
              <span class="check" @click="handleMarkRead([message.id])" v-if="message.isRead === 0">标记已读</span>
              <span class="delete" @click="handleDelete(message.id)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="tips">加载中...</div>
      <div v-if="noMore && !loading" class="tips">没有更多了</div>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <div class="switch-read">
          <el-switch v-model="state.isRead" @change="isReadChange" :active-value="0" :inactive-value="1" />
          <span class="switch-read__title">仅显示未读消息</span>
        </div>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-icon><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="read">
                <el-icon>
                  <Check />
                </el-icon>
                全部标记为已读
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <el-icon>
                  <Delete />
                </el-icon>
                删除已读消息
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import baseService from "@/service/baseService";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Check } from "@element-plus/icons-vue";
import { useMediaQuery } from "@vueuse/core";

const drawer = ref(false);

const state: any = reactive({
  messageList: [
    {
      id: "1",
      isRead: 0,
      content: "ceshi测试",
      createTime: "2024-11-11 10:11:11"
    },
    {
      id: "2",
      isRead: 0,
      content: "ceshi测试ceshi测试ceshi测试ceshi测试ceshi测试ceshi测试",
      createTime: "2024-11-11 10:11:11"
    }
  ],
  page: 1,
  limit: 10,
  isRead: "", //未读0 已读1
  total: 0
});
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value);
const isMobile = useMediaQuery("(max-width: 768px)");

const handleCommand = (action: any) => {
  if (action === "delete") {
    handleDeleteAllRead();
  } else if (action === "read") {
    let ids = state.messageList.map((item: any) => {
      return item.id;
    });
    handleMarkRead(ids);
  }
};
// 标记已读
const handleMarkRead = (ids: any) => {
  ElMessageBox.confirm("确定将消息标记为已读吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      baseService.post(`/`).then((res) => {
        if (res.code === 0) {
          ElMessage.success({
            message: "标记成功",
            duration: 500,
            onClose: () => {}
          });
          state.messageList.forEach((item: any) => {
            if (ids.includes(item.id)) {
              item.isRead = 1;
            }
          });
        }
      });
    })
    .catch(() => {
      //
    });
};
// 删除消息
const handleDelete = (id: any) => {
  ElMessageBox.confirm("确定删除此消息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    baseService.post(`/` + id).then((res) => {
      if (res.code === 0) {
        ElMessage.success({
          message: "删除成功",
          duration: 500,
          onClose: () => {}
        });
        const index = state.messageList.findIndex((item: any) => item.id === id);
        state.messageList.splice(index, 1);
      }
    });
  });
};
// 删除全部已读消息
const handleDeleteAllRead = () => {
  ElMessageBox.confirm("确定删除全部已读消息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    baseService.post(`/`).then((res) => {
      if (res.code === 0) {
        ElMessage.success({
          message: "删除成功",
          duration: 500,
          onClose: () => {}
        });
        state.messageList = state.messageList.map((item: any) => {
          if (item.isRead !== 1) {
            return item;
          }
        });
      }
    });
  });
};
// 切换已读未读
const isReadChange = (value: any) => {
  // if (value === 0) {
  //   state.isRead = 0;
  // } else {
  //   state.isRead = "";
  // }
  // state.total = 0;
  // state.page = 1;
  // noMore.value = false;
  // state.messageList = [];
  // getInfo();
};

// 获取未读消息数
const getMessageCount = () => {
  const unReadMessage = 0;
};
const init = () => {
  drawer.value = true;

  // getInfo();
};
// 获取信息
const getInfo = () => {
  // loading.value = true;
  // baseService
  //   .get(`/notification/page`, {
  //     page: state.page,
  //     limit: state.limit,
  //     isRead: state.isRead
  //   })
  //   .then((res) => {
  //     state.messageList.push(...res.data.list);
  //     state.total = res.data.total;
  //     noMore.value = state.page * state.limit >= state.total;
  //     loading.value = false;
  //     state.page++;
  //   })
  //   .catch(() => {
  //     noMore.value = true;
  //     loading.value = false;
  //   });
};
defineExpose({
  init
});
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

.infinite-list-wrapper {
  height: 100%;
  overflow: auto;
}
.message-cell {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #f7f8fa;
    .check,
    .delete {
      visibility: visible;
    }
  }
}
.content-box {
  width: 77%;
  color: #333;
  font-size: 14px;
  padding: 15px 20px 15px 15px;
  line-height: 1.5;
}
.right-box {
  flex: 1;
  padding-right: 5px;
  color: #999;
  font-size: 12px;
}
.handle {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  .check,
  .delete {
    visibility: hidden;
    cursor: pointer;
  }

  .check + .delete {
    margin-left: 5px;
  }

  .check:hover {
    color: @--color-primary;
  }
  .delete:hover {
    color: #f56c6c;
  }
}
.switch-read__title {
  font-size: 13px;
  margin-left: 10px;
  color: #333;
}
.is-unread::before {
  content: "";
  position: absolute;
  top: 12px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #f94e4e;
}
.tips {
  margin: 20px auto;
  text-align: center;
  font-size: 12px;
  color: #666;
}
.drawer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style lang="less">
.message-drawer {
  .el-drawer__header {
    margin-bottom: 12px;
    .el-drawer__title {
      font-size: 20px;
      font-weight: 700;
    }
  }
  .el-drawer__body {
    padding: 20px 0 !important;
  }
  .el-drawer__footer {
    padding: 10px;
    border: 1px solid var(--el-border-color-light);
  }
}
</style>
