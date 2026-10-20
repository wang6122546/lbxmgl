# 视觉资源来源

以下资源来自用户授权采集的测试系统当前已加载页面，通过浏览器 pageAssets 导出，不包含真实业务附件、个人照片或签名。

- menu-0.svg … menu-5.svg：页面六个主菜单的已渲染SVG。
- empty.png：原 no-data-new-Cdl5vQ6e.png。
- card-bg.png：原 card-bg-BZ9QYn1-.png。
- detail-bg.png：原 detail-bg-BcDqrGii.png。
- status-1.png / status-2.png：原 status_1-Cfb_WhYG.png / status_2-DMXToOKv.png。

来源前缀：https://test-bw.gsafetycloud.com/ehs-construction-safety-mgr-ag/assets/

仅用于该系统前端参考复刻。未采集或再分发真实业务文件。

## 本地PDF导出组件与字体

- jsPDF 4.2.1：来自 npm 官方包，项目 https://github.com/parallax/jsPDF ，本地文件 assets/vendor/jspdf-4.2.1.umd.min.js；MIT许可证见 LICENSE-jspdf.txt。
- LBReviewSans-Regular.ttf：由 Google Fonts Noto Sans SC 的 wght=400 静态实例保留拉丁、中文基本/扩展A、全角与常用标点生成，重命名为LBReviewSans；来源 https://github.com/google/fonts/tree/main/ofl/notosanssc ，OFL许可证见 assets/fonts/OFL-NotoSansSC.txt。字体仅在点击PDF下载时加载，并随PDF嵌入实际使用字符。
- PDF导出运行时只访问本原型站点文件，不依赖CDN或外部接口。
