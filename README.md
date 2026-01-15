<!-- markdownlint-disable MD033 -->
<div align="center">

# 实训 H5 作品

# 🧨 安全回家过大年，春运风险防控指南

<p>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg?logo=vue.js" alt="Vue 3">
  <img src="https://img.shields.io/badge/GSAP-3.12-88CE02.svg?logo=greensock" alt="GSAP">
  <img src="https://img.shields.io/badge/Swiper-11-6332F6.svg?logo=swiper" alt="Swiper">
</p>

[![Moe Counter](https://count.getloli.com/get/@DBJD-CR3?theme=moebooru)](https://github.com/DBJD-CR/H5_for_Chunyun)

**"列车睡觉防偷手，贵重物品随身走；接水只接三分二，平安到家乐悠悠"**  

[📖 项目介绍](#introduction) • [✨ 特色功能](#features) • [🎮 玩法指南](#gameplay) • [🛠️ 技术栈](#tech-stack) • [🚀 快速开始](#quick-start)

</div>

---

<span id="introduction"></span>

## 📖 项目介绍

这是一个简单的 H5 互动网页作品。正值春运高峰期，本项目通过趣味闯关的形式，模拟旅客在 **购票、接驳、候车、乘车** 四个典型场景中可能遇到的安全风险。

用户需要运用安全知识破解难题，收集“安全锦囊”口诀，旨在提高大众的防诈骗、防盗窃及人身安全意识，助力大家平平安安回家过年！🧧

<span id="features"></span>

## ✨ 特色功能

- **🗺️ 沉浸式闯关地图**：采用游戏化地图设计，循序渐进解锁关卡。
- **🧩 多样化交互玩法**：
  - **答题辨析**：单选/多选判断真假 12306 及诈骗电话。
  - **情景模拟**：模拟网约车选车、发送实时定位。
  - **眼力挑战**：在候车厅背景中寻找隐藏的安全隐患（找茬模式）。
  - **QTE 互动**：长按按钮控制接热水水位，模拟真实物理反馈。
- **🎒 安全锦囊背包**：每过一关解锁一条朗朗上口的防范口诀，随时在背包中查看。
- **🎵 视听体验**：全程背景音乐、操作音效及口诀语音朗读，氛围感拉满。
- **📱 移动端适配**：针对手机竖屏优化的 UI 设计，操作流畅。

<span id="gameplay"></span>

## 🎮 玩法指南

游戏共分为四个关卡，需按顺序通关：

### 第 1 关：🎫 购票反诈

> **任务**：识别正规购票渠道，拒绝黄牛与钓鱼链接。

- **玩法**：根据题目情境，选择正确的购票方式或识别诈骗陷阱。

### 第 2 关：🚗 接驳防黑

> **任务**：离开火车站后，安全乘坐交通工具。

- **玩法**：
  1. 从三辆车中选出正规的网约车或出租车。
  2. 模拟上车后的安全操作（如：点击手机图标分享定位给家人）。

### 第 3 关：🎒 候车防盗

> **任务**：在人流密集的候车厅守护财产安全。

- **玩法**：观察画面，点击找出 **3 处** 安全隐患（如：拉链没拉的背包、无人看管的手机、插队推搡）。

### 第 4 关：🚄 乘车安全

> **任务**：列车旅途中的防盗与防烫伤。

- **玩法**：
  1. 选择手机存放的最佳位置（贴身口袋）。
  2. **长按** 接水按钮，控制水位在红色安全线附近（约 2/3 处）松手，避免水满溢出烫伤。

---

<span id="tech-stack"></span>

## 🛠️ 技术栈

本项目使用原生 Web 技术构建，轻量级且易于部署：

- **核心技术**: HTML5, CSS3, JavaScript (ES6+)
- **前端框架**: [Vue.js 3](https://vuejs.org/) (通过 CDN 引入，使用 Composition API)
- **动画交互**:
  - [GSAP](https://greensock.com/gsap/) (动效支持)
  - [Swiper](https://swiperjs.com/) (场景切换与轮播)
  - CSS3 Keyframes (呼吸灯、水流、雷达波等动画)
- **美术资源**: SVG 绘图 (地图连线), MP3 音效

## 📂 项目结构

```text
├── index.html          # 主入口文件 (结构)
├── script.js           # 核心逻辑 (Vue 3, 状态管理, 游戏逻辑)
├── style.css           # 样式表 (响应式布局, 动画效果)
├── README.md           # 项目说明文档
├── audio/              # 音频资源目录 (口诀, BGM, 音效)
└── img/                # 图片资源目录 (背景, 选项图)
```

<span id="quick-start"></span>

## 🚀 快速开始

本项目为纯静态网页，无需复杂的后端环境。

1. **克隆项目**

   ```bash
   git clone https://github.com/DBJD-CR/H5_for_Chunyun.git
   ```

2. **运行**
   - **推荐**：使用 VS Code 安装 **Live Server** 插件，右键 `index.html` 选择 "Open with Live Server"。
   - 或者直接双击 `index.html` 在浏览器中打开（部分音频自动播放功能可能会受浏览器策略限制，建议使用本地服务器环境）。

---

> [!TIP]
> 本项目的相关开发数据：
>
> 开发时长：累计 2 天（主网页部分）
>
> 累计工时：约 9 小时
>
> 使用的大模型：Gemini 3.0 flash & Pro (With RooCode in VSCode)
>
> 对话窗口搭建：VSCode RooCode 扩展
>
> Tokens Used：11,430,770
