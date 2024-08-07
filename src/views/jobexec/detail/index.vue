<template>
  <div style="background-color: #b1aaaa; padding: 5px">
    <a-row :gutter="4" type="flex">
      <a-col :span="14">

        <a-card title="任务操作区" :bordered=true :headStyle="{color:'#1271d4',fontSize: 20}"
                :bodyStyle="{padding:'0'}">

          <a-space :size="size">

            <a-button type="success" shape="round" @click="handleStart" v-if="vifActionStart" > 任务开始</a-button>
            <a-button type="primary" shape="round" @click="handlePause"  v-if="vifActionPause"> 任务暂停 </a-button>
            <a-button type="warning" shape="round" @click="handleResume" v-if="vifActionResume"> 任务继续 </a-button>

          </a-space>
          <a-divider/>
          <a-space :size="size">
            <a-button type="danger" shape="round" @click="handleKill" v-if="vifActionKill"> 杀死任务</a-button>
            <a-button type="warning" shape="round" @click="handleStop" v-if="vifActionStop"> 任务停止</a-button>
          </a-space>
          <a-divider/>
        </a-card>
        <br/>


        <a-card title="任务详情" :bordered=true :headStyle="{color:'#f9033e',fontSize: 50}"
                :bodyStyle="{padding:'5'}">
          <a-space :size="20">

            <div class="info-title-j"> 名称:</div>
            <div class="info-title-r"> {{ jobTaskObjTitle }}</div>
            <div class="info-title-j"> 状态:</div>
            <div class="info-title-r"> {{ jobTaskObjStatus }}</div>

            <div class="info-title-g"> 绑定的树节点:</div>
            <div class="info-title-r"> {{ jobTaskObjNodePath }}</div>


            <div class="info-title-g"> 机器数量:</div>
            <div class="info-title-r"> {{ jobTaskObjTotalNum }}</div>
          </a-space>
          <a-divider/>
          <a-space :size="20">
            <div class="info-title-j"> 执行账号:</div>
            <div class="info-title-r"> {{ jobTaskObjAccount }}</div>


            <div class="info-title-g"> 超时时间:</div>
            <div class="info-title-r"> {{ jobTaskObjExecTimeoutSeconds }}</div>
            <div class="info-title-j"> 并发数量:</div>
            <div class="info-title-g"> {{ jobTaskObjBatchSize }}</div>
            <div class="info-title-j"> 错误策略:</div>
            <div class="info-title-r"> {{ jobTaskObjOnErrorStrategy }}</div>

          </a-space>
          <a-divider/>

          <a-tag  color="green" >脚本内容</a-tag>
          <a-textarea  v-model:value="jobTaskObjCode" disabled autoSize ></a-textarea>


          <a-divider/>

          <a-tag  color="blue" >机器列表</a-tag>
          <a-textarea  v-model:value="jobTaskObjHosts" disabled autoSize ></a-textarea>
          <result-drawer></result-drawer>


        </a-card>


      </a-col>


      <a-col :span="10">
        <a-card title="任务进度追踪" :bordered="true">

          <a-timeline>
            <a-timeline-item v-for="item in timeLineItems" :color="item.color">
              {{ item.timeAndNodeName }}
              <a-col>

                <a-row>
                  <a-tag color="red">{{ item.defineUserOrGroup }}</a-tag>
                </a-row>
                <a-textarea v-model:value="item.outPut" disabled></a-textarea>


              </a-col>


            </a-timeline-item>
          </a-timeline>

        </a-card>
      </a-col>
    </a-row>

    <a-divider/>
    <a-row :gutter="4" type="flex">
      <a-card title="单机任务结果查询" :bordered=true :headStyle="{color:'#eb7007',fontSize: 20}"
              :bodyStyle="{padding:'0'}">



        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">

            <template v-if="column.key === 'status'">

              <a-tag :color="statusColorFunc(record.status)"  :title="statusChinessFunc(record.status)">  {{ statusChinessFunc(record.status) }} </a-tag>

            </template>
            <template v-if="column.key === 'action'">
              <TableAction
                :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: catStdout.bind(null, record),
                label: '查看stdout'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                onClick: catSterr.bind(null, record),
                label: '查看stderr',
              },
            ]"
              />
            </template>
          </template>
        </BasicTable>

        <ResultDrawer @register="registerDrawer" />

      </a-card>
    </a-row>

  </div>
</template>

<script lang="ts" setup>


import {ref} from "vue";
import {
  actionJobTaskOne, getJobExecResultByJobId,
  getJobTaskOne,
} from "@/api/demo/system";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {useModal} from "@/components/Modal";
import {formSchemaOrderAction} from "@/views/workorder/apply/data";
import {BasicModal, useModalInner} from '/@/components/Modal';
import {getUserInfo} from "@/api/sys/user";
import {columns ,searchFormSchema} from  "./data";
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import ResultDrawer from "./resultDrawer.vue";
import {useDrawer} from "@/components/Drawer";
const [registerDrawer, { openDrawer }] = useDrawer();

const statusColorMap = {
  // "super":"primary danger",
  "running": "blue",
  "failed": "red",
  "pendingAction": "cyan",
  "success": "green",
};

const statusChinessMap = {
  // "super":"primary danger",
  "running": "执行中",
  "failed": "失败",
  "killed": "被杀死",
  "success": "成功",
};


const statusChinessFunc = function (index) {
  let tmp = statusChinessMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};

const statusColorFunc = function (index) {
  let tmp = statusColorMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};

const {query} = useRoute()
const {createMessage} = useMessage();

const title = ref("")

const timeLineItems = ref([

  {
    "color": "green",
    "content": "2015-09-01 审批节点 候选人",
    "v1": "实际执行人 xxx ",
    "v2": "审批通过 或执行结果 ",
    "v3": "结果输出",
  },
  {
    "color": "green",
    "content": "2015-09-01 审批节点 候选人",
    "v1": "实际执行人",
    "v2": "审批通过 或执行结果 ",
    "v3": "结果输出",
  },
  {
    "color": "red",
    "content": "2015-09-01 审批节点 候选人",
    "v1": "实际执行人",
    "v2": "审批通过 或执行结果 ",
    "v3": "结果输出",
  },
  {
    "color": "red",
    "content": "2015-09-01 审批节点 候选人",
    "v1": "实际执行人",
    "v2": "审批通过 或执行结果 ",
    "v3": "结果输出",
  },
])
const size = ref(20)
const [registerModal, {openModal, closeModal}] = useModal();
const isRelatedWithMe = ref(false)
const isMyCreated = ref(false)


const userInfo = ref()
const jobTaskObj = ref()
const jobTaskObjAccount = ref('')
const jobTaskObjTitle = ref('')
const jobTaskObjBatchSize = ref('')
const jobTaskObjExecTimeoutSeconds = ref('')
const jobTaskObjOnErrorStrategy = ref('')
const jobTaskObjStatus = ref('')
const jobTaskObjTreeNodeId = ref('')
const jobTaskObjNodePath = ref('')
const jobTaskObjTotalNum = ref('')
const jobTaskObjHosts = ref('')
const jobTaskObjCode = ref('')
const vifActionStart = ref(false)
const vifActionPause = ref(false)
const vifActionResume = ref(false)
const vifActionKill = ref(false)
const vifActionStop = ref(false)


getUserInfo().then((res) => {
  userInfo.value = res
}).catch(() => {
  createMessage.error('获取用户信息失败');
}).finally(() => {
});

getJobTaskOne(query.taskId).then((res) => {
  jobTaskObj.value = res
  jobTaskObjAccount.value = res.account
  jobTaskObjTitle.value = res.title
  jobTaskObjBatchSize.value = res.batchSize
  jobTaskObjExecTimeoutSeconds.value = res.execTimeoutSeconds
  jobTaskObjOnErrorStrategy.value = res.onErrorStrategy
  jobTaskObjStatus.value = res.status
  jobTaskObjNodePath.value = res.nodePath
  jobTaskObjTreeNodeId.value = res.treeNodeId
  jobTaskObjTotalNum.value = res.totalNum
  timeLineItems.value = res.timeLineItems
  const ips = JSON.parse(res.hostsRaw)
  ips.forEach((val, idx, array) => {
    jobTaskObjHosts.value = `${val}\n${jobTaskObjHosts.value}`
  })

  jobTaskObjCode.value = res.scriptContent


  const status = res.status
  if (status === 'pending'){
    vifActionStart.value = true
  }
  if (status === 'running'){
    vifActionStart.value = false
    vifActionPause.value = true
    vifActionKill.value = true
    vifActionStop.value = true
  }

  if (status === 'paused'){
    vifActionResume.value = true
    vifActionStop.value = true
  }
  if (status === 'killed'){
    vifActionStart.value = false
    vifActionPause.value = false
    vifActionResume.value = false
    vifActionKill.value = false
    vifActionStop.value = false
  }

  if (status === 'killing'){
    vifActionStart.value = false
    vifActionPause.value = false
    vifActionResume.value = false
    vifActionKill.value = false
    vifActionStop.value = false
  }

  if (status === 'finished'){
    vifActionStart.value = false
    vifActionPause.value = false
    vifActionResume.value = false
    vifActionKill.value = false
    vifActionStop.value = false
  }



  console.log("请求的结果", res)


}).catch((err) => {
  createMessage.error('获取工单模板失败', err);
  console.log('获取工单模板失败', err);
}).finally(() => {
});


function catStdout(record){
  console.log("catStdout.record",record)
  openDrawer(true, {
    record,
    title: `查看任务:${jobTaskObj.value.title} 机器:${record.hostIp} 标准输出`,
    outPut: record.stdout,
  });
}

function catSterr(record){
  console.log("catSterr.record",record)
  openDrawer(true, {
    record,
    title: `查看任务:${jobTaskObj.value.title} 机器:${record.hostIp} 标准错误`,
    outPut: record.stderr,
  });
}

function handleStart() {
  actionJobTaskOne(query.taskId, "start").then((res) => {
    createMessage.success('任务开始 成功');
  }).catch(() => {
    createMessage.error('任务开始 失败');
  }).finally(() => {
  });
  // location.reload()
}



function handlePause() {
  actionJobTaskOne(query.taskId, "pause").then((res) => {
    createMessage.success('任务暂停 成功');
  }).catch(() => {
    createMessage.error('任务暂停 失败');
  }).finally(() => {
  });
  // location.reload()
}

function handleResume() {
  actionJobTaskOne(query.taskId, "resume").then((res) => {
    createMessage.success('任务回复执行 成功');
  }).catch(() => {
    createMessage.error('任务回复执行 失败');
  }).finally(() => {
  });
  // location.reload()
}


function handleKill() {
  actionJobTaskOne(query.taskId, "kill").then((res) => {
    createMessage.success('任务kill 成功');
  }).catch(() => {
    createMessage.error('任务kill 失败');
  }).finally(() => {
  });
  // location.reload()
}


function handleStop() {
  actionJobTaskOne(query.taskId, "stop").then((res) => {
    createMessage.success('任务停止 成功');
  }).catch(() => {
    createMessage.error('任务停止 失败');
  }).finally(() => {
  });
  // location.reload()
}





const [registerTable, { reload }] = useTable({
  title: '任务机器结果',
  api: getJobExecResultByJobId,
  beforeFetch: (data) => {
    //
    data["jobId"] = query.taskId
    console.log("getJobExecResultByJobId.beforeFetch",data)
    return data

  },
  canResize: false,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: true,
  actionColumn: {
    width: 280,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
  },
});


</script>

<style scoped>
.info-title-g {

  font: 20px Extra large;
  color: green;
}

.info-title-j {

  font: 20px Extra large;
  color: #fd5701;
}


.info-title-r {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #881934;
}

.info-title-b {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #0474fd;
}

.info-title-z {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #aa04fd;
}
</style>
