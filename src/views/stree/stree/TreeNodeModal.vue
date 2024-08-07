<template>
  <BasicModal :width="1000"  v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import {
  createAccount,
  createRole,
  getDeptList, isAccountExist,
  updateAccount,
  updateRole, updateStreeNode
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import {modalFormSchema} from "@/views/stree/stree/stree.data";

export default defineComponent({
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const rowId = ref('');
    const getTitle = ref("")


    const [registerForm, { setFieldsValue, removeSchemaByField,updateSchema, appendSchemaByField,resetFields, validate ,getFieldsValue,clearValidate }] = useForm({
      labelWidth: 200,
      baseColProps: { span: 24 },
      schemas: modalFormSchema,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 23,
      },
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      console.log("打开模态框的数据",data)
      resetFields();
      setModalProps({ confirmLoading: false ,
        afterClose: () => {
          //  模态框完成后的回调 重新刷新
          // location.reload()
        },

      });

      var opsAdmins = data.node.ops_admin_users
      var rdAdmins = data.node.rd_admin_users
      if (opsAdmins==null){
        opsAdmins = []
        data.node.ops_admin_users = opsAdmins
      }
      // if (rdAdmins==null){
      //   rdAdmins = []
      //   data.node.rd_admin_users = rdAdmins
      // }

      getTitle.value = "编辑树节点："+data.node.nodePath
      //  打开模态框的时候 就应该把数据塞入form
      setFieldsValue({
        ...data.node,
      });

    });



    async function handleSubmit() {
      try {



        const values = await validate();
        setModalProps({ confirmLoading: true });
        // TODO custom api
        var reqData =  getFieldsValue()
        console.log("节点编辑运维负责人",reqData)


        const { createMessage } = useMessage();


        updateStreeNode(reqData).then(() => {
          // menuFunc(getFieldsValue()).then(() => {
          createMessage.success(`${getTitle.value}成功`);
        }).catch(() => {
          createMessage.error(`${getTitle.value}失败`);
        })

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
