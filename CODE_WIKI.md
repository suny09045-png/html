# Code Wiki - 登录管理系统

## 1. 项目概述

### 1.1 项目简介

本项目是一个基于 Web 的后台登录管理系统，主要功能包括：

- **用户身份验证**：提供管理员登录入口，支持用户名/密码认证
- **多站点配置管理**：通过 `mid`（商户 ID）区分不同站点，实现多租户支持
- **全局配置同步**：统一管理各站点的配置信息（余额、积分、虚拟币等）
- **通知系统集成**：支持系统公告和通知弹窗功能
- **第三方追踪集成**：集成 Cloudflare 性能监控

### 1.2 技术栈

| 类别 | 技术/框架 | 版本 | 用途 |
|------|----------|------|------|
| 前端框架 | 原生 JavaScript | ES6+ | 核心业务逻辑 |
| UI 框架 | LayUI | 2.x | 页面组件和弹窗 |
| 依赖库 | jQuery | 3.x | DOM 操作和 AJAX |
| 样式 | CSS3 | - | 页面样式和动画 |
| 后端通信 | Fetch API | - | 数据请求 |
| 监控服务 | Cloudflare Insights | - | 性能监控 |

### 1.3 目录结构

```
/workspace/
├── login/                           # 登录系统根目录
│   ├── _DataURI/                    # 数据 URI 资源
│   │   └── data.0d37f6de9dded8.txt
│   ├── notice.flashgo.cc/          # 通知服务模块
│   │   ├── api/
│   │   │   └── site-info.html      # 站点信息 API 接口
│   │   └── js/
│   │       └── common.js            # 通知系统核心脚本
│   ├── static.cloudflareinsights.com/  # Cloudflare 监控
│   │   └── beacon.min.js/
│   └── zpx.belmorian.com/           # 主站点域目录
│       ├── _admin/                  # 管理后台模块
│       │   ├── js/
│       │   │   ├── common/          # 公共 JS 库
│       │   │   │   ├── jquery.min.js
│       │   │   │   └── jquery.cookie.js
│       │   │   ├── jquery-core.min.js
│       │   │   └── fai.min.js
│       │   ├── layui/               # LayUI 组件库
│       │   │   ├── css/
│       │   │   │   ├── layui.css
│       │   │   │   └── modules/
│       │   │   └── layui.all.js
│       │   ├── jsmethod/
│       │   │   └── user_login.js    # 登录核心逻辑
│       │   └── login.html          # 登录页面入口
│       ├── cdn-cgi/
│       │   └── rum.html
│       ├── public/
│       │   └── configuration.js     # 全局配置加载器
│       └── user/
│           └── systemconfig.html    # 系统配置 API
└── .git/                            # Git 版本控制
```

---

## 2. 主要模块职责

### 2.1 登录模块 (`_admin/login.html` + `jsmethod/user_login.js`)

**职责**：
- 渲染登录界面（用户名、密码输入框）
- 处理用户登录表单提交
- 与后端 `/admin/login` 接口交互
- 管理登录令牌（Token）存储
- 页面样式和交互效果

**核心流程**：
```
用户输入 → 表单验证 → AJAX 提交 → 后端验证 → 令牌存储 → 页面跳转
```

### 2.2 配置管理模块 (`public/configuration.js`)

**职责**：
- 从后端 `/user/systemconfig` 获取站点全局配置
- 管理多租户环境变量（通过 `mid` 区分）
- 定义系统功能开关（余额、积分、虚拟币等）
- 提供全局配置访问接口

**配置项分类**：
| 类型 | 变量 | 说明 |
|------|------|------|
| 基础信息 | `global_title`, `global_appname`, `global_skin` | 站点标题、应用名、皮肤 |
| 下载配置 | `global_downappurl`, `global_appversion` | APP 下载地址和版本 |
| 功能开关 | `global_isbalance`, `global_iscurrency` 等 | 各功能模块开关 |
| 名称配置 | `global_balancename`, `global_currencyname` 等 | 各模块显示名称 |
| 业务开关 | `isvip`, `isgroup`, `istrust` 等 | 会员、团购等业务开关 |

### 2.3 通知系统模块 (`notice.flashgo.cc/js/common.js`)

**职责**：
- 检测并显示系统公告弹窗
- 获取站点信息（`site-info` API）
- 第三方追踪集成（`__twt__` 配置）
- 管理弹窗显示逻辑（支持关闭和参数控制）

### 2.4 第三方服务模块

**Cloudflare Insights** (`static.cloudflareinsights.com`)：
- 收集真实用户性能数据
- 监控页面加载时间
- 提供 CDN 边缘性能分析

---

## 3. 关键类与函数说明

### 3.1 登录模块 (`user_login.js`)

#### `sub()` - 登录提交函数

```javascript
function sub()
```

**功能**：处理登录表单提交

**参数**：无

**返回值**：无（通过 AJAX 与后端交互）

**流程**：
1. 显示加载动画 (`$('.loadingbar3').show()`)
2. 获取用户名和密码
3. 表单验证（检查必填项）
4. 发送 AJAX 请求到 `/admin/login`
5. 根据返回状态处理结果

**状态码处理**：
| 状态码 | 行为 |
|--------|------|
| `state == 1` | 存储 Token，跳转到管理后台 |
| `state == 2` | 显示错误消息 |
| 其他 | 显示错误消息 |

---

#### `setout()` - 退出登录函数

```javascript
function setout()
```

**功能**：清除登录 Token，实现退出登录

**参数**：无

**返回值**：无

---

#### `togglePwd()` - 密码显示切换

```javascript
function togglePwd()
```

**功能**：在密码输入框和文本输入框之间切换

---

#### `resizeWindow()` - 窗口调整处理

```javascript
function resizeWindow()
```

**功能**：响应式调整页面元素尺寸

---

#### `showQrCode()` - 二维码显示控制

```javascript
function showQrCode()
```

**功能**：控制二维码显示区域（当前已禁用）

---

### 3.2 配置模块 (`configuration.js`)

#### `GetQueryString(name)` - URL 参数获取

```javascript
function GetQueryString(name)
```

**功能**：从 URL 查询字符串中获取指定参数值

**参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `name` | string | 是 | 参数名称 |

**返回值**：string | null - 参数值或 null

**示例**：
```javascript
var mid = GetQueryString("mid");  // 获取商户 ID
```

---

#### `gotojump(url)` - 站内页面跳转

```javascript
function gotojump(url)
```

**功能**：在当前站点内跳转页面，自动附加 `mid` 参数

---

#### `jumpadmin(url)` - 管理后台跳转

```javascript
function jumpadmin(url)
```

**功能**：跳转到管理后台页面

---

#### `getpaytypename(paytypeid)` - 支付类型名称获取

```javascript
function getpaytypename(paytypeid)
```

**功能**：根据支付类型 ID 返回可读名称

**参数映射**：
| paytypeid | 返回值 |
|-----------|--------|
| 1 | `global_balancename` (余额) |
| 2 | `global_currencyname` (虚拟币) |
| 3 | `global_integralname` (积分) |
| 4 | "汇款支付" |
| 5 | "在线支付" |
| 12 | "账户支付" |
| 其他 | "未支付" |

---

#### `x_admin_show(title, url, w, h)` - 弹窗打开

```javascript
function x_admin_show(title, url, w, h)
```

**功能**：使用 LayUI layer 打开一个新页面弹窗

**参数**：
| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `title` | string | false | 弹窗标题 |
| `url` | string | "404.html" | 请求的 URL |
| `w` | number | 窗口宽度 90% | 弹窗宽度(px) |
| `h` | number | 窗口高度-50px | 弹窗高度(px) |

---

### 3.3 通知模块 (`common.js`)

#### `getMid()` - 获取商户 ID

```javascript
function getMid()
```

**功能**：从当前页面 URL 获取 `mid` 参数

---

#### `shouldShowNotice()` - 通知显示判断

```javascript
function shouldShowNotice()
```

**功能**：检查是否应该显示通知弹窗

**判断条件**（满足任一则不显示）：
- URL 参数包含 `no_notice`
- URL 参数包含 `noNotice`
- URL 参数 `notice` 为 "0"、"false"、"off"

---

#### `applySiteName(siteName)` - 站点名称应用

```javascript
function applySiteName(siteName)
```

**功能**：将站点名称应用到页面标题和指定元素

---

#### `openNoticeModal()` / `closeNoticeModal()` - 弹窗控制

```javascript
function openNoticeModal()
function closeNoticeModal()
```

**功能**：显示/关闭通知弹窗

---

#### `getSiteInfo(mid)` - 获取站点信息

```javascript
async function getSiteInfo(mid)
```

**功能**：从通知服务 API 获取站点详细信息

**返回值**：Promise<SiteInfo> - 站点信息对象

---

## 4. 依赖关系

### 4.1 前端依赖

```
login.html
├── jQuery (jquery.min.js)
│   └── AJAX 请求、DOM 操作、Cookie 管理
├── LayUI (layui.all.js + layui.css)
│   └── 弹窗 (layer.msg)、表单验证
├── configuration.js (公共配置)
│   └── 全局变量定义
├── fai.min.js (Fai 工具库)
│   └── Cookie 操作 (Fai.Cookie)
├── jquery.cookie.js
│   └── Token 存储
└── user_login.js (业务逻辑)
    └── 登录流程处理
```

### 4.2 外部依赖

| 服务 | CDN 地址 | 用途 |
|------|----------|------|
| Cloudflare Insights | `static.cloudflareinsights.com/beacon.min.js` | 性能监控 |
| 通知服务 | `notice.flashgo.cc/js/common.js` | 系统公告 |

### 4.3 后端 API 依赖

| 接口 | 方法 | 参数 | 用途 |
|------|------|------|------|
| `/admin/login` | POST | `aname`, `lpwd`, `mid` | 用户认证 |
| `/user/systemconfig` | POST | `token`, `mid` | 获取站点配置 |
| `/api/site-info` | GET | `mid` | 获取站点信息（通知服务） |

---

## 5. 项目运行方式

### 5.1 环境要求

- **Web 服务器**：支持静态文件托管（nginx/Apache/Node.js 等）
- **浏览器**：现代浏览器（Chrome 60+, Firefox 55+, Safari 11+, Edge 79+）
- **网络**：能够访问后端 API 服务

### 5.2 本地开发

1. **启动静态服务器**：
   ```bash
   # 使用 Python
   python -m http.server 8080

   # 使用 Node.js
   npx serve .

   # 使用 PHP
   php -S localhost:8080
   ```

2. **访问页面**：
   ```
   http://localhost:8080/zpx.belmorian.com/_admin/login.html?mid=115
   ```

3. **参数说明**：
   - `mid`：商户/站点 ID（必填）
   - `out=1`：退出登录

### 5.3 生产部署

1. 将 `login/` 目录部署到 Web 服务器
2. 配置服务器将请求代理到后端 API
3. 确保后端服务可访问：
   - `/admin/login` - 登录接口
   - `/user/systemconfig` - 配置接口

### 5.4 登录流程示例

```
1. 用户访问: /_admin/login.html?mid=115

2. 前端加载配置:
   configuration.js → GET /user/systemconfig
   → 获取全局配置（标题、名称、功能开关等）

3. 用户输入账号密码，点击登录:
   user_login.js → POST /admin/login
   → 后端验证 → 返回 Token 和状态

4. 登录成功:
   $.cookie('admin_token', newtoken)
   → location.href = '/_admin/main?mid=115'

5. 加载通知模块:
   common.js → GET /api/site-info?mid=115
   → 判断是否显示通知弹窗
```

---

## 6. 数据结构

### 6.1 系统配置响应 (systemconfig)

```javascript
{
  "state": 1,                    // 状态码：1=成功
  "message": null,
  "newtoken": null,
  "mid": null,
  "info": {
    "mid": 115,                  // 商户 ID
    "domain": "https://zpx.belmorian.com",
    "mname": "Shopify",          // 商户名称
    "web_open": 1,               // 网站开关
    "logo": "default.png",       // Logo 文件
    "global_title": "在线商城",   // 站点标题
    "global_skin": "num001",     // 皮肤主题
    "global_appname": "AppName",
    "global_appversion": "1.0.0",
    "global_downappurl": "http://...",
    "global_isbalance": 1,       // 余额功能开关
    "global_iscurrency": 1,      // 虚拟币功能开关
    "global_isintegral": 1,      // 积分功能开关
    "global_isdeposit": 1,       // 储蓄金功能开关
    "global_balancename": "优惠券",
    "global_currencyname": "我的奖金",
    "global_integralname": "推广奖金",
    "global_depositname": "代金券",
    "global_regvcode": 0,        // 注册验证码开关
    "isvip": 0,                  // VIP 功能
    "isgroup": 1,                // 团购功能
    "istrust": 0,                // 信任功能
    "delivername1": "送货上门",
    "delivername2": "到店自提",
    "faretpname": "运费",
    "withdrawal_name": "提现",
    "pv_name": "PV",
    "exp_name": "EXP"
  },
  "islogin": 0                   // 是否已登录
}
```

### 6.2 登录响应 (login)

```javascript
{
  "state": 1,                    // 状态码：1=成功, 2=需验证, 其他=失败
  "message": "登录成功",         // 消息
  "newtoken": "xxx",            // 新生成的 Token
  "mid": 115                    // 商户 ID
}
```

---

## 7. 安全注意事项

1. **Token 存储**：登录令牌存储在 Cookie 中，建议生产环境设置 `HttpOnly` 和 `Secure` 标志
2. **密码传输**：当前为明文传输，建议生产环境使用 HTTPS + 加密传输
3. **CORS 配置**：需要后端正确配置 CORS 策略
4. **CSRF 防护**：建议后端实现 CSRF Token 验证
5. **敏感信息**：配置文件中的密钥信息需要后端管理

---

## 8. 更新日志

| 日期 | 版本 | 描述 |
|------|------|------|
| 2022-06-28 | 1.0 | 初始版本，基础登录功能 |
| - | - | 支持多站点配置管理 |
| - | - | 集成通知系统 |
