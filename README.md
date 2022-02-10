# Gulp Template

這是個使用 gulp 打造的自動化樣板，提供一些簡易的指令，以提升前端網頁開發的效率。

## 測試環境

- Node.js 版本：v14.19.0
- NPM 版本：6.14.16

## Installation

安裝之前，請先確保在本地端電腦中安裝了 Node.js 以及 套件管理工具 NPM。

- 將 gulp 命令列套件安裝於全域環境

```shell
  npm install --global gulp-cli
```

- 安裝 gulp 相關套件

```shell
  npm install
```

## Usage

簡單的使用流程

```shell
  # 開發
  gulp

  # 上線
  gulp build # build 會壓縮優化程式碼
  gulp deploy
```

## Commands

- `gulp`
  執行預設任務。

- `gulp html`
  複製 html 檔案。

- `gulp scss`
  編譯 scss 檔案。

- `gulp bable`
  將 es6 編譯成 es5。

- `gulp build`
  將檔案編譯成待部署狀態。

- `gulp deploy`
  將網頁部署到線上。

## 備註

- gulp-concat 在打包不同 js 檔案時，由於檔案最終會經過 babel 編譯，如果使用相同的變數名稱，會導致衝突進而使得最終的 all.js 檔案無法產生。
