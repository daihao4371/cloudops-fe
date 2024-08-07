<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>

      </template>

      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'name'">

          <a-button type="danger"  shape="round" @click="clickDetail(record)" > {{  record.name }}</a-button>


        </template>
        <template v-if="column.key === 'status'">

          <a-tag :color="statusColorFunc(record.status)" > {{  record.statusChinese }}</a-tag>


        </template>

        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)"/>
        </template>
      </template>
    </BasicTable>

    <BasicModal @register="registerModal" @ok="handleOrderActionSubmit">
      <BasicForm @register="registerFormOrderAction"/>
    </BasicModal>

  </div>
</template>
<script lang="ts" setup>
import {
  BasicTable,
  useTable,
  TableAction,
  EditRecordRow,
  BasicColumn,
  ActionItem
} from '/@/components/Table';
import {
  approvalWorkOrderInstance,
  getWorkOrderInstanceList,
  actionWorkOrderInstance,
} from '/@/api/demo/system';

import {BasicModal, useModalInner} from '/@/components/Modal';
import {ref} from "vue";
import {
  columns,
  formSchemaOrderAction,
  workOrderInstanceSearchFormSchema,
  workOrderInstanceStatus
} from './data';
import {useMessage} from "@/hooks/web/useMessage";

const {createMessage} = useMessage();
import {getUserInfo} from "@/api/sys/user";
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue';
import {useModal} from "@/components/Modal";
import {BasicForm, useForm} from '/@/components/Form/index';
import {accountFormSchema} from "@/views/demo/system/account/account.data";
import {router} from "@/router";

const userInfo = ref()

getUserInfo().then((res) => {
  userInfo.value = res
}).catch(() => {
  createMessage.error('获取用户信息失败');
}).finally(() => {
});


const [registerModal, {openModal, closeModal}] = useModal();

const [registerFormOrderAction, {
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

/*
*
* 	WorkOrderInstanceStatusPendingApproval = "pendingApproval"
	WorkOrderInstanceStatusApprovalReject  = "approvalReject"
	WorkOrderInstanceStatusPendingAction   = "pendingAction"
	WorkOrderInstanceStatusFinished        = "finished"
	* */
//
const statusColorMap = {
  // "super":"primary danger",
  "pendingApproval": "blue",
  "approvalReject": "red",
  "pendingAction": "cyan",
  "finished": "green",
};
const statusColorFunc = function (index) {
  let tmp = statusColorMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};

const statusNameMap = {
  // "super":"primary danger",
  "pendingApproval": "待审批的",
  "approvalReject": "审批拒绝的",
  "pendingAction": "待执行的",
  "finished": "已执行完成的",
};
const statusNameFunc = function (index) {
  let tmp = statusNameMap[index]
  if (tmp == null) {
    tmp = "blue"
  }
  return tmp
};


const [registerTable, {reload}] = useTable({
  title: '工单实例列表',
  api: getWorkOrderInstanceList,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: workOrderInstanceSearchFormSchema,
    autoSubmitOnEnter: true
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: true,
  actionColumn: {
    width: 200,
    title: '操作',
    dataIndex: 'action',
    // fixed: 'left',
  },

});
const recordObj = ref()

// 只有创建人才能催单
function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {

  let actionItems = []
  if (userInfo.value.username === record.createUserName &&  record.status !== "approvalReject" ) {
    actionItems.push({
      label: '催单',
      icon: 'simple-icons:about-dot-me',
      popConfirm: {
        title: '是否确认催单',
        placement: 'left',
        confirm: handleReminder.bind(null, record),
      },
    },)
  }

  // 根据工单状态进行判断
  if (record.status === "pendingApproval" && record.isRelatedWithMe === true) {

    actionItems.push(
      {
        label: '认领审批',
        icon: 'ion:git-compare-outline',
        popConfirm: {
          title: '是否确认认领审批',
          placement: 'left',
          confirm: handleApproval.bind(null, record),
        },
      }
    )

    actionItems.push(
      {
        label: '审批拒绝',
        icon: 'tabler:chart-dots',
        popConfirm: {
          title: '是否确认审批拒绝',
          placement: 'left',
          confirm: handleApprovalForbid.bind(null, record),
        },
      }
    )
  }

  if (record.status === "pendingAction" && record.isRelatedWithMe === true) {
    actionItems.push(
      {
        label: '认领执行',
        popConfirm: {
          title: '是否确认认领执行',
          placement: 'left',
          confirm: handleAction.bind(null, record),
        },
      }
    )
  }
  return actionItems
}


async function handlePostWorkOrderResult() {
  const reqData = getFieldsValue()
  console.log("更新工单执行结果", reqData)


  actionWorkOrderInstance(recordObj.value.id, reqData).then(() => {
    createMessage.success('工单认领执行成功');
    closeModal();

  }).catch(() => {
    createMessage.error('工单认领执行失败');
  }).finally(() => {
  });
  reload()
}



function handleCreate() {

}

function clickDetail(item) {
  // 执行刷新
  // go();
  // router.push(PageEnum.BASE_HOME);
  router.push("/workOrder/detail?orderId="+item.id);
  // go(PageEnum.BASE_HOME,false);

}



function handleOrderActionSubmit() {
}


function handleEdit(record: Recordable) {
  console.log("编辑design record ", record)
}

function handleApproval(record: Recordable) {
  approvalWorkOrderInstance(record.id, "pass").then((res) => {
    createMessage.success('工单认领审批成功');
  }).catch(() => {
    createMessage.error('获取用户信息失败');
  }).finally(() => {
  });
  reload()
  console.log("认领并审批工单", record)

}

function handleReminder(record: Recordable) {
  console.log("催单", record)
}

function handleApprovalForbid(record: Recordable) {

  approvalWorkOrderInstance(record.id, "reject").then((res) => {
    createMessage.success('审批拒绝工单成功');
  }).catch(() => {
    createMessage.error('审批拒绝工单失败');
  }).finally(() => {
  });
  reload()
  console.log("认领并审批工单", record)
  console.log("审批拒绝工单 ", record)
}

function handleAction(record: Recordable) {

  recordObj.value = record
  openModal(true, {
    isUpdate: false,
  });


  console.log("认领并执行工单", record)
}



function handleSuccess() {
  reload();
}

</script>
<style>

.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>
