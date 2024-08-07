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
      <a-card title="展示Configmap" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
              :bodyStyle="{padding:'0'}">


        <li v-for="(content,key) in cmDataMap" >


          <a-tag color="blue" >{{ key }}</a-tag>

          <a-textarea v-bind:idx="key" v-bind:value="content" placeholder="Basic usage" :rows="20" />
          <a-divider/>
          <br/>


        </li>

      </a-card>


              <BasicForm @register="registerForm">

              </BasicForm>

<!--      <a-card title="镜像配置" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"-->
<!--              :bodyStyle="{padding:'0'}">-->

<!--      </a-card>-->
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
const cmDataMap = ref({})
const myRef = ref([]);
const setRef = (el) => {
  myRef.value.push(el);
};

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
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
const tagsColorFunc = function (index){
  let tmp = tagsColorMapIndex[index]
  if (tmp==null ){
    tmp = "red"
  }
  return tmp
};


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
  showSubmitButton: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = `更新deployment: ${data.record.name} 镜像`

  cluster.value = data.cluster
  namespace.value = data.record.namespace
  name.value = data.record.name

  cmDataMap.value = data.record.cmDataMap

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
    // if (!podContainerName.value){
    //   createMessage.error('请先选择容器');
    //   return
    // }

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
    console.log("myRef",myRef)

    console.log("k8s集群更新deployment 容器的image 操作要发起请求了 reqData", reqData)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    // setDeployOneContainerImage(reqData).then(() => {
    //   createMessage.success(`deploy set-image 成功`);
    // }).catch(() => {
    //   createMessage.error(`deploy set-image 失败`);
    // })


    // closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    // reloadWeb()
  }
}
</script>
