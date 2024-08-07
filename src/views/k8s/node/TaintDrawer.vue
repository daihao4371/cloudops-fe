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
      <a-card title="taintYaml配置区 yaml配置需要去掉前面的空格" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
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
        <a-button type="danger" shape="round" @click="handleTaintYamlCheck"> 校验taintYaml</a-button>
      </a-card>
    </a-col>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import {ref, computed, unref} from 'vue';
import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchemaTaint} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {
  createMenu,
  taintsK8sNodes,
  taintYamlCheck,
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


function handleTaintYamlCheck() {

  if (code.value === "") {
    return
  }
  const params = {
    "taintYaml": code.value,
  }
  taintYamlCheck(params).then((res) => {
    // console.log("校验的结果", res)
    if (res.success) {
      createMessage.success(`taintYaml校验成功`);

    } else {
      createMessage.error(`taintYaml校验失败:${res.err}` );
    }


  }).catch((err) => {
    createMessage.error('请求失败', err);
  }).finally(() => {
  });


}

const clusterName = ref('')
const nodeNames = ref([])
const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('批量给节点打污点');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const {createMessage} = useMessage();


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
  schemas: formSchemaTaint,
  showActionButtonGroup: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '批量给节点打污点'
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
  if (unref(isUpdate)) {
    getTitle.value = '批量给节点打污点'

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
    // TODO custom api

    // 发起请求
    // 判断一下menus的类型

    var data =  getFieldsValue()
    data["taintYamlString"] = code.value
    data["clusterName"] = clusterName.value
    data["nodeNames"] = nodeNames.value

    taintsK8sNodes(data).then(() => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch(() => {
      createMessage.error(`${getTitle.value}失败`);
    })


    console.log(values);
    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    // reloadWeb()
  }
}
</script>
