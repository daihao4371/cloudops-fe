<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
<!--        <a-button type="primary" @click="handleCreate"> 新增k8s实例 </a-button>-->
        <router-link target="_blank"  :to="{path:'/k8sApplication/instanceEditor',query:{}}">

          <a-button  type="primary">新增k8s实例 </a-button>
        </router-link>

        <a-button type="danger" @click="handleBatchDelete">批量删除实例 </a-button>
        <a-button type="success" @click="handleBatchRestart">批量重启实例 </a-button>
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

          <router-link target="_blank"  :to="{path:'/k8sApplication/instanceLogExec',query:{cluster:  record.cluster , namespace: record.namespace, application:record.k8sAppName, instance:record.name  }}">

            <a-tag color="#f50" >{{ record.name }}</a-tag>
          </router-link>
        </template>

        <template v-if="column.key === 'nodePath'">

          <router-link target="_blank"  :to="{path:'/实例Tree/streeAsync'}">
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


  </div>
</template>

<script lang="ts" setup>

import { defineComponent , ref } from 'vue';

import { BasicTable, useTable, TableAction } from '@/components/Table';
import {
  deleteProcess,
  deleteRole,
  getProcessList,
  getK8sInstanceList,
  deleteK8sAppOne,

  enableSwitchMonitorRecordRule,
  batchEnableSwitchMonitorRecordRule,
  setRoleStatus,
  batchDeleteK8sInstance,
  batchRestartK8sInstance,
} from '@/api/demo/system';

import { useDrawer } from '@/components/Drawer';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";
import {useRoute} from "vue-router";


const {query} = useRoute()

const { createMessage } = useMessage();
const [registerDrawer, { openDrawer }] = useDrawer();




const [registerTable, { reload,          getSelectRowKeys,getSelectRows }] = useTable({
  title: 'k8s实例列表',
  api: getK8sInstanceList,
  beforeFetch: (data) => {
    data["appId"] = query.appId
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
    createMessage.success(`已批量开关k8s实例`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('批量开关k8s实例失败');
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
    createMessage.success(`已批量删除k8s实例`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('批量删除k8s实例失败');
    })
    .finally(() => {
    });

}



function changeEnable(record){
  // console.log("changeEnable",record)

  enableSwitchMonitorRecordRule(record.id).then(() => {
    createMessage.success(`已成功开关k8s实例`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('开关k8s实例失败');
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


  router.push("/k8sApplication/instanceEditor?instanceId="+record.id);
}


function handleCopy(record: Recordable) {

  var url = `/k8sApplication/instanceEditor?instanceId=${record.id}&copy=true`

  router.push(url);
}

function handleDelete(record: Recordable) {

  var reqData = {}

  reqData["ids"] = []
  reqData["ids"].push(record.id)
  batchDeleteK8sInstance(reqData).then(() => {
    createMessage.success(`已成功删除k8s实例`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('删除k8s实例失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}


function handleBatchDelete() {
  var rows = getSelectRows()
  if (rows.length ===0 ) {
    createMessage.error('请选择实例');
    return
  }
  var reqData = {}

  reqData["ids"] = []

  rows.forEach((val, idx, array) => {
    // val: 当前值
    // idx：当前index
    // array: Array
    reqData["ids"].push(val.id)
  })


  console.log("批量删除的reqData",reqData)
  batchDeleteK8sInstance(reqData).then(() => {
    createMessage.success(`已成功删除k8s-实例`);
    // location.reload()
  })
    .catch(() => {
      createMessage.error('删除k8s-实例失败');
    })
    .finally(() => {
    });

}

function handleBatchRestart() {
  var rows = getSelectRows()
  if (rows.length ===0 ) {
    createMessage.error('请选择实例');
    return
  }
  var reqData = {}

  reqData["ids"] = []

  rows.forEach((val, idx, array) => {
    // val: 当前值
    // idx：当前index
    // array: Array
    reqData["ids"].push(val.id)
  })


  console.log("批量重启的reqData",reqData)
  batchRestartK8sInstance(reqData).then(() => {
    createMessage.success(`已成功批量重启k8s-实例`);
    // location.reload()
  })
    .catch(() => {
      createMessage.error('批量重启k8s-实例失败');
    })
    .finally(() => {
    });

}



</script>

<style scoped>

</style>
