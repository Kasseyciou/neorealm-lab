# NeoRealm LAB

NeoRealm LAB 新境研所的品牌重啟與個人接案網站原型。

目前以 Direction B「Graphite Cinema」為主要發展方向，整合品牌網站、AI 影像、動態敘事與過往網頁作品證據。

## Local preview

這是一個無建置流程的靜態原型。在專案根目錄啟動任一靜態伺服器：

```bash
python3 -m http.server 4173 --directory prototype
```

然後開啟：

```text
http://127.0.0.1:4173/#direction-b
```

## Structure

- `prototype/` — 網站原型、樣式、互動腳本與正式使用素材
- `DESIGN.md` — Direction B 設計系統與互動規範
- `PRODUCT.md` — 產品與內容方向
- `NeoRealm-LAB-Phase-1-Proposal.md` — 第一階段策略與設計提案
- `.impeccable/design.json` — 可機讀的設計系統資料

## Current capabilities

- 動態 KV 與滾動敘事
- Studio sticky story
- IG 作品雙欄瀑布流與桌機游標拖影
- AI 影音與 Web 服務內容
- 過往網站案例瀑布流
- Responsive 與 reduced-motion 支援

