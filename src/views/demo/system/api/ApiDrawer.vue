<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" rules="rules"/>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './api.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import {
    createApi,
    createMenu,
    getApiList,
    getMenuList,
    updateApi,
    updateMenu
  } from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'ApiDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate ,getFieldsValue}] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });


      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {

        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {

          setFieldsValue({
            ...data.record,
          });
          console.log("是更新：设置setFieldsValue",getFieldsValue())
        }
        const treeData = await getApiList();
        updateSchema({
          field: 'pId',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增Api' : '编辑Api'));

      async function handleSubmit() {
        try {
          var values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          const { createMessage } = useMessage();

          var modeFunc = createApi
          if (unref(isUpdate)) {
            modeFunc = updateApi
            // menuFunc = createMenu
          }

          modeFunc(getFieldsValue()).then(() => {
            createMessage.success(`${getTitle.value}成功`);
          }).catch(() => {
            createMessage.error(`${getTitle.value}失败`);
            })


          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
