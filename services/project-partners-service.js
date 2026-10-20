import {repo} from './repository.js';
export async function validateProjectPartners(projectId,selected){
 if(!projectId)return;
 const [existing,people]=await Promise.all([repo.list('partners',{projectId}),repo.list('people',{projectId})]);
 const names=new Set(selected.map(p=>p.name));
 for(const partner of existing)if(!names.has(partner.name)&&people.some(p=>p.partnerId===partner.id))throw Error(`${partner.name}仍有关联进场人员，请先移除人员关联`);
}
export async function syncProjectPartners(projectId,selected){
 await validateProjectPartners(projectId,selected);
 const existing=await repo.list('partners',{projectId});
 for(const partner of existing)if(!selected.some(p=>p.name===partner.name))await repo.remove('partners',partner.id);
 for(const company of selected){
  const old=existing.find(p=>p.name===company.name);
  if(!old){const {id,projectId:previous,...values}=company;await repo.create('partners',{...values,projectId,score:company.score??100});}
 }
}
