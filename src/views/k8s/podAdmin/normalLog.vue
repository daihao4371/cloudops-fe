<template>
  <div>
    <!--    <a-textarea  v-model:value="outPut" disabled autoSize ></a-textarea>-->
    <a-card title="选择要查看的容器" :bordered=true :headStyle="{color:'#eb7007',fontSize: 20}"
            :bodyStyle="{padding:'20'}">
      <a-select
        placeholder="选择选择要查看的容器"
        v-model:value="podContainerName"
        label-in-value
        style="width: 50%"
        :options="podContainerOptions"
        @change="handleSelectChange"
        showSearch
      >
      </a-select>

      <a-select
        placeholder="选择日志行数"
        v-model:value="logLine"
        style="width: 50%"
        :options="logOptions"
        @change="getLog"
        showSearch
      >
      </a-select>

      <a-button type="danger" shape="round" @click="getLog"> 刷新log</a-button>
      <a-button type="primary" class="my-4" @click="handleDownLoadYamlFile"> 文件流下载 </a-button>

    </a-card>


    <a-card :title="title" :bordered=true :headStyle="{color:'#05803d',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <a-button type="primary" @click="handleCopy"> 点击复制log内容 </a-button>
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
import {
  getK8sPodContainers,
  getMonitorAlertMangerYamlOne,
  getPodContainerNormalLog
} from "@/api/demo/system";
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
const podContainerOptions = ref([]);
const logOptions = [
  {
    value: 5,
    label: '最近5行',
  },
  {
    value: 10,
    label: '最近10行',
  },
  {
    value: 50,
    label: '最近50行',
  },
  {
    value: 100,
    label: '最近100行',
  },
  {
    value: 'all',
    label: '获取全部',
  },



]


const podContainerName = ref()
const logLine = ref(5)
const podContainerListDone = ref(false)

const {query} = useRoute()

const {createMessage} = useMessage();

const  yamlStr = ref(``)
const  code = ref(``)
const  title = ref(``)


function getLog(){
  if (!podContainerName.value){
    createMessage.error('请先选择容器获取容器');
    return
  }

  params["container"] = podContainerName.value.value
  params["logLine"] = logLine.value
  title.value = `集群:${query.cluster} ns:${query.ns} pod:${query.podName} 容器: ${podContainerName.value.value}`

  getPodContainerNormalLog(params).then((res) => {

    code.value = res
  }).catch((err) => {
    createMessage.error('获取容器列表失败', err);
  }).finally(() => {
  });

}

function handleSelectChange(value){
  podContainerName.value = value
  getLog()

}

// function handleSelectChange(value){
//   podContainerName.value = value
//   params["container"] = value.value
//   console.log("logLine",logLine.value)
//   params["logLine"] = logLine.value
//   title.value = `集群:${query.cluster} ns:${query.ns} pod:${query.podName} 容器: ${value.value}`
//
//
//   getPodContainerNormalLog(params).then((res) => {
//
//     code.value = res
//   }).catch((err) => {
//     createMessage.error('获取容器列表失败', err);
//   }).finally(() => {
//   });
//
//
// }


var params = {}
params["cluster"] = query.cluster
params["namespace"] = query.ns
params["podName"] = query.podName

getK8sPodContainers(params).then((res) => {


  podContainerOptions.value = res
  podContainerListDone.value = true
}).catch((err) => {
  createMessage.error('获取容器列表失败', err);
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
  var logFileName = `${query.cluster}_${query.ns}_${query.podName}_${  podContainerName.value.value}.log`

  downloadByData(code.value, logFileName);

}


</script>

<style scoped>

</style>
