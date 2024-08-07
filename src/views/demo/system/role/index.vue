<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增角色</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'users'">
          <li v-for="(item, index) in record.users" :key="index">
            <a-button class="success">{{ item.username }}</a-button>
          </li>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:account-book-twotone',
                onClick: showRoleApiDrawer.bind(null, record),
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

    <RoleDrawer
      @register="registerDrawer"
      @success="handleSuccess"
      :is-update="isUpdate"
    />

    <a-drawer
      title="分配API权限"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onCloseRoleApi"
    >
      <a-form :model="oneRole" layout="vertical">
        <a-row :gutter="24">
          <a-tag color="#55acee">分配Api权限</a-tag>
          <a-tree-select
            v-model:value="value"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeDataApi"
            treeDataSimpleMode
            placeholder="请选择"
            tree-checkable
            allow-clear
            tree-default-expand-all
            title="分配Api"
          >
          </a-tree-select>
        </a-row>
      </a-form>

      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="onCloseRoleApi">取消</a-button>
        <a-button type="primary" @click="onCloseRoleApi">提交</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { deleteRole, getRoleListByPage } from '/@/api/demo/system';
import { useDrawer } from '/@/components/Drawer';
import RoleDrawer from './RoleDrawer.vue';
import { columns, searchFormSchema } from './role.data';
import { useMessage } from '@/hooks/web/useMessage';

export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, RoleDrawer, TableAction },
  setup() {
    const [registerDrawer, { openDrawer }] = useDrawer();
    const [registerTable, { reload }] = useTable({
      title: '角色列表',
      api: getRoleListByPage,
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
        width: 80,
        title: '操作',
        dataIndex: 'action',
        fixed: undefined,
      },
    });

    const value = ref<string>();
    let oneRole = ref<Record<string, any>>({});
    const visible = ref<boolean>(false);
    let treeDataApi = ref<any[]>([]);
    const isUpdate = ref<boolean>(false);

    function showRoleApiDrawer(record: Recordable) {
      visible.value = true;
      oneRole.value = record;
      treeDataApi.value = record.apis;
      console.log("打开模态框后的record", record);
      console.log("打开模态框后的treeDataApi", treeDataApi);
    }

    const onCloseRoleApi = () => {
      visible.value = false;
    };

    function handleCreate() {
      isUpdate.value = false;
      openDrawer(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      isUpdate.value = true;
      openDrawer(true, {
        record,
        isUpdate: true,
      });
    }

    function handleDelete(record: Recordable) {
      const { createMessage } = useMessage();
      deleteRole(record.id)
        .then(() => {
          createMessage.success(`已成功删除角色`);
          reload();
        })
        .catch(() => {
          createMessage.error('删除角色失败');
        });
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
      isUpdate,
    };
  },
});
</script>
