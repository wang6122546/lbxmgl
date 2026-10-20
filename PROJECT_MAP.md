# 页面与工程映射

## 页面清单

| 页面 | 独立地址 | 主要模型 |
|---|---|---|
| 项目管理 | pages/projects.html | projects / sites / people / partners / points |
| 施工现场 | pages/sites.html | sites / projects |
| 风险库 | pages/risks.html | risks / points |
| 项目类型设置 | pages/types.html | types |
| 基础设置 | pages/settings.html | settings |
| 施工项目日报表 | pages/reports.html | reports / owners / categories |
| 报表基础配置 | pages/report-settings.html | owners / categories |
| 监管责任清单 | pages/responsibilities.html | projects / partners 派生视图 |
| 项目信息 | pages/project.html?id=P1 | projects |
| 相关方企业管理 | pages/partners.html?id=P1 | partners |
| 进场人员管理 | pages/people.html?id=P1 | people / partners |
| 人员证书管理 | pages/certificates.html?id=P1 | certificates / people |
| 进场培训跟踪 | pages/training.html?id=P1 | training |
| 风险点管理 | pages/project-risks.html?id=P1 | points |
| 隐患排查计划 | pages/plans.html?id=P1 | plans |
| 风险库详情 | pages/risk-detail.html?id=R3 | risks / points |

项目页通过稳定 id 参数查询同一数据对象；不存在 id 显示明确状态。原系统弹层已按核查结果恢复为右侧抽屉/居中弹窗；独立入口仍可直接打开相应状态。

## 组件和分层

- config/pages.config.js：页面注册表、菜单、URL 生成。
- components/layout.js：页头、侧栏、标签导航、表单控件、表格、分页、弹窗、提示及导出。
- styles/app.css：设计令牌、布局及共享视觉规范，无 CDN 依赖。
- modules/app.js：页面控制器、关联查询、演示操作、表单及校验。
- services/repository.js：统一 IndexedDB CRUD、引用保护、重命名同步、跨标签通知。
- data/seed.js：虚构实体与字典，初始化只在首次建库时执行。

## 数据关系和修改影响

项目 siteId → 现场；企业 projectId → 项目；人员 projectId/partnerId → 项目/企业；证书 personId → 人员；风险点 libraryId/projectId → 风险库/项目。

列表、项目摘要、监管视图从统一数据层查询。删除存在引用的现场、类型、企业、人员、风险库会阻止操作；删除项目清理其关联企业/人员/证书/培训/计划，清除风险点的项目关联。类型、业主单位、作业类别重命名同步相关展示引用。

本次全部新增在 construction-prototype/，不修改 hazard-prototype/ 或 partner-prototype/。

## 待确认与验证

原始业务规则与未采集界面边界见 README.md 和 reference/TRAVERSAL.md；运行验证见 tests/ACCEPTANCE.md。

## 公共抬头与账户更新（2026-10-15）

参考用户提供的 `隐患计划管理.html` 和 `隐患整改.html`，页头采用“安全生产统一智管平台”、68px深色栏、蓝紫渐变盾牌和圆形头像。新增 config/account.config.js 管理平台账户及参考页演示身份；localStorage 保存选中账户，新增记录创建人及演示审核记录读取当前账户。此处为演示身份，尚无真实登录和角色权限服务。

影响文件：components/layout.js、styles/app.css、modules/app.js、config/account.config.js。浏览器已验证身份切换、刷新保留、跨页一致性，无控制台错误；已有业务记录保留原创建人。

## 弹层一致性修正

新增 pages/report-form.html（日报表新增/编辑）及 pages/review.html（项目审核）。原进场管理页签恢复85%右侧抽屉，项目表单45%，人员/现场/类型648px，风险库25%，风险点45%；导入保留800px居中弹窗。完整证据和待确认项见 reference/FIDELITY_AUDIT.md。

## 本次两级审批优化

新增审核记录入口 `pages/audit-records.html?id=P1`，新增 `config/project-approval.config.js`、`services/approval-service.js`、`components/review-changes.js`。项目新增/编辑/只读详情和审核/记录页面统一使用两级流程与八类材料标题。变更处黄色标记；上传数量、格式、大小沿用基线。详情见 reference/TWO_STEP_CHANGELOG.md。

## 2026-10-20 评审优化
六项资料、审查跳转、逐项结论、一审履职频次、二审意见、右侧审核时间线及退场/延期弹层均已接入既有页面与Repository。变更、验证及字典边界见 [评审调整](reference/REVIEW_UPDATE_2026-10-20.md)。

## 来宾项目表单（2026-10-20，仅本地）
共用选人、图片上传/预览、关联企业见 components/project-form.js；目录配置见 config/project-directory.config.js；企业引用同步见 services/project-partners-service.js。保存与取消按父表单草稿处理。说明见 reference/PROJECT_FORM_LOCAL_2026-10-20.md。未经用户明确指令，不提交、不推送。
