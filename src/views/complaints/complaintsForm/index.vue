<template>
  <div>
    <div class="app-container">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getList"
        >
          <van-cell-group v-for="item in complaintsList" :key="item.id" inset style="margin: 10px; border: 1px solid #e6ebf5">
            <van-cell size="large" title="投诉单状态">
              <template #default>
                <span :class="{blueState: item.state === '1'}" v-for="state in stateOptions" v-if="state.value === item.state">{{ state.label }}</span>
              </template>
            </van-cell>
            <van-cell title="区县">
              <template #default>
                <template v-for="district in districtOptions" v-if="district.value === item.district">{{ district.label }}</template>
              </template>
            </van-cell>
            <van-cell title="用户电话" :value="item.userPhone" />
            <van-cell title="用户所在地" :value="item.userAddress" />
            <van-cell title="是否为住宅小区">
              <template #default>
                <span v-if="item.isHome === '0'">是</span>
                <span v-if="item.isHome === '1'">否</span>
              </template>
            </van-cell>
            <van-button v-if="item.state === '1'"
                        type="default"
                        block
                        style="color: #1890ff;"
                        @click="handleUpdate(item)">编辑投诉单</van-button>
            <van-button v-else
                        type="default"
                        block
                        style="color: #1890ff;"
                        @click="handleDetail(item)">查看投诉单</van-button>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-button style="position: fixed; bottom: 20px;left: 50%; transform: translateX(-50%);width: 90%" size="large" type="info" @click="handleAdd">新增投诉单</van-button>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listComplaintsByUser } from '@/api/complaintsList/complaintsList'

export default {
  name: "ComplaintsForm",
  data() {
    return {
      // 遮罩层
      loading: true,
      finished: true,
      isLoading: false,
      total: 0,
      // 用户表格数据
      complaintsList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5
      },
      districtOptions: [
        //区县，0-秦都区 1-渭城区 2-泾阳 3-兴平 4-武功 5-礼泉 6-乾县 7-永寿 8-彬州 9-长武 10-旬邑 11-淳化 12-三原 13-开发区
        {label: "秦都区", value: "0"},
        {label: "渭城区", value: "1"},
        {label: "泾阳", value: "2"},
        {label: "兴平", value: "3"},
        {label: "武功", value: "4"},
        {label: "礼泉", value: "5"},
        {label: "乾县", value: "6"},
        {label: "永寿", value: "7"},
        {label: "彬州", value: "8"},
        {label: "长武", value: "9"},
        {label: "旬邑", value: "10"},
        {label: "淳化", value: "11"},
        {label: "三原", value: "12"},
        {label: "开发区", value: "13"}
      ],
      stateOptions: [
        {label: "已处理", value: "0"},
        {label: "未处理", value: "1"},
        {label: "未完成", value: "2"}
      ],
      // 表单校验
      rules: {
      }
    };
  },
  watch: {

  },
  created() {
    this.getList();
  },
  methods: {
    onRefresh() {
      this.queryParams.pageNum = 1;
      this.complaintsList = [];
      this.isLoading = true;
      listComplaintsByUser(this.queryParams).then(response => {
        this.queryParams.pageNum++;
        this.complaintsList.push(...response.rows);
        this.finished = this.complaintsList.length === response.total;
        this.isLoading = false;
      });
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listComplaintsByUser(this.queryParams).then(response => {
        this.queryParams.pageNum++;
        this.complaintsList.push(...response.rows);
        this.finished = this.complaintsList.length === response.total;
        this.loading = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: "/complaints/add"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({path: "/complaints/edit/" + row.id});
    },
    handleDetail(row) {
      this.$router.push({path: "/complaints/edit/" + row.id, query: {isDetail: "0"}});
    }
  }
};
</script>
<style>
.blueState {
  color: #1890ff
}
</style>
