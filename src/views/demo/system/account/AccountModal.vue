<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import {
    createAccount,
    updateAccount,
  } from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, removeSchemaByField, appendSchemaByField,resetFields, validate ,getFieldsValue }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
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
            location.reload()
          },

        });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {

          rowId.value = data.record.id;
          //  更新的时候 把 roles 对象列表换成 strings数组
          var roles = data.record.roles
          var roleValus= []
          roles.forEach((val, idx, array) => {

            roleValus.push(val.roleValue)


          })
          data.record["roles"] = roleValus

          setFieldsValue({
            ...data.record,
          });

          removeSchemaByField('username')
          appendSchemaByField(
            {
              field: 'username',
              label: '用户名',
              // // ifShow: false,
              // componentProps:{
              //   disabled: true

              // }
            }, '',
          )
          console.log("setFieldsValue之后:%v",getFieldsValue())
          //



        }


        // const treeData = await getDeptList();
        // updateSchema([
        //   {
        //     field: 'pwd',
        //     show: !unref(isUpdate),
        //   },
        //   {
        //     field: 'dept',
        //     componentProps: { treeData },
        //   },
        // ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {



          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          var reqData =  getFieldsValue()
          var menuFunc = createAccount
          if (unref(isUpdate)) {
            //  如果是更新则去掉 userName 和password
            delete reqData["username"]
            delete reqData["password"]
            menuFunc = updateAccount
          }

          const { createMessage } = useMessage();


          console.log("原始的getFieldsValue",getFieldsValue())
          var roles = reqData["roles"]
          delete reqData["roles"]
          reqData["rolesFront"] = roles

          console.log("新增或编辑账号字段",reqData)
          menuFunc(reqData).then(() => {
          // menuFunc(getFieldsValue()).then(() => {
            createMessage.success(`${getTitle.value}成功`);
          }).catch(() => {
            createMessage.error(`${getTitle.value}失败`);
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
