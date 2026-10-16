// 本次评审变更的唯一配置：2个节点与8类材料标题。
export const approvalNodes=[
 {id:'supervisor',label:'项目监督人',legacyField:'approver0'},
 {id:'safety-environment',label:'安全环保部',legacyField:'approver1'}
];
export const materials=[
 {id:'qualification',title:'施工单位资质材料'},
 {id:'main-contract',title:'项目主合同'},
 {id:'safety-agreement',title:'安全协议书'},
 {id:'equipment-inspection',title:'进场设备、材料报验单'},
 {id:'staff-documents',title:'施工人员相关材料'},
 {id:'risk-deposit',title:'风险抵押金票据'},
 {id:'three-measures',title:'三措材料'},
 {id:'construction-drawings',title:'设计施工图纸（需要时）'}
];
export const uploadRules=Object.freeze({maxFiles:5,maxBytes:50*1024*1024,accept:'.pdf,.doc,.docx,.png,.jpg,.jpeg',extensions:['pdf','doc','docx','png','jpg','jpeg']});
export function assignedApprover(project,nodeIndex){return project?.approvalAssignments?.[approvalNodes[nodeIndex].id]||project?.[approvalNodes[nodeIndex].legacyField]||(nodeIndex===0?project?.manager:'安全环保部')||'';}
export function materialFiles(project){if(project?.materialAttachments)return structuredClone(project.materialAttachments);const result=Object.fromEntries(materials.map(m=>[m.id,[]]));(project?.attachments||[]).forEach((file,i)=>{const slot=materials[Math.min(i,materials.length-1)].id;result[slot].push(typeof file==='string'?{name:file}:file);});return result;}
export function validateMaterialUpload(existing,incoming,title='附件'){
 if(existing.length+incoming.length>uploadRules.maxFiles)throw Error(`${title}：每项最多5个附件`);
 for(const file of incoming){
  if(file.size>uploadRules.maxBytes)throw Error('附件不能超过50MB');
  if(!uploadRules.extensions.includes(file.name.split('.').pop().toLowerCase()))throw Error('附件仅支持pdf、doc、docx、png、jpg、jpeg格式');
 }
}
