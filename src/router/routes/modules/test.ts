import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import {RoleEnum} from "@/enums/roleEnum";

const dashboard: AppRouteModule = {
  path: '/about-1',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.about'),
    orderNo: 100,
    roles: [ RoleEnum.TEST]
  },
  children: [
    {
      path: 'index-1',
      name: 'AboutPage',
      component: () => import('/@/views/sys/about/index.vue'),
      meta: {
        title: '我新加的test',
        icon: 'simple-icons:about-dot-me',
      },
    },
    {
      path: 'index-2',
      name: 'AboutPage2',
      component: () => import('/@/views/sys/about/index.vue'),
      meta: {
        title: '我新加的test2',
        icon: 'simple-icons:about-dot-me',
      },
    },
  ],
};

export default dashboard;
