// 原型签字上传：画布图片持久化到本地IndexedDB，不触发文件选择。
const ready=new Promise((resolve,reject)=>{
 const request=indexedDB.open('construction-prototype-signatures',1);
 request.onupgradeneeded=()=>request.result.createObjectStore('signatures',{keyPath:'id'});
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});
export async function uploadSignature({projectId,nodeId,reviewer,username,image}){
 if(!image?.startsWith('data:image/png;base64,'))throw Error('请先完成手写签字');
 const record={id:crypto.randomUUID(),projectId,nodeId,reviewer,username,image,uploadedAt:new Date().toISOString()};
 const db=await ready;
 await new Promise((resolve,reject)=>{const tx=db.transaction('signatures','readwrite');tx.objectStore('signatures').add(record);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('签字上传失败'));});
 return record;
}
export async function getSignature(id){
 const db=await ready;
 return new Promise((resolve,reject)=>{const request=db.transaction('signatures').objectStore('signatures').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}
