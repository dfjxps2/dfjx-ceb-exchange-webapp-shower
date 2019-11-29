<template>
  <WorkMain :headerItems="['数据集管理']">
    <el-row :gutter="20">
      <el-col class="align-left spaceValue" :span="17">
          <span class="textCalss">所属应用项目：</span>
          <el-select size="mini"  style="width:150px;" v-model="projectS" placeholder="请选择项目" clearable filterable >
              <el-option v-for="item in projectOPtion" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
          </el-select>
          <el-input placeholder="请输入标识或者名称" style="width:180px"  v-model="seachUserId"></el-input>
          <el-button  @click="getTableData(1)" type="primary" >查 询</el-button>
          <el-button @click="resetInput()" >重 置</el-button>
          <el-button @click="openAddModal" type="primary">新增数据集</el-button>
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
                label="标识">
            </el-table-column> 
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="名称">
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
                label="文件名命名规则">
            </el-table-column>
            <el-table-column
                prop="email"
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
    <el-dialog title="新增数据集" :visible.sync="addShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="25%" :model="addformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据集标识：">
              <el-input v-model="addformData.data_lable" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>    
            <el-form-item size="mini" label="数据集名称：">
              <el-input v-model="addformData.data_name" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="所属应用项目：">
              <el-select size="mini"  style="width:340px;" v-model="addformData.app_peoject" placeholder="请选择所属应用项目" clearable filterable >
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="维护人：">
                <el-select size="mini"  style="width:340px;" v-model="addformData.contact_people" placeholder="请选择维护人" clearable filterable >
                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="应用项目说明：">
              <el-input v-model="addformData.project_Explain" auto-complete="off" type="textarea" autosize></el-input>
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
      <el-form  class="modal-form" label-position="left" label-width="25%" :model="editformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="数据集标识：">
              <el-input v-model="editformData.data_lable" auto-complete="off" ></el-input>
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
              <el-select size="mini"  style="width:340px;" v-model="editformData.app_peoject" placeholder="请选择所属应用项目" clearable filterable >
                    <el-option v-for="item in options1" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="维护人：">
                <el-select size="mini"  style="width:340px;" v-model="editformData.contact_people" placeholder="请选择维护人" clearable filterable >
                    <el-option v-for="item in options2" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="应用项目说明：">
              <el-input v-model="editformData.project_Explain" auto-complete="off" ></el-input>
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
      <el-form  class="modal-form" label-position="left" label-width="25%" :model="seeformData">
        <el-form-item size="mini" label="数据集标识：">
          <el-input v-model="seeformData.data_lable" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="数据集名称：">
          <el-input v-model="seeformData.data_name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="所属应用项目：">
          <el-input v-model="seeformData.app_peoject" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="维护人：">
          <el-input v-model="seeformData.contact_people" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="应用项目说明：">
          <el-input v-model="seeformData.project_Explain" auto-complete="off" disabled></el-input>
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
          contact_people: null,
          project_Explain: null,
        },
        editformData: {
          data_lable: null,
          data_name: null,
          app_peoject: null,
          contact_people: null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          data_lable: null,
          data_name: null,
          app_peoject: null,
          contact_people: null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
        },
        projectOPtion: [
            {name:'项目一',value:0},
            {name:'项目二',value:1 },
            {name:'项目三',value:2 },
        ],
        options1:[
            {name:"项目一",id:0},
            {name:"项目二",id:1},
            {name:"项目三",id:2},
        ],
        options2:[
            {name:"张三1",id:0},
            {name:"张三2",id:1},
            {name:"张三3",id:2},
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
            if (this.addformData.data_name == null || this.addformData.data_lable == null || this.addformData.app_peoject == null 
              || this.addformData.contact_people == null || this.addformData.project_Explain == null) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据集标识、数据集名称、所属应用项目、维护人、数据集说明'
              })
            }else{
              this.BaseRequest({
                  url: '/contact/insertpageContact',
                  method: 'get',
                  params: {
                  'user_name': this.addformData.data_name,
                  'mobile_phone': this.addformData.data_lable,
                  'email': this.addformData.app_peoject,
                  'email': this.addformData.contact_people,
                  'email': this.addformData.project_Explain,
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
            this.editformData.data_name = row.user_name;
            this.editformData.data_lable = row.mobile_phone;
            this.editformData.app_peoject = row.email;
            this.editformData.contact_people = row.email;
            this.editformData.project_Explain = row.email;
            this.editformData.createdTime = row.last_login_time;
            this.editformData.lastEditTime = row.last_login_time;
        },
        editSubmitDataForm: function () {//编辑弹窗 
            if (this.editformData.data_name == null || this.editformData.data_lable == null || this.editformData.app_peoject == null 
              || this.editformData.contact_people == null || this.editformData.project_Explain == null) {
              this.$notify({
                  dangerouslyUseHTMLString: true,       
                  message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>数据集标识、数据集名称、所属应用项目、维护人'
              })
            }else{
              this.BaseRequest({
                  url: '/contact/updatepageContact',
                  method: 'get',
                  params: {
                  'user_id': this.user_id,
                  'user_name': this.editformData.data_name,
                  'mobile_phone': this.editformData.data_lable,
                  'email': this.editformData.app_peoject,
                  'email': this.editformData.contact_people,
                  'email': this.editformData.project_Explain,
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
              this.seeformData.data_name = resJson.user_name;
              this.seeformData.data_lable = resJson.mobile_phone;
              this.seeformData.app_peoject = resJson.email;
              this.seeformData.contact_people = resJson.email;
              this.seeformData.project_Explain = resJson.email;
              this.seeformData.createdTime = resJson.reg_date;
              this.seeformData.lastEditTime = resJson.last_login_time;
            })
        },
        closeModal: function () {
            this.addShowModalPage = false;
            this.editShowModalPage = false;
            this.seeShowModalPage = false;
            this.addformData.data_lable = "";
            this.addformData.data_name = "";
            this.addformData.app_peoject = "";
            this.addformData.contact_people = "";
            this.addformData.project_Explain = "";
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
