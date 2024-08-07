<template >
  <div style="background-color: #b1aaaa; padding: 5px">
    <a-row :gutter="4" type="flex">
      <a-col :span="14">

        <a-card title="工单操作区"   :bordered=true :headStyle="{color:'#1271d4',fontSize: 20}" :bodyStyle="{padding:'0'}">
            <a-space  :size="size">
              <a-button type="primary"  shape="round" @click="handleApproval"  v-if="isRelatedWithMe"> 审批工单</a-button>
              <a-button type="primary"  shape="round" @click="handleApprovalForbid" v-if="isRelatedWithMe"> 审批拒绝</a-button>
              <a-button type="primary"  shape="round" @click="handleAction" v-if="isRelatedWithMe"> 认领执行工单</a-button>
              <a-button type="primary"  shape="round" @click="handleReminder" v-if="isMyCreated"> 催单</a-button>
            </a-space>
          <BasicModal @register="registerModal" >
            <BasicForm @register="registerFormOrderAction"/>
          </BasicModal>
        </a-card>
        <br />
        <a-card :title="title"   :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}" :bodyStyle="{padding:'0'}">

          <VFormCreate
            :form-config="formConfig"
            v-model:fApi="fApi"
            ref="formElRef"
          >
          </VFormCreate>


        </a-card>

        <a-card title="工单评论"   :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}" :bodyStyle="{padding:'0'}">
          <a-divider/>
          <a-timeline mode="alternate">
            <a-timeline-item  v-for="item in commentTimeLines"  color="green" class="info-title-b"> {{ item.userNameTime  }}
              <a-col>
                <p class="info-title-r">{{ item.comment }}</p>

              </a-col>


            </a-timeline-item>
          </a-timeline>
          <a-divider/>
          <BasicForm @register="register"/>
          <a-button type="danger"  shape="round" @click="addComment" > 追加评论</a-button>
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card title="工单进度追踪" :bordered="true">

          <a-timeline>
              <a-timeline-item  v-for="item in workOrderInstanceTimelines"  :color="item.color"> {{ item.timeAndNodeName  }}
                <a-col>

                  <a-row>
                  <a-tag  color="red">{{ item.defineUserOrGroup}}</a-tag>
                  </a-row>
                  <a-tag  color="blue">{{ item.actualUser}}</a-tag>
                  <p>{{ item.v2 }}</p>
                  <a-textarea  v-model:value="item.outPut" disabled></a-textarea>


                </a-col>


              </a-timeline-item>
          </a-timeline>

        </a-card>
      </a-col>
    </a-row>



  </div>
</template>

<script lang="ts" setup>




import {ref} from "vue";
import {IFormConfig} from "@/views/form-design/typings/v-form-component";
import {IVFormMethods} from "@/views/form-design/hooks/useVFormMethods";
import VFormCreate from '@/views/form-design/components/VFormCreate/index.vue';
import {
  actionWorkOrderInstance, approvalWorkOrderInstance,
  commentWorkOrderInstance,
  getWorkOrderInstanceOne,
  getWorkOrderTemplateDetail
} from "@/api/demo/system";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {formSchema} from "@/views/workorder/detail/data";
import {BasicForm,FormActionType, useForm} from '/@/components/Form/index';
import {useModal} from "@/components/Modal";
import {formSchemaOrderAction} from "@/views/workorder/apply/data";
import {BasicModal, useModalInner} from '/@/components/Modal';
import {getUserInfo} from "@/api/sys/user";

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



const formConfig = ref<IFormConfig>({
  // 表单配置
  schemas: [],
  layout: 'horizontal',
  labelLayout: 'flex',
  labelWidth: 100,
  labelCol: {},
  wrapperCol: {},
  currentItem: {
    component: '',
    componentProps: {},
  },
  activeKey: 1,
});
const fApi = ref<null | IVFormMethods>(null);
const { query } = useRoute()
const  workOrderInstance = ref()
const formElRef = ref<Nullable<FormActionType>>(null);
const { createMessage } = useMessage();

const title = ref("")

const commentTimeLines = ref([])

const workOrderInstanceTimelines = ref([

  {
    "color":"green",
    "content":"2015-09-01 审批节点 候选人",
    "v1":"实际执行人 xxx ",
    "v2":"审批通过 或执行结果 ",
    "v3":"结果输出",
  },
  {
    "color":"green",
    "content":"2015-09-01 审批节点 候选人",
    "v1":"实际执行人",
    "v2":"审批通过 或执行结果 ",
    "v3":"结果输出",
  },
  {
    "color":"red",
    "content":"2015-09-01 审批节点 候选人",
    "v1":"实际执行人",
    "v2":"审批通过 或执行结果 ",
    "v3":"结果输出",
  },
  {
    "color":"red",
    "content":"2015-09-01 审批节点 候选人",
    "v1":"实际执行人",
    "v2":"审批通过 或执行结果 ",
    "v3":"结果输出",
  },
])
const size=ref(20)
const [registerModal, {openModal, closeModal}] = useModal();
const isRelatedWithMe =ref(false)
const isMyCreated =ref(false)

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

getWorkOrderInstanceOne(query.orderId).then(( res) => {
  console.log("请求的结果",res)
  workOrderInstance.value = res
  isRelatedWithMe.value = res.isRelatedWithMe
  isMyCreated.value  = res.createUserName === userInfo.value.username
  const jsonConfig = JSON.parse(res.template.formDesign.formConfig)
  jsonConfig['disabled'] = true
  formConfig.value = jsonConfig
  console.log("formConfig结果",formConfig.value)
  title.value = `工单元信息：${workOrderInstance.value.name}   ||   创建人：${ workOrderInstance.value.createUserName}   ||   当前状态: ${ workOrderInstance.value.statusChinese} `
  const  actualApiJsonData =  JSON.parse(res.actualApiJsonData)


  console.log("formElRef对象",formElRef.value)
  // fApi.value?.disable()
  // formElRef.value?.setProps()
  // 遍历data 的json数据
  for (var val in actualApiJsonData) {
    console.log("回填用户真实的表单json数据",val,actualApiJsonData[val]);
    formElRef.value?.setFormModel(val,actualApiJsonData[val])
  }

  // 处理时间轴
  const actualFlowData = JSON.parse(res.actualFlowData)
  console.log("时间轴原始数据 actualFlowData",actualFlowData)


  workOrderInstanceTimelines.value = res.timeLineItems
  if (res.comments){
    commentTimeLines.value = JSON.parse(res.comments)
  }

  console.log("commentTimeLines",commentTimeLines)
  // fApi.value?.set()

}).catch((err) => {
  createMessage.error('获取工单模板失败',err);
  console.log('获取工单模板失败',err);
}).finally(() => {});




function handleApproval() {
  approvalWorkOrderInstance(query.orderId, "pass").then((res) => {
    createMessage.success('工单认领审批成功');
  }).catch(() => {
    createMessage.error('获取用户信息失败');
  }).finally(() => {
  });
  location.reload()

}

function handleApprovalForbid(record: Recordable) {

  approvalWorkOrderInstance(query.orderId, "reject").then((res) => {
    createMessage.success('审批拒绝工单成功');
  }).catch(() => {
    createMessage.error('审批拒绝工单失败');
  }).finally(() => {
  });
  location.reload()

}

function addComment(){
  const reqData = getFieldsValue()
  console.log("reqData",reqData)
  commentWorkOrderInstance(query.orderId, reqData).then(() => {
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


  actionWorkOrderInstance(query.orderId, reqData).then(() => {
    createMessage.success('工单认领执行成功');
    closeModal();

  }).catch(() => {
    createMessage.error('工单认领执行失败');
  }).finally(() => {
  });
}




function handleAction() {

  openModal(true, {});


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
