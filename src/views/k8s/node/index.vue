<template>
  <div>



    <a-col :span="24">

      <a-card title="选择k8s集群" :bordered=true :headStyle="{color:'#eb7007',fontSize: 20}"
              :bodyStyle="{padding:'20'}">
        <a-select
          v-model:value="k8sClusterName"
          label-in-value
          style="width: 120px"
          :options="k8sClusterOptions"
          @change="handleSelectChange"
          showSearch
        >
        </a-select>
      </a-card>




    <BasicTable @register="registerTable" v-if="k8sClusterListDone">
      <template #toolbar>
        <a-button type="danger" @click="batchDrain">批量驱逐k8s节点 </a-button>
        <a-button class="mr-2" type="success" @click="batchScheduleSwitch"> 批量改变调度状态 </a-button>
        <a-button class="mr-2" type="danger" @click="batchLabelNodes"> 批量给节点打标签 </a-button>
        <a-button class="mr-2" type="primary" @click="batchTaintNodes"> 批量增删节点污点 </a-button>
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'labels'">

          <a-tooltip>
            <a-tag color="green" > 标签</a-tag>

            <template #title>{{ record.labelsFront }}</template>

          </a-tooltip>

          <a-tooltip>
            <a-tag color="red" > 污点</a-tag>

            <template #title>{{ record.taintsFront }}</template>

          </a-tooltip>


        </template>

        <template v-if="column.key === 'env'">


          <a-tag :color="tagsColorFunc(record.env)" >{{ record.env }}</a-tag>

        </template>

        <template v-if="column.key === 'scheduleEnable'">

          <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.scheduleEnable === true ? true : false"  @change="changeScheduleOne(record)"  />

        </template>



        <template v-if="column.key === 'name'">

          <router-link target="_blank"  :to="{path:'/k8s/nodeDetail',  query:{nodeName: record.name ,clusterName: k8sClusterName.value  }}">
            <a-tag color="green">  {{ record.name }}</a-tag>
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
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '驱逐',
                popConfirm: {
                  title: '是否确认驱逐',
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
    <TaintDrawer @register="registerDrawerTaint" @success="handleSuccess" />
    </a-col>

  </div>
</template>

<script lang="ts" setup>

import { defineComponent , ref } from 'vue';

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {
  deleteProcess,
  deleteRole,
  getProcessList,
  getK8sNodeList,
  getK8sClusterListForSelect,
  drainK8sNodes,

  enableSwitchMonitorRecordRule,
  batchEnableSwitchMonitorRecordRule,
  scheduleEnableSwitchK8sNodes,
  setRoleStatus, getMonitorPrometheusYamlOne
} from '/@/api/demo/system';

import { useDrawer } from '/@/components/Drawer';
import ProcessDrawer from './LabelDrawer.vue';
import TaintDrawer from './TaintDrawer.vue';

import { columns, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";




const k8sClusterOptions = ref([]);
const k8sClusterName = ref()
const k8sClusterListDone = ref(false)

getK8sClusterListForSelect().then((res) => {


  k8sClusterOptions.value = res
  k8sClusterName.value =res[0]
  k8sClusterListDone.value = true
}).catch((err) => {
  createMessage.error('获取集群列表失败', err);
}).finally(() => {
});



const { createMessage } = useMessage();
const [registerDrawer, { openDrawer }] = useDrawer();
const [registerDrawerTaint, { openDrawer: openDrawerTaint }] = useDrawer();
const [registerTable, { reload,          getSelectRowKeys, }] = useTable({
  title: 'k8s节点列表',
  api: getK8sNodeList,
  beforeFetch: (data) => {
    data["cluster"] = k8sClusterName.value.value
    return data

  },
  columns,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchema,
  },
  rowKey: 'name',
  rowSelection: {
    type: 'checkbox',
  },
  defSort: {
    field: 'podNum',
    order: 'descend',
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
  },

});

function handleSelectChange(value){
  k8sClusterName.value = value
  reload()
}


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




function batchDrain(){
  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  var data = {}
  data["clusterName"] = k8sClusterName.value.value
  data["nodeNames"] = keys
  drainK8sNodes(data).then((res) => {
    console.log("驱逐的结果",res)
    createMessage.success(`已成功驱逐k8s节点 ${res}`);
    // location.reload()
  })
    .catch(() => {
      createMessage.error('驱逐k8s节点失败');
    })
    .finally(() => {
    });


}

function batchScheduleSwitch() {
  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  var data = {}
  data["clusterName"] = k8sClusterName.value.value
  data["nodeNames"] = keys
  changeScheduleFunc(data)

}

function batchLabelNodes() {

  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择节点');
    return
  }


  openDrawer(true, {
    isUpdate: true,
    func: reload,
    clusterName: k8sClusterName.value.value,
    nodeNames: keys,

  });

}

function batchTaintNodes() {

  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择节点');
    return
  }


  openDrawerTaint(true, {
    isUpdate: true,
    func: reload,
    clusterName: k8sClusterName.value.value,
    nodeNames: keys,

  });

}






function changeScheduleFunc(data){
  scheduleEnableSwitchK8sNodes(data).then(() => {
    createMessage.success(`已成功改变调度k8s节点`);
    // location.reload()
    reload()
  })
    .catch(() => {
      createMessage.error('改变调度k8s节点失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
}


function changeScheduleOne(record){
  // console.log("changeEnable",record)

  var data = {}
  data["clusterName"] = k8sClusterName.value.value
  data["nodeNames"] = [record.name]
  changeScheduleFunc(data)

  // reload();

  // record.enable=2

}

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
    func: reload,
  });
}

function handleEdit(record: Recordable) {

  openDrawer(true, {
    record,
    isUpdate: true,
    func: reload,
  });
}

function handleDelete(record: Recordable) {


  var data = {}
  data["clusterName"] = k8sClusterName.value.value
  data["nodeNames"] = [record.name]
  drainK8sNodes(data).then((res) => {
    console.log("驱逐的结果",res)
    createMessage.success(`已成功驱逐k8s节点 ${res}`);
    // location.reload()
  })
    .catch(() => {
      createMessage.error('驱逐k8s节点失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}

</script>

<style scoped>

</style>
