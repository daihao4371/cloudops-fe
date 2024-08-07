<template>
  <div style="background-color: #b1aaaa; padding: 5px">
    <a-row :gutter="4" type="flex">
      <a-col :span="14">
        <a-card title="元信息" :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}"
                :bodyStyle="{padding:'0'}">

          <Description
            class="mt-4"
            :title=DescriptionTitle
            layout="vertical"
            :collapseOptions="{ canExpand: true, helpMessage: '' }"
            :column="6"
            :data="cicdWorkOrderObj"
            :schema="getCicdWorkOrderSchema"
          />

        </a-card>
        <br/>
        <a-row :gutter="4" type="flex">
          <a-col :span="12">
            <a-card title="灰度发布配置" :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}"
                    :bodyStyle="{padding:'0'}">


              <a-textarea v-model:value="cicdWorkOrderObj.canaryStrategyYamlString"
                          class="class-title-r-canary"></a-textarea>

            </a-card>
          </a-col>
          <br/>
          <a-col :span="12">
            <a-card title="工单操作区" :bordered=true :headStyle="{color:'#1271d4',fontSize: 20}"
                    :bodyStyle="{padding:'0'}">
              <a-space :size="20">
                <a-button type="primary" shape="round" @click="handleApprovalPass"> 审批通过
                </a-button>
                <a-button type="danger" shape="round" @click="handleApprovalReject"> 审批拒绝
                </a-button>
                <a-divider/>

                <div class="info-title-r"> 工单审批人列表:</div>
                <li v-for="(item, index) in cicdWorkOrderObj.canApprovalUserNames">
                  <a-tag :color="tagsColorFuncIndex(index)">{{ item }}</a-tag>
                </li>

                <a-divider/>

              </a-space>

              <a-divider/>
              <a-button type="primary" shape="round" @click="handleClose"> 关闭工单</a-button>


              <BasicModal @register="registerModal">
                <BasicForm @register="registerFormOrderAction"/>
              </BasicModal>
            </a-card>
          </a-col>
        </a-row>
        <br/>
        <a-card title="发布阶段展示" :bordered=true :headStyle="{color:'#f90606',fontSize: 20}"
                :bodyStyle="{padding:'0'}">

          <BasicTable @register="registerTable">
            <template #toolbar>
              <!--              <a-button type="primary" @click="handleCreate"> 新增cicd工单</a-button>-->
              <!--        <a-button class="mr-2" type="success" @click="batchEnableSwitch"> 批量开关规则 </a-button>-->
              <!--        <a-button class="mr-2" type="danger" @click="batchDelete"> 批量删除规则 </a-button>-->
            </template>
            <template #bodyCell="{ column, record }">

              <template v-if="column.key === 'name'">
                <router-link target="_blank"
                             :to="{path:'/cicd/orderDetail',query:{id: record.id  }}">

                  <a-tag color="#f50">{{ record.name }}</a-tag>
                </router-link>
              </template>

              <template v-if="column.key === 'indexNum'">


                <a-button type="danger" shape="round" @click="handleShowPod(record)"> 查看pod：
                  {{ record.indexNum }}
                </a-button>


              </template>

              <template v-if="column.key === 'rolloutMessage'">


                <a-tooltip>
                  <template #title>{{ record.rolloutMessage }}</template>
                  <a-tag color="red">{{ record.rolloutMessage }}</a-tag>
                </a-tooltip>


              </template>

              <template v-if="column.key === 'enable'">

                <!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
                <a-switch checked-children="开启" un-checked-children="关闭"
                          :checked="record.enable === 1 ? true : false"
                          @change="changeEnable(record)"/>

              </template>


              <template v-if="column.key === 'statusChinese'">

                <a-tag :color="statusNameFunc(record.statusChinese)"> {{
                    record.statusChinese
                  }}
                </a-tag>


              </template>


              <template v-if="column.key === 'nodePath'">

                <router-link target="_blank" :to="{path:'/serviceTree/streeAsync'}">
                  <a-tag color="orange"> {{ record.nodePath }}</a-tag>
                </router-link>
              </template>

              <template v-if="column.key === 'sendGroupName'">

                <router-link target="_blank" :to="{path:'/monitor/sendgroup'}">
                  <a-button type="danger"> {{ record.sendGroupName }}</a-button>
                </router-link>
              </template>

              <!--        <template v-if="column.key === 'name'">-->

              <!--          <router-link target="_blank" :to="{path:'/monitor/ondutygroup-plan',query:{id: record.id}}">-->
              <!--            <button>  {{ record.name }}</button>-->
              <!--          </router-link>-->
              <!--        </template>-->
              <template v-if="column.key === 'action'">
                <TableAction
                  :actions="[
              {
                ifShow: () => {
                  return record.ifShowButtonCanDeploy === true; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
                icon: 'ant-design:thunderbolt-outlined',
                onClick: handleAction.bind(null, record),
                label: '发布'
              },
                  {
                  ifShow: () => {
                  return record.ifShowButtonCanApproveRollout === true; // 根据业务控制是否显示: enable状态的显示禁用按钮
                  },
                  icon: 'ant-design:play-circle-filled',
                  onClick: handleApproveRollout.bind(null, record),
                  label: '灰度继续'
                  },
              {
                ifShow: () => {
                  return record.ifShowButtonCanRollback === true; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
                icon: 'ant-design:retweet-outlined',
                onClick: handleRollback.bind(null, record),
                label: '回滚'
              },
              {
                ifShow: () => {
                  return record.ifShowButtonCanTest === true; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
                icon: 'ant-design:check-square-filled',
                onClick: handleTestSuccess.bind(null, record),
                label: '测试正常',
                divider: true
              },
              {
                ifShow: () => {
                  return record.ifShowButtonCanTest === true; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
                icon: 'ant-design:close-square-filled',
                onClick: handleTestFailed.bind(null, record),
                label: '测试异常'
              },



            ]"
                />
              </template>
            </template>
          </BasicTable>

        </a-card>
        <br/>
        <!--        <a-card title="工单评论" :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}"-->
        <!--                :bodyStyle="{padding:'0'}">-->
        <!--          <a-divider/>-->
        <!--          <a-timeline mode="alternate">-->
        <!--            <a-timeline-item v-for="item in commentTimeLines" color="green" class="info-title-b">-->
        <!--              {{ item.userNameTime }}-->
        <!--              <a-col>-->
        <!--                <p class="info-title-r">{{ item.comment }}</p>-->

        <!--              </a-col>-->


        <!--            </a-timeline-item>-->
        <!--          </a-timeline>-->
        <!--          <a-divider/>-->
        <!--          <BasicForm @register="register"/>-->
        <!--          <a-button type="danger" shape="round" @click="addComment"> 追加评论</a-button>-->
        <!--        </a-card>-->
      </a-col>
      <a-col :span="10">
        <a-card title="工单进度追踪" :bordered="true">

          <a-timeline>
            <a-timeline-item v-for="item in workOrderInstanceTimelines" :color="item.color">
              {{ item.timeAndNodeName }}
              <a-col>

                <a-row>
                  <a-tag color="red">{{ item.defineUserOrGroup }}</a-tag>
                </a-row>
                <a-tag color="blue">{{ item.actualUser }}</a-tag>
                <p>{{ item.v2 }}</p>
                <!--                <a-textarea v-model:value="item.outPut" class="{{ item.textAreaClass }}" disabled></a-textarea>-->
                <a-textarea v-model:value="item.outPut" :class="item.textAreaClass"
                            :disabled="item.disabled"></a-textarea>

              </a-col>


            </a-timeline-item>
          </a-timeline>

        </a-card>
      </a-col>
    </a-row>

    <PodDrawer @register="registerDrawer" @success="handleSuccess"/>


  </div>
</template>

<script lang="ts" setup>


import {inject, ref} from "vue";
import {Description, DescItem, useDescription} from '@/components/Description';
import {
  actionWorkOrderInstance,
  approvalCicdDeployWorkOrder,
  closeCicdDeployWorkOrder,
  actionCicdDeployStage,
  approveRolloutCicdDeployStage,
  rollBackCicdDeployStage,
  commentWorkOrderInstance, getCicdDeployStageListByOrderId, getCicdWorkOrderOne,
  getWorkOrderInstanceOne,
  getWorkOrderTemplateDetail, updateTestResultCicdDeployStage
} from "@/api/demo/system";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {formSchema} from "@/views/workorder/detail/data";
import {BasicForm, FormActionType, useForm} from '/@/components/Form/index';
import {useModal} from "@/components/Modal";
import {formSchemaOrderAction} from "@/views/workorder/apply/data";
import {BasicModal, useModalInner} from '/@/components/Modal';
import {getUserInfo} from "@/api/sys/user";
import {
  columns,
  columnsStage,
  getCicdWorkOrderSchema,
  searchFormSchema
} from "@/views/cicd/workorder/data";
import {BasicTable, useTable, TableAction} from '/@/components/Table';


import PodDrawer from './PodDrawer.vue';
import {useDrawer} from "@/components/Drawer";

const [registerDrawer, {openDrawer}] = useDrawer();

function handleSuccess() {
}


const [register, {
  setFieldsValue,
  removeSchemaByField,
  updateSchema,
  appendSchemaByField,
  resetFields,
  validate,
  getFieldsValue,
  clearValidate
}] = useForm({
  labelWidth: 100,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,

  actionColOptions: {
    span: 23,
  },

});

const statusNameMap = {
  // "super":"primary danger",
  /*
  		CICD_STAGE_DEPLOY_PENDING: "等待部署",
		CICD_STAGE_DEPLOY_SUCCESS: "部署成功，等待测试",
		CICD_STAGE_TEST_SUCCESS:   "测试成功",
		CICD_STAGE_TEST_FAILED:    "测试失败",
		CICD_STAGE_DEPLOY_FAILED:  "部署失败",
  * */
  "等待部署": "blue",
  "部署成功，等待测试": "yellow",
  "测试成功": "green",
  "已回滚": "purple",
  "测试失败": "red",
  "部署失败": "red",
};
const statusNameFunc = function (index) {
  let tmp = statusNameMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};


const tagsColorMap = {
  "dev": "green",
  "prod": "red",
  "stage": "blue",
  "press": "yellow"
}
const tagsColorFunc = function (index) {
  let tmp = tagsColorMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};

const tagsColorMapIndex = {
  // "super":"primary danger",
  0: "pink",
  1: "orange",
  2: "green",
  3: "cyan",
  4: "purple",
  5: "red",
  "test1": "success",

};
const tagsColorFuncIndex = function (index) {
  let tmp = tagsColorMapIndex[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};


const [registerTable, {reload, getSelectRowKeys,}] = useTable({
  api: getCicdDeployStageListByOrderId,
  beforeFetch: (data) => {
    //
    data["id"] = query.id
    return data

  },
  columns: columnsStage,
  // formConfig: {
  //   labelWidth: 200,
  //   schemas: searchFormSchema,
  // },
  // rowKey: 'id',
  // rowSelection: {
  //   type: 'checkbox',
  // },
  // useSearchForm: true,
  showTableSetting: false,
  bordered: true,
  showIndexColumn: false,
  canResize: true,
  actionColumn: {
    width: 380,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
  },

});


const cicdWorkOrderObj = ref({})
const {query} = useRoute()
const workOrderInstance = ref()
const formElRef = ref<Nullable<FormActionType>>(null);
const {createMessage} = useMessage();

const DescriptionTitle = ref("发布工单元信息")

const commentTimeLines = ref([])

const workOrderInstanceTimelines = ref([

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

const [registerFormOrderAction, formOrderActionMethod] = useForm({
  labelWidth: 100,
  baseColProps: {span: 24},
  schemas: formSchemaOrderAction,
  // showActionButtonGroup: false,

  actionColOptions: {
    span: 23,
  },
  submitButtonOptions: {
    text: '提交',
  },
  submitFunc: handlePostWorkOrderResult,
});
const userInfo = ref()

getUserInfo().then((res) => {
  userInfo.value = res
}).catch(() => {
  createMessage.error('获取用户信息失败');
}).finally(() => {
});

function refreshData() {
  getCicdWorkOrderOne(query.id).then((res) => {
    console.log("请求的结果", res)
    cicdWorkOrderObj.value = res
    workOrderInstance.value = res
    isRelatedWithMe.value = res.isRelatedWithMe
    isMyCreated.value = res.createUserName === userInfo.value.username


    // fApi.value?.disable()
    // formElRef.value?.setProps()
    // 遍历data 的json数据

    // 处理时间轴
    // const actualFlowData = JSON.parse(res.actualFlowData)
    // console.log("时间轴原始数据 actualFlowData", actualFlowData)


    workOrderInstanceTimelines.value = res.timeLineItems
    if (res.comments) {
      commentTimeLines.value = JSON.parse(res.comments)
    }

    console.log("commentTimeLines", commentTimeLines)
    // fApi.value?.set()

  })
}

refreshData()

function handleAction(record: Recordable) {
  actionCicdDeployStage(record.id).then((res) => {
    createMessage.success('阶段发布成功');

    setTimeout(() => {
      location.reload()
    }, 3000);

  }).catch(() => {
    createMessage.error('阶段发布失败');
    setTimeout(() => {
      location.reload()
    }, 3000);

  }).finally(() => {
  });


}


function handleApproveRollout(record: Recordable) {
  approveRolloutCicdDeployStage(record.id).then((res) => {
    createMessage.success('继续rollout成功');

    setTimeout(() => {
      location.reload()
    }, 3000);

  }).catch(() => {
    createMessage.error('继续rollout失败');
    setTimeout(() => {
      location.reload()
    }, 3000);

  }).finally(() => {
  });


}

function handleRollback(record: Recordable) {
  rollBackCicdDeployStage(record.id).then((res) => {
    createMessage.success('阶段回滚成功');

    setTimeout(() => {
      location.reload()
    }, 3000);

  }).catch(() => {
    createMessage.error('阶段回滚失败');
    setTimeout(() => {
      location.reload()
    }, 3000);

  }).finally(() => {
  });


}


function handleTestSuccess(record) {
  handleTest(record, "test_success")
}

function handleTestFailed(record) {
  handleTest(record, "test_failed")
}

function handleTest(record, result) {

  updateTestResultCicdDeployStage(record.id, result).then((res) => {
    createMessage.success('阶段更新测试状态成功');
    setTimeout(() => {
      location.reload()
    }, 3000);
  }).catch((err) => {
    // console.log("阶段更新测试状态失败"+err.response.data.message)
    createMessage.error('阶段更新测试状态失败: ' + err.response.data.message);
    setTimeout(() => {
      location.reload()
    }, 3000);
  }).finally(() => {
  });

}

function handleApproval(action) {
  if (cicdWorkOrderObj.value.canApproval === false) {
    createMessage.error('你不在审批人列表中，无权操作');
    return
  }

  if (cicdWorkOrderObj.value.approvalStatus !== "pendingApproval") {
    createMessage.error('不能重复审批');
    return
  }
  approvalCicdDeployWorkOrder(query.id, action).then((res) => {
    createMessage.success('工单审批成功');
    location.reload()
  }).catch(() => {
    createMessage.error('工单审批失败');
  }).finally(() => {
  });
}

function handleApprovalPass() {
  handleApproval("pass")
  //
  // refreshData()

}

function handleClose() {
  closeCicdDeployWorkOrder(query.id).then((res) => {
    createMessage.success('工单关闭成功');
    location.reload()
  }).catch(() => {
    createMessage.error('工单关闭失败');
  }).finally(() => {
  });
}

function handleApprovalReject() {
  handleApproval("reject")

}

function handleShowPod(record) {
  openDrawer(true, {
    record,
    isUpdate: true,
    func: reload,
  });
}


function handleApprovalForbid(record: Recordable) {

  approvalCicdDeployWorkOrder(query.id, "reject").then((res) => {
    createMessage.success('审批拒绝工单成功');
  }).catch(() => {
    createMessage.error('审批拒绝工单失败');
  }).finally(() => {
  });
  location.reload()

}

function addComment() {
  const reqData = getFieldsValue()
  console.log("reqData", reqData)
  commentWorkOrderInstance(query.id, reqData).then(() => {
    createMessage.success('工单认评论成功');

  }).catch(() => {
    createMessage.error('工单认领评论失败');
  }).finally(() => {
  });
  location.reload()

}


async function handlePostWorkOrderResult() {
  const reqData = formOrderActionMethod.getFieldsValue()
  console.log("更新工单执行结果", reqData)


  actionWorkOrderInstance(query.id, reqData).then(() => {
    createMessage.success('工单认领执行成功');
    closeModal();

  }).catch(() => {
    createMessage.error('工单认领执行失败');
  }).finally(() => {
  });
}


function handleReminder(record: Recordable) {
  console.log("催单", record)
}

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

.class-title-r {
  background: #11213a;
  height: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 30px;
  font: 15px Extra large;
  color: #f6023b;
}

.class-title-r-canary {
  background: #11213a;
  height: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 30px;
  font: 15px Extra large;
  color: #f6023b;
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
