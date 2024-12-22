<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>

  <style>
    .red {
      color: red!important;
    }
    .search {
      width: 300px;
      margin: 20px 0;
    }
    .my-form {
      display: flex;
      margin: 20px 0;
    }
    .my-form input {
      flex: 1;
      margin-right: 20px;
    }
    .table > :not(:first-child) {
      border-top: none;
    }
    .contain {
      display: flex;
      padding: 10px;
    }
    .list-box {
      flex: 1;
      padding: 0 30px;
    }
    .list-box  a {
      text-decoration: none;
    }
    .echarts-box {
      width: 600px;
      height: 400px;
      padding: 30px;
      margin: 0 auto;
      border: 1px solid #ccc;
    }
    tfoot {
      font-weight: bold;
    }
    @media screen and (max-width: 1000px) {
      .contain {
        flex-wrap: wrap;
      }
      .list-box {
        width: 100%;
      }
      .echarts-box {
        margin-top: 30px;
      }
    }
  </style>
</head>
<body>
<div id="app">
  <div class="contain">
    <!-- 左侧列表 -->
    <div class="list-box">

      <table class="table table-hover">
        <tbody>
        <tr v-for="(item, index) in list" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td :class="{ red: item.price > 500 }">{{ item.price.toFixed(2) }}</td>
          <td><a @click="del(item.id)" href="javascript:;">删除</a></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 右侧图表 -->
    <div class="echarts-box" id="main"></div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
   /* 饼图渲染
   *    (1) 初始化一个饼图 echarts.init(dom)  mounted钩子实现
   *    (2) 根据数据实时更新饼图 echarts.setOption({ ... })
   */
  const app = new Vue({
    el: '#app',
    data: {
      list: [],
      name: '',
      price: ''
    },
    computed: {
      totalPrice () {
        return this.list.reduce((sum, item) => sum + item.price, 0)
      }
    },
    created () {
      this.getList()
    },
    mounted () {
      this.myChart = echarts.init(document.querySelector('#main'))
      this.myChart.setOption({
        // 大标题
        title: {
          text: '消费账单列表',
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
              // { value: 1048, name: '球鞋' },
              // { value: 735, name: '防晒霜' }
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
    },

    methods: {
      async getList () {
        const res = await axios.get('https://applet-base-api-t.itheima.net/bill', {
          params: {
            creator: '小黑'
          }
        })
        this.list = res.data.data

        // 更新图表
        this.myChart.setOption({
          // 数据项
          series: [
            {
              // data: [
              //   { value: 1048, name: '球鞋' },
              //   { value: 735, name: '防晒霜' }
              // ]
              data: this.list.map(item => ({ value: item.price, name: item.name}))
            }
          ]
        })
      },
    }
  })
</script>
</body>
</html>
