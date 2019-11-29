<template>
  <WorkMain :headerItems="['数据生产计划']">
    <el-row :gutter="20">
      <el-col class="align-left spaceValue" :span="17">
          <span class="textCalss">所属应用项目：</span>
          <el-select size="mini"  style="width:150px;" v-model="projectS" placeholder="请选择项目" clearable filterable >
              <el-option v-for="item in projectOPtion" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
          </el-select>
          <el-input placeholder="请输入数据生产计划名称" style="width:180px"  v-model="seachUserId"></el-input>
          <el-button  @click="getTableData(1)" type="primary" >查 询</el-button>
          <el-button @click="resetInput()" >重 置</el-button>
          <el-button @click="openAddModal" type="primary">新增数据生产计划</el-button>
      </el-col>
      <el-col :span="24">
        <el-table
            :data="dataList"
            border
            stripe
            size="mini"
            class = "searchGrid"
            style="width:100%"
            v-loading="dataListLoading"
            >
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="mobile_phone"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="生产计划名称">
            </el-table-column> 
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="所属应用项目">
            </el-table-column>
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="所属数据集">
            </el-table-column>
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="数据推送周期">
            </el-table-column>
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="数据文件生成时间">
            </el-table-column>
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="负责人">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini"  @click="openEditModal(scope.row)" >编辑</el-button>
                    <el-button type="text" size="mini" @click="see(scope.row)" >查看</el-button>
                    <el-button type="text" size="mini" @click="delUser(scope.row)" >删除</el-button>
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
      </el-col>
    </el-row>

    <!-- 新增 弹窗-->
    <el-dialog title="新增数据消费计划" :visible.sync="addShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="32%" :model="addformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据生产计划名称：">
              <el-input v-model="addformData.dataPlan_name" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属应用项目：">
              <el-select size="mini"  style="width:300px;" v-model="addformData.AppProject" placeholder="请选择数据生产计划名称" clearable filterable >
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属数据集：">
              <el-select size="mini"  style="width:300px;" v-model="addformData.datas" placeholder="请选择所属数据集" clearable filterable >
                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据推送周期：">
              <el-select size="mini"  style="width:300px;" v-model="addformData.dataWeek" placeholder="请选择数据推送周期" clearable filterable >
                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件生成时间：">
              <el-date-picker
                  v-model="addformData.dataCreaTime"
                  type="datetime"
                  style="width:300px;"
                  value-format="yyyy-MM-dd HH:MM:SS"
                  placeholder="数据文件生成时间">
              </el-date-picker>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="上传任务时间：">
              <el-date-picker
                  v-model="addformData.uplodTime"
                  type="datetime"
                  style="width:300px;"
                  value-format="yyyy-MM-dd HH:MM:SS"
                  placeholder="上传任务时间">
              </el-date-picker>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据文件存放路径：">
              <el-input v-model="addformData.dataSsionPath" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="负责人：">
                <el-select size="mini"  style="width:300px;" v-model="addformData.contact_people" placeholder="请选择负责人" clearable filterable >
                    <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
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
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属数据集：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.datas" placeholder="请选择所属数据集" clearable filterable >
                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据推送周期：">
              <el-select size="mini"  style="width:300px;" v-model="editformData.dataWeek" placeholder="请选择数据推送周期" clearable filterable >
                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
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
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="负责人：">
                <el-select size="mini"  style="width:300px;" v-model="editformData.contact_people" placeholder="请选择负责人" clearable filterable >
                    <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="是否启用：">
                <el-radio v-model="editformData.isEnable" label="1">启用</el-radio>
                <el-radio v-model="editformData.isEnable" label="2">禁用</el-radio>
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
      <el-form  class="modal-form" label-position="left" label-width="32%" :model="seeformData">
        <el-form-item size="mini" label="数据生产计划名称：">
          <el-input v-model="seeformData.dataPlan_name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="所属应用项目：">
          <el-input v-model="seeformData.AppProject" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="所属数据集：">
           <el-input v-model="seeformData.datas" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="数据推送周期：">
           <el-input v-model="seeformData.dataWeek" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="数据文件生成时间：">
          <el-input v-model="seeformData.dataCreaTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="上传任务时间：">
          <el-input v-model="seeformData.uplodTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="数据文件存放路径：">
          <el-input v-model="seeformData.dataSsionPath" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="负责人：">
           <el-input v-model="seeformData.contact_people" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="是否启用：">
           <el-input v-model="seeformData.isEnable" auto-complete="off" disabled></el-input>
        </el-form-item> 
        <el-form-item size="mini" label="创建时间">
          <el-input v-model="seeformData.createdTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间">
          <el-input v-model="seeformData.lastEditTime" auto-complete="off" disabled></el-input>
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
          AppProject:null,
          datas:null,
          dataWeek:null,
          dataCreaTime:null,
          uplodTime:null,
          dataSsionPath:null,
          contact_people:null,
          isEnable:null,
        },
        editformData: {
          dataPlan_name:null,
          AppProject:null,
          datas:null,
          dataWeek:null,
          dataCreaTime:null,
          uplodTime:null,
          dataSsionPath:null,
          contact_people:null,
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          dataPlan_name:null,
          AppProject:null,
          datas:null,
          dataWeek:null,
          dataCreaTime:null,
          uplodTime:null,
          dataSsionPath:null,
          contact_people:null,
          isEnable:null,
          createdTime:null,
          lastEditTime:null,
        },
        projectOPtion: [
            {name:'项目一',value:0},
            {name:'项目二',value:1 },
            {name:'项目三',value:2 },
        ],
        options1:[
            {name:'a',value:0},
            {name:'b',value:1 },
            {name:'c',value:2 },
        ],
        options2:[
            {name:'q',value:0},
            {name:'w',value:1 },
            {name:'e',value:2 },
        ],
        options3:[
            {name:'11',value:0},
            {name:'22',value:1 },
            {name:'33',value:2 },
        ],
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
          this.projectS = null;
          this.seachUserId = null;
          this.getTableData(1);
        },
        getTableData: function (pageNum) {
            if (pageNum && pageNum !== '') {
              this.pageIndex = pageNum;
            } else {
              pageNum = this.pageIndex;
            }
            const $this = this;
            this.BaseRequest({
                url: '/contact/pageContact',
                method: 'get',
                params: {
                  'currPage': pageNum,
                  'pageSize': 10,
                }
            }).then((response) => {
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
        delUser: function (row) {//删除
            this.$confirm('确定删除用户【' + row.user_name + '】？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(() => {
              this.BaseRequest({
                  url: '/contact/delpageContact',    
                  method: 'get',
                  params: {'user_id': row.user_id}
              }).then((res) => {
                  if(res == "success"){
                    this.Message.success('删除成功');
                    this.getTableData(1);
                  }
              })
            })
        },
        openAddModal: function () {//新增
            this.addShowModalPage = true;
        },
        addSubmitDataForm: function () {//新增弹窗
        console.log(this.addformData.uplodTime)
            console.log(this.addformData.dataCreaTime)
            if (this.addformData.dataPlan_name == null || this.addformData.AppProject == null || this.addformData.datas == null 
              || this.addformData.dataWeek == null || this.addformData.dataCreaTime == null || this.addformData.uplodTime == null
              || this.addformData.dataSsionPath == null || this.addformData.contact_people == null || this.addformData.isEnable == null) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据生产计划名称、所属应用项目、所属数据集、数据推送周期、数据文件生成时间、上传任务时间、数据文件存放路径、责任人、是否启用'
              })
            }else{
              this.BaseRequest({
                  url: '/contact/insertpageContact',
                  method: 'get',
                  params: {
                    'user_name': this.addformData.dataPlan_name,
                    'mobile_phone': this.addformData.AppProject,
                    'email': this.addformData.datas,
                    'email': this.addformData.dataWeek,
                    'email': this.addformData.dataCreaTime,
                    'email': this.addformData.uplodTime,
                    'email': this.addformData.dataSsionPath,
                    'email': this.addformData.contact_people,
                    'email': this.addformData.isEnable,
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
            this.user_id = row.user_id;
            this.editformData.dataPlan_name = row.user_name;
            this.editformData.AppProject = row.mobile_phone;
            this.editformData.datas = row.email;
            this.editformData.dataWeek = row.email;
            this.editformData.dataCreaTime = row.email;
            this.editformData.uplodTime = row.email;
            this.editformData.dataSsionPath = row.email;
            this.editformData.contact_people = row.email;
            this.editformData.isEnable = row.email;
            this.editformData.createdTime = row.last_login_time;
            this.editformData.lastEditTime = row.last_login_time;
        },
        editSubmitDataForm: function () {//编辑弹窗 
        console.log(this.editformData)
        if (this.editformData.dataPlan_name == null || this.editformData.AppProject == null || this.editformData.datas == null 
            || this.editformData.dataWeek == null || this.editformData.dataCreaTime == null || this.editformData.uplodTime == null
            || this.editformData.dataSsionPath == null || this.editformData.contact_people == null || this.editformData.isEnable == null) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据消费计划名称、消费数据应用项目、生产计划名称、数据下载时间、数据存储路径、责任人、数据使用目的、是否启用'
              })
            }else{
              this.BaseRequest({
                  url: '/contact/updatepageContact',
                  method: 'get',
                  params: {
                    'user_id': this.user_id,
                    'user_name': this.editformData.dataPlan_name,
                    'mobile_phone': this.editformData.AppProject,
                    'email': this.editformData.datas,
                    'email': this.editformData.dataWeek,
                    'email': this.editformData.dataCreaTime,
                    'email': this.editformData.uplodTime,
                    'email': this.editformData.dataSsionPath,
                    'email': this.editformData.contact_people,
                    'email': this.editformData.isEnable,
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
            const $this = this;
            this.seeShowModalPage = true;
            this.BaseRequest({
              url: '/contact/pageContactselect',
              method: 'get',
              params: {
                  'user_id': row.user_id,
              }
            }).then((res) => {
              var resJson = res[0];
              this.seeformData.dataPlan_name = resJson.user_name;
              this.seeformData.AppProject = resJson.mobile_phone;
              this.seeformData.datas = resJson.email;
              this.seeformData.dataWeek = resJson.email;
              this.seeformData.dataCreaTime = resJson.email;
              this.seeformData.uplodTime = resJson.email;
              this.seeformData.dataSsionPath = resJson.email;
              this.seeformData.contact_people = resJson.email;
              this.seeformData.isEnable = resJson.email;
              
              this.seeformData.createdTime = resJson.reg_date;
              this.seeformData.lastEditTime = resJson.last_login_time;
            })
        },
        closeModal: function () {
            this.addShowModalPage = false;
            this.editShowModalPage = false;
            this.seeShowModalPage = false;
            this.addformData.dataPlan_name = "";
            this.addformData.AppProject = "";
            this.addformData.datas = "";
            this.addformData.dataWeek = "";
            this.addformData.dataCreaTime = "";
            this.addformData.uplodTime = "";
            this.addformData.dataSsionPath = "";
            this.addformData.contact_people = "";
            this.addformData.isEnable = "";
        },
    },
    mounted: function () {
      this.getTableData();
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
    margin-left:20px;
  }
  .textCalss{
      font-size: 13px;
      color:#606266;
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
