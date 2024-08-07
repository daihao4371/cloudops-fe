<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增采集池 </a-button>
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'prometheusInstances'">

          <li v-for="(item, index) in record.prometheusInstances">
            <router-link target="_blank" :to="{path:'/monitor/mainYaml',query:{poolName: record.name,ip:item}}">
              <a-tag color="red"   > 采集器主配置查看:{{ item }}</a-tag>
            </router-link>
            <br>

            <router-link target="_blank" :to="{path:'/monitor/alertRuleYaml',query:{poolName: record.name,ip:item }}">
              <a-tag color="green"   > 告警规则查看:{{ item }}</a-tag>
            </router-link>
            <br>

            <router-link target="_blank" :to="{path:'/monitor/recordRuleYaml',query:{poolName: record.name,ip:item }}">
              <a-tag color="blue"   > 预聚合规则查看:{{ item }}</a-tag>
            </router-link>


            <a-divider/>
          </li>


        </template>
        <template v-if="column.key === 'externalLabels'">

          <li v-for="(item, index) in record.externalLabels">
            <a-tag :color="tagsColorFunc(index)" >{{ item }}</a-tag>
          </li>


        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑采集池'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除采集池',
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
  getMonitorScrapePoolList,
  deleteMonitorScrapePool,
  setRoleStatus
} from '/@/api/demo/system';

import { useDrawer } from '/@/components/Drawer';
import ProcessDrawer from './poolDrawer.vue';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";

const [registerDrawer, { openDrawer }] = useDrawer();
const [registerTable, { reload }] = useTable({
  title: '采集池列表',
  api: getMonitorScrapePoolList,
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

function showPrometheusMainYaml(ip,record){

  var url= `/monitor/mainYaml?poolName=${record.name}&ip=${ip}`;
  router.push(url)
}

function showPrometheusAlertRuleYaml(ip,record){

  var url= `/monitor/alertRuleYaml?poolName=${record.name}&ip=${ip}`;
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
  deleteMonitorScrapePool(record.id).then(() => {
    createMessage.success("已成功删除采集池");
  })
    .catch(() => {
      createMessage.error('删除采集池失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}

</script>

<style scoped>

</style>
