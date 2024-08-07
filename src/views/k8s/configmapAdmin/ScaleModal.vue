<template>
  <BasicModal :width="800" v-bind="$attrs" @register="registerModal" :title="getTitle"  @ok="handleSubmit">
    <a-alert :message="scaleCmd" type="success" />
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaScale } from './data';
  import {
    k8sScaleDeployOne,
    createRole,
    getDeptList, isAccountExist,
    updateAccount,
    updateRole
  } from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'ScaleModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const getTitle = ref('');
      const scaleCmd = ref('');
      const openData = ref({});




      const cluster = ref('')
      const namespace = ref('')
      const name = ref('')

      const [registerForm, { setFieldsValue, removeSchemaByField,updateSchema, appendSchemaByField,resetFields, validate ,getFieldsValue,clearValidate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchemaScale,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });
      const ondutyGroupId = ref('')
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        console.log("OndutyChangeModal打开模态框的数据",data)
        resetFields();
        setFieldsValue({
          ...data.record,
        });
        setModalProps({ confirmLoading: false ,
          afterClose: () => {
            //  模态框完成后的回调 重新刷新
            // location.reload()
          },

        });

        cluster.value = data.cluster
        namespace.value = data.record.namespace
        name.value = data.record.name

        getTitle.value =  `扩缩容  集群:${cluster.value} ns:${namespace.value} deploy:${name.value} 原副本数: ${data.record.replicas}`
        scaleCmd.value = `kubectl -n ${namespace.value} scale deploy ${name.value} --replicas=xx `
      });



      async function handleSubmit() {
        try {


          const values = await validate();
          const { createMessage } = useMessage();

          setModalProps({ confirmLoading: true });
          // TODO custom api
          var reqData =  getFieldsValue()


          var menuFunc = k8sScaleDeployOne



          reqData["cluster"] = cluster.value
          reqData["namespace"] = namespace.value
          reqData["name"] = name.value

          console.log("拼接后的getFieldsValue",reqData)

          menuFunc(reqData).then(() => {
          // menuFunc(getFieldsValue()).then(() => {
            createMessage.success(`扩缩容成功`);
          }).catch(() => {
            createMessage.error(`扩缩容失败`);
          })

          console.log(values);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit,scaleCmd };
    },
  });
</script>
