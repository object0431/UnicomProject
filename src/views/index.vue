<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px" >
          <span class="center-style">愿景</span>
          <br />
            奋力建设具有全球竞争力的世界一流企业
          <br />
          <br />
          <span class="center-style">使命</span>
          <br />
            数字信息基础设施运营服务国家队
            网络强国数字中国智慧社会建设主力军
            数字技术融合创新排头兵
          <br />
          <br />
          <span class="center-style">核心价值观</span>
          <br />
            客户为本 员工为根
            服务为上 创新为魂
            奋斗为荣 清廉为基
          <br />
          <br />
          <span class="center-style">经营管理理念</span>
          <br />
            为客户创造价值
            市场和创新双轮 驱动
            一个联通 一体化能力聚合 一体化运营服务
          <br />
          <br />
          <span class="center-style">企业做风</span>
          <br />
            严 实 精 细 快
        </blockquote>

        <hr />
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="8">
        <el-card class="update-log" v-loading="loading">
          <div slot="header" class="clearfix">
            <span>公告</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item v-for="(notice,index) in noticeList" :key="index"
                              >
              <template slot="title">
                <div style="width: 100%">
                  <span style="width: 50%;display: inline-grid; justify-content: start">
                    {{ notice.noticeTitle }}
                  </span>
                  <span style="width: 50%;display: inline-grid; justify-content: end">
                    {{ parseTime(notice.createTime,'{y}-{m}-{d}') }}
                  </span>
                </div>
              </template>
<!--              <el-collapse-item title="反馈 Feedback">-->
              <div v-html="getContent(notice.noticeContent)"></div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
    <van-dialog v-model="show"  confirm-button-color="#0E89ED" width="80%">
      <template slot="title">
        <div style="font-size: 20px">
          <strong>
            公告
          </strong>
          <el-divider></el-divider>
        </div>
      </template>
      <div v-if="noticeList.length > 0" v-html="getContent(noticeList[0].noticeContent)" ></div>
    </van-dialog>
    <div class="echarts-box" ref="myMap" :style="{ float: 'right', width: '100%',height:'400px'}"></div>
  </div>
</template>

<script>

import { listNoticeByUser } from '@/api/complaintsList/noticeList'
import { parseTime } from '@/utils/ruoyi'
import * as echarts from "echarts"

export default {
  name: "Index",
  data() {
    return {
      // 版本号
      loading: false,
      noticeList: [],
      show: false,

      complaintsNumber: [],
      district: []
    };
  },
  created() {
    this.getList()
  },

  mounted () {
    this.sectorDiagram();
  },
  methods: {
    parseTime,
    goTarget(href) {
      window.open(href, "_blank");
    },
    getList() {
      this.loading = true;
      listNoticeByUser().then(response => {
        this.noticeList = response.data;
        this.loading = false;
        if (this.noticeList.length > 0){
          this.show = true
        }
      });
    },
    getDistrictList() {
      this.loading = true;

    },
    getContent(content) {
      return decodeURIComponent(atob(content))
    },
    sectorDiagram() {
      const option = ({
        // 大标题
        title: {
          text: '各区县当月投诉人数',
          left: 'center'
        },
        // 提示框
        tooltip: {
          trigger: 'item'
        },
        // 图例
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        // 数据项
        series: [
          {
            name: '投诉人数',
            type: 'pie',
            radius: '50%', // 半径
            data: [
              { value: 25, name: '球鞋' },
              { value: 30, name: '防晒霜' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      const myChart = echarts.init(this.$refs.myMap)
      myChart.setOption(option)
      window.addEventListener("resize", () =>{
        myChart.resize()
      })
    }
  },

  computed: {
    districtNumber () {
      //
      return this.complaintsNumber.reduce((sum, item) => sum + item.price, 0)
    }
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

.el-divider--horizontal{
  margin: 10px 0;
}
::v-deep .van-dialog__header{
  padding-top: 16px;
}
</style>

