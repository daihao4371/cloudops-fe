<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './stree.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import {
    createApi,
    createMenu, createStreeNode,
    getApiList,
    getMenuList,
    updateApi,
    updateMenu
  } from '/@/api/demo/system';
  import {useMessage} from "@/hooks/web/useMessage";

  export default defineComponent({
    name: 'StreeDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate ,getFieldsValue}] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const level= ref("");
      const pid = ref(0);
      const title = ref("");
      const getTitle = ref("");
      getTitle.value =  "新增顶级节点"
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        console.log("打开抽屉的data",data)
        level.value = data?.level;
        pid.value = data?.pid;
        title.value = data.title
        if (data.pid !=0){
          getTitle.value = `在节点${data.title}下增加`
        }
        resetFields();
        setDrawerProps({
          confirmLoading: false,
          closeFunc: reloadWeb,
        });

      });

      function reloadWeb(){
        location.reload()
      }


      async function handleSubmit() {
        try {
          var values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          const { createMessage } = useMessage();

          var reqData =  getFieldsValue()
          reqData["level"] = level.value
          reqData["pid"] = pid.value


          createStreeNode(reqData).then(() => {
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
