# JLPT 日本語挑戦

一個以繁體中文為介面的 JLPT N5～N1 分級日文能力測驗網站，提供單字、漢字、文法與閱讀題型，完成後可立即查看解析、分類成績與需要加強的項目。預設推薦 N3，適合作為中期學習目標。

[線上體驗](https://jlpt-n4-challenge.stn011391.chatgpt.site)

## 目前版本

**v1.3.0**

版本異動請參考 [CHANGELOG.md](CHANGELOG.md)。

## 功能

- N5、N4、N3、N2、N1 五級自由選擇
- 每級 500 題，共 2,500 題分級題庫
- 每次依固定比例隨機抽取 20 題（8 題單字漢字、6 題文法、6 題閱讀）
- 每次開始自動換新題，優先安排尚未出現的單字與不同文法重點
- 每級含 200 個不同的單字／漢字讀音學習重點
- 同級連續 25 次測驗、共 500 題不重複，完成後才自動開始新一輪
- 單字・漢字、文法、閱讀三類題型
- 依級別設定 20～40 分鐘倒數計時
- 每題即時中文解析
- 分類正確率與弱點分析
- 錯題重練
- 裝置端分級保存個人最佳成績
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

- **app/page.tsx**：分級選擇與主要測驗互動
- **app/questions.ts**：N5～N1 分級題庫與難度設定
- **app/vocabulary-data.ts**：N5～N1 單字與讀音資料
- **app/question-selection.ts**：20 題隨機抽題與 500 題不重複循環
- **app/globals.css**：網站視覺與響應式版面
- **app/layout.tsx**：網站標題與頁面資訊
- **VERSION**：目前正式版本
- **CHANGELOG.md**：歷次版本內容
- **THIRD_PARTY_NOTICES.md**：第三方題庫資料與授權說明

## 授權

本專案目前供個人學習與測試使用。第三方單字資料的來源與授權請參考 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
