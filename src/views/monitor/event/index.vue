<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button class="mr-2" type="success" @click="batchEventSilence"> 批量屏蔽告警 </a-button>
      </template>
      <template #bodyCell="{ column, record }">




        <template v-if="column.key === 'status'">


          <a-tag :color="tagsColorFunc(record.status)" >{{ record.status }}</a-tag>

        </template>

        <template v-if="column.key === 'sendGroupName'">

          <router-link target="_blank"  :to="{path:'/monitor/sendgroup'}">
            <a-button type="danger">  {{ record.sendGroupName }}</a-button>
          </router-link>
        </template>


        <template v-if="column.key === 'alertRuleName'">

          <router-link target="_blank"  :to="{path:'/monitor/alertrule'}">
            <a-button type="success">  {{ record.alertRuleName }}</a-button>
          </router-link>
        </template>

        <template v-if="column.key === 'onDutyGroupName'">

          <router-link target="_blank"  :to="{path:'/monitor/onDutyGroup'}">
            <a-tag color="blue">  {{ record.onDutyGroupName }}</a-tag>
          </router-link>
        </template>

        <!--        <template v-if="column.key === 'name'">-->

<!--          <router-link target="_blank" :to="{path:'/monitor/ondutygroup-plan',query:{id: record.id}}">-->
<!--            <button>  {{ record.name }}</button>-->
<!--          </router-link>-->
<!--        </template>-->
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleSilence.bind(null, record),
                label: '屏蔽',
                ifShow: () => {
                  return record.status !== 'silenced'; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
              },

              {
                icon: 'clarity:note-edit-line',
                onClick: handleUnSilence.bind(null, record),
                label: '解除屏蔽',
                ifShow: () => {
                  return record.status === 'silenced'; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
              },
                            {
                icon: 'clarity:close-line',
                onClick: handleRenLing.bind(null, record),
                label: '认领',
                ifShow: () => {
                  return record.status !== 'renlinged'; // 根据业务控制是否显示: enable状态的显示禁用按钮
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
  getMonitorAlertEventList,
  deleteMonitorSendGroup,
  eventAlertRenLing,
  eventAlertUnSilence,
  setRoleStatus
} from '/@/api/demo/system';

import { useDrawer } from '/@/components/Drawer';
import ProcessDrawer from './silenceDrawer.vue';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";

const [registerDrawer, { openDrawer }] = useDrawer();
const [registerTable, { reload,getSelectRowKeys }] = useTable({
  title: '告警事件列表',
  api: getMonitorAlertEventList,
  columns,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchema,
  },
  rowKey: 'id',
  rowSelection: {
    type: 'checkbox',
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

const tagsColorMap1 = {
  // "super":"primary danger",
  0 :"pink",
  1 :"orange",
  2 :"green",
  3 :"cyan",
  4 :"purple",
  5 :"red",
  "test1":"success",

};

const tagsColorFunc1 = function (index){
  let tmp = tagsColorMap[index]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};
const tagsColorMap = {
  "resolved":"green" ,
  "firing" :"red" ,
  "silenced": "blue",
  "upgraded": "yellow"
}
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



function handleSilence(record: Recordable) {

  openDrawer(true, {
    record,
    isUpdate: true,
    batch: false,
  });
}

function batchEventSilence(record: Recordable){
  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  openDrawer(true, {
    record,
    isUpdate: true,
    ids: keys,
    batch: true,
  });
}


function handleRenLing(record: Recordable) {
  const { createMessage } = useMessage();
  eventAlertRenLing(record.id).then(() => {
    createMessage.success(`已成功认领告警事件`);
    reload();
  })
    .catch(() => {
      createMessage.error('认领告警事件失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}

function handleUnSilence(record: Recordable) {
  const { createMessage } = useMessage();
  eventAlertUnSilence(record.id).then(() => {
    createMessage.success(`已成功解除屏蔽告警事件`);
    reload();
  })
    .catch(() => {
      createMessage.error('解除屏蔽告警事件失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}


function handleDelete(record: Recordable) {
  const { createMessage } = useMessage();
  deleteMonitorSendGroup(record.id).then(() => {
    createMessage.success(`已成功删除告警事件`);
    reload();
  })
    .catch(() => {
      createMessage.error('删除告警事件失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}

</script>

<style scoped>

</style>
