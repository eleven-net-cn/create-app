# 简介

create-app 是为复杂的企业级业务开发而设计，着力解决业务模板的开发、维护问题，将复杂的业务场景拆解为独立可集成的单元。

并且，吸收了社区内优秀项目脚手架的设计思路，例如参考了 [create-vue](https://github.com/vuejs/create-vue) 合并多次渲染的方式、借鉴了 [taro-cli](https://github.com/NervJS/taro/tree/main/packages/taro-cli) mem-fs 的处理方式，

越复杂的业务场景，将能发挥越大的价值。

## 为什么开发 create-app

流行的脚手架工具存在各种问题，最重要的有以下几点：

1. **几乎全都不能热更新调试模板**，模板的测试较为浪费时间
2. **大多数不能自由组合模板**，而仅仅从固定模板创建或从仓库下载，当我们有多个模板时持续维护较为困难

工作中，我需要为团队开发一款更棒的脚手架工具，这是最初写代码的动力。

## QA

1. 当前内置的 template-react/template-vue 似乎仅仅集成了社区三方命令创建方式？

    **A：**本仓库既是完整的企业级脚手架开发模板，也是我个人自用的 CLI，因此，当前我仅仅编写日常会使用的社区主流方案，而未编写复杂的业务单元。

    实际投入前端团队使用时，应当基于此项目，设计更加复杂的 Template。

    如下结构所示，`template/preset/`、`template/solution/` 将是 CLI Template 真正需要编写的核心逻辑，将团队日常开发使用到的埋点上报、异常监控、登录 SDK、JSBridge 等等都预置，在 prompts 中支持创建时选用。

    ```bash
    @e.fe/template-xxx/
    ├── src/              # 模板脚本
    │   ├── index.ts
    │   ├── prompts.ts
    │   └── types.ts
    ├── template/         # 模板文件目录
    │   ├── base/             # 基础项目文件
    │   ├── preset/           # 预置的各类解决方案（如：埋点上报、异常监控、登录 SDK、JSBridge 等）
    │   └── solution/         # 业务解决方案（如：C 端模板、Admin 管理后台等），允许预置 preset 中的若干配置方案
    ├── README.md
    └── package.json
    ```