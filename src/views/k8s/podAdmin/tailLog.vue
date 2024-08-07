<template>
  <PageWrapper :title="title">
    <div class="flex">

      <div class="w-1/3 bg-white p-4">



<!--        <div class="flex items-center">-->
<!--          <span class="text-lg font-medium mr-4"> 选择选择要查看的容器: </span>-->
<!--          <a-select-->
<!--            placeholder="选择选择要查看的容器"-->
<!--            v-model:value="podContainerName"-->
<!--            label-in-value-->
<!--            style="width: 50%"-->
<!--            :options="podContainerOptions"-->
<!--            @change="handleSelectChange"-->
<!--            showSearch-->
<!--          >-->
<!--          </a-select>-->
<!--        </div>-->
        <div class="flex items-center">
          <span class="text-lg font-medium mr-4"> 连接状态: </span>
          <a-tag :color="getTagColor">{{ status }}</a-tag>
        </div>
        <hr class="my-4" />

        <div class="flex">
          <a-textarea v-model:value="tailLogWsServerAddr" disabled>
            <template #addonBefore> ws服务地址 </template>
          </a-textarea>
          <a-button :type="getIsOpen ? 'danger' : 'primary'" @click="tailLog">
            {{ getIsOpen ? '停止查看' : '查看日志' }}
          </a-button>
        </div>

      </div>

      <div class="w-2/3 bg-white ml-4 p-4">
        <a-button type="success"  @click="clearLog">日志清屏</a-button>
        <span class="text-lg font-medium mr-4"> 容器日志: </span>
        <hr class="my-4" />
        <div >
          <div  ref="logContainerF"
               style="height: 450px; overflow-y: scroll; background: #333; color: #f30505; padding: 10px;">
            <div ref="logContainerC"/>
          </div>
        </div>


      </div>
    </div>
  </PageWrapper>


</template>

<script lang="ts" setup>

import { PageWrapper } from '/@/components/Page';
import {computed, reactive, ref, watch, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {getK8sPodContainers, getPodContainerNormalLog} from "@/api/demo/system";
import {useWebSocket} from "@vueuse/core";
import { formatToDateTime } from '/@/utils/dateUtil';

var apiAddr = ""
// console.log("import.meta.env.VITE_BACKEND_ADDR",import.meta.env.VITE_BACKEND_ADDR)
// const apiAddr = import.meta.env.VITE_BACKEND_ADDR

// data, send, close, open
/* 为了避免出现报错 我们把 import 环境变量这里塞入一个函数中做 ，避免和import 一起了
#0 15.94  ERROR  Unexpected token (Note that you need plugins to import files that are not JavaScript)
#0 15.94 file: /app/src/views/k8s/podAdmin/tailLog.vue?vue&type=script&setup=true&lang.ts:29:48
#0 15.94 27:
#0 15.94 28:
#0 15.94 29: console.log("import.meta.env.VITE_BACKEND_ADDR",import.meta.env.VITE_BACKEND_ADDR)
#0 15.94                                                     ^
#0 15.94 30: const apiAddr = import.meta.env.VITE_BACKEND_ADDR
#0 15.94
#0 15.94
#0 15.94  ERROR  error during build:
#0 15.94 RollupError: Unexpected token (Note that you need plugins to import files that are not JavaScript)
#0 15.94     at error (file:///app/node_modules/.pnpm/rollup@3.26.1/node_modules/rollup/dist/es/shared/node-entry.js:2245:30)
#0 15.94     at Module.error (file:///app/node_modules/.pnpm/rollup@3.26.1/node_modules/rollup/dist/es/shared/node-entry.js:13572:16)
#0 15.94     at Module.tryParse (file:///app/node_modules/.pnpm/rollup@3.26.1/node_modules/rollup/dist/es/shared/node-entry.js:14298:25)
#0 15.94     at Module.setSource (file:///app/node_modules/.pnpm/rollup@3.26.1/node_modules/rollup/dist/es/shared/node-entry.js:13899:39)
#0 15.94     at ModuleLoader.addModuleSource (file:///app/node_modules/.pnpm/rollup@3.26.1/node_modules/rollup/dist/es/shared/node-entry.js:24424:20)
#0 15.94     at processTicksAndRejections (node:internal/process/task_queues:96:5)
#0 15.94
#0 15.99  ELIFECYCLE  Command failed with exit code 1.

* */



const logContainerF =ref()
const logContainerC =ref()
const {query} = useRoute()
const {createMessage} = useMessage();
const tailLogWsServerAddr = ref('')
// tailLogWsServerAddr.value =   `ws://${apiAddr}/noAuth/getPodContainerTailLog?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}`
// tailLogWsServerAddr.value =   `ws://${location.host}/noAuth/getPodContainerTailLog?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}`
tailLogWsServerAddr.value =   `ws://${location.host}/basic-api/noAuth/getPodContainerTailLog?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}`

console.log("本容器的wslog地址",tailLogWsServerAddr.value)
const podContainerOptions = ref([]);
const podContainerName = ref()
function handleSelectChange(value){
  podContainerName.value = value

}
const title = ref('')
title.value = `websocket查看日志 集群:${query.cluster} ns:${query.ns} pod:${query.podName} 容器:${query.container}  `


var params = {}
params["cluster"] = query.cluster
params["namespace"] = query.ns
params["podName"] = query.podName

getK8sPodContainers(params).then((res) => {
  podContainerOptions.value = res

}).catch((err) => {
  createMessage.error('获取容器列表失败', err);
}).finally(() => {
});


function clearLog(){
  // console.log(" logContainerC.value ", logContainerC.value )
  logContainerC.value.innerHTML = ''
  // document.getElementById("logContainerC").innerHTML = ""
}

function tailLog(){


  if (getIsOpen.value) {
    close();
  } else {
    open();
  }
}

// ws 变量

const { status, data, send, close, open } = useWebSocket(tailLogWsServerAddr.value, {
  autoReconnect: false,
  immediate: false,
  heartbeat: { interval: 10000 },
});


watch(
  () => data.value,
  (newValue, oldValue) => {
    // console.log('rds-chart中监听node 变化新的值',newValue,)
    // console.log('rds-chart中监听node 变化旧的值',oldValue, )
    // const res = JSON.parse(data.value);



    // 接收服务端的实时日志并添加到HTML页面中
    // console.log("接收到的日志",data.value,typeof data.value)
    if (data.value ==="WS_HEARTBEAT_RESP_PONG"){
      return
    }
    console.log("接收到的日志logContainer", data.value)
    // logContainerC.value.append(data.value+ '\n')
    logContainerC.value.innerHTML+=data.value+ '<br>'
    // logContainerC.value.
    logContainerF.value.scrollTop = logContainerF.value.scrollHeight
    // 接收服务端的实时日志并添加到HTML页面中
    // $('#log-container div').append(event.data + '<br>')
    // 滚动条滚动到最低部
    // $('#log-container').scrollTop($('#log-container div').height() - $('#log-container').height())

  }
)

const getIsOpen = computed(() => status.value === 'OPEN');
const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red'));



</script>

<style scoped>

</style>
