# TSLA 0DTE Trade OS Dashboard

一个简洁的 TSLA 0DTE 仪表盘 MVP，用于判断：

- 今天是否适合交易
- 当前是否允许进场
- 推荐仓位大小
- 是否触发风控停手

> 注意：这是规则驱动的交易辅助工具，不是投资建议，也不是自动交易系统。

## 功能

- Today Status：红 / 黄 / 绿交易状态
- Market State：价格、VWAP、ATR、趋势、成交量
- Trade Window：A / B / C 时间窗口
- Position Size：根据账户、ATR、亏损次数自动计算建议仓位
- Risk Lock：3次亏损或当日亏损达到 -$50 自动提示停止交易
- Manual Inputs：可手动调整市场参数进行模拟

## 本地运行

```bash
npm install
npm run dev
```

打开浏览器访问终端显示的网址。

## 打包

```bash
npm run build
```

## 部署到 GitHub + Vercel

1. 新建 GitHub 仓库，例如：`tsla-0dte-trade-os`
2. 上传本项目所有文件
3. 登录 Vercel
4. Import GitHub Repository
5. 点击 Deploy

## 后续升级方向

- 接入 Alpaca / Polygon / Tradier 实时行情
- 加入期权链数据
- 加入 IV / Greeks / Gamma exposure
- 加入交易日志
- 加入回测模块
- 加入自动化风控提醒

## 风险提示

0DTE 期权风险极高，可能快速亏损本金。本项目仅用于辅助纪律管理和风险控制，不保证盈利。
