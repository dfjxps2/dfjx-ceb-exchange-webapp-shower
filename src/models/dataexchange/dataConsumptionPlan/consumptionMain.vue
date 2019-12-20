<template>
  <WorkMain :headerItems="['数据消费计划']">
    <div class="publicClass">
      <el-row :gutter="20">
        <el-col class="spaceValue" :span="24">
          <div class="headerCountentStyle">
            <span class="textCalss">所属应用项目：</span>
            <el-select size="mini"  style="width:150px;" v-model="projectS" placeholder="请选择项目" clearable filterable >
              <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                </el-option>
            </el-select>
            <span class="textCalss">关键字：</span>
            <el-input placeholder="请输入数据消费计划名称" prefix-icon="el-icon-search" style="width:180px;margin-right:10px"  v-model="seachUserId"></el-input>
            <el-button  @click="getTableData(1)" type="primary"  icon="el-icon-search">查 询</el-button>
            <el-button @click="resetInput()" >重 置</el-button>
            <el-button @click="openAddModal" type="primary" icon="el-icon-circle-plus-outline">新增数据消费计划</el-button>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="tableStyle">
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
                    prop="cons_id"
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
                    prop="dat_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="数据集名称">
                </el-table-column> 
                <el-table-column
                    prop="scnm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="生产数据应用项目">
                </el-table-column>
                <el-table-column
                    prop="xfnm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="消费数据应用项目">
                </el-table-column>
                <el-table-column
                    prop="download_cron"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="数据下载时间">
                </el-table-column>
                <el-table-column
                    prop="cons_desc"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="数据使用目的">
                </el-table-column>
                <el-table-column
                    prop="person_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="负责人">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="180"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"  @click="openEditModal(scope.row)" >编辑</el-button>
                        <el-button type="text" size="mini" @click="see(scope.row)" >查看</el-button>
                        <el-button type="text" size="mini" @click="startUser(scope.row)" >启用</el-button>
                        <el-button type="text" size="mini" @click="delUser(scope.row)" >停用</el-button>
                    </template>
              </el-table-column>
            </el-table>
            <el-pagination
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 新增 弹窗-->
    <el-dialog title="新增数据消费计划" :visible.sync="addShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="32%" :model="addformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据消费计划名称：">
              <el-input v-model="addformData.dataPlan_name" auto-complete="off" placeholder="请输入数据消费计划名称"></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="消费数据应用项目：">
              <el-select size="mini"  style="width:305px;" v-model="addformData.dataAppPro" placeholder="请选择消费数据应用项目" clearable filterable >
                    <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据集名称：">
              <el-select size="mini"  style="width:305px;" v-model="addformData.proPlanName" placeholder="请选择数据集名称" clearable filterable >
                    <el-option v-for="item in datasOPtion" :key="item.dat_cd" :label="item.dat_nm" :value="item.dat_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据下载时间：">
              <el-input v-model="addformData.dataDownloadTime" auto-complete="off" placeholder="请输入数据下载时间"></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据存储路径：">
              <el-input v-model="addformData.dataSsionPath" auto-complete="off" placeholder="请输入数据存储路径"></el-input>
            </el-form-item>
          </div>
        <div class="boxForm_item">
            <el-form-item size="mini" label="数据使用目的：">
              <el-input v-model="addformData.dataUseObjective" auto-complete="off" placeholder="请输入数据使用目的" type="textarea" autosize></el-input>
            </el-form-item>
          </div>
        <div class="boxForm_item">
            <el-form-item size="mini" label="是否启用：">
              <el-radio v-model="addformData.isEnable" label="1">启用</el-radio>
                <el-radio v-model="addformData.isEnable" label="0">禁用</el-radio>
            </el-form-item> 
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="addSubmitDataForm()">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 弹窗-->
    <el-dialog title="修改数据消费计划" :visible.sync="editShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="32%" :model="editformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据消费计划名称：">
              <el-input v-model="editformData.dataPlan_name" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="消费数据应用项目：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.dataAppPro" placeholder="请选择消费数据应用项目" clearable filterable >
                    <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据集名称：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.proPlanName" placeholder="请选择生产计划名称" clearable filterable >
                    <el-option v-for="item in datasOPtion" :key="item.dat_cd" :label="item.dat_nm" :value="item.dat_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据下载时间：">
              <el-input v-model="editformData.dataDownloadTime" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据存储路径：">
              <el-input v-model="editformData.dataSsionPath" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <el-form-item size="mini" label="数据使用目的：">
              <el-input v-model="editformData.dataUseObjective" auto-complete="off" type="textarea" autosize></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <el-form-item size="mini" label="是否启用：">
                <el-radio v-model="editformData.isEnable" label="1">启用</el-radio>
                <el-radio v-model="editformData.isEnable" label="0">禁用</el-radio>
            </el-form-item> 
        </div>
        <el-form-item size="mini" label="创建时间：">
          <el-input v-model="editformData.createdTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间：">
          <el-input v-model="editformData.lastEditTime" auto-complete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="editSubmitDataForm()">保 存</el-button>
      </div>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog title="查看数据消费计划" :visible.sync="seeShowModalPage" >
      <el-form  class="modal-form" label-position="right" label-width="32%" :model="seeformData">
        <el-form-item size="mini" label="数据消费计划名称：">
          <span>{{seeformData.dataPlan_name}}</span>
        </el-form-item>
        <el-form-item size="mini" label="消费数据应用项目：">
          <span>{{seeformData.dataAppPro}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据集名称：">
          <span>{{seeformData.proPlanName}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据下载时间：">
          <span>{{seeformData.dataDownloadTime}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据存储路径：">
          <span>{{seeformData.dataSsionPath}}</span>
        </el-form-item>
        <el-form-item size="mini" label="责任人：">
          <span>{{seeformData.contact_people}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据使用目的：">
          <span>{{seeformData.dataUseObjective}}</span>
        </el-form-item>
        <el-form-item size="mini" label="是否启用：">
          <span>{{seeformData.isEnable}}</span>
        </el-form-item> 
        <el-form-item size="mini" label="创建时间：">
          <span>{{seeformData.createdTime}}</span>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间：">
          <span>{{seeformData.lastEditTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeShowModalPage = false">关 闭</el-button>
      </div>
    </el-dialog>
  </WorkMain>
</template>

<script>
  import WorkTablePager from '@/models/public/WorkTablePager';
  import WorkMain from '@/models/public/WorkMain';
  import { required } from 'vuelidate/lib/validators';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    name: 'consumptionMain',
    data () {
      return {
        dataListLoading: false,
        user_id:"",
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        editShowModalPage: false,
        addShowModalPage: false,
        seeShowModalPage: false,
        addformData: {
          dataPlan_name:null,
          dataAppPro:null,
          proPlanName:null,
          dataDownloadTime:"* 0/1 7-23 * * ?",
          dataSsionPath:"123",
          dataUseObjective:null,
          isEnable:null,
        },
        editformData: {
          dataPlan_name:null,
          dataAppPro:null,
          proPlanName:null,
          dataDownloadTime: "* 0/1 7-23 * * ?",
          dataSsionPath:"123",
          dataUseObjective:null,
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          dataPlan_name:null,
          dataAppPro:null,
          proPlanName:null,
          dataDownloadTime:null,
          dataSsionPath:null,
          contact_people:null,
          dataUseObjective:null,
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        projectOPtion: [],
        datasOPtion:[],
        projectS:"",
        seachUserId:"",
        page_res:{},
        prj_cd:"",
        dat_cd:"",
        cons_id:"",
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
        resetInput: function () {
          this.projectS = "";
          this.seachUserId = "";
          this.getTableData(1);
        },
        getAPPProData: function () {//所属应用项目下拉
          this.BaseRequest({
                url: '/consumption/dataConsumptionprojectlist',
                method: 'get',
                params: {}
            }).then((res) => {
                if (res) {
                    this.projectOPtion = res;
                }
            })
        },
        getdatasData: function () {//新增里数据集下拉
          this.BaseRequest({
                url: '/management/datamanagementselectlist',
                method: 'get',
                params: {}
            }).then((res) => {
                if (res) {
                    this.datasOPtion = res;
                }
            })
        },
        getTableData: function (pageNum) {
            if (pageNum && pageNum !== '') {
              this.pageIndex = pageNum;
            } else {
              pageNum = this.pageIndex;
            }
            if(this.projectS == null || this.seachUserId == null){
              this.projectS = "";
              this.seachUserId = "";
            }
            const $this = this;
            this.BaseRequest({
                url: '/consumption/dataconsumptionList',
                method: 'get',
                params: {
                'currPage': pageNum,
                'pageSize': 10,
                'prj_cd': this.projectS,
                'cons_nm': this.seachUserId,
                }
            }).then((response) => {
              console.log(response,"list")
              if (response) {
                  if(this.page_res[this.pageIndex]){
                      this.dataList = this.page_res[this.pageIndex];
                  }else {
                      this.dataList = response.dataList;
                  }
                  this.totalPage = response.totalNum;
                  this.pageIndex = response.currPage;
              } else {
                  this.dataList = [];
                  this.totalPage = 0;
              }
              this.dataListLoading = false;
            })
        },
        // 当前页
        currentChangeHandle (val) {
            if(!this.page_res[this.pageIndex]){
               this.page_res[this.pageIndex] = this.dataList;
            }
            this.pageIndex = val;
            // 获取table数据
            this.dataListLoading = true;
            this.getTableData(val);
        },
        startUser(row){//启用此数据消费计划
          if(row.flag == 1){
               this.Message.success('此数据消费计划已启用'); 
          }else{
            this.$confirm('确定启用此数据消费计划【' + row.cons_nm + '】？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
              }).then(() => {
                this.BaseRequest({
                    url: '/consumption/delconsumption',    
                    method: 'get',
                    params: {'cons_id': row.cons_id,"flag": 1}
                }).then((res) => {
                    if(res == "success"){
                      this.Message.success('此此数据消费计划启用成功');
                      this.getTableData(1);
                    }
                })
              })
          }
        },
        delUser: function (row) {//停用此数据消费计划
          if(row.flag == 0){
               this.Message.success('此数据消费计划已停用'); 
          }else{
            this.$confirm('确定停用此数据消费计划【' + row.cons_nm + '】？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
            }).then(() => {
              this.BaseRequest({
                  url: '/consumption/delconsumption',    
                  method: 'get',
                  params: {'cons_id': row.cons_id,"flag": 0}
              }).then((res) => {
                if(res == "success"){
                  this.Message.success('此数据消费计划停用成功');
                  this.getTableData(1);
                }
              })
            })
          }
        },
        openAddModal: function () {//新增
            this.addShowModalPage = true;
        },
        addSubmitDataForm: function () {//新增弹窗
             if (this.addformData.dataPlan_name == null || this.addformData.dataAppPro == null || this.addformData.proPlanName == null 
             || this.addformData.dataDownloadTime == null || this.addformData.dataSsionPath == null ){
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据消费计划名称、消费数据应用项目、生产计划名称、数据下载时间、数据存储路径'
              })
            }else{
              if( this.addformData.dataUseObjective == null || this.addformData.isEnable == null){
                 this.addformData.dataUseObjective = "";
                 this.addformData.isEnable = "";
              }
              this.BaseRequest({
                  url: '/consumption/insertdataconsumption',
                  method: 'get',
                  params: {
                    'cons_nm': this.addformData.dataPlan_name,
                    'prj_cd': this.addformData.dataAppPro,
                    'dat_cd': this.addformData.proPlanName,
                    'download_cron': this.addformData.dataDownloadTime,
                    'storage_path': this.addformData.dataSsionPath,
                    'cons_desc': this.addformData.dataUseObjective == ""?"暂无":this.addformData.dataUseObjective,
                    'flag': this.addformData.isEnable,
                  }
              }).then((res) => {
                  this.getTableData(1);
                  if(res == "success"){
                    this.Message.success('保存成功')
                    this.closeModal();
                  }
              })
            }
        },
        openEditModal: function (row) {//编辑
            this.editShowModalPage = true;
            this.cons_id = row.cons_id;
            this.editformData.dataPlan_name = row.cons_nm;
            this.editformData.dataAppPro = row.xfnm;
            this.editformData.proPlanName = row.dat_nm;
            this.editformData.dataDownloadTime = row.download_cron;
            this.editformData.dataSsionPath = row.storage_path;
            this.editformData.dataUseObjective = row.cons_desc;
            this.editformData.isEnable = row.flag == "1"?"1":"0";
            this.editformData.createdTime = row.create_time;
            this.editformData.lastEditTime = row.update_time;
        },
        editSubmitDataForm: function () {//编辑弹窗 
            if (this.editformData.dataPlan_name == null || this.editformData.dataAppPro == null || this.editformData.proPlanName == null 
             || this.editformData.dataDownloadTime == null || this.editformData.dataSsionPath == null ){
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据消费计划名称、消费数据应用项目、生产计划名称、数据下载时间、数据存储路径'
              })
            }else{
              for(var i=0;i<this.projectOPtion.length;i++){ 
                if(this.editformData.dataAppPro == this.projectOPtion[i].prj_nm){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }else if(this.editformData.dataAppPro == this.projectOPtion[i].prj_cd ){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }
              }
              for(var i=0;i<this.datasOPtion.length;i++){
                if(this.editformData.proPlanName == this.datasOPtion[i].dat_nm){
                  this.dat_cd = this.datasOPtion[i].dat_cd;
                }else if(this.editformData.proPlanName == this.datasOPtion[i].dat_cd ){
                  this.dat_cd = this.datasOPtion[i].dat_cd;
                }
              }
              if( this.addformData.dataUseObjective == null || this.addformData.isEnable == null){
                 this.addformData.dataUseObjective = "";
                 this.addformData.isEnable = "";
              }
              this.BaseRequest({
                  url: '/consumption/updatedataconsumption',
                  method: 'get',
                  params: {
                    'cons_id': this.cons_id,
                    'cons_nm': this.editformData.dataPlan_name,
                    'prj_cd': this.prj_cd,
                    'dat_cd': this.dat_cd,
                    'download_cron': this.editformData.dataDownloadTime,
                    'storage_path': this.editformData.dataSsionPath,
                    'cons_desc': this.editformData.dataUseObjective,
                    'flag': this.editformData.isEnable,
                  }
              }).then((res) => {
                  this.getTableData(1);
                  if(res == "success"){
                    this.Message.success('修改成功');
                    this.closeModal();
                  }
              })
            }
        },
        see: function (row) { //查看
              this.seeShowModalPage = true;
              this.seeformData.dataPlan_name = row.cons_nm;
              this.seeformData.dataAppPro = row.scnm;
              this.seeformData.proPlanName = row.dat_nm;
              this.seeformData.dataDownloadTime = row.download_cron;
              this.seeformData.dataSsionPath = row.storage_path;
              this.seeformData.contact_people = row.person_nm;
              this.seeformData.dataUseObjective = row.cons_desc == ""?"暂无":row.cons_desc;;
              this.seeformData.isEnable = row.flag == "1"?"启用":"禁用";
              this.seeformData.createdTime = row.create_time;
              this.seeformData.lastEditTime = row.update_time;
        },
        closeModal: function () {
            this.addShowModalPage = false;
            this.editShowModalPage = false;
            this.seeShowModalPage = false;
            this.addformData.dataPlan_name = "";
            this.addformData.dataAppPro = "";
            this.addformData.proPlanName = "";
            this.addformData.dataDownloadTime = "";
            this.addformData.dataSsionPath = "";
            this.addformData.contact_people = "";
            this.addformData.dataUseObjective = "";
            this.addformData.isEnable = "";
        },
    },
    mounted: function () {
      this.getTableData();
      this.getdatasData();
      this.getAPPProData();
    }
  }
</script>

<style lang="css">
  .mini-font-size{
    font-size: 12px !important;
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
  .textCalss{
      font-size: 13px;
      color:#606266;
      margin-left: 10px;
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
</style>
