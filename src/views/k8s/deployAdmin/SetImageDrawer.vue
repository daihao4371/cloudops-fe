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
      <a-card title="选择容器" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
              :bodyStyle="{padding:'0'}">
      <a-select
        placeholder="选择选择要更新镜像的容器"
        v-model:value="podContainerName"
        style="width: 50%"
        :options="podContainerOptions"
        showSearch
      >
      </a-select>
      </a-card>




      <a-card title="镜像配置" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
              :bodyStyle="{padding:'0'}">
        <BasicForm @register="registerForm">

        </BasicForm>
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
  setDeployOneContainerImage,
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

const podContainerOptions = ref([]);
const podContainerName = ref()
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


const cluster = ref('')
const namespace = ref('')
const name = ref('')
const promql = ref('')


const [registerForm, {
  resetFields,
  setFieldsValue,
  validate,
  getFieldsValue,
  updateSchema
}] = useForm({
  labelWidth: 100,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = `更新deployment: ${data.record.name} 镜像`

  cluster.value = data.cluster
  namespace.value = data.record.namespace
  name.value = data.record.name



  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
    // closeFunc: data.func,
    closeFunc: reloadWeb,
  });


  podContainerOptions.value = data.record.containerImageOptions


});

function reloadWeb(){
  location.reload()
}

async function handleSubmit() {
  try {
    if (!podContainerName.value){
      createMessage.error('请先选择容器');
      return
    }

    const values = await validate();
    setDrawerProps({confirmLoading: true});

    var reqData = getFieldsValue()

    reqData["cluster"] = cluster.value
    reqData["namespace"] = namespace.value
    reqData["name"] = name.value
    reqData["container"] = podContainerName.value

    // TODO custom api

    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的


    console.log("k8s集群更新deployment 容器的image 操作要发起请求了 reqData", reqData)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    setDeployOneContainerImage(reqData).then(() => {
      createMessage.success(`deploy set-image 成功`);
    }).catch(() => {
      createMessage.error(`deploy set-image 失败`);
    })


    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    // reloadWeb()
  }
}
</script>
