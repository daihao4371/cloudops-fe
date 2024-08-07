<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">

    </BasicForm>

    <div>
      <a-divider/>
      <a-tag color="#55acee"> 选择语言</a-tag>
      <a-select
        ref="select"
        v-model:value="lang"
        style="width: 120px"
      >
        <a-select-option value="shell">shell</a-select-option>
        <a-select-option value="python">python</a-select-option>
        <a-select-option value="json">json</a-select-option>
        <a-select-option value="yaml">yaml</a-select-option>
      </a-select>
      <a-divider/>
      <a-tag color="#55acee"> 编辑代码</a-tag>
      <Codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        ref="cmRef"
        height="1000"
      >
      </Codemirror>

    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchema} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {defineComponent, reactive, ref, unref,onMounted, onUnmounted , toRefs} from "vue";




import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type { CmComponentRef } from "codemirror-editor-vue3"
import type { Editor, EditorConfiguration } from "codemirror"


import {
  createJobExecScript,
  createMenu, createProcess, createWorkOrderTemplate, updateJobExecScript,
  updateMenu, updateProcess, updateWorkOrderTemplate,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增脚本模板');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const code = ref(`import * from abc`)
const lang = ref(`python`)

const {createMessage} = useMessage();



const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  lineNumbers: true, // Show line number
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
  smartIndent: true, // Smart indent
  indentUnit: 4, // The smart indent unit is 2 spaces in length
}

const onChange = (val: string, cm: Editor) => {
  console.log(val)
  console.log(cm.getValue())
}

const onInput = (val: string) => {
  console.log(val)
}

const onReady = (cm: Editor) => {
  console.log(cm.focus())
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 1000)

  setTimeout(() => {
    cmRef.value?.resize(300, 200)
  }, 2000)

  setTimeout(() => {
    cmRef.value?.cminstance.isClean()
  }, 3000)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})



function useEditedCode() {
  console.log("@@@blur@@@code:", code.value, lang.value);
}


const [registerForm, {resetFields, setFieldsValue, validate, getFieldsValue}] = useForm({
  labelWidth: 90,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});


const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '新增脚本模板'


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("脚本模板模态框-isUpdate", isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑脚本模板'
    // 这里能拿到data
    // 进行表格的赋值
    code.value = data.record.code
    lang.value = data.record.lang


    setFieldsValue({
      ...data.record,
    });
  }
});


async function handleSubmit() {
  try {
    const values = await validate();
    setDrawerProps({confirmLoading: true});
    // TODO custom api
    var menuFunc = createJobExecScript
    if (unref(isUpdate)) {
      menuFunc = updateJobExecScript
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData = getFieldsValue()

    reqData["lang"] = lang.value
    reqData["code"] = code.value
    console.log("脚本模板操作要发起请求了 reqData", reqData)
    console.log("脚本模板操作要发起请求了 code", code.value)
    console.log("脚本模板操作要发起请求了 lang", lang.value)


    menuFunc(reqData).then(() => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch(() => {
      createMessage.error(`${getTitle.value}失败`);
    })


    console.log(values);
    closeDrawer();

    emit('success');
    code.value = ``
  } finally {
    setDrawerProps({confirmLoading: false});
  }
}
</script>
