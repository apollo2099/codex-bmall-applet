# codex-bmall-applet · 优选集市电商小程序

一个可直接运行的微信小程序电商示例，覆盖 **购物车、商品、订单、用户** 四大模块，界面采用 **Figma 风格设计系统**（中性画布 + 1px 描边 + 墨黑主按钮，品牌色只用于强调）。
项目内置模拟接口与演示数据，不需要后端服务即可完整走通「浏览商品 → 加入购物车 → 下单 → 支付 → 查看订单 → 管理收货地址」的全链路。

## 一、如何运行

1. 打开 **微信开发者工具**，选择「导入项目」。
2. 目录选择本文件夹（`codex-bmall-applet`）。
3. AppID 选择「测试号」即可（项目已配置 `touristappid`）。
4. 编译后即可使用。**数据全部来自后端 `codex-bmall`**，请先按「四、接入真实后端」启动后端并初始化数据库；
   若想完全离线体验，把 `services/request.js` 的 `USE_MOCK` 改为 `true` 即切换回内置模拟数据。

> 项目未使用任何图片资源，商品图由「渐变底色 + emoji」占位渲染，因此不会出现图片加载失败。
> 接入真实商品图后，只需给商品数据补上 `cover` 字段，页面模板无需改动。

## 二、功能清单

### 商品模块
- 首页：搜索入口、轮播位、分类金刚区、热销榜单、猜你喜欢（分页加载 + 下拉刷新）
- 分类页：左侧一级分类联动右侧商品列表
- 列表页：综合 / 销量 / 价格排序、上拉加载更多、空状态
- 搜索页：搜索历史（本地留存，最多 10 条）、热门搜索、结果列表
- 详情页：价格与原价对比、服务保障、商品亮点与参数、相关推荐
- 规格弹层：多规格选择（颜色 / 版本 / 尺码等）、数量步进器、加入购物车与立即购买

### 购物模块（购物车）
- 加购自动合并同商品同规格、数量增减（受库存约束）
- 单选 / 全选、实时合计金额、编辑模式批量删除、单条删除
- 结算时写入「结算草稿」，下单成功后自动清理已购商品
- 空购物车时展示推荐商品，底部自定义导航栏实时显示角标数量

### 订单模块
- 确认订单：收货地址选择、商品清单、满减计算、运费规则（满 99 包邮）、支付方式、订单备注
- 提交订单 → 模拟微信支付 → 状态流转（待付款 → 待收货 → 已完成）
- 订单列表：按状态筛选（全部 / 待付款 / 待收货 / 已完成）、各状态数量角标
- 订单操作：去支付、取消订单、确认收货、删除订单、再次购买、复制订单号
- 订单详情：状态头、物流时间轴、收货信息、商品明细、金额明细、订单信息

### 用户模块
- 登录 / 退出（模拟登录态与 token 缓存）
- 个人资料：昵称、头像、手机号修改
- 收货地址：新增、编辑、删除、设为默认；下单页可直接选择地址
- 我的订单入口与数量提醒、积分 / 优惠券 / 余额 / 收藏数据展示
- 「清空演示数据」可一键重置本地订单、地址、购物车与登录态

## 三、目录结构

```
codex-bmall-applet/
├── app.js / app.json / app.wxss      # 全局配置、启动逻辑、公共样式变量
├── custom-tab-bar/                   # 自定义底部导航（含购物车角标）
├── components/
│   ├── goods-card/                   # 商品卡片（grid / list 两种排版）
│   ├── stepper/                      # 数量步进器
│   └── empty/                        # 空状态
├── pages/
│   ├── index/                        # 首页
│   ├── category/                     # 分类
│   ├── search/                       # 搜索
│   ├── goods/list/ goods/detail/     # 商品列表、商品详情
│   ├── cart/                         # 购物车
│   ├── order/confirm|list|detail/    # 确认订单、订单列表、订单详情
│   └── user/ index|address|profile/  # 用户中心、地址管理、资料
├── design/tokens.json                # 设计 token，可导入 Figma（Tokens Studio）
├── styles/icons.wxss                 # 线性图标系统（内联 SVG，无图片资源）
├── services/                         # 业务服务层（页面只依赖这一层）
│   ├── request.js                    # 请求封装（mock / 真实接口切换开关）
│   ├── goods.js / cart.js / order.js / user.js / address.js / checkout.js
├── mock/                             # 模拟后端
│   ├── goods.js                      # 商品、分类、轮播数据
│   ├── db.js                         # 订单 / 地址 / 用户的本地存储模拟数据库
│   ├── server.js                     # 路由表形式的模拟接口
│   └── seed.js                       # 首次启动的演示数据
└── utils/                            # 金额、时间、存储、事件订阅等工具
```

分层关系：**页面 → services → request → mock/server（或真实后端）**。
页面不直接拼接口地址，因此替换后端时只改 `services` 一层。

## 四、接入真实后端

### 1. 启动后端并初始化数据

```bash
# 1) 初始化数据库（本地 MySQL 8，脚本幂等）
mysql -h127.0.0.1 -uroot -p < ../codex-bmall/db/init.sql
# 2) 启动后端（需 JDK 17），默认端口 8080
java -jar ../codex-bmall/target/codex-bmall-1.0.0-SNAPSHOT.jar
```

初始化脚本会写入 6 个分类、18 个商品、3 条首页轮播、1 个演示用户（手机号 `13800008888`）与 1 个收货地址。

### 2. 配置请求地址

打开 `services/request.js`（`USE_MOCK = false` 表示调用真实后端）：

| 场景 | BASE_URL 配置 |
| --- | --- |
| 微信开发者工具 | `http://127.0.0.1:8080`，并勾选「详情 → 本地设置 → 不校验合法域名」 |
| 真机调试 | 电脑局域网 IP，例如 `http://192.168.1.10:8080`，手机与电脑同一网络 |
| 正式环境 | https 域名，并在小程序后台配置 request 合法域名 |

### 3. 登录说明

登录调用 `POST /auth/login`，当前使用演示手机号 `13800008888` 与固定验证码（后端暂只校验非空），
未注册手机号后端会自动创建用户。**TODO：接入短信验证码后改为用户输入并做真实校验。**

### 4. 接口一览（与 codex-bmall 实际路由一致）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/banners` | 首页轮播 |
| GET | `/categories` | 分类列表 |
| GET | `/products` | 商品列表（categoryId / keyword / sort / page / pageSize） |
| GET | `/products/:id` | 商品详情 |
| GET | `/products/hot` | 热销榜（limit） |
| GET | `/products/recommend` | 推荐商品（limit） |
| POST | `/orders` | 创建订单 |
| GET | `/orders` | 订单列表（userId / status / page / pageSize） |
| GET | `/orders/count` | 各状态订单数量（userId） |
| GET | `/orders/:id` | 订单详情 |
| POST | `/orders/:id/pay｜cancel｜confirm` | 订单操作 |
| DELETE | `/orders/:id` | 删除订单 |
| POST | `/auth/login` | 登录（phone / code） |
| GET/PUT | `/users/:id` | 用户资料 |
| GET/POST | `/addresses` | 地址列表 / 新增（userId） |
| PUT/DELETE | `/addresses/:id` | 地址修改 / 删除 |

### 5. 字段对应关系

- 订单明细字段为 `items`；收货信息为 `receiverName / receiverPhone / receiverAddress`（下单快照）
- 订单状态时间轴由 `createdAt / paidAt / finishedAt` 三个真实时间生成，不臆造节点
- 后端暂无商品规格（SKU）数据，详情页规格弹层只展示数量选择
- 后端暂无积分 / 优惠券 / 余额字段，用户页改为展示手机号与用户 ID，不做假数据展示

购物车数据保存在本地（`wx.setStorageSync`），如需服务端同步购物车，把 `services/cart.js` 中的读写换成接口调用即可，页面无需改动。

## 五、设计系统（Figma 风格）

所有视觉都取自 `app.wxss` 顶部定义的 token，页面样式只引用变量，不写死颜色。

**色彩**

| 用途 | Token | 值 |
| --- | --- | --- |
| 品牌橙（促销、角标） | `--figma-orange` | `#f24e1e` |
| 品牌珊瑚（服饰类强调） | `--figma-coral` | `#ff7262` |
| 品牌紫（美妆类强调） | `--figma-purple` | `#a259ff` |
| 品牌蓝（数码类强调） | `--figma-blue` | `#1abcfe` |
| 品牌绿（完成态、生鲜类） | `--figma-green` | `#0acf83` |
| 主按钮 / 主文字 | `--primary` / `--ink-1` | `#1e1e1e` |
| 链接与可点击文字 | `--link` | `#0d99ff` |
| 描边 / 画布 / 卡片 | `--line-1` / `--canvas` / `--surface-1` | `#e6e6e6` / `#f5f5f5` / `#ffffff` |

**规范**

- 圆角：勾选框 4px、按钮与输入框 6px、卡片 8px、弹层 12px、标签胶囊全圆
- 间距：4 / 8 / 12 / 16 / 20 / 24（px）为唯一节拍，对应 `--sp-1` ~ `--sp-6`
- 描边优先、阴影克制：只有固定底栏与弹层使用阴影，卡片一律 1px 描边
- 字体：Inter + 系统字体回退；标题字重 600 并收紧字距，正文 400
- 商品图统一使用浅色 `tint` 底 + 图标占位，店铺接入真实图片后替换 `cover` 字段即可

**图标**

- 全部界面图标集中在 `styles/icons.wxss`，统一 24×24 网格、1.7px 描边、圆角端点
- 用 `background-image` 内联 SVG 实现，不需要图片资源：默认灰 `#8a8a8a`，选中态 `filter: brightness(0)` 转墨黑，深色底用 `.icon--on-dark`
- 用法：`<view class="icon icon--cart"></view>`；组件内（如自定义 tabBar）通过 `@import "../styles/icons.wxss";` 引入
- 分类入口与功能图标一律使用线性图标；商品图仍用 emoji 占位（代表商品照片），避免风格混杂
- 校验脚本会检查模板里出现的图标名是否都有定义，写错名字会在自检时报错

**多机型适配规范**

- 尺寸一律使用 `rpx`（以 750 设计稿为基准），避免在不同像素密度机型上出现比例错乱
- 固定底栏、底部导航统一使用 `env(safe-area-inset-bottom)` 预留安全区，适配全面屏/带手势条机型
- 分类页的「侧栏 + 商品列表」使用**绝对定位分区**而不是 flex 行：
  `scroll-view` 在微信里无法可靠地作为 flex 项目收缩（其自带 `width: 100%`），
  会把商品卡片挤出屏幕（华为 Mate 20 实测：侧栏被压窄、卡片与加购按钮被裁切）。
  现在的写法是侧栏 `width: 220rpx` 定宽、列表 `left: 220rpx` + `width: calc(100% - 220rpx)`，
  几何完全确定，不依赖引擎的 flex 收缩行为。
- 商品卡片内所有可能变长的文本容器都设置 `min-width: 0`，价格行允许换行，加购按钮 `flex: none`，
  保证长标题（中文/中英混排）不会把卡片撑宽
- 小屏机型（≤ 360px，如 iPhone SE）通过 `@media (max-width: 360px)` 收窄侧栏到 `184rpx`，给商品卡片留出宽度
- 列表底部预留 `calc(180rpx + env(safe-area-inset-bottom))`，避免最后一条被自定义 tabBar 遮挡

`design/tokens.json` 采用 Tokens Studio 格式，可在 Figma 中通过 Tokens Studio 插件直接导入，用于同步设计稿与代码。

## 六、最小可用范围（MVP）

当前工程是**完整演示版**，不是最小版本：13 个页面覆盖了较全的电商链路，方便按需裁剪。
如果按最小可用口径收敛，建议保留与延后的功能如下。

**核心（建议保留）**

| 模块 | 最小实现 |
| --- | --- |
| 商品 | 商品列表 + 商品详情（规格选择）→ `pages/goods/list`、`pages/goods/detail` |
| 购物车 | 加购、改数量、选中、结算 → `pages/cart`、`services/cart.js` |
| 订单 | 确认订单 + 订单列表（付款/取消/收货）→ `pages/order/confirm`、`pages/order/list` |
| 用户 | 登录态 + 收货地址 → `pages/user/index`、`pages/user/address` |

**可延后（删除页面与入口即可，不影响主链路）**

- 首页营销位、热销榜、猜你喜欢 → `pages/index` 可退化为商品列表入口
- 分类页、搜索页 → `pages/category`、`pages/search`
- 订单详情、物流时间轴 → `pages/order/detail`
- 个人资料编辑、会员权益、清空演示数据 → `pages/user/profile` 及 `pages/user/index` 对应工具项

裁剪方式：删除对应页面目录、从 `app.json` 的 `pages` 中移除路径、并删掉页面里的跳转入口即可；`services` 与 `mock` 层无需改动。

## 七、其他说明

- 支付为**模拟支付**（弹窗确认后直接改订单状态）。正式环境需接入微信支付：后端下单拿到 `prepay_id`，前端调用 `wx.requestPayment`，并在支付回调中更新订单状态。
- 登录为**模拟登录**。正式环境应使用 `wx.login` 获取 `code`，由后端换取 `openid` 并签发 token。
- 客服、物流查询等入口已预留，正式环境对接对应开放能力即可。
- 换肤只需修改 `app.wxss` 顶部的 token；`design/tokens.json` 同步后 Figma 设计稿也能保持一致。
- 商品文案与价格均为演示数据，请勿直接用于生产环境。
