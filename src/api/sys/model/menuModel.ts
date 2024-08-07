import type { RouteMeta } from 'vue-router';

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
  // 这里写 form 依赖的字段
  title?: string;
  parentMenu?: string;

}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
