# 青葱 - 社交分享应用

一个基于 `React Native + Expo` 开发的现代化社交分享应用，UI 设计参考小红书风格。支持跨平台运行(iOS、Android、Web)，提供流畅的用户体验和丰富的社交功能。

## 技术栈

### 前端框架
- [React Native](https://reactnative.dev/) - 跨平台移动应用开发框架
- [Expo](https://expo.dev/) - React Native 开发工具和运行时
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- [NativeWind](https://www.nativewind.dev/) - 基于 TailwindCSS 的 React Native 样式解决方案
- [Expo Router](https://docs.expo.dev/router/introduction/) - 文件系统路由
- [React Navigation](https://reactnavigation.org/) - 导航管理
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) - 高性能动画库
- [Lottie](https://airbnb.design/lottie/) - 高质量动画效果

### 后端服务
- [Appwrite](https://appwrite.io/) - 开源后端即服务(BaaS)平台
  - 用户认证
  - 数据库
  - 文件存储
  - API 服务

### 开发工具
- `Jest` - 单元测试框架
- `ESLint` - 代码质量检查
- `TypeScript` - 静态类型检查

## 主要特性

### 用户系统
- 邮箱注册/登录
- 个人资料管理
- 用户关注/取关
- 精美的登录注册动画

### 内容分享
- 瀑布流式内容展示
- 图文笔记发布
- 沉浸式内容详情页
- 发布帖子
- 评论互动
- 图片上传
- 内容流展示

### 界面设计
- 仿小红书风格的现代化 UI
- 三栏式布局(发现/关注/个人中心)
- 流畅的动画效果
- 响应式触觉反馈
- Tab 式导航

### 多平台支持
- iOS 应用（优先支持，UI体验最佳）
- Android 应用（持续优化中）
- Web 端适配

> **注意**: 目前应用在 iOS 平台上的适配性较好，Android 平台的 UI 体验仍在优化中。我们欢迎社区贡献者帮助改善 Android 平台的用户体验。

## 开始使用

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发服务器

   ```bash
   npx expo start
   ```

3. 选择运行平台
- 按 `i` 在 iOS 模拟器中运行
- 按 `a` 在 Android 模拟器中运行
- 按 `w` 在网页浏览器中运行
- 使用 `Expo Go` 应用扫描二维码在真机上运行

## 开发环境要求

- `Node.js 16.0` 或更高版本
- `npm` 或 `yarn` 包管理器
- iOS 开发需要 macOS 系统和 `Xcode`
- Android 开发需要 `Android Studio` 和 `Android SDK`

## 贡献指南

欢迎提交 `Issue` 和 `Pull Request` 来帮助改进项目。特别欢迎针对 Android 平台优化的贡献。在提交之前，请确保：

1. 代码通过 `ESLint` 检查
2. 新功能包含适当的测试
3. 遵循项目的代码风格
4. 提交信息清晰明了

## 已知问题

- Android 平台上的部分 UI 组件可能存在显示异常
- Android 平台的动画效果可能不如 iOS 流畅
- 正在积极解决这些问题，欢迎社区贡献

## 许可证

本项目采用 `MIT` 许可证
