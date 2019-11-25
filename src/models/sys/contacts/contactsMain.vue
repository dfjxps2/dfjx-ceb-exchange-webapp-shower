<template>
  <WorkMain :headerItems="['联系人管理']">
    <el-row class="search-row" :gutter="20">
      <el-col class="align-left" :span="17">
        <el-button @click="openAddModal" type="primary" icon="plus-circle">新增信息联系人</el-button>
      </el-col>
    </el-row>

    <el-row class="table-page-root-outoptions">
      <el-col :span="24">
        <el-table
          :data="dataList"
          header-row-class-name="table-header-style"
          row-class-name="mini-font-size" stripe
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            align="left"
            label="联系人姓名">
          </el-table-column>
          <el-table-column
            prop="tel"
            align="left"
            label="联系人电话">
          </el-table-column>
          <el-table-column
            prop="email"
            align="left"
            label="联系人邮箱">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openEditModal(scope.row)" size="mini">编辑</el-button>
              <el-button type="text" @click="see(scope.row)" size="mini">查看</el-button>
              <el-button type="text" @click="delUser(scope.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页 refreshData:点击页码上一页下一页时调用的方法、pageCount:总页数-->
    <WorkTablePager @refreshData="getTableData"
                    :pageCount="totalPage">
    </WorkTablePager>

    <!-- 新增 弹窗-->
    <el-dialog title="新增联系人信息" :visible.sync="addShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="20%" :model="addformData">
        <el-form-item size="mini" label="联系人姓名">
          <el-input v-model="addformData.contacts_name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人电话">
          <el-input v-model="addformData.contacts_tel" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人邮箱">
          <el-input v-model="addformData.contacts_email" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="addSubmitDataForm()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 弹窗-->
    <el-dialog title="修改联系人信息" :visible.sync="editShowModalPage" >
      <el-form  class="modal-form" label-position="left" label-width="22%" :model="editformData">
        <el-form-item size="mini" label="联系人姓名">
          <el-input v-model="editformData.contacts_name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人电话">
          <el-input v-model="editformData.contacts_tel" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人邮箱">
          <el-input v-model="editformData.contacts_email" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="创建时间">
          <el-input v-model="editformData.createdTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间">
          <el-input v-model="editformData.lastEditTime" auto-complete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="editSubmitDataForm()">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog title="查看联系人信息" :visible.sync="showUserAuth" >
      <el-form  class="modal-form" label-position="left" label-width="22%" :model="seeformData">
        <el-form-item size="mini" label="联系人姓名" >
          <el-input v-model="seeformData.contacts_name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人电话">
          <el-input v-model="seeformData.contacts_tel" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="联系人邮箱">
          <el-input v-model="seeformData.contacts_email" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="创建时间">
          <el-input v-model="seeformData.createdTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item size="mini" label="最后修改时间">
          <el-input v-model="seeformData.lastEditTime" auto-complete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserAuthModal">取 消</el-button>
        <el-button type="primary" @click="saveUserRole()">确 定</el-button>
      </div>
    </el-dialog>
  </WorkMain>
</template>

<script>
  import WorkTablePager from '@/models/public/WorkTablePager'
  import WorkMain from '@/models/public/WorkMain'
  import { required } from 'vuelidate/lib/validators'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'UserMain',
    data () {
      return {
        dataList: [],
        originList: [],
        searchOriginName: '',
        userType: 1,
        seachOriginId: null,
        // tableDataUrl: '/contact/pageContact',
        currPageNum: 1,
        totalPage: 1,
        editShowModalPage: false,
        addShowModalPage: false,
        isEditModal: false,
        showUserAuth: false,
        showOrigin: false,
        allRoleList: [],
        user_role_id: '',
        addformData: {
          contacts_name: null,
          contacts_tel: null,
          contacts_email: null,
        },
        editformData: {
          contacts_name: null,
          contacts_tel: null,
          contacts_email: null,
          createdTime:null,
          lastEditTime:null,
        },
        seeformData: {
          contacts_name: null,
          contacts_tel: null,
          contacts_email: null,
          createdTime:null,
          lastEditTime:null,
        },
        options:[]

      }
    },
    validations: {
      formData: {
        user_name: {
          required
        },
        user_type: {
          required
        },
        user_status: {
          required
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
      getTableData: function (pageNum) {
        if (pageNum && pageNum !== '') {
          this.currPageNum = pageNum;
        } else {
          pageNum = this.currPageNum;
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
          console.log(response,"返回的数据")
          // $this.totalPage = reponse.totalPage;
          // this.dataList = reponse.List.dataList;
          // $this.refreshTableList(reponse.List.dataList);
        })
      },
      // refreshTableList: function (dataList) {
      //   // this.dataList = dataList;
      // },
      delUser: function (row) {
        this.$confirm('确定删除用户【' + row.user_name + '】？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.BaseRequest({
            url: 'sys/user/delUserByUserId',    
            method: 'get',
            params: {'user_id': row.user_id}
          }).then(() => {
            this.Message.success('删除成功');
            this.getTableData();
          })
        }).catch(() => {
        })
      },
      openAddModal: function () {//新增
        this.clearData();
        this.addShowModalPage = true;
        this.isEditModal = false;
      },
      clearData: function () {
        this.formData = {
          user_id: null,
          user_name: null,
          user_status: null,
          user_type: null
        }
      },
      openEditModal: function (row) {//编辑
        this.clearData();
        this.editShowModalPage = true;
        this.isEditModal = true;
        this.editformData.contacts_name = row.name;
        this.editformData.contacts_tel = row.tel;
        this.editformData.contacts_email = row.email;
        this.editformData.createdTime = row.user_type;
        this.editformData.lastEditTime = row.user_type;
      },
      addSubmitDataForm: function () {//新增弹窗
        if (this.checkInputNull()) {
          return
        }
        if (this.isEditModal) {
          this.BaseRequest({
            url: 'sys/user/updateSaveUser',
            method: 'POST',
            data: {'user_name': this.formData.user_name,
              'user_id': this.formData.user_id,
              'user_type': this.formData.user_type,
              'user_status': this.formData.user_status}
          }).then(() => {
            this.Message.success('保存成功')
            this.closeModal()
          })
        } else {
          this.BaseRequest({
            url: 'sys/user/saveNewUser',
            method: 'get',
            params: {'user_name': this.formData.user_name,
              'user_id': this.formData.user_id,
              'user_type': this.formData.user_type,
              'user_status': this.formData.user_status}
          }).then((response) => {
            this.Message.success('保存成功');
            this.formData.user_id = response.user_id;
            this.closeModal();
          })
        }
      },
      editSubmitDataForm: function () {//编辑弹窗
        if (this.checkInputNull()) {
          return
        }
        if (this.isEditModal) {
          this.BaseRequest({
            url: 'sys/user/updateSaveUser',
            method: 'POST',
            data: {'user_name': this.formData.user_name,
              'user_id': this.formData.user_id,
              'user_type': this.formData.user_type,
              'user_status': this.formData.user_status}
          }).then(() => {
            this.Message.success('保存成功')
            this.closeModal()
          })
        } else {
          this.BaseRequest({
            url: 'sys/user/saveNewUser',
            method: 'get',
            params: {'user_name': this.formData.user_name,
              'user_id': this.formData.user_id,
              'user_type': this.formData.user_type,
              'user_status': this.formData.user_status}
          }).then((response) => {
            this.Message.success('保存成功');
            this.formData.user_id = response.user_id;
            this.closeModal();
          })
        }
      },
      see: function (row) { //查看
        const $this = this;
        this.showUserAuth = true;
        this.formData.user_id = row.user_id;
        this.formData.user_name = row.user_name;
        this.BaseRequest({
          url: 'sys/userRole/getRoleByUserId',
          method: 'get',
          params: {user_id: this.formData.user_id}
        }).then(response => {
          if (response != null && response.length > 0) {
            $this.user_role_id = response[0]['user_role_id']
            $this.formData.user_role_id = response[0]['user_role_id']
          }
        })
      },
      saveUserRole: function () {//查看弹窗
        this.BaseRequest({
          url: 'sys/userRole/updateUserRole',
          method: 'get',
          params: {user_id: this.formData.user_id, user_role_id: this.user_role_id, old_user_role_id: this.formData.user_role_id}
        }).then(() => {
          this.Message.success('保存成功');
          this.showUserAuth = false;
        })
      },
      closeModal: function () {
        this.addShowModalPage = false;
        this.editShowModalPage = false;
        this.seeShowModalPage = false;
        this.isEditModal = false;
      },
      closeUserAuthModal: function () {
        this.showUserAuth = false;
      },

      checkInputNull () {
        const checkResult = this.$v.$invalid;
        if (checkResult) {
          this.$notify({
            dangerouslyUseHTMLString: true,       
            message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>联系人姓名、电话、邮箱'
          })
        }
        return checkResult;
      }
    },
    mounted: function () {
      this.getTableData(1);
      // this.userDataList = [];
      // const $this = this;
      // this.BaseRequest({
      //   url: 'sys/role/rolePageData',
      //   method: 'get',
      //   params: {currPage: 1, pageSize: 100}
      // }).then(response => {
      //   $this.allRoleList = response.dataList;
      // })
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

  .search-row{
    margin:5px 0 0 0;
  }
</style>
