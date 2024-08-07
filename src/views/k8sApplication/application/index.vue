<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
<!--        <a-button type="primary" @click="handleCreate"> 新增k8s应用 </a-button>-->
        <router-link target="_blank"  :to="{path:'/k8sApplication/editor',query:{}}">

          <a-tag  color="green" >新增k8s应用 </a-tag>
        </router-link>

<!--        <a-button class="mr-2" type="success" @click="batchEnableSwitch"> 批量开关规则 </a-button>-->
<!--        <a-button class="mr-2" type="danger" @click="batchDelete"> 批量删除规则 </a-button>-->
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'lastProbeSuccess'">


          <a-tooltip>
            <template #title>{{  record.lastProbeErrorMsg }}</template>
            <a-tag :color="tagsColorFuncBool(record.lastProbeSuccess)" >{{ record.lastProbeSuccess }}</a-tag>
          </a-tooltip>



        </template>

        <template v-if="column.key === 'env'">


          <a-tag :color="tagsColorFunc(record.env)" >{{ record.env }}</a-tag>

        </template>

        <template v-if="column.key === 'enable'">

<!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
          <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.enable === 1 ? true : false"  @change="changeEnable(record)"  />

        </template>



        <template v-if="column.key === 'name'">

          <router-link target="_blank"  :to="{path:'/k8sApplication/instance',query:{appId:record.id }}">

            <a-tag color="#f50" >{{ record.name }}</a-tag>
          </router-link>
        </template>

        <template v-if="column.key === 'nodePath'">

          <router-link target="_blank"  :to="{path:'/serviceTree/streeAsync'}">
            <a-tag color="orange">  {{ record.nodePath }}</a-tag>
          </router-link>
        </template>

        <template v-if="column.key === 'sendGroupName'">

          <router-link target="_blank"  :to="{path:'/monitor/sendgroup'}">
            <a-button type="danger">  {{ record.sendGroupName }}</a-button>
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
                onClick: handleEdit.bind(null, record),
                label: '编辑'
              },
              {
                icon: 'clarity:star-line',
                onClick: handleCopy.bind(null, record),
                label: '复制'
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

import { BasicTable, useTable, TableAction } from '@/components/Table';
import {
  deleteProcess,
  deleteRole,
  getProcessList,
  getK8sAppList,
  deleteK8sAppOne,

  enableSwitchMonitorRecordRule,
  batchEnableSwitchMonitorRecordRule,
  setRoleStatus
} from '@/api/demo/system';

import { useDrawer } from '@/components/Drawer';
import ProcessDrawer from './ClusterDrawer.vue';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";
import {useRoute} from "vue-router";


const {query} = useRoute()

const { createMessage } = useMessage();
const [registerDrawer, { openDrawer }] = useDrawer();




const [registerTable, { reload,          getSelectRowKeys, }] = useTable({
  title: 'k8s应用列表',
  api: getK8sAppList,
  beforeFetch: (data) => {
    data["cluster"] = query.cluster
    data["projectId"] = query.projectId
    return data
  },
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



// const tagsColorMap = {
//   "warning":"green" ,
//   "critical" :"red" ,
//   "test1": "success"
// }
// const tagsColorFunc = function (index){
//   let tmp = tagsColorMap[index]
//   if (tmp==null ){
//     tmp = "blue"
//   }
//   return tmp
// };



const tagsColorFunc1 = function (index){
  let tmp = tagsColorMap[index]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};
const tagsColorMap = {
  "dev":"green" ,
  "prod" :"red" ,
  "stage": "blue",
  "press": "yellow"
}
const tagsColorFunc = function (index){
  let tmp = tagsColorMap[index]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};

const tagsColorFuncBool = function (b:boolean){
  if (b){
    return "green"
  }
  return "red"
};


const enableCheckFunc = function (enable:number){
  if ( enable ===1){
    return true
  }
  return false
};

function batchEnableSwitch() {
  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  const data ={}
  data["ids"] =keys
  batchEnableSwitchMonitorRecordRule(data).then(() => {
    createMessage.success(`已批量开关k8s应用`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('批量开关k8s应用失败');
    })
    .finally(() => {
    });

}

function batchDelete() {

  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  const data ={}
  data["ids"] =keys
  data["ids"] = getSelectRowKeys()
  deleteK8sAppOne(data).then(() => {
    createMessage.success(`已批量删除k8s应用`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('批量删除k8s应用失败');
    })
    .finally(() => {
    });

}



function changeEnable(record){
  // console.log("changeEnable",record)

  enableSwitchMonitorRecordRule(record.id).then(() => {
    createMessage.success(`已成功开关k8s应用`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('开关k8s应用失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  // reload();

  // record.enable=2

}


function handleSuccess() {
  reload();
}

function handleCreate() {
  openDrawer(true, {
    isUpdate: false,
    func: reload,
  });
}

function handleEdit(record: Recordable) {


  router.push("/k8sApplication/editor?appId="+record.id);
}


function handleCopy(record: Recordable) {

  var url = `/k8sApplication/editor?appId=${record.id}&copy=true`

  router.push(url);
}

function handleDelete(record: Recordable) {

  deleteK8sAppOne(record.id).then(() => {
    createMessage.success(`已成功删除k8s应用`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('删除k8s应用失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}

</script>

<style scoped>

</style>
