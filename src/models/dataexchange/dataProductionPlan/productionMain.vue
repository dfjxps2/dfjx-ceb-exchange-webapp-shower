<template>
  <WorkMain :headerItems="['数据生产计划']">
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
              <el-input placeholder="请输入数据生产计划名称" prefix-icon="el-icon-search" style="width:180px;margin-right:10px;"  v-model="seachUserId"></el-input>
              <el-button  @click="getTableData(1)" type="primary"  icon="el-icon-search">查 询</el-button>
              <el-button @click="resetInput()" >重 置</el-button>
              <el-button @click="openAddModal" type="primary" icon="el-icon-circle-plus-outline">新增数据生产计划</el-button>
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
                :header-cell-style="{background:'#f4f3f3',}"
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
                    label="所属应用项目">
                </el-table-column>
                <el-table-column
                    prop="dat_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="所属数据集">
                </el-table-column>
                <el-table-column
                    prop="upload_cron"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="上传任务时间">
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
                    width="250"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"  @click="openEditModal(scope.row)" >编辑</el-button>
                        <el-button type="text" size="mini" @click="see(scope.row)" >查看</el-button>
                        <el-button type="text" size="mini" @click="startUser(scope.row)" >启用</el-button>
                        <el-button type="text" size="mini" @click="delUser(scope.row)" >停用</el-button>
                        <el-button type="text" size="mini" @click="dataConsumption(scope.row)" >数据消费方</el-button>
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
            <el-form-item size="mini" label="数据生产计划名称：">
              <el-input v-model="addformData.dataPlan_name" placeholder="请输入数据生产计划名称"  auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属应用项目：">
              <el-select size="mini"  style="width:305px;" v-model="addformData.AppProject" placeholder="请选择所属应用项目" clearable filterable >
                   <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属数据集：">
              <el-select size="mini"  style="width:305px;" v-model="addformData.datas" placeholder="请选择所属数据集" clearable filterable >
                    <el-option v-for="item in datasOPtion" :key="item.dat_cd" :label="item.dat_nm" :value="item.dat_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件生成时间：">
              <el-input v-model="addformData.dataCreaTime" placeholder="请输入数据文件生成时间"  auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="上传任务时间：">
              <el-input v-model="addformData.uplodTime" placeholder="请输入上传任务时间"  auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件存放路径：">
              <el-input v-model="addformData.dataSsionPath" auto-complete="off" placeholder="请输入数据文件存放路径"></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <el-form-item size="mini" label="是否启用：">
                <el-radio v-model="addformData.isEnable" label="1">启用</el-radio>
                <el-radio v-model="addformData.isEnable" label="2">禁用</el-radio>
            </el-form-item> 
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="addSubmitDataForm()">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 弹窗-->
    <el-dialog title="修改数据生产计划" :visible.sync="editShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="32%" :model="editformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据生产计划名称：">
              <el-input v-model="editformData.dataPlan_name" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属应用项目：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.AppProject" placeholder="请选择所属应用项目" clearable filterable >
                    <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属数据集：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.datas" placeholder="请选择所属数据集" clearable filterable >
                    <el-option v-for="item in datasOPtion" :key="item.dat_cd" :label="item.dat_nm" :value="item.dat_cd">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件生成时间：">
              <el-input v-model="editformData.dataCreaTime" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="上传任务时间：">
              <el-input v-model="editformData.uplodTime" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件存放路径：">
              <el-input v-model="editformData.dataSsionPath" auto-complete="off" ></el-input>
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
    <el-dialog title="查看数据生产计划" :visible.sync="seeShowModalPage" >
      <el-form  class="modal-form" label-position="right" label-width="32%" :model="seeformData">
        <el-form-item size="mini" label="数据生产计划名称：">
          <span>{{seeformData.dataPlan_name}}</span>
        </el-form-item>
        <el-form-item size="mini" label="所属应用项目：">
          <span>{{seeformData.AppProject}}</span>
        </el-form-item>
        <el-form-item size="mini" label="所属数据集：">
          <span>{{seeformData.datas}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据文件生成时间：">
          <span>{{seeformData.dataCreaTime}}</span>
        </el-form-item>
        <el-form-item size="mini" label="上传任务时间：">
          <span>{{seeformData.uplodTime}}</span>
        </el-form-item>
        <el-form-item size="mini" label="数据文件存放路径：">
          <span>{{seeformData.dataSsionPath}}</span>
        </el-form-item>
        <el-form-item size="mini" label="责任人：">
          <span>{{seeformData.contact_people}}</span>
        </el-form-item>
        <el-form-item size="mini" label="是否启用：">
          <span>{{seeformData.isEnable}}</span>
        </el-form-item> 
        <el-form-item size="mini" label="创建时间">
          <span>{{seeformData.createdTime}}</span>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间">
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
    name: 'productionMain',
    data () {
      return {
        dataListLoading: false,
        prod_id:"",
        prj_cd:"",
        dat_cd:"",
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        editShowModalPage: false,
        addShowModalPage: false,
        seeShowModalPage: false,
        addformData: {
          dataPlan_name:null,
          AppProject:null,
          datas:null,
          dataCreaTime: "* 0/1 7-23 * * ?",
          uplodTime: "* 0/1 7-23 * * ?",
          dataSsionPath:"123",
          isEnable:null,
        },
        editformData: {
          dataPlan_name:null,
          AppProject:null,
          datas:null,
          dataCreaTime: "* 0/1 7-23 * * ?",
          uplodTime: "* 0/1 7-23 * * ?",
          dataSsionPath:"123",
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          dataPlan_name:null,
          AppProject:null,
          datas:null,
          dataCreaTime:null,
          uplodTime:null,
          dataSsionPath:null,
          contact_people:null,
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        projectOPtion: [],
        datasOPtion:[],
        projectS:"",
        seachUserId:"",
        page_res:{},
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
                url: '/production/dataProductionprojrctlist',
                method: 'get',
                params: {}
            }).then((res) => {
              console.log(res,"resList")
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
        dataConsumption(row){//数据消费方
          this.$router.push({name:"consumptionUser",query:{prod_id:row.prod_id}})
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
                url: '/production/dataproductionList',
                method: 'get',
                params: {
                  'currPage': pageNum,
                  'pageSize': 10,
                  'prj_cd': this.projectS,
                  'prod_nm': this.seachUserId,
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
        startUser: function (row){//启用数据生产计划
          if(row.flag == 1){
               this.Message.success('此数据生产计划已启用'); 
          }else{
            this.$confirm('确定启用此数据生产计划【' + row.prod_nm + '】？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
              }).then(() => {
                this.BaseRequest({
                    url: '/production/delproduction',    
                    method: 'get',
                    params: {'prod_id': row.prod_id,"flag": 1}
                }).then((res) => {
                  if(res == "success"){
                      this.getTableData(1);
                      this.Message.success('此数据生产计划启用成功');
                    }
                })
              })
          }
        },
        delUser: function (row) {//停用生产计划
            if(row.flag == 0){
               this.Message.success('此数据生产计划已停用'); 
            }else{
              this.$confirm('确定停用此数据生产计划【' + row.prod_nm + '】？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
              }).then(() => {
                this.BaseRequest({
                    url: '/production/delproduction',    
                    method: 'get',
                    params: {'prod_id': row.prod_id,"flag": 0}
                }).then((res) => {
                  if(res == "success"){
                      this.getTableData(1);
                      this.Message.success('此数据生产计划停用成功');
                    }
                })
              })
            }
        },
        openAddModal: function () {//新增
            this.addShowModalPage = true;
        },
        addSubmitDataForm: function () {//新增弹窗
            if (this.addformData.dataPlan_name == null || this.addformData.AppProject == null || this.addformData.datas == null 
              || this.addformData.dataCreaTime == null || this.addformData.uplodTime == null|| this.addformData.dataSsionPath == null ) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据生产计划名称、所属应用项目、所属数据集、数据文件生成时间、上传任务时间、数据文件存放路径'
              })
            }else{
              if( this.addformData.isEnable == null ){
                 this.addformData.isEnable = "";
              }
              this.BaseRequest({
                  url: '/production/insertdataproduction',
                  method: 'get',
                  params: {
                    'prod_nm': this.addformData.dataPlan_name,
                    'prj_cd': this.addformData.AppProject,
                    'dat_cd': this.addformData.datas,
                    'create_cron': this.addformData.dataCreaTime,
                    'upload_cron': this.addformData.uplodTime,
                    'storage_path': this.addformData.dataSsionPath,
                    'flag': this.addformData.isEnable,
                  }
              }).then((res) => {
                if(res == "success"){
                    this.Message.success('保存成功')
                    this.getTableData(1);
                    this.closeModal();
                  }
              })
            }
        },
        openEditModal: function (row) {//编辑
            this.editShowModalPage = true;
            this.prod_id = row.prod_id;
            this.editformData.dataPlan_name = row.prod_nm;
            this.editformData.AppProject = row.scnm;
            this.editformData.datas = row.dat_nm;
            this.editformData.dataCreaTime = row.create_cron;
            this.editformData.uplodTime = row.upload_cron;
            this.editformData.dataSsionPath = row.storage_path;
            this.editformData.isEnable = row.flag == "1"?"1":"0";
            this.editformData.createdTime = row.create_time;
            this.editformData.lastEditTime = row.update_time;
        },
        editSubmitDataForm: function () {//编辑弹窗
            if (this.editformData.dataPlan_name == null || this.editformData.AppProject == null || this.editformData.datas == null 
                || this.editformData.dataCreaTime == null || this.editformData.uplodTime == null
                || this.editformData.dataSsionPath == null  || this.editformData.isEnable == null) {
                  this.$notify({
                      dangerouslyUseHTMLString: true,       
                      message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据消费计划名称、消费数据应用项目、生产计划名称、数据下载时间、数据存储路径'
                  })
            }else{
               for(var i=0;i<this.projectOPtion.length;i++){
                if(this.editformData.AppProject == this.projectOPtion[i].prj_nm){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }else if(this.editformData.AppProject == this.projectOPtion[i].prj_cd ){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }
              }
              for(var i=0;i<this.datasOPtion.length;i++){
                if(this.editformData.datas == this.datasOPtion[i].dat_nm){
                  this.dat_cd = this.datasOPtion[i].dat_cd;
                }else if(this.editformData.datas == this.datasOPtion[i].dat_cd ){
                  this.dat_cd = this.datasOPtion[i].dat_cd;
                }
              } 
              if( this.editformData.isEnable == null ){
                 this.editformData.isEnable = "";
              }
              this.BaseRequest({
                  url: '/production/updatedataproduction',
                  method: 'get',
                  params: {
                    'prod_id': this.prod_id,
                    'prod_nm': this.editformData.dataPlan_name,
                    'prj_cd': this.prj_cd,
                    'dat_cd': this.dat_cd,
                    'create_cron': this.editformData.dataCreaTime,
                    'upload_cron': this.editformData.uplodTime,
                    'storage_path': this.editformData.dataSsionPath,
                    'flag': this.editformData.isEnable,
                  }
              }).then((res) => {
                if(res == "success"){
                    this.Message.success('修改成功');
                    this.getTableData(1);
                    this.closeModal();
                  }
              })
            }
        },
        see: function (row) { //查看 
            this.seeShowModalPage = true;
            this.BaseRequest({
                  url: '/production/dataproductionselect',
                  method: 'get',
                  params: {
                    'prod_id': row.prod_id,
                  }
              }).then((res) => {
                  var json = res[0];
                  this.seeformData.dataPlan_name = json.prod_nm;
                  this.seeformData.AppProject = json.scnm;
                  this.seeformData.datas = json.dat_nm;
                  this.seeformData.dataCreaTime = json.create_cron;
                  this.seeformData.uplodTime = json.upload_cron;
                  this.seeformData.dataSsionPath = json.storage_path;
                  this.seeformData.isEnable = json.flag == "1"?"启用":"禁用";
                  this.seeformData.contact_people = json.person_nm;
                  this.seeformData.createdTime = json.create_time;
                  this.seeformData.lastEditTime = json.update_time;
              })
            
        },
        closeModal: function () {
            this.addShowModalPage = false;
            this.editShowModalPage = false;
            this.seeShowModalPage = false;
            this.addformData.dataPlan_name = "";
            this.addformData.AppProject = "";
            this.addformData.datas = "";
            this.addformData.dataCreaTime = "";
            this.addformData.uplodTime = "";
            this.addformData.dataSsionPath = "";
            this.addformData.contact_people = "";
            this.addformData.isEnable = "";
        },
    },
    created () {
      this.$nextTick(() => {
        this.getTableData(1);
        this.getAPPProData();
        this.getdatasData();
      })
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
