<template>
  <div>

    <a-card title="请选择k8s集群和namespace" :bordered=true
            :headStyle="{color:'#1271d4',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <a-tag color="#f50" >选择集群和ns</a-tag>
      <a-cascader v-model:value="clusterNsValue" :options="nsOptions" size="large"  style="width: 50%;color: #c62b2b;" placeholder="集群和ns级联选择" @change="nsChange" :show-search="{ nsFilter }"/>
    </a-card>



    <BasicTable @register="registerTable" v-if="clusterNsValue.length >0">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增service </a-button>
        <a-button type="danger" @click="handleBatchDelete">批量删除Service </a-button>
        <!--        <a-button class="mr-2" type="success" @click="batchScale"> 批量扩缩容 </a-button>-->
        <!--        <a-button class="mr-2" type="danger" @click="batchLabelNodes"> 批量给节点打标签 </a-button>-->
        <!--        <a-button class="mr-2" type="primary" @click="batchTaintNodes"> 批量增删节点污点 </a-button>-->
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'enable'">

          <!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
          <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.enable === 1 ? true : false"  @change="changeEnable(record)"  />


        </template>

        <template v-if="column.key === 'name'">

          <router-link target="_blank"  :to="{path:'/k8s/serviceYaml',query:{name:record.name, ns:record.namespace,cluster:  clusterNsValue[0] }}">

            <a-tag color="#f50" >{{ record.name }}</a-tag>
          </router-link>
        </template>

        <template v-if="column.key === 'status'">


          <!--          <a-tag :color="tagsColorFunc(record.status)" >{{ record.status }}</a-tag>-->
          <a-tag :color="tagsColorFuncStatus( record.status)"  >{{ record.status }}</a-tag>

          <li v-for="(item, index) in record.containers" >
          <li v-for="(itemShell, indexShell) in shellList">


            <router-link target="_blank"  :to="{path:'/k8s/podWebShell',query:{podName:record.name, ns:record.namespace,container: item,cluster:  clusterNsValue[0],shell:itemShell }}">
              <a-tag :color="tagsColorFunc2(index)" >webshell执行命令: {{ item  }} shell: {{ itemShell }} </a-tag>
            </router-link>
            <br/>

          </li>
          </li>


        </template>


        <template v-if="column.key === 'ip'">


          <!--          <a-tag :color="tagsColorFunc(record.ip)" >{{ record.ip }}</a-tag>-->
          <a-tag color="green" >{{ record.ip }}</a-tag>

        </template>


        <template v-if="column.key === 'cpuRequestInfo'">

          <div   :style="{ color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}"> {{ record.cpuRequestInfo }}</div>

        </template>




        <template v-if="column.key === 'logs'">


          <a-divider/>
          <router-link target="_blank"  :to="{path:'/k8s/podTailLog',query:{podName:record.name, ns:record.namespace,cluster:  clusterNsValue[0] }}">
            <a-tag color="red"> ws-tail型日志</a-tag>
          </router-link>
        </template>


        <template v-if="column.key === 'containerImages'">
          <!--          <router-link target="_blank"  :to="{path:'/k8s/podNormalLog',query:{podName:record.name, ns:record.namespace,cluster:  clusterNsValue[0] }}">-->
          <!--            <a-tag color="orange"> 非tail型日志</a-tag>-->
          <!--          </router-link>-->

          <li v-for="(item, index) in record.containerImages">
            <!--            <router-link target="_blank"  :to="{path:'/k8s/podTailLog',query:{podName:record.name, ns:record.namespace,container: item,cluster:  clusterNsValue[0] }}">-->
            <a-tag :color="tagsColorFunc(index)" >{{ item }}</a-tag>
            <br/>


          </li>


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
                label: '编辑内容'
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

    <EditDrawer @register="registerDrawer" @success="handleSuccess" />
    <!--    <ScaleModal @register="registerModal" @success="handleSuccess"  />-->


  </div>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {
  k8sBatchDeleteService,
  getClusterNamespacesForCascader,
  getK8sServiceListByNs,
} from "@/api/demo/system";
import {useMessage} from "@/hooks/web/useMessage";
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {columnsService , searchFormSchemaPods} from "./data";
import EditDrawer from "./EditDrawer.vue";
import {useDrawer} from "@/components/Drawer";
import ScaleModal  from "./ScaleModal.vue"
import {useModal} from "@/components/Modal";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}


const clusterNsValue = ref([])
const nsOptions = ref([] )
const firstTableLoad = ref(true)
const { createMessage } = useMessage();


getClusterNamespacesForCascader().then((res) => {

  nsOptions.value =res
  // console.log("getClusterNamespacesForCascader",res)

}).catch((err) => {
  createMessage.error('alertmanager集群池', err);
  // console.log('alertmanager集群池', err);
}).finally(() => {
});



const shellList =[
  "bash",
  "sh"
]



const nsFilter = (inputValue: string, path: Option[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};


const [registerTable, { reload,          getSelectRowKeys, getSelectRows,}] = useTable({
  title: 'Configmap列表',
  api: getK8sServiceListByNs,
  beforeFetch: (data) => {

    data["cluster"] = clusterNsValue.value[0]
    data["namespace"] = clusterNsValue.value[1]
    firstTableLoad.value = false
    return data
  },
  columns: columnsService,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchemaPods,
  },
  // rowKey: 'name',
  rowSelection: {
    type: 'checkbox',
  },
  defSort: {
    field: 'name',
    order: 'descend',
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  actionColumn: {
    width: 280,
    title: '操作',
    dataIndex: 'action',
    //   // slots: { customRender: 'action' },
  },

});

const [registerDrawer, { openDrawer }] = useDrawer();


const [registerModal, {openModal}] = useModal();

function nsChange(value, selectedOptions){
  console.log("集群-ns选择器",value,selectedOptions)
  if (!firstTableLoad.value){
    reload()
  }


}

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
const tagsColorMapIndex = {
  // "super":"primary danger",
  0 :"pink",
  1 :"orange",
  2 :"green",
  3 :"cyan",
  4 :"purple",
  5 :"red",
  "test1":"success",

};

const tagsColorMapIndex2 = {
  // "super":"primary danger",
  0 :"purple",
  2 :"blue",
  1 :"green",
  3 :"cyan",
  4 :"purple",
  5 :"red",
  "test1":"success",

};

const tagsColorMapStatus= {
  // "super":"primary danger",
  "Running" :"blue",
  "Pending" :"red",
  "Error" :"purple",

};
const tagsColorFunc = function (index){
  let tmp = tagsColorMapIndex[index]
  if (tmp==null ){
    tmp = "red"
  }
  return tmp
};

const tagsColorFunc2 = function (index){
  let tmp = tagsColorMapIndex2[index]
  if (tmp==null ){
    tmp = "green"
  }
  return tmp
};

const tagsColorFuncStatus = function (index){
  let tmp = tagsColorMapStatus[index]
  if (tmp==null ){
    tmp = "green"
  }
  return tmp
};



const tagsColorFuncBool = function (b:boolean){
  if (b){
    return "green"
  }
  return "red"
};




function handleCreate() {
  openDrawer(true, {
    isUpdate: false,
    cluster:  clusterNsValue.value[0],
    func: reload,
  });
}

function handleSuccess() {
  reload();
}

function handleView(record){

  openDrawer(true, {
    record,
    isUpdate: true,
    func: reload,
    cluster:  clusterNsValue.value[0],
    namespace:  clusterNsValue.value[1],

  });

}
function handleEdit(record){
  openDrawer(true, {
    record,
    isUpdate: true,
    func: reload,
    cluster:  clusterNsValue.value[0],
  });
}



function handleDelete(record: Recordable){

  var reqData = {}

  reqData["cluster"] =  clusterNsValue.value[0]
  reqData["items"] = []
  reqData["items"].push({"name":record.name,"namespace":record.namespace})
  //
  k8sBatchDeleteService(reqData).then(() => {
    createMessage.success(`已成功删除k8s-Service`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('删除k8s-Service失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
}

function handleBatchDelete() {
  var rows = getSelectRows()
  if (rows.length ===0 ) {
    createMessage.error('请选择Service');
    return
  }
  console.log("rows",rows)
  var reqData = {}

  reqData["cluster"] =  clusterNsValue.value[0]
  reqData["items"] = []

  rows.forEach((val, idx, array) => {
    // val: 当前值
    // idx：当前index
    // array: Array
    reqData["items"].push({"name":val.name,"namespace":val.namespace})

  });


  // reqData["items"].push({"name":record.name,"namespace":record.namespace})
  console.log("批量删除的reqData",reqData)
  k8sBatchDeleteService(reqData).then(() => {
    createMessage.success(`已成功删除k8s-Service`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('删除k8s-Service失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}




const enableCheckFunc = function (enable:number){
  if ( enable ===1){
    return true
  }
  return false
};


function changeEnable(){}


</script>

<style scoped>

</style>
