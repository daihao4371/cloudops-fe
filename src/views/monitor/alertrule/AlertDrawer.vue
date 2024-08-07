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

      <a-card title="告警规则表单字段" :bordered=true :headStyle="{color:'#1271d4',fontSize: 20}"
              :bodyStyle="{padding:'0'}">
        <BasicForm @register="registerForm">


        </BasicForm>
      </a-card>

      <a-card title="promql校验区" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
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
        <a-button type="danger" shape="round" @click="handlePromqlCheck"> 校验promql</a-button>
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
  createMonitorAlertRule,
  promqlExprCheck,
  updateMonitorAlertRule,
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
const getTitle = ref('新增告警规则');
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
  labelWidth: 200,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '新增告警规则'



  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
    // closeFunc: data.func,
    closeFunc: reloadWeb,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("告警规则模态框-isUpdate", isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑告警规则'
    code.value = data.record.expr

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
    if (code.value===""){
      createMessage.error(`请填写告警promql`);
      return
    }

    const values = await validate();
    setDrawerProps({confirmLoading: true});
    // TODO custom api
    var modFunc = createMonitorAlertRule
    if (unref(isUpdate)) {
      modFunc = updateMonitorAlertRule
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData = getFieldsValue()

    reqData['expr'] = code.value

    console.log("告警规则操作要发起请求了 reqData", reqData)

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


    console.log(values);
    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    reloadWeb()
  }
}
</script>
