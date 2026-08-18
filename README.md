# N4 日本語挑戦

一個以繁體中文為介面的 JLPT N4 日文能力測驗網站，提供單字、漢字、文法與閱讀題型，完成後可立即查看解析、分類成績與需要加強的項目。

[線上體驗](https://jlpt-n4-challenge.stn011391.chatgpt.site)

## 目前版本

**v1.0.1**

版本異動請參考 [CHANGELOG.md](CHANGELOG.md)。

## 功能

- 20 題 N4 模擬測驗
- 單字・漢字、文法、閱讀三類題型
- 25 分鐘倒數計時
- 每題即時中文解析
- 分類正確率與弱點分析
- 錯題重練
- 裝置端保存個人最佳成績
- 桌機免滾動答題介面
- 響應式手機版

## 開發環境

- Node.js 22.13 以上
- React 19
- Next.js / Vinext
- Tailwind CSS 4

## 本機執行

~~~bash
npm install
npm run dev
~~~

正式建置：

~~~bash
npm run build
~~~

## 版本管理規則

本專案採用 [Semantic Versioning](https://semver.org/lang/zh-TW/)：

- PATCH（例如 v1.0.1）：修正題目、文字、版面或小型錯誤
- MINOR（例如 v1.1.0）：增加題庫、練習模式或相容功能
- MAJOR（例如 v2.0.0）：大幅改版或不相容的架構調整

每次進版需同步更新：

1. VERSION
2. package.json 與 package-lock.json
3. CHANGELOG.md
4. Git 標籤 vX.Y.Z

## 專案結構

- **app/page.tsx**：測驗題庫與主要互動
- **app/globals.css**：網站視覺與響應式版面
- **app/layout.tsx**：網站標題與頁面資訊
- **VERSION**：目前正式版本
- **CHANGELOG.md**：歷次版本內容

## 授權

本專案目前供個人學習與測試使用。
