<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { ondutyChangeFormSchema } from './data';
  import {
    createMonitorOndutyGroupChange,
    createRole,
    getDeptList, isAccountExist,
    updateAccount,
    updateRole
  } from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'OndutyChangeModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const getTitle = ref('');
      const openData = ref({});

      const [registerForm, { setFieldsValue, removeSchemaByField,updateSchema, appendSchemaByField,resetFields, validate ,getFieldsValue,clearValidate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: ondutyChangeFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });
      const ondutyGroupId = ref('')
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        console.log("OndutyChangeModal打开模态框的数据",data)
        resetFields();
        setModalProps({ confirmLoading: false ,
          afterClose: () => {
            //  模态框完成后的回调 重新刷新
            // location.reload()
          },

        });
        getTitle.value =  `换班 日期${data.dateString} 原值班人${data.userNameCh}`
        ondutyGroupId.value = data.ondutyGroupId
        openData.value = data
      });



      async function handleSubmit() {
        try {


          const values = await validate();

          setModalProps({ confirmLoading: true });
          // TODO custom api
          var reqData =  getFieldsValue()
          var menuFunc = createMonitorOndutyGroupChange


          const { createMessage } = useMessage();
          console.log("原始的getFieldsValue",reqData)
          reqData['ondutyGroupId'] =  parseInt( openData.value['ondutyGroupId'], 10);
          reqData['dateString'] = openData.value['dateString']
          reqData['originUserName'] = openData.value['originUserName']
          console.log("拼接后的getFieldsValue",reqData)

          menuFunc(reqData).then(() => {
          // menuFunc(getFieldsValue()).then(() => {
            createMessage.success(`换班成功`);
          }).catch(() => {
            createMessage.error(`换班失败`);
          })

          console.log(values);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
