<template>
  <WorkMain :headerItems="['数据集管理']" >
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
                <el-input placeholder="请输入标识或者名称" prefix-icon="el-icon-search" style="width:180px;margin-right:10px"  v-model="seachUserId"></el-input>
                <el-button  @click="getTableData(1)" type="primary" icon="el-icon-search" >查 询</el-button>
                <el-button @click="resetInput()" >重 置</el-button>
                <el-button @click="openAddModal" type="primary" icon="el-icon-circle-plus-outline">新增数据集</el-button>
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
                    prop="dat_cd"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="标识">
                </el-table-column> 
                <el-table-column
                    prop="dat_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="prj_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="所属应用项目">
                </el-table-column>
                <el-table-column
                    prop="file_regexp"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="文件名命名规则">
                </el-table-column>
                <el-table-column
                    prop="person_nm"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="维护人">
                </el-table-column>
                <el-table-column
                    label="操作"
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
      <!-- 新增 弹窗-->
      <el-dialog title="新增数据集" :visible.sync="addShowModalPage" >
        <el-form  class="modal-form" label-position="left" label-width="28%" :model="addformData">
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="数据集标识：">
                <el-input v-model="addformData.data_lable" auto-complete="off" placeholder="请输入数据集标识"></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>    
              <el-form-item size="mini" label="数据集名称：">
                <el-input v-model="addformData.data_name" auto-complete="off" placeholder="请输入数据集名称"></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="所属应用项目：">
                <el-select size="mini"  style="width:325px;" v-model="addformData.app_peoject" placeholder="请选择所属应用项目" clearable filterable >
                      <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="文件名命名规则：">
                <el-input v-model="addformData.fileClass" auto-complete="off" placeholder="请输入文件名命名规则"></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <el-form-item size="mini" label="数据集说明：">
                <el-input v-model="addformData.project_Explain" placeholder="请输入数据集说明" auto-complete="off" type="textarea" autosize></el-input>
              </el-form-item> 
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeModal">取 消</el-button>
          <el-button type="primary" @click="addSubmitDataForm()">保 存</el-button>
        </div>
      </el-dialog>

      <!-- 编辑 弹窗-->
      <el-dialog title="修改数据集" :visible.sync="editShowModalPage" >
        <el-form  class="modal-form" label-position="left" label-width="28%" :model="editformData">
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="数据集标识：">
                <el-input v-model="editformData.data_lable" auto-complete="off" disabled ></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="数据集名称：">
                <el-input v-model="editformData.data_name" auto-complete="off" ></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="所属应用项目：">
                <el-select size="mini"  style="width:325px;" v-model="editformData.app_peoject" placeholder="请选择所属应用项目" clearable filterable >
                      <el-option v-for="item in projectOPtion" :key="item.prj_cd" :label="item.prj_nm" :value="item.prj_cd">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <span class="colorRed">*</span>
              <el-form-item size="mini" label="文件名命名规则：">
                <el-input v-model="editformData.fileClass" auto-complete="off"></el-input>
              </el-form-item>
          </div>
          <div class="boxForm_item">
              <el-form-item size="mini" label="数据集说明：">
                <el-input v-model="editformData.project_Explain" auto-complete="off" type="textarea" autosize></el-input>
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
      <el-dialog title="查看数据集" :visible.sync="seeShowModalPage" >
        <el-form  class="modal-form" label-position="right" label-width="28%" :model="seeformData">
          <el-form-item size="mini" label="数据集标识：">
              <span>{{seeformData.data_lable}}</span>
          </el-form-item>
          <el-form-item size="mini" label="数据集名称：">
              <span>{{seeformData.data_name}}</span>
          </el-form-item>
          <el-form-item size="mini" label="所属应用项目：">
              <span>{{seeformData.app_peoject}}</span>
          </el-form-item>
          <el-form-item size="mini" label="维护人：">
              <span>{{seeformData.contact_people}}</span>
          </el-form-item>
          <el-form-item size="mini" label="数据集说明：">
              <span>{{seeformData.project_Explain}}</span>
          </el-form-item>
          <el-form-item size="mini" label="创建时间：">
              <span>{{seeformData.createdTime}}</span>
          </el-form-item>
          <el-form-item size="mini" label="最后修改时间：">
              <span>{{seeformData.lastEditTime}}</span>
          </el-form-item>
          <el-form-item size="mini" label="是否启用：">
              <span>{{seeformData.flag}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="seeShowModalPage = false">关 闭</el-button>
        </div>
      </el-dialog>
  </div>
  </WorkMain>
</template>

<script>
  import WorkTablePager from '@/models/public/WorkTablePager';
  import WorkMain from '@/models/public/WorkMain';
  import { required } from 'vuelidate/lib/validators';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    name: 'administrationMain',
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
          data_lable: null,
          data_name: null,
          app_peoject: null,
          fileClass:null,
          project_Explain: null,
        },
        editformData: {
          data_lable: null,
          data_name: null,
          app_peoject: null,
          fileClass:null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          data_lable: null,
          data_name: null,
          app_peoject: null,
          contact_people: null,
          fileClass:null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
          flag:null,
        },
        projectOPtion: [],
        projectS:"",
        seachUserId:"",
        page_res:{},
        prj_cd:null,
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
        getdatasData: function () {
          this.BaseRequest({
                url: '/management/datamanagementprojectlist',//应用项目下拉
                method: 'get',
                params: {}
            }).then((res) => {
                if (res) {
                    this.projectOPtion = res;
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
                url: '/management/datamanagementList',
                method: 'get',
                params: {
                'currPage': pageNum,
                'pageSize': 10,
                'prj_cd': this.projectS,
                'bsornm': this.seachUserId,
                }
            }).then((res) => {
              if (res) {
                console.log(res,"res")
                  if(this.page_res[this.pageIndex]){
                      this.dataList = this.page_res[this.pageIndex];
                  }else {
                      this.dataList = res.dataList;
                  }
                  this.totalPage = res.totalNum;
                  this.pageIndex = res.currPage;
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
        startUser(row){//启用数据集
          if(row.flag == 1){
               this.Message.success('此数据集已启用'); 
          }else{
            this.$confirm('确定启用此数据集【' + row.dat_nm + '】？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
              }).then(() => {
                this.BaseRequest({
                    url: '/management/delmanagement',    
                    method: 'get',
                    params: {'dat_cd': row.dat_cd,"flag": 1}
                }).then((res) => {
                    this.Message.success('此数据集启用成功');
                    this.getTableData(1);
                })
              })
          }
        },
        delUser: function (row) {//停用数据集
            if(row.flag == 0){
               this.Message.success('此数据集已停用'); 
            }else{
              this.$confirm('确定停用此数据集【' + row.dat_nm + '】？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
              }).then(() => {
                this.BaseRequest({
                    url: '/management/delmanagement',    
                    method: 'get',
                    params: {'dat_cd': row.dat_cd,"flag": 0}
                }).then((res) => {
                    this.Message.success('此数据集停用成功'); 
                    this.getTableData(1);
                })
              })
            }
        },
        openAddModal: function () {//新增
            this.addShowModalPage = true;
        },
        addSubmitDataForm: function () {//新增弹窗
            // this.addformData.fileClass
           
            if (this.addformData.data_name == null || this.addformData.data_lable == null || this.addformData.app_peoject == null 
              || this.addformData.fileClass == null ) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据集标识、数据集名称、所属应用项目、文件名命名规则'
              })
        
            }else{
              if( this.addformData.project_Explain == null ){
                 this.addformData.project_Explain = "";
              }
              this.BaseRequest({
                  url: '/management/insertmanagement',
                  method: 'get',
                  params: {
                    'dat_nm': this.addformData.data_name,
                    'prj_cd': this.addformData.app_peoject,
                    'dat_cd': this.addformData.data_lable,
                    'file_regexp': this.addformData.fileClass,
                    'dat_desc': this.addformData.project_Explain == ""?"暂无":this.addformData.project_Explain,
                  }
              }).then((res) => {
                this.getTableData(1);
                if(res == "success"){
                    this.Message.success('保存成功');
                    this.closeModal();
                }
              })
            }
        },
        openEditModal: function (row) {//编辑
            console.log(row)
            this.editShowModalPage = true;
            this.user_id = row.user_id;
            this.editformData.data_name = row.dat_nm;
            this.editformData.data_lable = row.dat_cd;
            this.editformData.app_peoject = row.prj_nm;
            this.editformData.fileClass = row.file_regexp;
            this.editformData.project_Explain = row.dat_desc;
            this.editformData.createdTime = row.create_time;
            this.editformData.lastEditTime = row.update_time;
        },
        editSubmitDataForm: function () {//编辑弹窗 
            if (this.editformData.data_name == null || this.editformData.data_lable == null || this.editformData.app_peoject == null 
              || this.editformData.fileClass == null ) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据集标识、数据集名称、所属应用项目、维护人'
              })
            }else{
              for(var i=0;i<this.projectOPtion.length;i++){
                if(this.editformData.app_peoject == this.projectOPtion[i].prj_nm){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }else if(this.editformData.app_peoject == this.projectOPtion[i].prj_cd ){
                  this.prj_cd = this.projectOPtion[i].prj_cd;
                }
              }
              if( this.editformData.project_Explain == null ){
                 this.editformData.project_Explain = "";
              }
              this.BaseRequest({
                  url: '/management/updatemanagement',
                  method: 'get',
                  params: {
                    'dat_nm': this.editformData.data_name,
                    'prj_cd': this.prj_cd,
                    'dat_cd': this.editformData.data_lable,
                    'file_regexp': this.editformData.fileClass,
                    'dat_desc': this.editformData.project_Explain,
                  }
              }).then((res) => {
                this.getTableData(1);
                if(res == "success"){
                  this.Message.success('保存成功');
                  this.closeModal();
                }
              })
            }
        },
        see: function (row) { //查看
            const $this = this;
            this.seeShowModalPage = true;
            this.seeformData.data_name = row.dat_nm;
            this.seeformData.data_lable = row.dat_cd;
            this.seeformData.app_peoject = row.prj_nm;
            this.seeformData.fileClass = row.file_regexp;
            this.seeformData.contact_people = row.person_nm;
            this.seeformData.project_Explain = row.dat_desc == ""?"暂无":row.dat_desc;
            this.seeformData.flag = row.flag == 0?"停用":"启用";
            this.seeformData.createdTime = row.create_time;
            this.seeformData.lastEditTime = row.update_time;
        },
        closeModal: function () {
            this.addShowModalPage = false;
            this.editShowModalPage = false;
            this.seeShowModalPage = false;
            this.addformData.data_lable = "";
            this.addformData.data_name = "";
            this.addformData.app_peoject = "";
            this.addformData.fileClass = "";
            this.addformData.project_Explain = "";
        },
    },
    mounted: function () {
      this.getTableData();
      this.getdatasData();
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
