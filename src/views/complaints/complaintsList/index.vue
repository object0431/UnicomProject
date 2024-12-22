<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="110px">
          <el-form-item label="反映人" prop="createUser">
            <el-input
              v-model="queryParams.createUser"
              placeholder="请输入反映人"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户电话" prop="userPhone">
            <el-input
              v-model="queryParams.userPhone"
              placeholder="用户电话"
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
          <el-form-item label="是否为小区住宅" prop="isHome">
            <el-select
              v-model="queryParams.isHome"
              placeholder="状态"
              clearable
              style="width: 240px"
            >
              <el-option :label="'是'" :value="'0'" :key="'0'"></el-option>
              <el-option :label="'否'" :value="'1'" :key="'1'"></el-option>
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
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['feedback:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="complaintsList">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[0].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户电话" align="center" key="userPhone" prop="userPhone" v-if="columns[1].visible" width="120" />
          <el-table-column label="所属网格" align="center" key="grid" v-if="columns[2].visible" width="120">
            <template slot-scope="scope">
              <template v-for="grid in districtOptions" v-if="grid.value === scope.row.grid">
                {{ grid.label }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="反映人" align="center" key="createUser" prop="createUser" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="区县" align="center" width="120" v-if="columns[4].visible">
            <template slot-scope="scope">
              <template v-for="district in districtOptions" v-if="district.value === scope.row.district">
                {{ district.label }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="用户所在地" align="center" key="userAddress" prop="userAddress" v-if="columns[5].visible" width="120" />
          <el-table-column label="经纬度" align="center" width="180" v-if="columns[6].visible">
            <template slot-scope="scope">
              <span v-if="scope.row.latitude && scope.row.longitude">{{ scope.row.latitude + ", " + scope.row.longitude }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="是否为住宅小区" align="center" width="120" v-if="columns[7].visible">
            <template slot-scope="scope">
              <span v-if="scope.row.isHome === '0'">是</span>
              <span v-if="scope.row.isHome === '1'">否</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" key="state" width="80" v-if="columns[8].visible">
            <template slot-scope="scope">
              <template v-for="state in stateOptions" v-if="state.value === scope.row.state">
                {{ state.label }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['feedback:save']"
              >处理</el-button>
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

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户电话" prop="userPhone">
              {{ form.userPhone }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              {{ parseTime(form.createTime) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属网格" prop="grid">
              <template v-for="grid in districtOptions" v-if="grid.value === form.grid">
                {{ grid.label }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反映人" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区县" prop="district">
              <template v-for="district in districtOptions" v-if="district.value === form.district">
                {{ district.label }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户所在地" prop="createUser">
              {{ form.userAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否为住宅小区" prop="isHome">
              {{ form.isHome === '0' ? '是' : '否' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <template v-for="state in stateOptions" v-if="state.value === form.state">
                {{ state.label }}
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户反映问题" prop="remark">
              {{ form.remark ? form.remark : '-' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="userImg">
              <el-row>
                <el-col :span="4" v-for="(userImg,index) in form.files" :key="index">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="userImg.fileUrl"
                    :fit="'fill'"
                    :preview-src-list="imgList"
                    :initial-index="index"
                  ></el-image>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="feedbackTable" :model="feedbackTable" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="问题归纳" prop="questionClassified">
              <el-select v-model="feedbackTable.questionClassified" placeholder="请选择问题归纳">
                <el-option v-for="questionClassified in questionClassifiedOptions"
                           :key="questionClassified.value"
                           :label="questionClassified.label"
                           :value="questionClassified.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="feedbackTable.questionClassified === '5'">
            <el-form-item label="其他问题" prop="otherClassified">
              <el-input v-model="feedbackTable.otherClassified" placeholder="请输入其他问题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户反馈结果及方案" prop="feedbackResult">
              <el-input v-model="feedbackTable.feedbackResult" type="textarea" placeholder="请输入用户反馈结果及方案"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="基站有无">
              <el-checkbox v-model="feedbackTable.liantong" :true-label="'0'" :false-label="'1'">联通</el-checkbox>
              <el-checkbox v-model="feedbackTable.dianxin" :true-label="'0'" :false-label="'1'">电信</el-checkbox>
              <el-checkbox v-model="feedbackTable.yidong" :true-label="'0'" :false-label="'1'">移动</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电平值" prop="levelValue">
              <el-input v-model="feedbackTable.levelValue" type="textarea" placeholder="请输入用户反应地电平值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="最终反馈" prop="finalResult">
              <el-input v-model="feedbackTable.finalResult" type="textarea" placeholder="请输入最终反馈"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="feedbackTable.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm" v-hasPermi="['feedback:submit']">提 交</el-button>
        <el-button type="primary" @click="saveForm" v-hasPermi="['feedback:save']">暂时保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listComplaints, getComplaints, submitFeedback, saveFeedback} from "@/api/complaintsList/complaintsList";
import { parseTime } from '@/utils/ruoyi'

export default {
  name: "Complaints",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 投诉表格数据
      complaintsList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: "123456",
      // 日期范围
      dateRange: [],
      // 投诉单参数
      form: {},
      feedbackTable: {},
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
      questionClassifiedOptions: [
        {label: "非网络问题", value: "1"},
        {label: "深度覆盖不足", value: "2"},
        {label: "弱覆盖", value: "3"},
        {label: "网络正常", value: "4"},
        {label: "其他", value: "5"}
      ],
      userOptions: [

      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createUser: undefined,
        userPhone: undefined,
        district: undefined,
        isHome: undefined,
        state: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `创建时间`, visible: true },
        { key: 1, label: `用户电话`, visible: true },
        { key: 2, label: `所属网格`, visible: true },
        { key: 3, label: `反映人`, visible: true },
        { key: 4, label: `区县`, visible: true },
        { key: 5, label: `用户所在地`, visible: true },
        { key: 6, label: `经纬度`, visible: true },
        { key: 7, label: `是否为住宅小区`, visible: true },
        { key: 8, label: `状态`, visible: true }
      ],
      //图片
      imgList: [],
      // 表单校验
      rules: {
        questionClassified: [
          { required: true, message: "请选择问题归纳", trigger: ["blur","change"] },
        ],
        otherClassified: [
          { required: true, message: "请输入其他问题", trigger: ["blur","change"] },
          { min: 2, max: 10, message: '长度在 2 和 10 之间', trigger: ["blur","change"] }
        ],
        levelValue: [
          { required: true, message: "请输入用户反应地电平值", trigger: ["blur","change"] }
        ],
        feedbackResult: [
          { required: true, message: "请输入用户反馈结果及方案", trigger: ["blur","change"] }
        ],
        finalResult: [
          { required: true, message: "请输入最终反馈", trigger: ["blur","change"] }
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
      listComplaints(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.complaintsList = response.rows;
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
      this.form = {
        id: undefined,
        userPhone: undefined,
        userAddress: undefined,
        district: undefined,
        latitude: undefined,
        longitude: undefined,
        isHome: undefined,
        state: undefined,
        createUser: undefined,
        createTime: undefined,
        remark: undefined,
        feedbackTable: {}
      };
      this.feedbackTable = {
        complaintsId: undefined,
        questionClassified: undefined,
        otherClassified: undefined,
        feedbackResult: undefined,
        liantong: "1",
        dianxin: "1",
        yidong: "1",
        finalResult: undefined,
        levelValue: undefined

      }
      this.resetForm("form");
      this.resetForm("feedbackTable");
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
    /** 处理按钮操作 */
    handleUpdate(row) {
      this.reset();
      getComplaints(row.id).then(response => {
        this.form = response.data;
        if (this.form.feedbackTable.id) {
          this.feedbackTable = this.form.feedbackTable
          this.resetForm("feedbackTable");
        }
        this.imgList= []
        for (let img of this.form.files){
          this.imgList.push(img.fileUrl)
        }
        console.log(this.imgList)
        this.open = true;
        this.title = "处理投诉";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["feedbackTable"].validate(valid => {
        if (valid) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.feedbackTable.complaintsId = this.form.id;
            submitFeedback(this.feedbackTable).then(response => {
              this.$modal.msgSuccess("提交成功");
              this.open = false;
              this.getList();
            });
          });
        }
      });
    },
    saveForm() {
      this.feedbackTable.complaintsId = this.form.id;
      saveFeedback(this.feedbackTable).then(response => {
        this.$modal.msgSuccess("保存成功");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('complaints/export', {
        ...this.queryParams
      }, `complaints_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>






