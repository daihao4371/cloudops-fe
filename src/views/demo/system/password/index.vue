<template>
  <PageWrapper title="修改当前用户密码" content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';

  import { formSchema } from './pwd.data';
  import {changePassword, deleteMenu} from "@/api/demo/system";
  import {useMessage} from "@/hooks/web/useMessage";
  import { useGo } from '/@/hooks/web/usePage';
  import {useRouter} from "vue-router";
  import { router } from '/@/router';
  import {PageEnum} from "@/enums/pageEnum";
  import {useUserStore} from "@/store/modules/user";

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });
      const router = useRouter();
      async function handleSubmit() {
          const values = await validate();
          const { passwordOld, passwordNew } = values;


          const { createMessage } = useMessage();

          changePassword({
            'passwordOld':passwordOld,
            'passwordNew':passwordNew,
          }).then(() => {
            createMessage.success(`更新密码成功`);

          }).catch(() => {
            createMessage.error(`更新密码失败`);
          })
          // const go = useGo();
           const userStore = useUserStore();
           userStore.logout(true)
           // router.push(PageEnum.BASE_LOGIN);
          // 执行刷新
          // go();
          // go(PageEnum.BASE_LOGIN);
          // return {}
          // var router = useRouter();

          // console.log("router:",router)
          // router.go("/");


      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
