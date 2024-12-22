<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="110px">
          <el-form-item label="标题" prop="noticeTitle">
            <el-input
              v-model="queryParams.noticeTitle"
              placeholder="请输入标题"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="内容" prop="noticeContent">
            <el-input
              v-model="queryParams.noticeContent"
              placeholder="请输入内容"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="区县" prop="district">
            <el-select
              v-model="queryParams.district"
              placeholder="区县"
              clearable
              style="width: 240px"
            >
              <el-option v-for="district in districtOptions" :label="district.label" :value="district.value" :key="district.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="queryParams.state"
              placeholder="状态"
              clearable
              style="width: 240px"
            >
              <el-option v-for="state in stateOptions" :label="state.label" :value="state.value" :key="state.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>



        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['complaints:notice:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="noticeList">
          <el-table-column label="序号" align="center" type="index" />

          <el-table-column label="标题" align="center" key="noticeTitle" prop="noticeTitle" />
          <el-table-column label="区县" align="center" >
            <template slot-scope="scope">
              <template v-for="(dis, index) in scope.row.district">
                <span v-if="index > 0">, </span>
                <span v-for="district in districtOptions" v-if="district.value === dis">
                  {{ district.label }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="state">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-value="0"
                inactive-value="1"
                @change="handleStateChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['complaints:notice:edit']"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" destroy-on-close>
      <el-form ref="notice" :model="notice" label-width="100px" :rules="rules">
        <el-form-item label="标题" prop="noticeTitle" >
          <el-input v-model="notice.noticeTitle" placeholder="请输入公告标题"/>
        </el-form-item>
        <el-form-item label="公告内容" prop="noticeContent">
          <Tinymce ref="tinymce" v-model="notice.noticeContent"></Tinymce>
        </el-form-item>
        <el-form-item label="区县" prop="district">
          <el-select
            v-model="notice.district"
            multiple placeholder="请选择区县"
            clearable
            style="width: 100%"
          >
            <el-option v-for="district in districtOptions" :label="district.label" :value="district.value" :key="district.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="notice.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch
            v-model="notice.state"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getNotice, listNotice, saveNotice, updateNotice ,changeState} from '@/api/complaintsList/noticeList'
import { parseTime } from '@/utils/ruoyi'
import Tinymce from '@/components/Tinymce/index.vue'

export default {
  name: "Notice",
  components: { Tinymce },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 公告单参数
      notice: {},
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
        //状态，0-启用 1-停用
        {label: "启用", value: "0"},
        {label: "停用", value: "1"}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        noticeContent: undefined,
        district: undefined,
        state: undefined
      },
      rules: {
        noticeTitle: [
          {required: true, message: "请填写公告标题", trigger: ["blur","change"]},
        ],
        district: [
          {required: true, message: "请选择要发放的区县", trigger: ["blur","change"]}
        ]
      }
    };
  },
  watch: {

  },
  created() {
    this.getList();

  },
  methods: {
    parseTime,
    /** 序号 */
    getList() {
      this.loading = true;
      listNotice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.notice = {
        id: undefined,
        noticeContent: undefined,
        noticeTitle: undefined,
        district: [],
        state: '0',
        createTime: undefined,
        remark: undefined
      };
      this.resetForm("notice");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**新增*/
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增公告";
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      getNotice(row.id).then(response => {
        this.notice = response.data;
        this.notice.noticeContent = decodeURIComponent(atob(this.notice.noticeContent))
        this.open = true;
        this.title = "编辑公告";
      });
    },
    // 角色状态修改
    handleStateChange(row) {
      let text = row.state === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要' + text + '"' + row.noticeTitle + '"吗？').then(function() {
        return changeState(row.id, row.state);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.state = row.state === "0" ? "1" : "0";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs.notice.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.notice)
          data.noticeContent = btoa(encodeURIComponent(this.notice.noticeContent));
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.notice.id){
              updateNotice(data).then(response => {
                this.$modal.msgSuccess("提交成功");
                this.open = false;
                this.getList();
              });
            }else{
              saveNotice(data).then(response => {
                this.$modal.msgSuccess("提交成功");
                this.open = false;
                this.getList();
              });
            }
          });
        }
      });
    },
  }
};
</script>
