<template>
  <WorkMain :headerItems="['应用项目管理']">
    <el-row :gutter="20">
      <el-col class="align-left spaceValue" :span="17">
            <el-button @click="openAddModal" type="primary">新增应用项目</el-button>
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
                prop="user_name"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="应用名称">
            </el-table-column>
            <el-table-column
                prop="mobile_phone"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="应用标识">
            </el-table-column>
            <el-table-column
                prop="email"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="联系人">
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
    <el-dialog title="新增应用项目" :visible.sync="addShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="25%" :model="addformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
          <el-form-item size="mini" label="应用项目标识：">
            <el-input v-model="addformData.project_label" auto-complete="off" ></el-input>
          </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
          <el-form-item size="mini" label="应用项目名称：">
            <el-input v-model="addformData.project_name" auto-complete="off" ></el-input>
          </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
          <el-form-item size="mini" label="联系人：">
              <el-select size="mini"  style="width:340px;" v-model="addformData.contact_people" placeholder="请选择联系人" clearable filterable >
                  <el-option v-for="item in projectOPtion" :key="item.id" :label="item.name" :value="item.id">
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
    <el-dialog title="修改应用项目" :visible.sync="editShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="25%" :model="editformData">
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="应用项目标识：">
              <el-input v-model="editformData.project_label" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="应用项目名称：">
              <el-input v-model="editformData.project_name" auto-complete="off" ></el-input>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="联系人：">
                <el-select size="mini"  style="width:340px;" v-model="editformData.contact_people" placeholder="请选择联系人" clearable filterable >
                    <el-option v-for="item in projectOPtion" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="boxForm_item">
            <span class="colorRed">*</span>
            <el-form-item size="mini" label="应用项目说明：">
              <el-input v-model="editformData.project_Explain" auto-complete="off" type="textarea" autosize ></el-input>
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
        <el-button @click="editShowModalPage = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitDataForm()">保 存</el-button>
      </div>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog title="查看应用项目" :visible.sync="seeShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="22%" :model="seeformData">
        <el-form-item size="mini" label="应用项目标识：">
          <el-input v-model="seeformData.project_label" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="应用项目名称：">
          <el-input v-model="seeformData.project_name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人：">
          <el-input v-model="seeformData.contact_people" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="应用项目说明：">
          <el-input v-model="seeformData.project_Explain" auto-complete="off" type="textarea" autosize disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="创建时间：">
          <el-input v-model="seeformData.createdTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间：">
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
    name: 'projectMain',
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
          project_name: null,
          project_label: null,
          contact_people: null,
          project_Explain: null,
        },
        editformData: {
          project_name: null,
          project_label: null,
          contact_people: null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          project_name: null,
          project_label: null,
          contact_people: null,
          project_Explain: null,
          createdTime:null,
          lastEditTime:null,
        },
        projectOPtion:[
            {name:"项目一",id:0},
            {name:"项目二",id:1},
            {name:"项目三",id:2},
        ],
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
            if (this.addformData.project_name == null || this.addformData.project_label == null  
             || this.addformData.contact_people == null || this.addformData.project_Explain == null) {
                this.$notify({
                    dangerouslyUseHTMLString: true,       
                    message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>应用项目标识、应用项目名称、联系人、应用项目说明'
                })
            }else{
                this.BaseRequest({
                    url: '/contact/insertpageContact',
                    method: 'get',
                    params: {
                    'user_name': this.addformData.project_name,
                    'mobile_phone': this.addformData.project_label,
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
            this.editformData.project_name = row.user_name;
            this.editformData.project_label = row.mobile_phone;
            this.editformData.contact_people = row.email;
            this.editformData.project_Explain = row.email;
            this.editformData.createdTime = row.last_login_time;
            this.editformData.lastEditTime = row.last_login_time;
        },
        editSubmitDataForm: function () {//编辑弹窗 
            if (this.editformData.project_name == null || this.editformData.project_label == null 
             || this.editformData.contact_people == null || this.editformData.project_Explain == null) {
                this.$notify({
                    dangerouslyUseHTMLString: true,       
                    message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>应用项目标识、应用项目名称、联系人、应用项目说明'
                })
            }else{
                this.BaseRequest({
                    url: '/contact/updatepageContact',
                    method: 'get',
                    params: {
                        'user_id': this.user_id,
                        'user_name': this.editformData.project_name,
                        'mobile_phone': this.editformData.project_label,
                        'email': this.editformData.contact_people,
                        'email': this.editformData.project_Explain
                    }
                }).then((res) => {
                    if(res == "success"){
                        this.Message.success('修改成功');
                        this.getTableData(1);
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
                this.seeformData.project_name = resJson.user_name;
                this.seeformData.project_label = resJson.mobile_phone;
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
            this.addformData.project_name = "";
            this.addformData.project_label = "";
            this.addformData.contact_people = "";
            this.addformData.project_Explain = "";
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
</style>
