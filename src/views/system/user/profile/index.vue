<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属网格
                <div class="pull-right">
                  <template v-for="grid in gridOptions" v-if="grid.value === user.grid">
                    {{ grid.label }}
                  </template>
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      activeTab: "userinfo",
      gridOptions: [
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
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
      });
    }
  }
};
</script>
