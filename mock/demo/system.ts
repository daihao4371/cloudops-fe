import {MockMethod} from 'vite-plugin-mock';
import {
  getRequestToken,
  requestParams,
  resultError,
  resultPageSuccess,
  resultSuccess
} from '../_util';
import {RoleEnum} from "@/enums/roleEnum";
import {createFakeUserList, setFakeUserList} from "../sys/user";

const sysRoute = {
  path: '/system',
  name: 'System',
  component: 'LAYOUT',
  redirect: '/system/account',
  meta: {
    icon: 'ion:settings-outline',
    title: 'routes.demo.system.moduleName',
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: 'routes.demo.system.account',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/account/index',
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail',
      meta: {
        hideMenu: true,
        title: 'routes.demo.system.account_detail',
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/account',
      },
      component: '/demo/system/account/AccountDetail',
    },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        title: 'routes.demo.system.role',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/role/index',
    },

    {
      path: 'menu',
      name: 'MenuManagement',
      meta: {
        title: 'routes.demo.system.menu',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/menu/index',
    },
    {
      path: 'dept',
      name: 'DeptManagement',
      meta: {
        title: 'routes.demo.system.dept',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/dept/index',
    },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      meta: {
        title: 'routes.demo.system.password',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/password/index',
    },
  ],
};

let dbMenuList = [

  {
    path: '/system',
    name: 'System',
    component: 'LAYOUT',
    redirect: '/system/account',
    // meta: {
    //   icon: 'ion:settings-outline',
    //   title: 'routes.demo.system.moduleName', // 这里是给 左边栏
    // },
    icon: 'ion:settings-outline',
    // title: 'routes.demo.system.moduleName',
    title: '系统管理',
    id: "1",
    dbId: "1",
    type: "0",
    show: "1",
    orderNo: 0,

  },

  {
    path: 'menu',
    name: 'MenuManagement',
    // meta: {
    //   title: 'routes.demo.system.menu',
    //   ignoreKeepAlive: true,
    // },

    title: '菜单管理',
    icon: 'ant-design:account-book-filled',
    component: '/demo/system/menu/index',
    id: "1-2",
    dbId: "2",
    type: "1",
    parentMenu: "1",
    show: "1",
    orderNo: 88,

  },
  {
    path: 'account',
    name: 'AccountManagement',
    // meta: {
    //   title: 'routes.demo.system.menu',
    //   ignoreKeepAlive: true,
    // },

    title: '用户管理',
    icon: 'ant-design:account-book-twotone',
    component: '/demo/system/account/index',
    id: "1-3",
    dbId: "3",
    type: "1",
    parentMenu: "1",
    show: "1",
    orderNo: 2,

  },
  {
    path: 'role',
    name: 'RoleManagement',
    // meta: {
    //   title: 'routes.demo.system.menu',
    //   ignoreKeepAlive: true,
    // },

    title: '角色管理',
    icon: 'ion:layers-outline',
    component: '/demo/system/role/index',
    id: "1-4",
    dbId: "4",
    type: "1",
    parentMenu: "1",
    show: "1",
    orderNo: 3,

  },
  {
    path: 'changePassword',
    name: 'ChangePassword',
    // meta: {
    //   title: 'routes.demo.system.menu',
    //   ignoreKeepAlive: true,
    // },

    title: '修改密码',
    icon: 'ion:layers-outline',
    component: '/demo/system/password/index',
    id: "1-7",
    dbId: "7",
    type: "1",
    parentMenu: "1",
    show: "1",
    orderNo: 3,

  },
  {
    path: '/permission',
    name: 'Permission',
    component: 'LAYOUT',
    redirect: '/permission/front/page',
    icon: 'ion:settings-outline',
    title: '权限管理',
    id: "5",
    dbId: "5",
    type: "0",
    show: "1",
    orderNo: 8,

  },
  {
    path: 'front',
    name: 'PermissionFrontDemo',
    component: '/demo/permission/front/index',
    icon: 'ion:settings-outline',
    title: '前端权限管理',
    id: "5-6",
    dbId: "6",
    type: "1",
    show: "1",
    orderNo: 8,
    parentMenu: "5",

  },


]

//     {
//       path: 'dept',
//       name: 'DeptManagement',
//       meta: {
//         title: 'routes.demo.system.dept',
//         ignoreKeepAlive: true,
//       },
//       component: '/demo/system/dept/index',
//     },


//  我们不用这个
let fakeMenuList = [{
  path: '/system',
  name: 'System',
  component: 'LAYOUT',
  redirect: '/system/account',
  meta: {
    icon: 'ion:settings-outline',
    title: 'routes.demo.system.moduleName',
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: 'routes.demo.system.account',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/account/index',
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail',
      meta: {
        hideMenu: true,
        title: 'routes.demo.system.account_detail',
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/account',
      },
      component: '/demo/system/account/AccountDetail',
    },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        title: 'routes.demo.system.role',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/role/index',
    },

    {
      path: 'menu',
      name: 'MenuManagement',
      meta: {
        title: 'routes.demo.system.menu',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/menu/index',
    },
    {
      path: 'dept',
      name: 'DeptManagement',
      meta: {
        title: 'routes.demo.system.dept',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/dept/index',
    },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      meta: {
        title: 'routes.demo.system.password',
        ignoreKeepAlive: true,
      },
      component: '/demo/system/password/index',
    },
  ],
}];

let fakeRoleList = [
  {
    id: 1,
    orderNo: 1,
    roleName: '超级管理员',
    roleValue: RoleEnum.SUPER,
    createTime: '@datetime',
    remark: '@cword(10,20)',
    menu: ['1', '1-2', '1-3', '1-4', '1-7'],
    status: '1',
  },
  {
    id: 2,
    orderNo: 2,
    roleName: '前端权限管理员',
    roleValue: 'frontAdmin',
    createTime: '@datetime',
    remark: '@cword(10,20)',
    menu: ['5', '5-6'],
    status: '1',
  },
  // {
  //   id: 3,
  //   orderNo: 3,
  //   roleName: 'cicd管理员',
  //   roleValue: RoleEnum.CICD_ADMIN,
  //   createTime: '@datetime',
  //   remark: '@cword(10,20)',
  //   menu: ['5'],
  //   status: '1',
  // },
  // {
  //   id: 4,
  //   orderNo: 4,
  //   roleName: '服务树管理员',
  //   roleValue: RoleEnum.TREE_ADMIN,
  //   createTime: '@datetime',
  //   remark: '@cword(10,20)',
  //   menu: ['0', '1', '2'],
  //   status: '1',
  // },
  // {
  //   id: 5,
  //   orderNo: 5,
  //   roleName: 'k8s管理员',
  //   roleValue: RoleEnum.K8S_ADMIN,
  //   createTime: '@datetime',
  //   remark: '@cword(10,20)',
  //   menu: ['0', '1', '2'],
  //   status: '1',
  // },

];


export function getFakeMenuList() {
  return fakeMenuList
}

export function createFakeRoleList() {
  return [
    {
      id: 1,
      orderNo: 1,
      roleName: '超级管理员',
      roleValue: RoleEnum.SUPER,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: ['0', '1', '2'],
      status: '1',
    },
    {
      id: 2,
      orderNo: 2,
      roleName: '监控管理员',
      roleValue: RoleEnum.RROME_ADMIN,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: ['0', '1', '2'],
      status: '1',
    },
    {
      id: 3,
      orderNo: 3,
      roleName: 'cicd管理员',
      roleValue: RoleEnum.CICD_ADMIN,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: ['0', '1', '2'],
      status: '1',
    },
    {
      id: 4,
      orderNo: 4,
      roleName: '服务树管理员',
      roleValue: RoleEnum.TREE_ADMIN,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: ['0', '1', '2'],
      status: '1',
    },
    {
      id: 5,
      orderNo: 5,
      roleName: 'k8s管理员',
      roleValue: RoleEnum.K8S_ADMIN,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      menu: ['0', '1', '2'],
      status: '1',
    },

  ];
}


const accountList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      account: '@first',
      email: '@email',
      nickname: '@cname()',
      role: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '1'],
    });
  }
  return result;
})();

// const roleList = (() => {
//   const result: any[] = [];
//   for (let index = 0; index < 4; index++) {
//     result.push({
//       id: index + 1,
//       orderNo: `${index + 1}`,
//       roleName: ['超级管理员', '管理员', '文章管理员', '普通用户'][index],
//       roleValue: '@first',
//       createTime: '@datetime',
//       remark: '@cword(10,20)',
//       menu: [['0', '1', '2'], ['0', '1'], ['0', '2'], ['2']][index],
//       'status|1': ['0', '1'],
//     });
//   }
//   return result;
// })();


const roleList = (() => {
  // return createFakeRoleList()
  return fakeRoleList
})();


const deptList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      deptName: ['华东分部', '华南分部', '西北分部'][index],
      orderNo: index + 1,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            deptName: ['研发部', '市场部', '商务部', '财务部'][j],
            orderNo: j + 1,
            createTime: '@datetime',
            remark: '@cword(10,20)',
            'status|1': ['0', '1'],
            parentDept: `${index}`,
            children: undefined,
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

const menuList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      icon: ['ion:layers-outline', 'ion:git-compare-outline', 'ion:tv-outline'][index],
      component: 'LAYOUT',
      type: '0',
      menuName: ['Dashboard', '权限管理', '功能'][index],
      permission: '',
      orderNo: index + 1,
      createTime: '@datetime',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            type: '1',
            menuName: ['菜单1', '菜单2', '菜单3', '菜单4'][j],
            icon: 'ion:document',
            permission: ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index],
            component: [
              '/dashboard/welcome/index',
              '/dashboard/analysis/index',
              '/dashboard/workbench/index',
              '/dashboard/test/index',
            ][j],
            orderNo: j + 1,
            createTime: '@datetime',
            'status|1': ['0', '1'],
            parentMenu: `${index}`,
            children: (() => {
              const children: any[] = [];
              for (let k = 0; k < 4; k++) {
                children.push({
                  id: `${index}-${j}-${k}`,
                  type: '2',
                  menuName: '按钮' + (j + 1) + '-' + (k + 1),
                  icon: '',
                  permission:
                    ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index] +
                    ':btn' +
                    (k + 1),
                  component: [
                    '/dashboard/welcome/index',
                    '/dashboard/analysis/index',
                    '/dashboard/workbench/index',
                    '/dashboard/test/index',
                  ][j],
                  orderNo: j + 1,
                  createTime: '@datetime',
                  'status|1': ['0', '1'],
                  parentMenu: `${index}-${j}`,
                  children: undefined,
                });
              }
              return children;
            })(),
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/system/getAccountList',
    timeout: 100,
    method: 'get',
    response: ({query}) => {
      const {page = 1, pageSize = 20} = query;
      // return resultPageSuccess(page, pageSize, accountList);
      var dbAccountList = createFakeUserList()

      return resultPageSuccess(page, pageSize, dbAccountList);
    },
  },
  {
    url: '/basic-api/system/getRoleListByPage',
    timeout: 100,
    method: 'get',
    response: ({query}) => {
      const {page = 1, pageSize = 20, status, roleName} = query;
      // console.log("getRoleListByPage : 参数  ", status, roleName,)
      // 首先匹配 status的逻辑
      let filterRes = fakeRoleList
      if (status != undefined) {
        filterRes = filterRes.filter(
          n => n.status == status
        );
      }

      // console.log("indeof search","超级".includes("超wdwd"))
      // 匹配name
      if (roleName != undefined) {
        filterRes = filterRes.filter(
          n => n.roleName.includes(roleName) == true
        );
      }

      return resultPageSuccess(page, pageSize, filterRes);
    },
  },
  {
    url: '/basic-api/system/setRoleStatus',
    timeout: 500,
    method: 'post',
    response: ({body}) => {
      // console.log('setRoleStatus.call')
      const {id, status} = body;
      // console.log('setRoleStatus.id', id, status)
      const checkRole = fakeRoleList.find(
        (item) => item.id === id
      );
      if (!checkRole) {
        return resultError('角色没有找到');
      }

      checkRole.status = status

      return resultSuccess({id, status});
    },
  },
  {
    url: '/basic-api/system/deleteRole',
    timeout: 500,
    method: 'delete',
    response: ({body}) => {

      const {id} = body;
      console.log('deleteRole.call.id', id)
      const checkRole = fakeRoleList.find(
        (item) => item.id === id
      );
      if (!checkRole) {
        return resultError('角色没有找到');
      }

      // const deleteItem = (arr,id) => {
      //   arr.value = arr.value.filter((i) => {
      //     return i.id != id
      //   })
      // }
      // deleteItem(fakeRoleList,id)

      fakeRoleList.splice(id - 1, 1)
      // fakeRoleList = newFakeRoleList
      // console.log('deleteRole.after', id, fakeRoleList)
      return resultSuccess({id});
    },
  },
  {
    url: '/basic-api/system/getAllRoleList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(roleList);
    },
  },
  {
    url: '/basic-api/system/getDeptList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(deptList);
    },
  },

  {
    url: '/basic-api/system/deleteMenu',
    timeout: 500,
    method: 'delete',
    response: ({body}) => {

      const {id} = body;
      console.log('deleteMenu.call.id', id)
      const dbMenu = dbMenuList.find(
        (item) => item.id === id
      );
      if (!dbMenu) {
        return resultError('菜单没有找到');
      }
      var dbMenuIndex = dbMenuList.indexOf(dbMenu)

      dbMenuList.splice(dbMenuIndex, 1)
      return resultSuccess({id});
    },
  },
  {
    url: '/basic-api/system/getMenuList',
    timeout: 100,
    method: 'get',
    response: (request: requestParams) => {


      // 获取用户信息 根据token 找到用户

      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');

      var dbAccountList = createFakeUserList()
      const checkUser = dbAccountList.find((item) => item.token === token);
      console.log("获取菜单列表",token, dbAccountList)

      if (!checkUser) {
        return resultError('根据用户token找用户没找到'+token);
      }

      //  这里用map 不用数组是因为 多个角色的 menu可能会 重复，需要去重
      const menuMap = new Map<string, object>();

      // console.log("getMenuList.user.print",checkUser)
      // 遍历角色列表找到可以访问的 菜单 再拼接
      checkUser.roles.forEach((itemU) => {

        // 根据roleName 找到role
        var roleObj = fakeRoleList.find(
          (item) => item.roleValue === itemU.value
        );
        console.log("根据用户找到角色", roleObj)
        roleObj.menu.forEach((value, key) => {
          menuMap.set(value, itemU)


        })


      })

      var thisMemus = [];
      const fatherMap = new Map<string, object>();
      // 再遍历 menu 列表 找到所有的menu
      //  最后再遍历father map
      menuMap.forEach((value, key) => {
        // 先找到father

        var menuObj = dbMenuList.find((item) => item.id === key)
        thisMemus.push(menuObj)

        // fatherMap 获取来自本地数据 ,前端穿不过来
        var parentMenuId = menuObj.parentMenu
        if (parentMenuId != null){

          var parentMenu = dbMenuList.find((item) => item.id === parentMenuId)
          fatherMap.set(parentMenu.id, parentMenu);
        }

      })
      fatherMap.forEach((value,key) =>{
        thisMemus.push(value)

      })


      console.log('拿到所有的菜单打印map', menuMap)


      console.log('拿到所有的菜单打印list',  thisMemus)


      // return resultSuccess(menuList);
      // 遍历db 列表 根据父子关系去拼接




      // dbMenuList.forEach((item) => {
      //   if (item.type == "0") {
      //     fatherMap.set(item.id, item);
      //   }
      //
      // })

      var childMenus = [];
      let tmpDbMenuList = JSON.parse(JSON.stringify(thisMemus));
      let showMenu = {
        "1": false,
        "0": true,
      }

      tmpDbMenuList.forEach((item) => {
        // dbMenuList.forEach((item) => {
        //   这里渲染：meta进行字段的组合： 将外部字段拼接到里面
        item.meta = {};
        item.meta.title = item.title
        item.meta.icon = item.icon

        item.meta.showMenu = showMenu[item.show]
        item.meta.hideMenu = showMenu[item.show]

        if (item.type == "0") {
          fatherMap.set(item.id, item);
        } else {
          childMenus.push(item)
        }

      });
      console.log("###############################")
      console.log("父菜单map",fatherMap)
      console.log("子菜单列表",childMenus)
      console.log("###############################")

      childMenus.forEach((item) => {
        // 先找到father
        var father = fatherMap.get(item.parentMenu);
        if (father == null) {
          return
        }
        // console.log(father)
        // var c = father.children
        if (father.children == null) {
          father.children = []
        }
        father.children.push(item)
        // father.children = c

        fatherMap.set(item.parentMenu,father)
      })

      var menus = [];
      //  最后再遍历father map
      fatherMap.forEach((value, key) => {
        // 先找到father
        menus.push(value)

      })
      console.log('打印最终的fatherMap',fatherMap)
      fatherMap.clear()
      return resultSuccess(menus);
    },
  },

  {
    url: '/basic-api/system/getMenuListAll',
    timeout: 100,
    method: 'get',
    response: (request: requestParams) => {


      // return resultSuccess(menuList);
      // 遍历db 列表 根据父子关系去拼接
      var menus = [];
      const fatherMap = new Map<string, object>();

      var childMenus = [];
      let tmpDbMenuList = JSON.parse(JSON.stringify(dbMenuList));
      let showMenu = {
        "1": false,
        "0": true,
      }

      tmpDbMenuList.forEach((item) => {
        // dbMenuList.forEach((item) => {
        //   这里渲染：meta进行字段的组合： 将外部字段拼接到里面
        item.meta = {};
        item.meta.title = item.title
        item.meta.icon = item.icon

        item.meta.showMenu = showMenu[item.show]
        item.meta.hideMenu = showMenu[item.show]

        if (item.type == "0") {
          fatherMap.set(item.id, item);
        } else {
          childMenus.push(item)
        }

      });
      // console.log("###############################")
      // console.log("childMenus..",childMenus)
      // console.log("###############################")

      childMenus.forEach((item) => {
        // 先找到father
        const father = fatherMap.get(item.parentMenu);
        // console.log(father)
        var c = father.children
        if (c == null) {
          c = []
        }
        c.push(item)
        father.children = c
      })

      //  最后再遍历father map
      fatherMap.forEach((value, key) => {
        // 先找到father
        menus.push(value)

      })

      fatherMap.clear()
      return resultSuccess(menus);
    },
  },


  {
    url: '/basic-api/system/createMenu',
    timeout: 100,
    method: 'post',
    response: ({body}) => {
      console.log('createMenu.call.print', body)


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加


      body.createTime = '@datetime'
      body.meta = {}
      body.meta.title = body.title
      // 逻辑就是 往 menulist中 推数据 ,
      // 只需要加个id 和createtime
      const lastNum = dbMenuList.length
      const thisNum = lastNum + 1
      // 如果 目录 type=0
      body.dbId = thisNum
      if (body.type == "0") {
        body.component = "LAYOUT"
        body.id = `${thisNum}`
        // fakeMenuList.push(body)
      } else {
        body.id = `${body.parentMenu}-${thisNum}`
      }

      //  存储到数据库
      dbMenuList.push(body)
      return resultSuccess(`${body.name} 创建成功id=${body.id}`);
    },
  },

  {
    url: '/basic-api/system/createRole',
    timeout: 100,
    method: 'post',
    response: ({body}) => {
      console.log('createRole.call.print', body)


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加

      const lastNum = fakeRoleList.length
      const thisNum = lastNum + 1
      // 如果 目录 type=0
      body.id = thisNum
      body.createTime = '@datetime'

      //  存储到数据库
      fakeRoleList.push(body)
      return resultSuccess(`${body.ro} 创建成功id=${body.id}`);
    },
  },

  {
    url: '/basic-api/system/updateRole',
    timeout: 100,
    method: 'post',
    response: ({body}) => {
      const {id} = body
      console.log('updateRole.call.print', body)

      var dbRole = fakeRoleList.find(
        (item) => item.id === id
      );

      if (!dbRole) {
        return resultError('角色没有找到');
      }
      var dbIndex = fakeRoleList.indexOf(dbRole);
      fakeRoleList[dbIndex] = body


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加
      // dbMenu = body
      return resultSuccess(`${body.name} 更新成功id=${id}`);
    },
  },
  {
    url: '/basic-api/system/changePassword',
    method: 'post',
    response: (request: requestParams) => {
      console.log("changePassword", request)
      // console.log("changePassword-type",)
      //  header中的token 获取当前用户
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');


      var dbAccountList = createFakeUserList()
      const checkUser = dbAccountList.find((item) => item.token === token);
      if (!checkUser) {
        return resultError('根据token找用户没找到');
      }

      const {body} = request

      const passwordNew = body["passwordNew"]
      const passwordOld = body["passwordOld"]
      console.log("get.body", body, passwordNew, passwordOld, checkUser.password)
      // 判断旧密码是否正确
      if (passwordOld != checkUser.password) {
        return resultError('旧密码错误');

      }
      // 旧密码是对的
      checkUser.password = passwordNew

      var dbIndex = dbAccountList.indexOf(checkUser);
      dbAccountList[dbIndex] = checkUser

      setFakeUserList(dbAccountList)


      return resultSuccess('密码更新成功');
    },
  },

  {
    url: '/basic-api/system/updateMenu',
    timeout: 100,
    method: 'post',
    response: ({body}) => {
      const {id} = body
      console.log('updateMenu.call.print', body)

      var dbMenu = dbMenuList.find(
        (item) => item.id === id
      );

      if (!dbMenu) {
        return resultError('菜单没有找到');
      }
      var dbIndex = dbMenuList.indexOf(dbMenu);
      dbMenuList[dbIndex] = body


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加
      // dbMenu = body
      return resultSuccess(`${body.name} 更新成功id=${id}`);
    },
  },

  {
    url: '/basic-api/system/createAccount',
    timeout: 100,
    method: 'post',
    response: ({body}) => {
      console.log('createAccount.call.print', body)


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加
      var dbAccountList = createFakeUserList()

      const lastNum = dbAccountList.length
      const thisNum = lastNum + 1
      // 如果 目录 type=0
      body.userId = thisNum
      body.createTime = '@datetime'


      //  role 列表 传参会是  value 数组
      //  后端存储的是 role对象的 []
      // 做转化 遍历 传入的roles values 列表，从 数据库中找到role，给他塞入

      // 在外部声明 roles 新对象数组
      let newRoles = []
      body.roles.forEach((val, idx, array) => {
        // val: 当前值
        // idx：当前index
        // array: Array
        const checkRole = fakeRoleList.find(
          (item) => item.roleValue === val
        );
        if (!checkRole) {
          return true; // Continues
        }
        newRoles.push({
          'roleName': checkRole.roleName,
          'value': checkRole.roleValue,
        })


      });
      // 替换 roles 为新的
      body.roles = newRoles


      //  存储到数据库
      dbAccountList.push(body)
      setFakeUserList(dbAccountList)

      return resultSuccess(`${body.ro} 创建成功id=${body.id}`);
    },
  },

  {
    url: '/basic-api/system/updateAccount',
    timeout: 100,
    method: 'post',
    response: ({body}) => {

      const {userId} = body
      console.log('updateAccount.call.print', body)


      // 第一步往 dbMenu 中添加数据 ：模拟往数据库中添加
      var dbAccountList = createFakeUserList()

      //

      var dbObj = dbAccountList.find(
        (item) => item.userId === userId
      );

      if (!dbObj) {
        return resultError('用户没有找到');
      }

      // 在外部声明 roles 新对象数组
      let newRoles = []
      body.roles.forEach((val, idx, array) => {
        // val: 当前值
        // idx：当前index
        // array: Array
        const checkRole = fakeRoleList.find(
          (item) => item.roleValue === val
        );
        if (!checkRole) {
          return true; // Continues
        }
        newRoles.push({
          'roleName': checkRole.roleName,
          'value': checkRole.roleValue,
        })


      });
      // 替换 roles 为新的
      body.roles = newRoles


      var dbIndex = dbAccountList.indexOf(dbObj);
      dbAccountList[dbIndex] = body

      setFakeUserList(dbAccountList)

      return resultSuccess(`${body.username} 更新成功id=${body.id}`);

    },
  },

  {
    url: '/basic-api/system/deleteAccount',
    timeout: 500,
    method: 'delete',
    response: ({body}) => {

      const {userId} = body;
      console.log('deleteAccount.call.id', userId)
      var dbAccountList = createFakeUserList()

      const dbObj = dbAccountList.find(
        (item) => item.userId === userId
      );
      if (!dbObj) {
        return resultError('用户没有找到');
      }

      // const deleteItem = (arr,id) => {
      //   arr.value = arr.value.filter((i) => {
      //     return i.id != id
      //   })
      // }
      // deleteItem(fakeRoleList,id)

      dbAccountList.splice(userId - 1, 1)

      setFakeUserList(dbAccountList)
      // fakeRoleList = newFakeRoleList
      return resultSuccess({userId});
    },
  },

  {
    url: '/basic-api/system/accountExist',
    timeout: 500,
    method: 'post',
    response: ({body}) => {
      const {account} = body || {};
      // 真实情况 得从数据库中查询
      var dbAccountList = createFakeUserList()

      var dbUser = dbAccountList.find(
        (item) => item.username === account
      );
      if (dbUser != null) {
        return resultError('用户已存在');
      } else {
        return resultSuccess(`${account} can use`);
      }

      // if (account && account.indexOf('admin') !== -1) {
      //   return resultError('该字段不能包含admin');
      // } else {
      //   return resultSuccess(`${account} can use`);
      // }
    },
  },
] as MockMethod[];
