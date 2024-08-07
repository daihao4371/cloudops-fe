<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增工单模板 </a-button>
      </template>
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'users'">

          <li v-for="(item, index) in record.users">
            <a-button class="success" >{{ item.username }}</a-button>
            <!--            <a-button  >{{ item.value }}</a-button>-->
            <!--            <a-divider> </a-divider>-->
          </li>


        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑工单模板'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除工单模板',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ProcessDrawer @register="registerDrawer" @success="handleSuccess" />



  </div>
</template>
<script lang="ts">
  import { defineComponent , ref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    deleteProcess,
    deleteRole,
    getProcessList,
    getRoleListByPage, getWorkOrderTemplateList,
    deleteWorkOrderTemplate,
    setRoleStatus
  } from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import ProcessDrawer from './templateDrawer.vue';

  import { columns, searchFormSchema } from './data';
  import {useMessage} from "@/hooks/web/useMessage";
  import {TreeItem} from "@/components/Tree";
  export default defineComponent({
    name: 'WorkOrderTemplateManagement',
    components: { BasicTable, ProcessDrawer, TableAction},
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '工单模板列表',
        api: getWorkOrderTemplateList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 280,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: 'left',
        },

      });

      const value = ref<string>();
      var oneRole =  {}

      const visible = ref<boolean>(false);

      var treeDataApi = ref<any[]>([]);


      function showRoleApiDrawer(record: Recordable) {
        visible.value = true;
        oneRole = record
        treeDataApi = record.apis
        console.log("打开模态框后的record",record)
        console.log("打开模态框后的treeDataApi",treeDataApi)
      }

      const onCloseRoleApi = () => {
        visible.value = false;
      };

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {

        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        const { createMessage } = useMessage();
        deleteWorkOrderTemplate(record.id).then(() => {
            createMessage.success(`已成功删除工单模板`);
          })
          .catch(() => {
            createMessage.error('删除工单模板失败');
          })
          .finally(() => {
            record.pendingStatus = false;
          });
        reload();

      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        onCloseRoleApi,
        handleDelete,
        visible,
        value,
        oneRole,
        treeDataApi,
        showRoleApiDrawer,
        handleSuccess,
      };
    },
  });
</script>
