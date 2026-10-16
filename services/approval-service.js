import {repo} from './repository.js';
import {approvalNodes,assignedApprover} from '../config/project-approval.config.js';
export function approvalState(project){
 const saved=project?.approvalFlow;
 if(saved?.version===2)return structuredClone(saved);
 const baselineApproved=['待开始','进行中','暂停中','已退场'].includes(project?.status);
 return {version:2,current:baselineApproved?2:0,baselineOnly:baselineApproved,nodes:approvalNodes.map((n,i)=>({id:n.id,label:n.label,assignee:assignedApprover(project,i),status:baselineApproved?'基线已通过':i===0?'待审核':'未到达',history:[]}))};
}
export async function submitApproval(projectId,payload){
 const project=await repo.get('projects',projectId);if(!project)throw Error('项目不存在');
 const flow=approvalState(project);if(flow.current>=2)throw Error('本项目两级审批已经完成');
 if(payload.nodeId!==approvalNodes[flow.current].id)throw Error('审批节点已变化，请刷新后再试');
 if(!['通过','不通过'].includes(payload.result))throw Error('请选择审核结果');
 if(!payload.signature)throw Error('请完成签字');
 const index=flow.current,node=flow.nodes[index],time=new Date().toISOString();
 const event={nodeId:node.id,nodeLabel:approvalNodes[index].label,reviewer:payload.reviewer,username:payload.username,result:payload.result,opinion:payload.opinion||'',signature:payload.signature,checkedMaterials:payload.checkedMaterials||[],time};
 node.status=payload.result==='通过'?'已通过':'不通过';node.history=[...(node.history||[]),event];node.last=event;
 if(payload.result==='通过'){flow.current=index+1;if(flow.current<2)flow.nodes[flow.current].status='待审核';}
 else {flow.current=index;for(let i=index+1;i<2;i++)flow.nodes[i].status='未到达';}
 const status=payload.result==='不通过'?'审核不通过':flow.current===2?'待开始':'待审核';
 await repo.update('projects',projectId,{approvalFlow:flow,status,auditHistory:[...(project.auditHistory||[]),event],auditor:payload.reviewer,auditUsername:payload.username});
 return flow;
}
