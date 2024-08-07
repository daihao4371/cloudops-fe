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

        <BasicForm @register="registerForm">


        </BasicForm>

      <a-card title="标签配置区" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
              :bodyStyle="{padding:'0'}">
        <Codemirror
          v-model:value="code"
          :options="cmOptions"
          border
          ref="cmRef"
          height="300"
          width="100%"
        >
        </Codemirror>
        <a-divider></a-divider>
      </a-card>
    </a-col>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import {ref, computed, unref} from 'vue';
import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchema} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {
  createMenu,
  createK8sCluster,
  promqlExprCheck,
  labelK8sNodes,
  updateK8sCluster,
  createMonitorScrapePool,
  createProcess,
  createWorkOrderTemplate,
  getLeafStreeNodes,
  getMenuList,
  updateMenu, updateMonitorOndutyGroup,
  updateMonitorScrapePool,
  updateProcess,
  updateWorkOrderTemplate, getMonitorAlertMangerYamlOne,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import json from "@/views/demo/editor/json/index.vue";

import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type {CmComponentRef} from "codemirror-editor-vue3"
import type {Editor, EditorConfiguration} from "codemirror"


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


const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('k8s集群设置标签');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const {createMessage} = useMessage();


const clusterName = ref('')
const nodeNames = ref([])
const promql = ref('')


const [registerForm, {
  resetFields,
  setFieldsValue,
  validate,
  getFieldsValue,
  updateSchema
}] = useForm({
  labelWidth: 250,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '新增k8s集群'

  clusterName.value = data.clusterName
  nodeNames.value = data.nodeNames


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
    // closeFunc: data.func,
    closeFunc: reloadWeb,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("k8s集群模态框-isUpdate", isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑k8s集群'

    // updateSchema({
    //   field: 'pId',
    //   componentProps: { treeData },
    // });
    // 这里能拿到data
    // 进行表格的赋值
    setFieldsValue({
      ...data.record,
    });

  }
});

function reloadWeb(){
  location.reload()
}

async function handleSubmit() {
  try {


    const values = await validate();
    setDrawerProps({confirmLoading: true});
    //  先拿到code

    var labels = code.value.split("\n")
    var hasErr = false
    var kvs = []
    labels.forEach((val, idx, array) => {
      // val: 当前值
      // idx：当前index
      // array: Array
      console.log("标签每一个行的值",val)
      var oneKv = val.split("=")
      if (oneKv.length!==2){
        createMessage.error(`k,v设置有错误，必须是k=v的格式 ${val}`);
        hasErr= true
        return
      }
      kvs.push(val.trim())

    });
    if (hasErr){
      return
    }

    var data = {}
    data["labels"] = kvs
    data["clusterName"] = clusterName.value
    data["nodeNames"] = nodeNames.value

    // TODO custom api

    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的


    console.log("k8s集群操作要发起请求了 reqData", data)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    labelK8sNodes(data).then(() => {
      createMessage.success(`批量label k8s节点成功`);
    }).catch(() => {
      createMessage.error(`批量label k8s节点成功`);
    })


    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    // reloadWeb()
  }
}
</script>
