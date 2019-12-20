<template>
  <div style="padding:0px 20px">
      <div class="breadcrumbStyle">
        <el-breadcrumb separator=" > ">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: 'dataProductionPlan' }">数据生产计划</el-breadcrumb-item>
            <el-breadcrumb-item>数据消费方</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="publicClass">
        <el-row>
          <el-col class="align-left spaceValue" :span="24">
                <el-button @click="$router.go(-1)" >返 回</el-button>
          </el-col>
          <el-col :span="24">
            <el-table
                :data="dataList"
                border
                stripe
                size="mini"
                class = "searchGrid"
                style="width:100%"
                :header-cell-style="{background:'#f6f6f7',}"
                v-loading="dataListLoading"
                >
                <el-table-column
                    prop="prod_id"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="编号"> 
                </el-table-column>
                <el-table-column
                    prop="cons_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="消费计划名称">
                </el-table-column>
                <el-table-column
                    prop="prod_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="生产计划名称">
                </el-table-column>
                <el-table-column
                    prop="scnm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="生产计划应用项目">
                </el-table-column>
                <el-table-column
                    prop="xfnm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="消费数据应用项目">
                </el-table-column>
                <el-table-column
                    prop="upload_cron"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="数据下载时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="see(scope.row)" >查看</el-button>
                    </template>
              </el-table-column>
            </el-table>
            <!-- <el-pagination
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, prev, pager, next, jumper">
            </el-pagination> -->
          </el-col>
        </el-row>
      </div>
      <!--查看弹窗-->
      <el-dialog title="查看数据消费计划" :visible.sync="seeShowModalPage" >
        <el-form  class="modal-form" label-position="right" label-width="32%" :model="seeformData">
          <el-form-item size="mini" label="编号：">
            <span>{{seeformData.index}}</span>
          </el-form-item>
          <el-form-item size="mini" label="消费计划名称：">
            <span>{{seeformData.consumName}}</span>
          </el-form-item>
          <el-form-item size="mini" label="生产计划名称：">
            <span>{{seeformData.productName}}</span>
          </el-form-item>
          <el-form-item size="mini" label="生产计划应用项目：">
            <span>{{seeformData.productPlanAppPro}}</span>
          </el-form-item>
          <el-form-item size="mini" label="消费数据应用项目：">
            <span>{{seeformData.consumDataAppPro}}</span>
          </el-form-item>
          <el-form-item size="mini" label="数据下载时间：">
            <span>{{seeformData.dataDownloadTime}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="seeShowModalPage = false">关 闭</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import WorkTablePager from '@/models/public/WorkTablePager';
  import WorkMain from '@/models/public/WorkMain';
  import { required } from 'vuelidate/lib/validators';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    name: 'consumptionUser',
    data () {
      return {
        dataListLoading: false,
        seeShowModalPage: false,
        prod_id:"",
        dataList: [],
        // pageIndex: 1,
        // pageSize: 10,
        // totalPage: 0,
        // page_res:{},
        seeformData: {
          index: null,
          consumName:null,
          productName: null,
          productPlanAppPro: null,
          consumDataAppPro:null,
          dataDownloadTime:null,
        },
      }
    },
    computed: {
      
    },
    components: {
      Treeselect,
      WorkTablePager,
      WorkMain
    },
    methods: {
        getTableData: function () {
            this.prod_id = this.$route.query.prod_id;
            console.log(this.prod_id,"444")
            this.BaseRequest({
                url: '/production/dataproductionselectxff',
                method: 'get',
                params: {'prod_id': this.prod_id}
            }).then((response) => {
              console.log(response,"listkk")
              if (response) {
                  this.dataList = response;
              }
              this.dataListLoading = false;
            })
        },
        see: function (row) { //查看
              this.seeShowModalPage = true;
              this.seeformData.index = row.prod_id;
              this.seeformData.consumName = row.cons_nm;
              this.seeformData.productName = row.prod_nm;
              this.seeformData.productPlanAppPro = row.scnm;
              this.seeformData.consumDataAppPro = row.xfnm;
              this.seeformData.dataDownloadTime = row.upload_cron;
        },
    },
    mounted: function () {
      this.getTableData(1);
    }
  }
</script>

<style lang="css">
  .mini-font-size{
    font-size: 12px !important;
  }
  .el-form-item__content{
    text-align: left;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/styles/table-page.scss";
  .searchGrid{
        min-height: calc(100vh - 202px - 64px);
  }
  .spaceValue{
    margin-bottom:15px;
  }
  .colorRed{
    color: red;
    position: absolute;
    top: 10%;
    left: -2%;
  }
  .boxForm_item{
    position: relative;
  }
  .breadcrumbStyle{
    margin-top: 15px;
    margin-bottom: 15px;
    padding-left: 5px;
  }
</style>
