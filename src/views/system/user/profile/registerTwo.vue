<template>
  <div class="app-container">
    <van-form ref="form" @submit="submitForm" :label-width="100">
      <van-field v-model="form.userName"
                 name="userName" required
                 label="用户名"
                 placeholder="登录名"
                 :rules="rules.userName"/>
      <van-field v-model="form.nickName"
                 name="nickName" required
                 label="昵称"
                 placeholder="昵称"
                 :rules="rules.nickName"/>

      <van-field v-model="form.newPassword"
                 name="newPassword" required
                 label="密码"
                 type="password"
                 placeholder="请输入密码"
                 :rules="rules.newPassword"/>
      <van-field v-model="form.confirmPassword"
                 name="confirmPassword" required
                 label="确认密码"
                 type="password"
                 :rules="rules.confirmPassword"
                 placeholder="再次输入密码"/>
      <van-field readonly clickable required
                 name="grid"
                 label="网格"
                 :value="getDistrictLabel()"
                 :rules="rules.grid"
                 placeholder="点击选择网格" @click="showDistrictPicker = true"/>
      <van-popup v-model="showDistrictPicker" position="bottom">
        <van-picker show-toolbar
                    :columns="districtOptions"
                    :value-key="'label'"
                    @confirm="onDistrictConfirm"
                    @cancel="showDistrictPicker = false"/>
      </van-popup>
      <van-field readonly clickable required
                 name="sellCard"
                 label="是否为营业员"
                 :value="getSellCardOr()"
                 :rules="rules.sellCard"
                 placeholder="请点击选择" @click="showSellCardPicker = true"/>
      <van-popup v-model="showSellCardPicker" position="bottom">
        <van-picker show-toolbar
                    :columns="sellCardOptions"
                    :value-key="'label'"
                    @confirm="onSellCard"
                    @cancel="showSellCardPicker = false"/>
      </van-popup>

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { getTmpToken, removeTmpToken, setToken } from '@/utils/auth'
import { updateUserProfileAndPwd } from '@/api/system/user'

export default {
  name: "RegisterTwo",
  data() {
    const equalToPassword = (value) => {
      return new Promise((resolve) => {
        resolve(this.form.newPassword === value);
      });
    };
    const userNameValidate = (value) => {
      return new Promise((resolve) => {
        resolve(!/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g.test(value));
      });
    }
    return {
      // 投诉单参数
      form: {
        userId: undefined,
        userName: undefined,
        nickName: undefined,
        oldPassword: "123456",
        newPassword: undefined,
        confirmPassword: undefined,
        password: undefined,
        grid: undefined,
        sellCard: undefined
      },
      sellCardOptions: [
        //0-营业员，1-非营业员
        {label:"营业员", value: "0"},
        {label:"非营业员",value: "1"}
      ],
      showSellCardPicker: false,
      showDistrictPicker: false,
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
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "onChange" },
          { validator: userNameValidate, message: "请输入英文", trigger: "onChange" }
        ],
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "onChange" }
        ],
        grid: [
          { required: true, message: "请选择区县", trigger: "onChange" },
        ],
        sellCard: [
          { required: true, message: "请选择是否为营业员", trigger: "onChange" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "onChange" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "onChange" },
          { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "onChange" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "onChange" },
          { validator: equalToPassword, message: "两次输入的密码不一致", trigger: "onChange" }
        ]
      }
    };
  },
  created() {
    this.form.userId = this.$store.state.user.id;
  },
  methods: {
    getDistrictLabel() {
      for (let district of this.districtOptions) {
        if (this.form.district === district.value) {
          return district.label;
        }
      }
    },
    getSellCardOr() {
      for (let sellCard of this.sellCardOptions) {
        if (this.form.sellCard === sellCard.value) {
          return sellCard.label;
        }
      }
    },
    onDistrictConfirm(district) {
      this.form.district = district.value;
      this.showDistrictPicker = false;
    },
    onSellCard(sellCard) {
      this.form.sellCard = sellCard.value;
      this.showSellCardPicker = false;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate().then(() => {
        this.$dialog.confirm({
          title: '确认提交？',
          confirmButtonColor: "#1890ff"
        }).then(() => {
          this.form.password = this.form.newPassword;
          updateUserProfileAndPwd(this.form).then(response => {
            this.$toast({
              message: '提交成功',
              position: 'bottom',
            });
            setToken(getTmpToken())
            removeTmpToken();
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          });
          // on confirm
        }).catch(() => {
          // on cancel
        });
      });
    }
  }
};
</script>
