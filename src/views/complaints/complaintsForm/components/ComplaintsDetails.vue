<template>
  <div class="app-container">
    <van-form ref="form" @submit="submitForm" :label-width="100" :disabled="isDetail">
      <van-field v-model="form.userPhone" name="userPhone" label="用户电话" type="tel" placeholder="用户电话"
                 :rules="[{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }]"/>
      <van-field readonly clickable required
                 name="district"
                 label="区县"
                 :value="getDistrictLabel()"
                 :rules="rules.district"
                 placeholder="点击选择区县" @click="showDistrictPicker = true"/>
      <van-popup v-model="showDistrictPicker" position="bottom">
        <van-picker show-toolbar
                    :columns="districtOptions"
                    :value-key="'label'"
                    @confirm="onDistrictConfirm"
                    @cancel="showDistrictPicker = false"/>
      </van-popup>
      <van-field v-model="form.userAddress"
                 name="userAddress" required
                 label="用户所在地"
                 :rules="rules.userAddress"
                 placeholder="用户所在地"/>
      <van-field v-model="form.longitude"
                 name="longitude"
                 label="经度"
                 type="number"
                 placeholder="108.xx">
        <template v-if="!isDetail" #button>
          <van-button size="small" type="info" @click="showIframe = true" native-type="button">获取</van-button>
        </template>
      </van-field>
      <van-field v-model="form.latitude"
                 name="latitude"
                 label="纬度"
                 type="number"
                 placeholder="37.xx">
      </van-field>
      <van-field name="isHome" label="是否为住宅小区" required>
        <template #right-icon>
          <van-switch :disabled="isDetail" v-model="form.isHome" size="20" :active-value="'0'" :inactive-value="'1'" />
        </template>
      </van-field>

      <van-field name="uploader" label="上传图片">
        <template #input>
          <van-uploader v-model="fileList"  multiple :max-count="6" :after-read="afterRead" upload-text="点击上传"/>
        </template>
      </van-field>

      <van-field
        name="remark"
        v-model="form.remark" required
        rows="3"
        autosize
        label="备注"
        type="textarea"
        maxlength="150"
        placeholder="用户反映问题"
        :rules="rules.remark"
        show-word-limit
      />
      <div style="margin: 16px;">
        <van-button v-if="!isDetail" round block type="info" native-type="submit">提交</van-button>
        <van-button style="margin-top: 20px" round block type="default" @click="cancel" native-type="button">返回</van-button>
      </div>
    </van-form>
    <iframe v-if="showIframe" id="mainIframe" src="javascript:(function(){
        	if(window.navigator.geolocation){
              window.navigator.geolocation.getCurrentPosition(
                  function(position){
                      window.getLongitude = position.coords.longitude;
                      window.getLatitude = position.coords.latitude;
                      window.top.postMessage('success','*')
                  },
                  function(err){
                      console.log('不支持');
                      window.top.postMessage('error','*')
                  },
                  {
                  	enableHighAccuracy : true,
                    maximumAge : 30000,
                    timeout :3000
                   }
              )
          }
        })()" style="display:none;"></iframe>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getComplaints, saveComplaints, updateComplaints} from "@/api/complaintsList/complaintsList";
import { fileUpload } from '@/api/system/file'


export default {
  name: "ComplaintsDetails",
  data() {
    return {
      isDetail: false,
      // 投诉单参数
      form: {
        id: undefined,
        userPhone: undefined,
        userAddress: undefined,
        district: undefined,
        latitude: undefined,
        longitude: undefined,
        isHome: '0',
        remark: undefined
      },
      showIframe: false,
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
        district: [
          { required: true, message: "请选择区县" },
        ],
        remark: [
          { required: true, message: "请输入用户反映问题" },
          { min: 1, max: 150, message: '长度在150字以内' }
        ],
        userAddress: [
          { required: true, message: "请输入用户所在地" }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    };
  },
  mounted() {
    // 监听 iframe postmessage传值
    window.addEventListener('message', event => {
      this.handleMessage(event);
      this.showIframe = false;
    });
  },
  created() {
    if (this.$route.params.complaintsId) {
      this.isDetail = this.$route.query.isDetail === "0";
      getComplaints(this.$route.params.complaintsId).then((response) => {
        this.form = response.data;
        this.fileList = [];
        for (let file of this.form.files) {
          let fileTmp = {
            url: file.fileUrl,
            fileId: file.id
          }
          this.fileList.push(fileTmp)
        }
        console.log(this.fileList)
      })
    }
  },
  methods: {
    handleMessage (e) {
      if(e.data == 'success'){
        let iframeWin = window.frames['mainIframe'].contentWindow
        this.form.latitude = iframeWin.getLatitude
        this.form.longitude = iframeWin.getLongitude
      } else if(e.data == 'error'){
        this.$toast({
          message: '获取超时!',
          position: 'bottom',
        });
      }
    },
    getDistrictLabel() {
      for (let district of this.districtOptions) {
        if (this.form.district === district.value) {
          return district.label;
        }
      }
    },
    onDistrictConfirm(district) {
      this.form.district = district.value;
      this.showDistrictPicker = false;
    },
    // 取消按钮
    cancel() {
      this.$router.back();
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate().then(() => {
        let files = [];
        for (let file of this.fileList) {
          let fileTmp = {
            id: file.fileId
          }
          files.push(fileTmp);
        }
        this.form.files = files;
        console.log(this.fileList);
        this.$dialog.confirm({
          title: '确认提交？',
          confirmButtonColor: "#1890ff"
        }).then(() => {
          if (this.form.id) {
            updateComplaints(this.form).then(response => {
              this.upImgTips()
            });
          } else {
            saveComplaints(this.form).then(response => {
              this.upImgTips()
            });
          }
          // on confirm
        }).catch(() => {
          // on cancel
        });
      });
    },
    //方法在用户移除文件时触发，打印移除的文件信息。
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    afterRead(file) {
      file.status = 'uploading';
      file.message = '上传中...';
      let form = new FormData();
      form.append("file",file.file);
      fileUpload(form).then(response => {
        file.fileId = response.data.id;
        file.status = 'done';
        file.message = '上传成功';
        // 此时可以自行将文件上传至服务器
      }).catch(error => {
        file.status = 'failed';
        file.message = '上传失败';
      })
    },
    //图片上传时提示
    upImgTips(){
      if (this.$auth.hasRoleOr(["oneline"])){
        if (!this.form.files || this.form.files.length === 0){
          this.$alert('提交成功，下次请您上传图片，谢谢您的配合！')
        }
      }else{
        this.$toast({
          message: '提交成功',
          position: 'bottom',
        });
      }
      this.cancel();
    }
  }
};
</script>
<style scoped>
.upload-container {
  display: flex;
  align-items: center;
}

.upload-text {
  font-size: 13px;
  margin-right: 10px; /* 调整间距 */
}

.el-upload {
  flex-shrink: 0; /* 保证上传按钮不会缩小 */
}
</style>
