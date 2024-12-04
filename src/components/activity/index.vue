<template>
  <el-button type="primary" @click="addFollow" v-if="activityType == 2 || activityType == 3">写跟进</el-button>
  <div class="infinite-list-wrapper">
    <el-timeline
      class="list"
      v-infinite-scroll="getInfo"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="200"
    >
      <el-timeline-item
        class="list-item"
        center
        placement="top"
        v-for="(item, index) in state.followList"
        :key="item.id"
      >
        <el-card shadow="hover">
          <div class="header mb15">
            <div class="header-left">
              <div>
                <p class="name mb10">{{ item.createName }}</p>
                <p class="time">{{ item.createDate }}</p>
              </div>
              <el-tag v-if="activityType !== 1" class="ml20">
                {{ getDictLabel("operateType", item.operateType) }}
              </el-tag>
            </div>
            <div v-if="activityType !== 1">
              <svg-icon class="svg-icon" name="icon-edit-fill" @click="addFollow(item)"></svg-icon>
              <svg-icon class="svg-icon ml10" name="icon-delete-fill" @click="deleteFollow(item, index)"></svg-icon>
            </div>
          </div>
          <div class="content">{{ item.content }}</div>
        </el-card>
      </el-timeline-item>

      <p v-if="loading" class="text-center pb10">加载中...</p>
      <p v-if="noMore" class="text-center pb10">没有更多了……</p>
    </el-timeline>
  </div>
  <FollowAddUpdate
    ref="addFollowRef"
    @refreshDataList="getFollow"
    :associationId="associationId"
    :activityType="activityType"
  />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from "vue";
import baseService from "@/service/baseService";
import FollowAddUpdate from "./FollowAddUpdate.vue";
import SvgIcon from "@/components/base/svg-icon";
import { ElMessage, ElMessageBox } from "element-plus";
import useUtils from "@/hooks/useUtils";
const { getDictLabel } = useUtils();

const props = defineProps(["associationId", "activityType"]);
const emit = defineEmits(["refreshDataList"]);
const state: any = reactive({
  followList: [],
  total: 0,
  page: 1,
  limit: 10
});
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value);
// 写跟进
const addFollowRef = ref();
const addFollow = (item?: number) => {
  addFollowRef.value.init(item);
};
const getFollow = () => {
  state.page = 1;
  state.followList = [];
  getInfo();
};
// 删除
const deleteFollow = (item: any, index: number) => {
  ElMessageBox.confirm("确定进行[删除]操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      baseService.post(`/activity/delete/` + item.id).then((res) => {
        ElMessage.success({
          message: "成功",
          duration: 500,
          onClose: () => {
            state.followList.splice(index, 1);
          }
        });
      });
    })
    .catch(() => {
      //
    });
};
// 获取跟进记录
const getInfo = () => {
  loading.value = true;
  baseService
    .get(`/activity/list`, {
      page: state.page,
      limit: state.limit,
      associationId: props.associationId,
      activityType: props.activityType
    })
    .then((res) => {
      state.followList.push(...res.data.list);
      state.total = res.data.total;

      noMore.value = state.page * state.limit >= state.total;
      loading.value = false;

      state.page++;
    })
    .catch(() => {
      noMore.value = true;
      loading.value = false;
    });
};
</script>

<style scoped lang="less">
@import url("@/assets/theme/base.less");

.infinite-list-wrapper {
  margin-top: 10px;
  height: 100%;
  .list {
    height: 100%;
    overflow: auto;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;

    .name {
      font-size: 16px;
    }
    .time {
      color: #999;
    }
  }
}
.svg-icon {
  opacity: 0;
  cursor: pointer;
  color: @--color-primary;
}

.list-item {
  &:hover .svg-icon {
    opacity: 1;
  }
}

.content {
  word-break: break-all;
}
</style>
