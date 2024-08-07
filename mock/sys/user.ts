import {MockMethod} from 'vite-plugin-mock';
import {resultError, resultSuccess, getRequestToken, requestParams} from '../_util';



let dbAccountList = [

  {
    userId: '1',
    username: 'admin',
    realName: '超管',
    avatar: '',
    desc: 'manager',
    password: '123456',
    token: 'fakeToken1',
    homePath: '/system/role',
    roles: [
      {
        roleName: '超级管理员',
        value: 'super',
      },

    ],
  },
  {
    userId: '2',
    username: 'front1',
    realName: '小1',
    avatar: '',
    desc: 'manager',
    password: '123456',
    token: 'fakeToken2',
    homePath: '/permission/front',
    roles: [
      {
        roleName: '前端权限管理员',
        value: 'frontAdmin',
      },

    ],
  },
]

// export function createFakeUserList() {
//
//
//
//
//
//   var dbList  = Persistent.getLocal(MOCK_ACCOUNT_LIST_KEY)
//   //  说明 store中还没有 没有修改或新增过
//   if (dbList==null){
//     return dbAccountList
//   }
//
//
//   return dbList
// }

export function createFakeUserList() {


  return dbAccountList


}

// export function setFakeUserList(list: any) {
//
//   const userStore = useUserStore();
//   userStore.setAccount(list)
//   // Persistent.setLocal(MOCK_ACCOUNT_LIST_KEY, list);
//   // dbAccountList = list
//   // console.log("setFakeUserList.call ", list, dbAccountList)
// }

export function setFakeUserList(list: any) {

  // Persistent.setLocal(MOCK_ACCOUNT_LIST_KEY, list);
  dbAccountList = list
  console.log("setFakeUserList.call ", list, dbAccountList)
}

const fakeCodeList: any = {
  // '1': ['1000', '3000', '5000'],
  '1': ['1'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  // {
  //   url: '/basic-api/login',
  //   timeout: 200,
  //   method: 'post',
  //   response: ({body}) => {
  //     const {username, password} = body;
  //
  //     const dbList = createFakeUserList()
  //
  //
  //     // console.log("/basic-api/login.dbAccountList", dbList, username, password)
  //     const checkUser = dbList.find(
  //       (item) => item.username === username && password === item.password,
  //     );
  //     if (!checkUser) {
  //       return resultError('Incorrect account or password！');
  //     }
  //     const {userId, username: _username, token, realName, desc, roles} = checkUser;
  //     return resultSuccess({
  //       roles,
  //       userId,
  //       username: _username,
  //       token,
  //       realName,
  //       desc,
  //     });
  //   },
  // },
  // {
  //   url: '/basic-api/getUserInfo',
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const checkUser = createFakeUserList().find((item) => item.token === token);
  //     if (!checkUser) {
  //       return resultError('The corresponding user information was not obtained!');
  //     }
  //     return resultSuccess(checkUser);
  //   },
  // },
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  {
    url: '/basic-api/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, {message: 'Token has been destroyed'});
    },
  },
  {
    url: '/basic-api/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!');
    },
  },
] as MockMethod[];
