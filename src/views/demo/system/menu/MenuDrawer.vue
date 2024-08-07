<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
<!--    <BasicForm @register="registerForm" rules="rules"/>-->
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import {createMenu, getMenuList, updateMenu} from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'MenuDrawer',
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
        const treeData = await getMenuList();
        updateSchema({
          field: 'pId',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          var values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          const { createMessage } = useMessage();

          var menuFunc = createMenu
          if (unref(isUpdate)) {
            menuFunc = updateMenu
            // menuFunc = createMenu
          }

          menuFunc(getFieldsValue()).then(() => {
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
