<template>

  <div>
<!--    <a-textarea  v-model:value="outPut" disabled autoSize ></a-textarea>-->

    <a-card :title="title" :bordered=true :headStyle="{color:'#05803d',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <a-button type="primary" @click="handleCopy"> 点击复制yaml内容 </a-button>
      <a-button type="success" class="my-4" @click="handleDownLoadYamlFile"> 文件流下载 </a-button>

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
import {getK8sConfigmapYamlOne} from "@/api/demo/system";
import {useMessage} from "@/hooks/web/useMessage";
import {ref, unref} from "vue";

import "codemirror/mode/javascript/javascript.js"
import "codemirror/mode/yaml/yaml.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type { CmComponentRef } from "codemirror-editor-vue3"
import type { Editor, EditorConfiguration } from "codemirror"
import {useCopyToClipboard} from "@/hooks/web/useCopyToClipboard";
import {downloadByData} from "@/utils/file/download";


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
var params = {}
params["cluster"] = query.cluster
params["namespace"] = query.ns
params["name"] = query.name

getK8sConfigmapYamlOne(params).then((res) => {


  yamlStr.value = res
  code.value = res
  title.value = `查看cm的yaml 集群:${query.cluster} ns:${query.ns} pod:${query.name}  `

}).catch((err) => {
  createMessage.error('获取configmap yaml失败', err);
  console.log('获取configmap yaml失败', err);
}).finally(() => {
});

const valueRef = ref('');
function handleCopy() {

  clipboardRef.value = yamlStr.value
  if (unref(copiedRef)) {
    createMessage.warning('copy success！');
  }
}

function handleDownLoadYamlFile() {
  var yamlFileName = `${query.cluster}_${query.ns}_${query.name}_configmap.yaml`

  downloadByData(code.value, yamlFileName);

}

</script>

<style scoped>
.CodeMirror {
  font-family: Arial, monospace;
  font-size: 200px;
}

</style>
