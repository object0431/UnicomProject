<!--<template>-->
<!--  <el-card class="comp-container" style="position: relative; text-align: center" shadow="never">-->
<!--    <el-form :model="company" ref="companyForm" label-width="150px" :rules="rules" size="small">-->
<!--&lt;!&ndash;      <el-form-item label="企业UID：" prop="companyUid" style="width: 50%; display: inline-block">-->
<!--        <el-input v-model="company.companyUid" :disabled="isWatching"></el-input>-->
<!--      </el-form-item>&ndash;&gt;-->
<!--      <el-form-item label="企业名称：" prop="companyName" style="width: 50%; display: inline-block">-->
<!--        <el-input v-model="company.companyName" :disabled="isWatching"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="企业图片：" prop="companyImg" style="width: 50%; display: inline-block">-->
<!--&lt;!&ndash;-->
<!--        <el-image :src="company.companyImg" :fit="'scale-down'"></el-image>-->
<!--        <input type='file' accept=".jpg, .png, .jpeg" name="avatar" placeholder="" id="img" @change="upload($event)"></input>-->
<!--&ndash;&gt;-->
<!--&lt;!&ndash;        <single-upload v-model="company.companyImg" :is-watching="isWatching"></single-upload>&ndash;&gt;-->
<!--        <el-upload class="avatar-uploader"-->
<!--                   action=""-->
<!--                   :show-file-list="false"-->
<!--                   :before-upload="beforeAvatarUpload"-->
<!--                   :disabled="isWatching">-->
<!--          <el-image v-if="company.companyImg" :src="company.companyImg" class="avatar"></el-image>-->
<!--          <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--        </el-upload>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="企业介绍：" prop="remark" style="width: 50%; display: inline-block">-->
<!--        <Tinymce v-model="company.remark" :is-watching="isWatching"></Tinymce>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="所有员工可用：" style="width: 50%; display: inline-block">-->
<!--        <el-tooltip effect="dark" placement="top">-->
<!--          <div slot="content">是：员工在登录e食厨时自动拥有该企业权限<br/>否：需自行在员工管理中为所需员工添加该企业权限</div>-->
<!--          <el-radio-group v-model="company.companySync" :disabled="isWatching">-->
<!--            <el-radio :label="0">是</el-radio>-->
<!--            <el-radio :label="1">否</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-tooltip>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="关联商户ID：" prop="merchantId" style="width: 50%; display: inline-block">-->
<!--        <el-input v-model="company.merchantId" :disabled="isWatching"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="是否启用：" prop="status" style="width: 50%; display: inline-block">-->
<!--        <el-radio-group v-model="company.status" :disabled="isWatching">-->
<!--          <el-radio :label="0">是</el-radio>-->
<!--          <el-radio :label="1">否</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item style="width: 50%; display: inline-block">-->
<!--        <el-button type="info" plain @click="forReturn" style="">返回</el-button>-->
<!--        <el-button type="primary" disabled>上一步</el-button>-->
<!--        <el-tooltip effect="dark" content="确认保存后再进行下一步" placement="bottom-start" v-if="!isWatching">-->
<!--          <el-button type="primary" @click="forNext" style="">下一步</el-button>-->
<!--        </el-tooltip>-->
<!--        <el-button type="primary" @click="forNext" style="" v-if="isWatching">下一步</el-button>-->
<!--        <el-button type="success" v-if="isAdd||isEdit" @click="onSubmit()" style="">保存</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--  </el-card>-->
<!--</template>-->
<!--<style scoped>-->
<!--.avatar-uploader .el-upload {-->
<!--  border: 1px dashed #d9d9d9;-->
<!--  border-radius: 6px;-->
<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--}-->
<!--.avatar-uploader .el-upload:hover {-->
<!--  border-color: #409EFF;-->
<!--}-->
<!--.avatar-uploader-icon {-->
<!--  font-size: 28px;-->
<!--  color: #8c939d;-->
<!--  width: 150px;-->
<!--  height: 150px;-->
<!--  line-height: 150px;-->
<!--  text-align: center;-->
<!--}-->
<!--.avatar {-->
<!--  width: 150px;-->
<!--  height: 150px;-->
<!--  display: block;-->
<!--}-->
<!--</style>-->
<!--<script>-->
<!--import {getCompanyById, createCompany, updateCompany} from '@/api/company/company';-->
<!--import SingleUpload from '@/components/Upload/minioUpload';-->
<!--import Tinymce from '../../../components/Tinymce/index';-->
<!--import lrz from "lrz";-->
<!--const defaultCompany = {-->
<!--  id: null,-->
<!--  companyUid: null,-->
<!--  merchantId: null,-->
<!--  companyName: null,-->
<!--  companyImg: null,-->
<!--  companySync: 0,-->
<!--  remark: '',-->
<!--  status: 0-->
<!--};-->
<!--export default {-->
<!--  name: 'companySetting',-->
<!--  components: {SingleUpload, Tinymce},-->
<!--  props: {-->
<!--    isAdd: {-->
<!--      type: Boolean,-->
<!--      default: false-->
<!--    },-->
<!--    isWatching: {-->
<!--      type: Boolean,-->
<!--      default: false-->
<!--    },-->
<!--    isEdit: {-->
<!--      type: Boolean,-->
<!--      default: false-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      company: Object.assign({}, defaultCompany),-->
<!--      rules: {-->
<!--        /*companyUid: [-->
<!--          {required: true, message: '请输入企业Uid', trigger: 'blur'},-->
<!--          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}-->
<!--        ],*/-->
<!--        companyName: [-->
<!--          {required: true, message: '请输入企业名称', trigger: 'blur'},-->
<!--          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}-->
<!--        ]-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    if (this.$store.state.user.companyList.companyId > 0) {-->
<!--      this.getCompany();-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    forReturn() {-->
<!--      this.$router.push({path: '/company/companyList'});-->
<!--    },-->
<!--    forNext() {-->
<!--      this.$emit("nextTab", "timeSetting");-->
<!--    },-->
<!--    onSubmit() {-->
<!--      this.$refs.companyForm.validate(valid => {-->
<!--        if (valid) {-->
<!--          this.$confirm('是否要确认?', '提示', {-->
<!--            confirmButtonText: '确定',-->
<!--            cancelButtonText: '取消',-->
<!--            type: 'warning'-->
<!--          }).then(() => {-->
<!--            if (this.isEdit) {-->
<!--              updateCompany(this.$store.state.user.companyList.companyId, this.company).then(response => {-->
<!--                this.$message({-->
<!--                  message: '修改成功！',-->
<!--                  type: 'success'-->
<!--                });-->
<!--                this.getCompany();-->
<!--              })-->
<!--            } else if (this.isAdd) {-->
<!--              createCompany(this.company).then(response => {-->
<!--                this.$message({-->
<!--                  message: '保存成功！',-->
<!--                  type: 'success'-->
<!--                });-->
<!--                this.$store.state.user.companyList.companyId = response.data-->
<!--                this.isAdd = false;-->
<!--                this.isEdit = true;-->
<!--                this.getCompany();-->
<!--              })-->
<!--            }-->
<!--          })-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    getCompany() {-->
<!--      getCompanyById(this.$store.state.user.companyList.companyId).then(response => {-->
<!--        this.company = response.data;-->
<!--        if (this.company.remark !== null && this.company.remark !== '' && this.company.remark !== undefined) {-->
<!--          this.company.remark = decodeURIComponent(atob(this.company.remark))-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    beforeAvatarUpload(file) {-->
<!--      if (!file) {-->
<!--        return;-->
<!--      }-->
<!--      // 仅支持png/jpg/jpeg类型图片-->
<!--      let type = file.type;-->
<!--      if (!(type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {-->
<!--        this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!');-->
<!--        return;-->
<!--      }-->
<!--      // 文件大小必须小于20Kb-->
<!--      if (file.size / 1024 > 20) {-->
<!--        this.$message.error('上传图片大小不能超过 20KB!');-->
<!--        return;-->
<!--      }-->
<!--      // 使用插件, lrz-->
<!--      lrz(file, {width: 4096, height: 4096, quality: 0.5, filedName: 'file'}).then((rst) => {-->
<!--        this.company.companyImg = rst.base64;-->
<!--        return rst;-->
<!--      }).catch(function(error) {-->
<!--        // console.log('失败时', error);-->
<!--        this.$message.error('图片上传失败');-->
<!--      }).always(function() {-->
<!--        // console.log('都会执行');-->
<!--      })-->
<!--    },-->
<!--    upload(e) {-->
<!--      let file = e.target.files[0];-->
<!--      if (!file) {-->
<!--        return;-->
<!--      }-->
<!--      // 仅支持png/jpg/jpeg类型图片-->
<!--      let type = file.type;-->
<!--      if (!(type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {-->
<!--        this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!');-->
<!--        e.target.value = ''-->
<!--        return;-->
<!--      }-->
<!--      // 文件大小必须小于20Kb-->
<!--      if (file.size / 1024 > 20) {-->
<!--        this.$message.error('上传图片大小不能超过 20KB!');-->
<!--        e.target.value = ''-->
<!--        return;-->
<!--      }-->
<!--      // 使用插件, lrz-->
<!--      lrz(file, {width: 4096, height: 4096, quality: 0.5, filedName: 'file'}).then((rst) => {-->
<!--        this.company.companyImg = rst.base64;-->
<!--        return rst;-->
<!--      }).catch(function(error) {-->
<!--        // console.log('失败时', error);-->
<!--        this.$message.error('图片上传失败');-->
<!--        e.target.value = ''-->
<!--      }).always(function() {-->
<!--        // console.log('都会执行');-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style scoped>-->
<!--.comp-container {-->
<!--  position: absolute;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  width: 100%;-->
<!--  padding: 35px 35px 15px 35px;-->
<!--  margin: 20px auto;-->
<!--}-->
<!--</style>-->
