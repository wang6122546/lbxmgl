import {repo} from './repository.js';
import {projectCompany} from '../config/project-directory.config.js';
// 仅迁移先前原型的基线单位文案，不覆盖用户自定义单位。
export async function ensureProjectContext(){
 for(const table of ['projects','sites','partners','reports']){
  for(const row of await repo.list(table)){
   const patch={};for(const key of ['org','department'])if(row[key]==='鞍钢集团矿业有限公司')patch[key]=projectCompany;
   if(table==='sites'&&row.id==='S2'&&row.org==='东鞍山烧结厂'){patch.org=projectCompany;if(row.department==='东鞍山烧结厂')patch.department='生产管理部';}
   if(Object.keys(patch).length)await repo.update(table,row.id,patch);
  }
 }
}
