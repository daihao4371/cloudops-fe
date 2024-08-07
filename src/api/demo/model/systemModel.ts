import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AccountParams = BasicPageParams & {
  account?: string;
  nickname?: string;
};

export type RoleParams = {
  roleName?: string;
  status?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export type DeptParams = {
  deptName?: string;
  status?: string;
};

export type MenuParams = {
  menuName?: string;
  status?: string;
};

export type MenuMeta = {
  title: string, // 中文名称

}




// 前后端都会使用的
export type MenuForm = {
  id: string,
  dbId: number,
  icon: string;
  component: string;
  //       meta: {
  //         hideMenu: true,
  //         title: 'routes.demo.system.account_detail',
  //         ignoreKeepAlive: true,
  //         showMenu: false,
  //         currentActiveMenu: '/system/account',
  //       },
  title: string, // 中文名称

  meta: MenuMeta,


  children: MenuForm[]
  type: string;
  name?: string;
  // menuName?: string;
  permission: string;
  orderNo: number;
  status: string;
  // routePath?: string;
  path?: string;
  parentMenu?: string;
  createTime?: string;
};



export interface AccountListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export interface DeptListItem {
  id: string;
  orderNo: string;
  createTime: string;
  remark: string;
  status: number;
}

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
  status: number;
  orderNo: string;
  createTime: string;
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];
