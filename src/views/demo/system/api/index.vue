<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增api </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
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
    <ApiDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import {defineComponent, nextTick, unref} from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {
  createMenu,
  deleteApi,
  deleteMenu,
  getApiList,
  getMenuList,
  updateMenu
} from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import ApiDrawer from './ApiDrawer.vue';

  import { columns, searchFormSchema } from './api.data';
import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'ApiManagement',
    components: { BasicTable, ApiDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll }] = useTable({
        title: 'api列表',
        api: getApiList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {

        console.log("handleEdit.record打印",record)

        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        const { createMessage } = useMessage();

        deleteApi(record.id)
          .then(() => {
            createMessage.success(`删除成功`);
            handleSuccess(); // 重新加载数据
          })
          .catch(() => {
            createMessage.error(`删除失败`);
          });
      }


      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
      };
    },
  });
</script>
