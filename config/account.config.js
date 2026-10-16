export const platformName='安全生产统一智管平台';
export const accounts=[
 {id:'platform',name:platformName,username:'platform',role:'平台账户',avatar:'平台'},
 {id:'reporter',name:'黄国系',username:'15012589880',role:'上报人',avatar:'黄'},
 {id:'leader',name:'张三',username:'15012589888',role:'班组长',avatar:'张'},
 {id:'leader2',name:'李四',username:'15012589887',role:'班组长',avatar:'李'},
 {id:'safety1',name:'王五',username:'15012589886',role:'二审人员',avatar:'王'},
 {id:'safety2',name:'赵六',username:'15012589885',role:'二审人员',avatar:'赵'},
 {id:'fixer',name:'陈建国',username:'15012589884',role:'整改人',avatar:'陈'}
];
const storageKey='construction-demo-account';
export function currentAccount(){return accounts.find(a=>a.id===localStorage.getItem(storageKey))||accounts[0];}
export function setAccount(id){if(accounts.some(a=>a.id===id))localStorage.setItem(storageKey,id);}
