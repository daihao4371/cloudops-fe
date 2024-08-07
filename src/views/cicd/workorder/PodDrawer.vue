<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="70%"
    @ok="handleSubmit"
  >

    <a-col :span="24">

      <a-card :bordered=true :headStyle="{color:'#1271d4',fontSize: 20}"
              :bodyStyle="{padding:'0'}">

        <BasicTable @register="registerTable">
          <template #toolbar>
<!--            <a-button type="primary" @click="handleCreate"> 新增cicd工单 </a-button>-->
            <!--        <a-button class="mr-2" type="success" @click="batchEnableSwitch"> 批量开关规则 </a-button>-->
            <!--        <a-button class="mr-2" type="danger" @click="batchDelete"> 批量删除规则 </a-button>-->
          </template>
          <template #bodyCell="{ column, record }">

            <template v-if="column.key === 'name'">

                <a-tag color="#f50" >{{ record.name }}</a-tag>
            </template>

            <template v-if="column.key === 'imageVersion'">


              <a-tag :color="record.imageVersionColor" >{{ record.imageVersion }}</a-tag>

            </template>


            <template v-if="column.key === 'containers'">
              <router-link target="_blank"  :to="{path:'/k8s/podNormalLog',query:{podName:record.name, ns:record.namespace,cluster:   stageObj.cluster}}">
                <a-tag color="orange"> 非tail型日志</a-tag>
              </router-link>

              <li v-for="(item, index) in record.containers">
                <router-link target="_blank"  :to="{path:'/k8s/podTailLog',query:{podName:record.name, ns:record.namespace,container: item,cluster:   stageObj.cluster }}">
                  <a-tag :color="tagsColorFunc(index)" >ws-tail型日志: {{ item }}</a-tag>
                </router-link>
                <br/>


              </li>


            </template>

            <template v-if="column.key === 'enable'">

              <!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
              <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.enable === 1 ? true : false"  @change="changeEnable(record)"  />

            </template>



            <template v-if="column.key === 'status'">

              <a-tag :color="tagsColorFuncStatus( record.status)"  >{{ record.status }}</a-tag>


            </template>


            <template v-if="column.key === 'nodePath'">

              <router-link target="_blank"  :to="{path:'/serviceTree/streeAsync'}">
                <a-tag color="orange">  {{ record.nodePath }}</a-tag>
              </router-link>
            </template>

            <!--        <template v-if="column.key === 'name'">-->

            <!--          <router-link target="_blank" :to="{path:'/monitor/ondutygroup-plan',query:{id: record.id}}">-->
            <!--            <button>  {{ record.name }}</button>-->
            <!--          </router-link>-->
            <!--        </template>-->
            <template v-if="column.key === 'action'">
              <!--          <TableAction-->
              <!--            :actions="[-->
              <!--              {-->
              <!--                icon: 'clarity:note-edit-line',-->
              <!--                onClick: handleEdit.bind(null, record),-->
              <!--                label: '编辑'-->
              <!--              },-->

              <!--              {-->
              <!--                icon: 'ant-design:delete-outlined',-->
              <!--                color: 'error',-->
              <!--                label: '删除',-->
              <!--                popConfirm: {-->
              <!--                  title: '是否确认删除',-->
              <!--                  placement: 'left',-->
              <!--                  confirm: handleDelete.bind(null, record),-->
              <!--                },-->
              <!--              },-->
              <!--            ]"-->
              <!--          />-->
            </template>
          </template>
        </BasicTable>
      </a-card>

<!--      <a-card title="独特配置区" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"-->
<!--              :bodyStyle="{padding:'0'}">-->
<!--        <Codemirror-->
<!--          v-model:value="code"-->
<!--          :options="cmOptions"-->
<!--          border-->
<!--          ref="cmRef"-->
<!--          height="300"-->
<!--          width="100%"-->
<!--        >-->
<!--        </Codemirror>-->
<!--        <a-divider></a-divider>-->
<!--        <a-button type="danger" shape="round" @click="handlePromqlCheck"> 校验promql</a-button>-->
<!--      </a-card>-->
    </a-col>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import {ref, computed, unref} from 'vue';
import {BasicForm, useForm} from '/@/components/Form/index';
import {columns, columnsPod, formSchema, searchFormSchema} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {
  createMenu,
  createCicdDeployWorkOrder,
  promqlExprCheck,
  updateK8sCluster,
  createMonitorScrapePool,
  createProcess,
  createWorkOrderTemplate,
  getLeafStreeNodes,
  getMenuList,
  updateMenu, updateMonitorOndutyGroup,
  updateMonitorScrapePool,
  updateProcess,
  updateWorkOrderTemplate, getMonitorAlertMangerYamlOne, getCicdDeployStagePodList,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import json from "@/views/demo/editor/json/index.vue";

import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type {CmComponentRef} from "codemirror-editor-vue3"
import type {Editor, EditorConfiguration} from "codemirror"
import { BasicTable, useTable, TableAction } from '/@/components/Table';


const tagsColorMapStatus= {
  // "super":"primary danger",
  "Running" :"blue",
  "Pending" :"red",
  "Error" :"purple",

};
const tagsColorFuncStatus = function (index){
  let tmp = tagsColorMapStatus[index]
  if (tmp==null ){
    tmp = "green"
  }
  return tmp
};



const tagsColorFunc = function (index){
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

const code = ref('')
const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
}


function handlePromqlCheck() {

  if (code.value === "") {
    return
  }
  const params = {
    "ql": code.value,
  }
  promqlExprCheck(params).then((res) => {
    // console.log("校验的结果", res)
    if (res.success) {
      createMessage.success(`promql校验成功`);

    } else {
      createMessage.error(`promql校验失败:${res.err}` );
    }


  }).catch((err) => {
    createMessage.error('请求失败', err);
  }).finally(() => {
  });


}


// const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增cicd工单');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);
const stageObj = ref({})


const {createMessage} = useMessage();


const promql = ref('')

// const [registerForm, {
//   resetFields,
//   setFieldsValue,
//   validate,
//   getFieldsValue,
//   updateSchema
// }] = useForm({
//   labelWidth: 250,
//   baseColProps: {span: 24},
//   schemas: formSchema,
//   showActionButtonGroup: false,
// });

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '新增cicd工单'



  // resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
    // closeFunc: data.func,
    closeFunc: reloadWeb,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("cicd工单模态框-isUpdate", isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = `应用${data.record.k8sAppName} 对应的pod列表`
    stageObj.value = data.record
    // updateSchema({
    //   field: 'pId',
    //   componentProps: { treeData },
    // });
    // 这里能拿到data
    // 进行表格的赋值
    // setFieldsValue({
    //   ...data.record,
    // });

  }
});


const [registerTable, { reload,          getSelectRowKeys, }] = useTable({
  title: 'pod状态列表',
  api: getCicdDeployStagePodList,
  beforeFetch: (data) => {
    //
    data["id"] = stageObj.value.id
    return data

  },
  columns: columnsPod,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchema,
  },
  rowKey: 'name',
  // rowKey: 'id',
  // rowSelection: {
  //   type: 'checkbox',
  // },
  useSearchForm: false,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  pagination: { pageSize: 50 },
  // actionColumn: {
  //   width: 280,
  //   title: '操作',
  //   dataIndex: 'action',
  //   // slots: { customRender: 'action' },
  // },

});

function reloadWeb(){
  location.reload()
}

async function handleSubmit() {
  try {


    const values = await validate();
    setDrawerProps({confirmLoading: true});
    // TODO custom api
    var modFunc = createCicdDeployWorkOrder
    // 这里是给前端用的
    var reqData = getFieldsValue()


    console.log("cicd工单操作要发起请求了 reqData", reqData)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    modFunc(reqData).then(() => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch(() => {
      createMessage.error(`${getTitle.value}失败`);
    })


    closeDrawer();
    // reloadWeb()
  } finally {
    setDrawerProps({confirmLoading: false});
  }
}
</script>
