<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增值班组 </a-button>
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'todayDutyUser'">


            <a-button type="primary"  > 值班人： {{ record.todayDutyUser.realName }}</a-button>


        </template>
        <template v-if="column.key === 'userNames'">

          <li v-for="(item, index) in record.userNames">
            <a-tag :color="tagsColorFunc(index)" >{{ item }}</a-tag>
          </li>


        </template>


        <template v-if="column.key === 'name'">

          <router-link target="_blank" :to="{path:'/monitor/ondutygroup-plan',query:{id: record.id}}">
            <button>  {{ record.name }}</button>
          </router-link>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除',
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

<script lang="ts" setup>

import { defineComponent , ref } from 'vue';

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {
  deleteProcess,
  deleteRole,
  getProcessList,
  getMonitorOndutyGroupList,
  deleteMonitorOndutyGroup,
  setRoleStatus
} from '/@/api/demo/system';

import { useDrawer } from '/@/components/Drawer';
import ProcessDrawer from './OnDutyGroupDrawer.vue';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";

const [registerDrawer, { openDrawer }] = useDrawer();
const [registerTable, { reload }] = useTable({
  title: '值班组列表',
  api: getMonitorOndutyGroupList,
  columns,
  formConfig: {
    labelWidth: 200,
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
  },

});

const tagsColorMap = {
  // "super":"primary danger",
  0 :"pink",
  1 :"orange",
  2 :"green",
  3 :"cyan",
  4 :"purple",
  5 :"red",
  "test1":"success",

};
const tagsColorFunc = function (index){
  let tmp = tagsColorMap[index]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};

function showPrometheusYaml(ip,record){

  var url= `/monitor/yaml?poolName=${record.name}&ip=${ip}`;
  router.push(url)
}

function handleSuccess() {
  reload();
}

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
  deleteMonitorOndutyGroup(record.id).then(() => {
    createMessage.success(`已成功删除值班组`);
  })
    .catch(() => {
      createMessage.error('删除值班组失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}

</script>

<style scoped>

</style>
