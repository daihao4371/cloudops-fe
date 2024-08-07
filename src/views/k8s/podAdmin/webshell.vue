<template>
  <PageWrapper :title="title">
    <div class="flex">

      <div class="w-1/3 bg-white p-4">

        <div class="flex items-center">
          <span class="text-lg font-medium mr-4"> 连接状态: </span>
          <a-tag :color="getTagColor">{{ status }}</a-tag>
        </div>
        <hr class="my-4" />

        <div class="flex">
          <a-textarea v-model:value="podWebShellWsServerAddr" disabled>
            <template #addonBefore> ws服务地址 </template>
          </a-textarea>
          <a-button :type="getIsOpen ? 'danger' : 'primary'" @click="execShell">
            {{ getIsOpen ? '停止shell' : '开始shell' }}
          </a-button>
        </div>

      </div>

      <div class="w-2/3 bg-white ml-4 p-4">
        <span class="text-lg font-medium mr-4"> 容器webShell: </span>
        <hr class="my-4" />
        <div >
          <div id="terminal"></div>
        </div>


      </div>
    </div>
  </PageWrapper>



</template>

<script>


import { Terminal } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { AttachAddon } from '@xterm/addon-attach'
import 'xterm/css/xterm.css'

import { PageWrapper } from '/@/components/Page';
import {computed, onBeforeUnmount, onMounted, ref} from "vue"
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";

export default {
  name: 'web-terminal',
  components: {
    PageWrapper,
  },

  setup(){
    // 初始化ws连接 这时候就已经开始连接了
    const {createMessage} = useMessage();
    const {query} = useRoute()
    const title = ref('')
    const status = ref('')
    title.value = `websocket查看日志 集群:${query.cluster} ns:${query.ns} pod:${query.podName} 容器:${query.container}  `

    const getIsOpen = computed(() => status.value === 'OPEN');
    const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red'));

    // const apiAddr = import.meta.env.VITE_BACKEND_ADDR

    const podWebShellWsServerAddr = ref(``)
    // podWebShellWsServerAddr.value = `ws://localhost:9080/webshell?podName=nginx-bigdevops-8649cc8bb7-4b4v7&namespace=default&containerName=nginx`
    // podWebShellWsServerAddr.value =   `ws://${apiAddr}/noAuth/getPodContainerWebShell?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}&shell=${query.shell}`
    // podWebShellWsServerAddr.value =   `ws://${location.host}/noAuth/getPodContainerWebShell?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}&shell=${query.shell}`
    podWebShellWsServerAddr.value =   `ws://${location.host}/basic-api/noAuth/getPodContainerWebShell?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}&shell=${query.shell}`
    // podWebShellWsServerAddr.value =   `ws://${apiAddr}/noAuth/getPodContainerWebShell?cluster=${query.cluster}&namespace=${query.ns}&podName=${query.podName}&container=${query.container}`

    let ws = new WebSocket(podWebShellWsServerAddr.value)
    ws.onopen = ()=>{
      console.log(Date(), 'onopen')
      status.value = 'OPEN'
      heartCheck.start()
    }
    ws.onclose = ()=>{
      console.log(Date(), 'onclose')
      status.value = 'CLOSE'
      heartCheck.stop()
    }
    ws.onerror = ()=> {
      status.value = 'ERROR'
      console.log(Date(), 'onerror')
    }
    function execShell(){
      if (getIsOpen.value) {
        ws.close();
        document.getElementById('terminal').innerHTML = ''
      } else {
        location.reload();
      }
    }

    //心跳检查
    const heartCheck = {
      timeout: 5000, // 5s发一次心跳
      //关闭心跳检查
      stop: function() {
        clearInterval(this.timer)
      },
      //开启心跳检查
      start: function() {
        this.timer = setInterval(function() {
          if (ws !== null && ws.readyState === 1) {
            ws.send('ping')
          }
        }, this.timeout)
      }
    }
    //页面挂载后初始化terminal功能
    onMounted(()=>{
      // 找到Terminal dom
      let webTerminal = document.getElementById('terminal')
      //  初始化Terminal
      let terminal = new Terminal(
        {
          lineHeight: 1.2,
          fontSize: 20,
          fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
          theme: {
            background: '#181d28',
            foreground: "#79e71f", //字体

          },
          // 光标闪烁
          cursorBlink: true,
          cursorStyle: 'underline',
          scrollback: 100,
          tabStopWidth: 4,
        }
      )

      //  new 一个 fit的插件
      let fitAddon = new FitAddon()
      //  加载fit插件
      terminal.loadAddon(fitAddon)
      terminal.open(webTerminal)
      try {
        fitAddon.fit()
      } catch (e) {
        console.error(e)
      }

      //加载attach插件，通过ws实现web终端与远程终端进行实时交互
      terminal.loadAddon(new AttachAddon(ws))

      //增加滚轮事件监听，用于调整web终端字体大小
      webTerminal.addEventListener("wheel", (e) => {
        if (e.ctrlKey) {
          e.preventDefault()
          if (e.deltaY < 0) {
            terminal.options.fontSize = ++self.fontSize
          } else {
            terminal.options.fontSize = --self.fontSize
          }
          try { fitAddon.fit() } catch (e) {/**/}
          if (ws !== null && ws.readyState === 1) {
            ws.send(`resize:${terminal.rows}:${terminal.cols}`)
          }
        }

        //为window添加窗口大小调整事件，用于实时调整终端窗口
        window.addEventListener('resize', () => {
          webTerminal.style.height = document.documentElement.clientHeight + 'px'
          try { fitAddon.fit() } catch (e) {/**/}
          if (ws !== null && ws.readyState === 1) {
            ws.send(`resize:${terminal.rows}:${terminal.cols}`)
          }
        })
      })

      // 销毁的方法
      onBeforeUnmount(()=>{
        if (ws !== null) {
          ws.close()
        }
        if (terminal !== null) {
          terminal.dispose()
        }
      })
    })

    return {
      title,
      status,
      getIsOpen,
      getTagColor,
      podWebShellWsServerAddr,
      execShell,

    }

  }
}
</script>

<style>

</style>
