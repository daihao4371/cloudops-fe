<template>

  <div>
<!--    <a-textarea  v-model:value="outPut" disabled autoSize ></a-textarea>-->

    <a-card :title="title" :bordered=true :headStyle="{color:'#05803d',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <a-button type="primary" @click="handleCopy"> 点击复制yaml内容 </a-button>
    <Codemirror
      v-model:value="code"
      :options="cmOptions"
      border
      ref="cmRef"
      height="85%"
      width="100%"
    >
    </Codemirror>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

import {useRoute} from "vue-router";
import {getMonitorPrometheusAlertYamlOne} from "@/api/demo/system";
import {useMessage} from "@/hooks/web/useMessage";
import {ref, unref} from "vue";

import "codemirror/mode/javascript/javascript.js"
import "codemirror/mode/yaml/yaml.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type { CmComponentRef } from "codemirror-editor-vue3"
import type { Editor, EditorConfiguration } from "codemirror"
import {useCopyToClipboard} from "@/hooks/web/useCopyToClipboard";


const { clipboardRef, copiedRef } = useCopyToClipboard();
const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  // mode: "text/javascript",
  mode: "text/x-yaml",
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
}


const {query} = useRoute()

const {createMessage} = useMessage();

const  yamlStr = ref(``)
const  code = ref(``)
const  title = ref(``)

getMonitorPrometheusAlertYamlOne(query.ip).then((res) => {


  yamlStr.value = res
  code.value = res
  title.value = `告警触发器${query.poolName} 实例ip: ${query.ip}`

}).catch((err) => {
  createMessage.error('获取告警触发器失败', err);
  console.log('获取告警触发器失败', err);
}).finally(() => {
});

const valueRef = ref('');
function handleCopy() {

  clipboardRef.value = yamlStr.value
  if (unref(copiedRef)) {
    createMessage.warning('copy success！');
  }
}

</script>

<style scoped>
.CodeMirror {
  font-family: Arial, monospace;
  font-size: 200px;
}

</style>
