# AGENTS.md
> 微信原生小程序项目，Codex Agent 执行任务前必须阅读。遵循最小MCP模式。

## 基础信息
- 项目：微信原生小程序（wxml/wxss/js/json），默认不使用Taro/uni-app
- 基础库最低版本：2.24.0
- UI标准：以Figma设计稿为准，750rpx；只实现需求核心功能，次要功能标记`// TODO:`暂不开发
- 未经用户确认，禁止引入npm第三方包

## 目录结构
├── app.js/app.json/app.wxss
├── pages/      # 页面目录，单页面独立文件夹，命名小写 + 短横线
├── components/ # 通用自定义组件
├── utils/      # 工具函数、请求封装
├── api/        # 接口请求
├── static/     # 图片静态资源
├── styles/     # 全局样式变量
└── project.config.json


## 编码规范
1. WXML：使用`bind:tap`；`wx:key`禁止使用index；image增加mode与lazy-load；复杂逻辑放js。
2. WXSS：单位rpx；class命名`page-xxx`/`comp-xxx`；禁止id、标签选择器。
3. JS：原生Page/Component；接口统一封装request；异步增加try/catch；变量采用小驼峰。
4. JSON：按需配置，不冗余申请隐私权限。

## Git规范
- Commit格式：`type(模块):描述`，type可选：feat/fix/style/refactor/docs/chore
- 单次提交只做单一功能。项目初始化创建.gitignore，忽略 node_modules、miniprogram_npm、project.private.config.json、.DS_Store、.vscode

## Agent强制规则
1. 修改代码前读取原文件，禁止盲目覆盖原有业务。
2. 输出完整文件代码，多文件修改分开展示，不输出片段。
3. 需求存在歧义，先询问用户，不自行猜测实现。
4. 页面跳转严格区分API：wx.navigateTo / wx.switchTab / wx.reLaunch；表单增加防重复点击。
5. 定位、相册、手机号等隐私API，必须处理用户授权拒绝场景。
6. UI必须实现默认态、loading、空状态、错误状态；色值/间距/圆角对齐Figma。
7. 任务完成输出：变更说明 + 自测清单 + TODO列表。

## 权限策略
- 遵循最小MCP，不额外开发需求外功能；高危操作等待用户审批。
