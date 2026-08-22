# NeoRealm LAB 品牌重啟與個人接案網站設計探索

版本：Phase 1 Research, Strategy, IA, Creative Direction  
日期：2026-08-22  
狀態：概念選擇前，不進入網站實作

## 0. 本階段的執行邊界

使用者的要求是研讀附件並開始執行專案。附件內容在本階段被視為工作範圍、品牌假設與交付規格，不被當成已驗證的市場事實。舊站、Logo、公開參考站與可存取的社群內容才屬於研究證據。

本文件完成研究、定位、內容策略、資訊架構與兩套設計概念。依附件要求，本階段不產生完整網站、首頁原型或正式前端程式碼。

## 1. 結論先行

NeoRealm LAB 最有價值的差異，不是「會使用 AI」，而是能以設計師與 Creative Director 的判斷，把抽象概念導演成影像、動態與可互動的數位世界。

建議核心定位：

> NeoRealm LAB 是一座獨立創意實驗室，以設計導向整合 AI 影像、動態與網頁，把抽象概念轉化成可被看見、感受與進入的新境。

建議英文短句：

> An independent creative lab directing ideas into visual worlds, motion, and digital experiences.

品牌主張：

> I DESIGN NEW REALMS.

這個網站不應像 AI Agency，也不應像傳統接案作品集。它必須同時完成三件事：

1. 在 5 到 8 秒內建立鮮明的創作觀點。
2. 用少量精選作品證明 Design × AI × Motion × Web 的整合能力。
3. 讓品牌方與代理商快速判斷合作方式並開始詢問。

## 2. 研究與證據盤點

### 2.1 舊站稽核

舊站 `/Users/kasseyciou/Desktop/webstandardizer/` 是典型的長頁式個人工作室網站。它以黃色、黑色、六角形服務圖示、技能百分比、龐大作品縮圖牆、固定價目與聯絡表單建立完整接案敘事。

值得保留的不是舊視覺，而是三個更深的品牌資產：

- 把技術原則當成公開主張，而不只是製作細節。
- 用網站本身證明前端與互動能力。
- 「近乎苛求」所代表的個人標準與作者性。

需要退場的內容：

- 黃色、六角形與裝置 Mockup 所代表的時代樣式。
- 技能百分比，因為無法形成可信比較。
- 三欄服務卡與固定價目，容易把策略型創作降格成製作菜單。
- 30 件以上的平均化縮圖牆，讓真正強作失去優先級。
- 過長的 W3C 說明、已失效地圖與過時外掛依賴。

最適合的新舊轉譯句：

> Web Standardizer asked how the web should be built. NeoRealm LAB asks what the web can become.

### 2.2 Logo 稽核

兩份 Logo 皆為 2000 × 856 PNG，提供黑底白字與白底黑字。字標的高對比 Serif「NeoRealm」與理性 Sans Serif「LAB」形成很好的核心張力：編輯感與系統感、想像與實作、世界與實驗室。

後續製作需求：

- 保留原始檔，不直接覆寫。
- 建立透明背景 SVG 或高解析透明 PNG 衍生版。
- 建立橫式、縮寫與極小尺寸版本，避免手機導覽直接縮小大畫布 PNG。
- 定義安全距離、最小尺寸、黑白反轉與影像覆蓋規則。
- Logo Serif 不延伸成全站所有標題字體，避免品牌看起來像復古時尚刊物。

### 2.3 參考網站拆解

- [v7.usestate.org](https://v7.usestate.org/) 把「Developer」身份、Showreel、Selected Works 與 Archive 結合成單一作者敘事。可借鏡的是作品先行與實驗歸檔，不是直接複製巨大黑底字。
- [Atlas Motion](https://atlasmotion.com/) 以單一 Thesis 組織整段捲動敘事，工業影像帶來具體物質感。可借鏡的是先說主張，再展開系統與案例。
- [Yokan Collection](https://yokanka.com/) 用一個問題、克制留白與精準物件攝影建立記憶點。可借鏡的是問句式開場與編輯節奏，而不是模仿日式美學。
- [Mathieu Levesque](https://mathieulevesque.com/en) 的公開專案說明將方向概括為解構式網格、動態字體、影像優先與行動裝置感應互動。可借鏡的是攝影與版式共同形成介面，而非把作品放進制式卡片。[Behance 專案說明](https://www.behance.net/gallery/74387467/Mathieu-Levesque-Website?locale=en_US)

共同啟示：NeoRealm LAB 不需要更多裝飾，而需要一個可被辨認的編排規則，讓影像、動態與網頁案例都像同一位作者的作品。

### 2.4 Instagram 作品牆稽核

稽核證據為使用者於 2026-08-22 提供的 `@neorealmlab` 完整桌面版主頁截圖。截圖可確認 63 篇貼文、3 篇置頂內容、5 組精選動態，以及整體作品分布。由於本機瀏覽器控制層仍無法讀取單篇頁面，本次不推測 caption、互動數據、Reel 實際動態品質、音訊、製作角色或客戶關係。畫面上的影片標記相當頻繁，但不能據此宣稱精確的靜態與動態比例。

#### 作品牆目前傳達的品牌印象

第一印象是高度人物導向的 AI Fashion / Editorial Visual Practice。人物肖像、造型與美妝語彙佔據明顯多數，其次是奇幻、科幻、角色世界觀、產品概念與寵物主題。這證明 NeoRealm LAB 具備快速建立風格、角色與情緒世界的能力，但目前尚未自然傳達「Design × AI × Motion × Web」的完整交集。

| 可見訊號 | 截圖證據 | 對網站的含義 |
| --- | --- | --- |
| 人物與時尚是主體 | 63 格中約 40 格以上以人物、造型、美妝或角色肖像為核心 | 可成為首頁最強的 Editorial 軸線，但需避免相似臉孔與相同半身構圖造成生成式同質感 |
| Cinematic Worldbuilding 已成形 | 龍、奇幻戰鬥、科幻工作站、仿生角色與敘事場景形成可辨識群組 | 適合整理成一至兩組有起承轉合的 Motion / Worldbuilding Case，而非分散成單張圖 |
| 產品敘事具商業潛力 | 香水、食物、飲品概念、機械壓製畫面與 Campaign 式人物情境可見 | 應補上受眾、產品命題、Art Direction 決策與交付物，才能從漂亮圖像轉成商業案例 |
| 寵物、節慶與插畫探索比例不低 | 貓、兔、節慶場景與手繪作品連續出現 | 適合進入 Lab / Afterimage，不宜和首頁 Selected Work 爭奪同等層級 |
| 品牌過程證據稀少 | 最底部僅見字標草圖與名片 Mockup 等少量品牌過程 | 建議保留並擴充，因為這類內容最能證明作者判斷，而不只是生成結果 |
| Web / Digital 幾乎不可見 | 截圖中沒有可明確辨認的網站、介面或互動案例 | 正式上線前必須補入至少一組強 Web Case，否則 60 / 40 定位會被實際內容推翻 |

#### 強項與風險

最強的資產不是單一美學，而是能在 Editorial Fashion、Cinematic Fantasy、Sci-fi Character 與 Product Narrative 之間切換，同時維持精緻、戲劇化與人物中心的視覺語氣。金色光影肖像、黑白時尚、機車造型、香氛情境、龍與科幻場景，是最有機會發展成 Anchor Project 的可見群組。

目前最大的風險是作品以單張圖與高頻輸出的方式並列，讓訪客先感受到「AI 圖像很多」，而不是「這位 Creative Director 如何定義問題、建立系統並完成跨媒介敘事」。NeoRealm 字標覆蓋在大量縮圖上，但比例與位置不完全一致，會把作品推向雜誌封面 Mockup，而非一致的作品識別系統。人物臉型、膚質、取景與姿態也有重複傾向，需要以更嚴格的編輯節奏打破。

Gucci、Coca-Cola、House of the Dragon、Alita 等可辨識品牌或 IP 若非正式委託，必須明確標示為 Self-initiated Concept / Fan Study，避免讓網站暗示不存在的客戶關係。未確認授權前，不建議把這些內容當首頁第一層商業案例。

#### 建議的網站選片群組

1. `Editorial Realms`：金色光影、黑白肖像、機車與造型系列。展示 Art Direction、Casting Logic、Styling、Color Script 與版式系統。
2. `Cinematic Worldbuilding`：龍、奇幻戰鬥、科幻工作站與仿生角色。以 Sequence、Motion、Sound 與世界觀設定重組，不以單張圖數量取勝。
3. `Product Narratives`：香氛、食物與產品情境。只保留能補齊 Brief、目標受眾、概念推導與交付物的案例。
4. `Identity in Process`：NeoRealm 字標草圖、名片與視覺系統演化。連接 Web Standardizer 到 NeoRealm LAB 的品牌重啟故事。
5. `Web / Digital Counterweight`：由舊站可驗證案例或新近網站專案補入。這是發佈前必要內容，不是可選裝飾。

首頁只放 3 到 5 組 Anchor Project，其餘人物變體、寵物、節慶與形式實驗進入 Lab。網站不沿用 Instagram 時序，也不把每篇貼文當成獨立專案。

#### IG 本身的結構調整建議

- Profile Name 可改為 `NeoRealm LAB | Creative Direction` 或 `NeoRealm LAB | AI Visual, Motion & Web`。
- Bio 中的 `AI Solutions & Creator` 與品牌「Design first, AI as medium」衝突，建議改為 `Independent Creative Lab`、`Creative Direction, AI Visual, Motion, Web` 與 `I DESIGN NEW REALMS.`。
- Highlights 由人物或企劃名稱改為訪客可理解的 `Selected / Motion / Visual / Web / Process / About`。
- 三篇置頂建議分別代表 Cinematic Motion、Editorial Campaign、Web / Digital 或 Brand Process，避免三篇都被理解為 AI 人像或世界觀圖片。
- 未來貼文以系列化 Case Carousel 呈現 Problem、Direction、System、Frames、Motion 與 Credits，而不是只持續增加 Finished Image。

#### 對兩案選擇的影響

截圖進一步支持 Concept B `REALMS IN MOTION` 作為創意推薦，因為實際作品庫的 Fashion、Character、Cinematic 與大量影片標記，天然適合以時間軸和場景轉換來編排。但 Concept B 必須加入嚴格的案例文字結構，並以至少一組強 Web / Digital Case 平衡內容，否則網站會放大目前「影像很多、設計判斷太少」的問題。Concept A 仍是較理性、較容易凸顯過程與 Web 能力的選項。

最終選片仍使用以下評分規則，並在取得單篇 caption、原始媒體、角色、權利與成果資料後完成排名：

| 評分面向 | 判斷問題 | 權重 |
| --- | --- | ---: |
| 作者性 | 不看帳號名稱，仍能認出是 NeoRealm LAB 嗎？ | 25% |
| 記憶點 | 三秒後還能描述核心畫面或概念嗎？ | 20% |
| 動態敘事 | 運動是否改變意義，而非只讓畫面動起來？ | 15% |
| 跨媒介延展 | 能否延伸成動態、Campaign 或網站體驗？ | 15% |
| 商業可讀性 | 潛在客戶能否理解可合作的角色？ | 15% |
| 媒體品質與權利 | 是否有足夠解析度、正確比例與公開權利？ | 10% |

首頁只應使用總分最高的 3 到 5 組作品。其餘內容進入 Work Index 或 Lab，不以 Instagram 時序直接搬運。

### 2.5 品牌與內容策略

經策略確認後，不再要求舊 Web 案例填滿固定的 40% 篇幅。新版 NeoRealm LAB 網站本身就是最重要的 Web / Digital Case Study，以視覺系統、資訊架構、互動方向與最終前端實作直接證明現在的能力。舊 Web Standardizer 案例縮成 Selected Archive，只負責建立十年經驗與能力沿革，不進行大量重新包裝。

IG 內容採兩層結構。完整作品用影像牆快速帶過，另從真實 Insights 中選出約 3 則高流量且內容完整的作品作 Featured Work。未來每次 IG 發布都應能同步更新網站，正式技術方案可在 Instagram Graph API、CMS 輔助同步與手動備援之間選擇，前端先透過可替換的 Content Adapter 解耦資料來源。

首頁訊息優先順序調整為：新版網站的設計 Hook、Featured Visual / Motion、持續更新的 IG 影像牆、AI 影音服務方案、精簡舊案沿革、專案詢問。Creative Direction 仍是所有內容的上位敘事。

可操作的雙方向粗略原型已建立於 `/Users/kasseyciou/Documents/ChatGPT/neoRealm Lab/prototype/`。上方 Tab 可直接切換 Concept A 與 Concept B。本階段只比較資訊架構、第一眼構圖與氣質，不代表最終字體、影像選片、動態或開發技術已定案。

建議內容標籤：

- Direction: Creative Direction, Art Direction, Visual System
- Medium: AI Visual, Motion, Film, Web, Interactive
- Context: Fashion, Food, Culture, Lifestyle, Technology
- Status: Commissioned, Self-initiated, Research

不建議以 Midjourney、Runway 或其他工具名稱當主要分類。工具可在製作說明出現，但不能取代創意問題、判斷與成果。

### 2.6 建議轉換路徑

```text
Instagram / Search / Referral
        ↓
第一眼主張與代表作
        ↓
精選案例中的角色、方法與成果
        ↓
Capabilities in Practice
        ↓
Start a Project / Check Availability
```

主要 CTA：Start a Project  
次要 CTA：View Selected Work  
輔助 CTA：Check Availability / Follow on Instagram

聯絡表單只收集 Name、Email、Company、Project Type、Timeline、Budget Range、Message。Budget Range 應可選「Not sure yet」，避免阻擋早期策略合作。

### 2.7 Creative System Pressure Test

為避免只在熟悉的 Portfolio 語法內選風格，Concept A 另外以六種完整世界規則壓力測試。判斷只看 Audience Identification 與 Product Clarity，不把外觀拼貼進品牌。

| 測試世界 | Audience Identification | Product Clarity | Verdict | 提升到 Concept A 的系統紀律 |
| --- | --- | --- | --- | --- |
| 2 a.m. ANSI BBS | Low | Low | Declined | 鍵盤操作、Focus 狀態與稀缺的 Live Presence |
| Split-flap Concourse | Medium | High | Competitive | 每次只發生一個可被讀懂的狀態變化 |
| Wuxia Painted Hoarding | Low | Low | Declined | Hero 靜態畫面本身必須成立，不依賴動畫補救 |
| Pulp Rocket Plate | Low | Low | Declined | 構圖需有清楚方向性，Rule 不可只是垂直裝飾 |
| Gravity-rain Garden | High | Low | Competitive | 全站由一個行為法則統治，避免多套互動 gimmick |
| Sewing Pattern Envelope | High | Medium | Competitive | 將製作、尺寸、角色與決策證據直接標記在作品附近 |

結果不是採用終端機、翻牌、武俠、太空或縫紉外觀，而是提高 Concept A 的鍵盤可用性、狀態清楚度、靜態構圖、單一 Rule Grammar 與製作證據。整頁仍只屬於 NeoRealm LAB 的 Living Standard 世界。

# Concept A: THE MUTABLE STANDARD

中文概念名：可變的新標準

## A1. Concept Name

THE MUTABLE STANDARD / 可變的新標準

## A2. One-sentence Concept

一份持續變形的編輯式創意準則，讓每個 Standard 都打開一個影像、動態或數位新境。

## A3. Brand Strategy

把 Web Standardizer 的「標準」從歷史包袱變成品牌起點。舊品牌關注正確、穩定與相容，新品牌保留這份嚴謹，但把它推進到更主觀的創意導演、AI 影像、動態與互動實驗。

網站不是案例容器，而是一份會被作品持續改寫的 Living Standard。每件作品都回答一個問題：NeoRealm LAB 如何定義新的影像規則、運動規則或數位規則？

## A4. Positioning Direction

> An independent creative lab defining new standards for visual worlds, motion, and digital experience.

客戶感受到的是有方法、有判斷、能落地的作者型工作室，不是追逐 AI 工具的新創公司。

## A5. Three Desired Impressions

1. Precise 精準
2. Provocative 挑釁既定方法
3. Authored 具有清楚作者性

## A6. Keywords

Living standard, editorial system, threshold, evidence, annotation, transformation, visual research, disciplined contrast, authored technology, future craft.

## A7. Complete Visual System

### Palette

- Paper: `#F1EEE7`, 全站主底色。
- Ink: `#141310`, 主要文字與深色段落。
- Signal Vermilion: `#E54B2D`, 唯一功能性強調色。
- Alloy: `#A9A69F`, 註解、時間、次要線條。

不使用紫藍漸層、發光、玻璃卡或純科技藍。深色只在作品進入、Showreel 或頁尾出現，避免黑白交錯沒有節制。

### Typography

- Display Latin: Tiempos Headline 或同級高對比 Editorial Serif，正式採購前確認授權。
- UI Latin: Suisse Intl 或同級中性 Grotesk。
- Traditional Chinese: Noto Serif TC 用於少量觀點標題，Noto Sans TC 用於正文與介面。
- Logo 保持原字標，不以近似字體重新排字。

標題大而短，正文窄欄。英文字可建立強烈比例，中文不做被動縮小版，而使用不同換行與字級。

### Grid and Composition

- Desktop: 12 欄，外距 40 到 64px，欄距 20 到 24px。
- Tablet: 8 欄。
- Mobile: 4 欄，外距 18 到 22px。
- 8px baseline，區段間距採 96 / 144 / 224px 三級。

主畫面以不對稱文字欄、邊界線與全出血媒體交替。作品不用一致圓角卡片，每個媒體框依內容比例決定，但共享同一條對齊規則。

### Graphic Grammar

一條垂直「Rule」貫穿首頁。當作品進入視窗，Rule 會改變位置、粗細或方向，表達標準被作品重新定義。它同時負責區段邊界、焦點狀態與進度，不只是裝飾。

### Image and Video Treatment

- 首頁靜態圖優先使用完整作品，不套相同濾鏡。
- AI 視覺以成品和方向決策為主，生成過程只在 Case Study 出現。
- Motion 使用短 Poster Loop，不用多支影片同時自動播放。
- Web 案例使用真實介面錄影、局部互動錄製與可點擊 Live Site，不使用大量裝置 Mockup。

### UI Geometry

- 直角與 1px hairline 為主。
- 按鈕採文字、底線與狀態變化，不做大型膠囊。
- Tags 是資訊索引，不做彩色 chips 牆。
- 僅 Project Inquiry 使用實心 Vermilion CTA。

## A8. Homepage Storyboard

1. Hero: Logo、小型定位、兩行主張與第一件作品的局部影像。
2. Thesis: 「From Standardizing the Web to Designing New Realms」短句轉折。
3. Selected Work One: AI Motion，Rule 穿過靜態主視覺後變成運動軌跡。
4. Selected Work Two: AI Visual / Art Direction，使用大圖與三條關鍵判斷。
5. Selected Work Three: Web / Interactive，Rule 變成瀏覽器座標與互動焦點。
6. Practice: Image, Motion, Web 不是三張卡，而是三段相互覆寫的能力敘述。
7. Origin: Web Standardizer 至 NeoRealm LAB 的短時間線。
8. Lab: 最新三則實驗與研究狀態。
9. Availability: 目前可承接的合作類型與時間窗。
10. Contact: 短表單與直接 Email。

## A9. Sitemap

```text
Home
Work
  Work Index
  Project Detail
Practice
Origin
Lab
  Experiment Detail
Contact
Privacy
404
```

## A10. Desktop and Mobile Navigation

Desktop 使用固定頂欄。左側為精簡 Logo，右側為 Work、Practice、Origin、Lab、Contact。當進入案例，導覽縮成 Logo、Back to Work、Project Index。

Mobile 使用 Logo 加 Menu 文字，不用抽象漢堡圖示單獨存在。展開後是全高編輯索引，包含 Work、Practice、Origin、Lab、Contact 與語言。離開 Hero 後，底部可出現單行 Start a Project，但不遮擋 9:16 作品。

## A11. Hero Concept and Headline Directions

Hero 以 Paper 底、不對稱排版與垂直 Rule 開場。Logo 位於左上，主標位於右半，第一件代表作被 Rule 切出一條窄幅預覽。主 CTA 在第一屏內可見。

Headline options:

1. I DESIGN NEW REALMS.
2. WHAT COMES AFTER THE STANDARD?
3. FROM WEB STANDARDS TO NEW REALMS.

建議首選 1，副句用「Independent Creative Lab for AI Visual, Motion, and Digital Experience」立即補足商業可讀性。

## A12. Selected Works Approach

首頁只放 3 到 4 件 Anchor Projects。每件以 Title、Context、Role、One-line Outcome 和一個代表媒體進入，不先塞滿工具、年份與所有 Deliverables。

Work Index 才顯示完整清單，並可依 Medium、Context、Status 篩選。首頁以 AI Visual / Motion 與新版網站本身的設計證據為主，舊 Web 案例只保留精簡 Archive。

## A13. AI Portfolio Approach

以 Creative Question 組織，而非工具名稱。例如：

- How can a still image imply a world before it moves?
- How can fashion imagery feel synthetic yet human?
- How can a product acquire a cinematic mythology?

案例必須顯示 Brief、Art Direction、選擇標準、關鍵迭代、Motion Logic 與最終應用。工具放在 Making Notes，避免品牌被綁定特定平台。

## A14. Web Portfolio Approach

每個網站案例先用一句「What changed for the user or brand」說明價值，再展示 IA、Visual System、Responsive Behavior、Motion 與 Performance。

舊 Web Standardizer 案例可建立「Selected Legacy」小節，只收錄仍能證明思考與工藝的 3 到 5 件，不把所有舊縮圖搬回新站。

## A15. Case Study Structure

1. Context
2. Creative Question
3. Direction
4. System
5. Motion or Interaction Logic
6. Making and Iteration
7. Final Experience
8. Outcome or Deliverables
9. Role and Credits
10. Related Experiment / Next Realm

沒有可驗證商業數據時，寫清楚 Deliverables 與設計結果，不捏造成效百分比。

## A16. About and Legacy Story

About 不做長履歷。核心結構：

> Web Standardizer began with a demanding belief: the web should be built with care. NeoRealm LAB carries that standard forward, then opens it to visual direction, AI, motion, and new forms of digital experience.

以三個短節點呈現：Standardize、Experiment、Direct。照片只放一張有工作狀態與空間感的人像，不用企業式大頭照。

## A17. Capabilities Expression

Capabilities 以四條「Ways to Work」展開，不做四張等寬卡：

- Creative and Art Direction
- AI Visual Development
- Motion and Concept Film
- Web and Interactive Experience

每條包含適合情境、可交付內容與典型合作方式。Creative Direction 放第一位，Web 保留從策略到前端的完整能力。

## A18. Lab / Archive Expression

Lab 是研究紀錄，不是次級垃圾桶。條目包含 Question、Medium、State、Date、Finding。可篩選 Image、Motion、Interaction、Process，也可只看 Published 或 In Progress。

每則實驗可短至一個畫面與三句筆記。敏感 Prompt、客戶素材與未授權生成內容不公開。

## A19. Signature Interactions

1. Rule Transform: 垂直線依作品媒介轉成時間軸、裁切線或瀏覽器座標。
2. Focus Preview: 鍵盤或指標聚焦 Work Index 標題時，只更新一個固定媒體預覽。
3. Still / Motion Compare: 使用清楚切換控制比較靜態 Art Direction 與 Motion 結果。
4. Evidence Reveal: 點選註解後展開一個決策證據，不開多層 Modal。
5. Case Progress: 側邊 Rule 表示案例閱讀位置與目前章節。
6. Archive State: Lab 篩選後保留 URL 狀態，便於分享研究視圖。
7. Inquiry Logic: Project Type 會調整後續問題，但不要求註冊。
8. Language Transition: 切換語言保留目前頁面與閱讀位置。

## A20. Motion Principles

- Micro state: 160 到 220ms。
- Editorial reveal: 420 到 600ms。
- Page transition: 650 到 800ms。
- Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)`。
- 一個視窗同時只有一個主要動態事件。
- Rule 的變化負責連接內容，不讓每個標題、圖片與按鈕各自飛入。
- `prefers-reduced-motion` 下保留狀態差異，移除位移、Scrub 與自動播放。

## A21. Mobile Adaptation

- Hero 以靜態 Poster 開場，主標最多兩行，CTA 不被 9:16 媒體推到折線下。
- 12 欄敘事改為 4 欄順序，不把 Desktop 橫向構圖硬縮小。
- Rule 變成左側閱讀軸，避免遮住主要作品。
- Hover 功能改為 Focus、Tap 或明確切換。
- 9:16 Motion 使用專用裁切或專用輸出，不用 `object-fit: cover` 任意切臉。
- 表單欄位單欄，按鈕高度至少 44px，尊重 safe-area。

## A22. Recommended Technology

- Astro + TypeScript，預設靜態輸出與局部互動 Islands。
- Astro Content Collections 管理 Work 與 Lab 的結構化內容，適合大量同型案例資料。[Astro Content Collections](https://v6.docs.astro.build/en/guides/content-collections/)
- `astro:assets` 或影像 CDN 產生 AVIF / WebP 與 responsive sizes。[Astro Image Service](https://docs.astro.build/en/reference/image-service-reference/)
- 原生 CSS + 少量 GSAP，GSAP 僅處理 Rule Transform 與必要的 ScrollTrigger。ScrollTrigger 支援 viewport 觸發、Scrub 與 responsive setup，但不應變成全頁 scroll-jacking。[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- Astro View Transitions 只用於 Work Index 到 Project 的媒體延續，並提供標準導航 fallback。[Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- 初期使用 Git-based content，內容量或協作者增加後再評估 Sanity / Storyblok。

## A23. Performance Risks and Controls

主要風險是多張高解析影像、字型與多個短 Loop。控制方式：

- Hero LCP 使用可在初始 HTML 發現的 Poster，不用 JavaScript 才插入的背景媒體。
- 首屏媒體不 lazy-load，其他圖片與影片才延遲載入。Web performance guidance 建議 LCP 資源在初始 HTML 可被發現，並以 2.5 秒內作為良好 LCP 的目標。[Optimize LCP](https://web.dev/articles/optimize-lcp?hl=en)
- 非首屏影片使用 `poster`、`preload="none"` 與視窗接近時才載入。影片 Lazy Loading 與 Poster 策略可避免不必要下載。[Lazy-loading Video](https://web.dev/articles/lazy-loading-video)
- 同時間最多一支影片播放，離開視窗立即 pause。
- 自架核心字型 WOFF2，Display 最多 2 個 weight，正文 Variable Font 只在檔案確實較小時採用。

暫定驗收預算：Mobile 首屏 Poster 250KB 內、初始 JS gzip 120KB 內、首頁同時解碼影片 1 支。這些是設計預算，不是已達成數據。

## A24. SEO Approach

- 每件主要作品有獨立靜態 URL、Title、Description、OG Image 與可讀正文。
- 使用 Person / ProfessionalService、CreativeWork、VideoObject 與 BreadcrumbList 結構化資料。
- 英文與繁體中文使用 route-based `hreflang`，不只靠前端切換文字。
- Work 標題包含真實產業與媒介，例如「AI Fashion Film Art Direction」，避免堆砌 AI 關鍵字。
- Lab 建立長尾搜尋入口，但只有具備方法、觀察或成果的內容才 index。
- Image alt 描述作品，不塞服務字串；Motion 提供字幕、摘要或 transcript。

## A25. Advantages

- 最能承接 Web Standardizer 歷史，又不落入復古重製。
- 案例與服務清楚，對代理商、品牌方與搜尋引擎都容易理解。
- Content Model 穩定，未來作品持續增加時不會破壞系統。
- 以 Light Editorial 為主，和大量黑底動態作品集形成差異。
- 效能與無障礙較容易達到高標準。

## A26. Risks

- 若作品文字與過程素材不足，可能看起來像設計宣言多於實績。
- Rule 語法若使用過度，會變成形式主義。
- Serif、hairline 與紙張色若處理不準，容易偏向文化刊物，削弱 Motion 能量。
- 需要嚴格選片，不能用大量普通貼文填滿索引。

## A27. Development Difficulty Breakdown

| 工作面向 | 難度 1-5 | 原因 |
| --- | ---: | --- |
| 品牌與編輯系統 | 4 | 規則必須能跨 Image、Motion、Web 而不僵化 |
| 內容建模 | 3 | Work 與 Lab 結構清楚，但需整理舊新資料 |
| Frontend | 4 | Rule Transform、媒體預覽與語言路由需細緻整合 |
| Motion | 3 | 動態集中且可控，不需全頁複雜時間軸 |
| Media Production | 4 | 需要多比例 Poster、Loop 與案例裁切 |
| Accessibility / QA | 3 | 結構自然，但互動預覽需完整鍵盤與 reduced-motion 測試 |

整體難度：4 / 5。主要成本在內容編輯與設計系統，不在堆疊特效。

# Concept B: REALMS IN MOTION

中文概念名：新境放映室

標記：IMPECCABLE'S PICK。它最直接對應目前以 AI Visual / Motion 為主的內容重心。風險是電影式作品集在創意產業並不陌生，必須用 NeoRealm 自有的剪輯規則、作品與文案建立辨識度。

## B1. Concept Name

REALMS IN MOTION / 新境放映室

## B2. One-sentence Concept

一座以電影剪輯邏輯展開的作品空間，讓每個專案以 Scene 進場、以 Process 轉場，最後落在可被客戶判斷的完整案例。

## B3. Brand Strategy

把 Instagram 的瞬間吸引力轉化為可持續觀看的品牌敘事。首頁像一支被網站重新剪輯的 Showreel，但每個情緒段落都能進入可讀、可驗證的 Case Study。

此方向不以「標準」作為主要視覺隱喻，而將 NeoRealm 解釋為被導演、被組織、能被進入的新世界。Web Standardizer 歷史在 About 才揭露，形成第二層深度。

## B4. Positioning Direction

> Independent Creative Director and Digital Maker shaping ideas into image, motion, and interactive worlds.

客戶先感受到強烈創意，再透過案例中的角色、流程與交付確認合作可信度。

## B5. Three Desired Impressions

1. Cinematic 電影感
2. Immediate 立即進入作品
3. Immersive 有節奏但不失控制

## B6. Keywords

Sequence, cut, frame, tempo, atmosphere, fashion image, visual world-building, tactile motion, directed technology, spatial media.

## B7. Complete Visual System

### Palette

- Graphite: `#171816`, 主要舞台。
- Chalk: `#EFEDE7`, 文字與淺色段落。
- Signal Lime: `#C8EE39`, 唯一互動與狀態色。
- Smoked Silver: `#8B8D86`, Credits、時間與技術資訊。

Signal Lime 不做霓虹外光，只用於播放狀態、焦點、CTA 和時間碼。這能保留前衛感，避免常見紫藍 AI Startup 語彙。

### Typography

- Display Latin: Druk Condensed 或同級窄體 Display Sans，授權確認後採用。
- Narrative Latin: Suisse Intl / Neue Haas Grotesk 類型。
- Traditional Chinese: Noto Sans TC，標題使用 Bold 與壓縮行距，正文 Regular。
- NeoRealm 原 Logo 只在 Cold Open、導覽與 Ending Credit 使用，不與窄體標題競爭。

標題像片名，Case Body 像 Production Notes。字距、行長與 Credits 有明確層級，不用全站大寫。

### Grid and Composition

- Desktop: 14 欄，讓 16:9、4:5、9:16 能產生不等寬疊合。
- Mobile: 4 欄，以 9:16 和滿版橫向裁切交替。
- 畫面圍繞 Frame、Cut、Sequence 三個單位，不使用傳統 Section Card。
- Full-bleed 媒體後必須接一段 Quiet Frame，避免整頁持續轟炸。

### Graphic Grammar

以「Edit Point」作為品牌動態符號。它是一條短垂直切點與時間碼，只在場景切換、Focus 與 Play State 出現。每次切換由媒體內容決定 Hard Cut、Match Cut 或 Dissolve，不套同一種轉場。

### Image and Video Treatment

- Hero 使用一張高品質 Poster，載入後才升級為靜音短 Loop。
- Selected Work 每次只讓一件作品主導視窗。
- Fashion / Editorial 保留人物比例與眼神方向，不自動中央裁切。
- AI Motion 首頁 Loop 只呈現核心一拍，完整敘事在 Case Film。
- Web 案例以真實 Screen Capture 與一個可操作片段表達「可進入的 Realm」。

### UI Geometry

- 直角、薄框與影像邊緣作為主要幾何。
- 播放控制具可辨識 Label，不用只有圓形圖示。
- CTA 使用 Chalk 實底或 Signal Lime 文字，避免大量亮色按鈕。
- 頁面只保留一個可選的 Sound 控制，預設永遠靜音。

## B8. Homepage Storyboard

1. Cold Open: NeoRealm LAB Logo 短暫出現，立即切入代表作 Poster。
2. Hero: 兩行主張、定位與 View Selected Work，Loop 在允許條件下啟動。
3. Scene One: 最強 AI Motion，以滿版片段和一句 Creative Premise 進場。
4. Quiet Frame: 簡短品牌論述，讓節奏降下來。
5. Scene Two: Fashion / Editorial AI Visual，4:5 與 9:16 形成攝影編排。
6. Scene Three: Web / Interactive，從影片畫面切入可操作界面片段。
7. Direction Reel: 以 20 到 30 秒蒙太奇串起 60 / 40 能力比例，可由使用者主動播放聲音。
8. Ways to Work: Direct、Generate、Animate、Build 的線性流程。
9. Origin: 一句舊品牌轉折和簡短人物介紹。
10. Afterimage: Lab 最新實驗。
11. Final Credit: Availability、Contact Form、Email、Instagram。

## B9. Sitemap

```text
Home / Showreel
Work
  Project Detail
Lab / Afterimage
About
Contact
Privacy
404
```

Capabilities 不獨立成頁，而整合進首頁與案例。若 SEO 研究顯示服務關鍵字有必要，再增加 Capabilities Landing Pages，不先建立空泛頁面。

## B10. Desktop and Mobile Navigation

Desktop 左上為 Logo，右上為 Work、Lab、About、Contact。當 Hero 媒體播放時，導覽保持可見但降低對比，鍵盤 Focus 或指標接近即恢復完整對比。

Mobile 導覽為 Logo、Work 與 Menu。Menu 由右側展開，但頁面不被縮放或扭曲。Hero 後出現小型 Check Availability，使用者播放媒體時自動隱藏，避免遮住字幕與 9:16 主體。

## B11. Hero Concept and Headline Directions

Hero 是一個非置中的 Cinematic Frame。主標固定在左下 7 欄，作品人物或物件保留右側視線空間。Poster 能獨立成立，影片不是理解主張的必要條件。

Headline options:

1. I DESIGN NEW REALMS.
2. REALITY IS A DESIGN MATERIAL.
3. IDEAS, DIRECTED INTO MOTION.

建議首選 1。副句標示 Creative Direction, AI Visual, Motion, Web，讓藝術性與可合作性在第一屏同時成立。

## B12. Selected Works Approach

首頁使用 3 件 Hero Cases，每件 70 到 100vh，彼此以 Quiet Frame 分隔。選片優先順序：

1. 最能代表整體世界觀的 AI Motion。
2. 最能證明 Art Direction 的 Fashion / Editorial Visual。
3. 最能證明互動與落地能力的 Web / Digital Experience。

Work Index 使用標題清單與單一大型預覽，不回到平均化卡片 Grid。每個 Project 明確標示 Commissioned、Self-initiated 或 Research。

## B13. AI Portfolio Approach

AI 作品以「Direction before Generation」為原則：

- 首屏先呈現 Final World。
- 第二段說明 Creative Premise 與人物、材質、光線、Camera Logic。
- 第三段呈現選擇、淘汰與連續性控制。
- 第四段說明 Motion、Edit、Sound 或應用場景。

不展示密集 Prompt 截圖，也不以工具 Logo 取得可信度。技術資訊可以放在 Making Notes，角色與判斷永遠先出現。

## B14. Web Portfolio Approach

Web 案例被定義為「Enter the Realm」。首頁先展示 6 到 10 秒 Screen Film，Case Study 再提供一個不依賴第三方 iframe 的局部互動 Demo。

內容包括 User Need、Creative Direction、Navigation Model、Responsive Art Direction、Motion System、Frontend Decisions、Performance 與 Live URL。舊站作品只保留能支撐 Origin Story 的代表案例。

## B15. Case Study Structure

1. Premise
2. Context and Role
3. World Building
4. Visual Direction
5. Sequence and Motion
6. Digital Build or Production
7. Final Cut / Final Experience
8. Deliverables or Outcome
9. Credits
10. Next Scene

Case 頁可依媒介略調節篇幅，但 Role、Credits 與 Deliverables 不可省略。

## B16. About and Legacy Story

About 將歷史作為第二幕：

> First, I learned to give the web standards. Now, I use those standards to build worlds that move.

內容順序為 Current Practice、Working Belief、Web Standardizer Origin、Collaboration Model。搭配一張工作現場人像與一段 10 秒無聲 Process Film，避免冗長履歷時間線。

## B17. Capabilities Expression

能力被編排成一條 Production Path：

```text
DIRECT → GENERATE → ANIMATE → BUILD
```

- Direct: Concept, Creative Direction, Art Direction
- Generate: AI Visual Development, Look Development
- Animate: Motion Design, Concept Film, Edit
- Build: Web Design, Interaction, Frontend

每個專案不必走完四步。詢問表單可讓客戶選擇需要哪一段，或選「Need help defining it」。

## B18. Lab / Archive Expression

Lab 命名為 AFTERIMAGE。它像影片結束後留下的視覺殘像，收錄短實驗、未採用方向、Motion Tests、Interface Studies 與方法筆記。

不做無限瀑布。預設只顯示最新 12 則，以 Medium 與 Year 篩選，較舊資料進 Archive Index。每則可由單一 Poster 進入，保留速度與策展感。

## B19. Signature Interactions

1. Poster to Motion: 代表作進入視窗且媒體可用時，由 Poster 無跳動升級為靜音 Loop。
2. Edit Point: 場景轉換時出現短切點與時間碼，協助理解段落變化。
3. Title Focus Preview: Work 標題被 Focus 時，固定預覽以 Cut 或 Dissolve 更新。
4. Filmstrip Scrub: 使用拖曳、鍵盤方向鍵或明確控制檢視製作節點，不綁架頁面捲動。
5. Match Cut: 從首頁 Project Poster 進入 Case 時延續同一畫面位置。
6. Enter the Realm: Web Case 可啟動一個小型真實互動，不預載完整網站。
7. Sound Consent: 使用者主動開啟聲音後才載入含聲軌版本，狀態全站保留。
8. Inquiry Cue: 看完兩件 Case 後，Contact CTA 以一句相關合作問題出現，不用彈窗。

## B20. Motion Principles

- Hard cut: 80 到 120ms，只用於媒體與章節斷點。
- UI state: 180 到 240ms。
- Editorial dissolve: 500 到 700ms。
- Realm transition: 900 到 1200ms。
- Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)`。
- Scroll 只觸發或控制單一關鍵時間軸，不加入慣性 Smooth Scroll。
- 人物、服裝與產品 Motion 由作品本身主導，UI 不與它競爭。
- `prefers-reduced-motion` 使用 Poster、直接切換與靜態 Filmstrip。

## B21. Mobile Adaptation

- 每件主作品需準備 9:16 專用 Poster 與 3 到 5 秒 Loop。
- 初次載入預設 Poster；網路、裝置與使用者設定允許後才載入 Motion。
- 首屏主標最多兩行，定位與 CTA 同屏可見。
- Desktop 的重疊 Frame 改為單一主 Frame 加下一幕 Preview，不做小到看不清的拼貼。
- Filmstrip 支援拖曳與按鈕，不只依賴 Hover。
- Sound 預設關閉，開啟後有明確狀態、字幕與關閉控制。
- iOS Safari、Android Chrome 的記憶體、影片 inline playback、方向變化與 safe-area 列為專項 QA。

## B22. Recommended Technology

- Next.js App Router + TypeScript，以 Static Generation 為預設，互動與 Form 才使用 Server 能力。
- CSS Modules 或具名 Design Tokens，不引入 Dashboard 型 Component Kit。
- `next/image` 或媒體 CDN 處理 Responsive Images，Hero Poster 在 HTML 中直接輸出。
- Next Metadata API 管理 Project Title、Description、OG、Robots 與 Sitemap，並可產生專案分享圖。[Next.js Metadata](https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata)
- GSAP + ScrollTrigger 僅處理場景時間軸、媒體交接與 Match Cut。[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- Mux、Cloudinary 或同級影音服務產生多解析度、Poster 與 CDN Delivery。最終供應商需依成本、地區與分析需求比較。
- 不以 WebGL 作為基線。只有被選中的 Signature Interaction 確實需要空間渲染時，再建立延遲載入的單一 Canvas Island。

若選定後發現不需要跨頁持續媒體狀態，應改用 Astro，以減少前端 JavaScript。技術服從概念，不以框架決定創意。

## B23. Performance Risks and Controls

主要風險是 Autoplay Video、同時解碼、多比例媒體、跨頁轉場與低階手機記憶體。

- Hero 先輸出 Poster，影片是 Progressive Enhancement。
- LCP Poster 不 lazy-load；其餘影片使用 `loading="lazy"`、`preload="none"` 或 metadata，並在接近視窗時才準備。Web.dev 亦建議用 Poster 配合載入策略，且 LCP Video 不應 lazy-load。[Video Performance](https://web.dev/learn/performance/video-performance?authuser=2&hl=en)
- 全站同時播放與解碼最多一支影片。
- Intersection Observer 停止離開視窗的影片，路由切換釋放不再使用的 source。
- 提供 Mobile、Tablet、Desktop 三級編碼，不讓手機下載 Desktop 4K。
- 不預載完整 Showreel 音訊，使用者同意 Sound 後才載入。
- 所有 Motion 有 Static Fallback，影片失敗時仍可閱讀作品與 CTA。

暫定驗收預算：Mobile Hero Poster 300KB 內、Hero Loop 2.5MB 內、Desktop Loop 5MB 內、初始 JS gzip 180KB 內、首頁同時播放 1 支。這些是設計預算，需在真實媒體進場後實測。

## B24. SEO Approach

- Showreel 首頁不能只剩 Canvas 或影片，主張、能力與作品摘要必須存在於 Server-rendered HTML。
- 每件主案例有獨立 URL、CreativeWork / VideoObject schema、Poster、Transcript、Role 與 Credits。
- AI 關鍵字以服務語意自然出現，例如 AI Art Direction、AI Fashion Film、Generative Visual Development，不重複堆字。
- 英文與繁中使用獨立路由與 `hreflang`。
- OG Image 以 Project Poster 與短標題生成，確保從 IG、LINE、LinkedIn 分享時仍有一致辨識。
- Lab 的短實驗預設可被搜尋，但純視覺、無說明或未完成內容可設 `noindex`。

## B25. Advantages

- 最符合 AI Visual / Motion 主體內容與 IG Mobile 導流。
- 第一眼衝擊強，容易被創意總監、品牌與代理商記住。
- 能把 Motion、Art Direction 和 Web Interaction 表達為同一種導演能力。
- 適合 Fashion、Food、Lifestyle 與文化型客戶。
- Showreel 與 Case 之間有明確路徑，不只是一支影片。

## B26. Risks

- 高度依賴真正強的影片、Poster、Edit 與 Sound 素材。
- 若 Case 文字太少，客戶可能只看到風格，無法理解合作角色。
- 媒體與互動較重，Mobile Performance 和 QA 成本高。
- 電影式作品集是創意產業熟悉語法，必須避免只靠 Full-screen Video 與巨大字體。
- 每新增一件首頁作品，都需要多比例重新剪輯，維護成本較高。

## B27. Development Difficulty Breakdown

| 工作面向 | 難度 1-5 | 原因 |
| --- | ---: | --- |
| 品牌與電影語法 | 4 | 每個 Cut 必須由內容決定，不能依賴單一特效 |
| 內容建模 | 3 | Sitemap 簡潔，但案例需大量媒體欄位與 Credits |
| Frontend | 5 | Persistent state、Match Cut、媒體生命週期與 Form 整合複雜 |
| Motion | 5 | 需要網站 Motion Director 與編輯節奏，不只是 GSAP 實作 |
| Media Production | 5 | 每件代表作需要 Poster、多比例 Loop、Showreel 與字幕 |
| Accessibility / QA | 5 | Sound、Video、Focus、reduced-motion、低階手機皆需專項測試 |

整體難度：5 / 5。主要成本不是框架，而是媒體製作、動態導演與跨裝置驗證。

# 3. Concept Comparison Matrix

評分定義：1 表示弱或低，5 表示強或高。Development Difficulty 的 5 代表最困難，其他欄位的 5 代表最有利。

| 評估面向 | A 可變的新標準 | B 新境放映室 |
| --- | ---: | ---: |
| Brand Distinctiveness | 5 | 4 |
| Legacy Continuity | 5 | 3 |
| Immediate Visual Impact | 4 | 5 |
| AI Visual / Motion Fit | 4 | 5 |
| Web / Digital Credibility | 5 | 4 |
| Client Clarity | 5 | 4 |
| Mobile / Instagram Fit | 4 | 5 |
| SEO and Content Depth | 5 | 4 |
| Performance Resilience | 5 | 3 |
| Long-term Scalability | 5 | 3 |
| Development Difficulty | 4 | 5 |

### Rationale

- A 的獨特性來自品牌歷史與 Living Standard 的結合，不依賴某種流行視覺風格。它最容易建立長期內容系統。
- B 的優勢是情緒、Motion 與行動端衝擊，與目前預期作品比例最直接，但必須持續投入高品質剪輯與多比例媒體。
- A 對代理商與品牌端更容易掃讀角色、方法與成果。B 需要特別強化文字證據，避免只留下氣氛。
- A 的技術風險較低。B 可做到最有記憶點的體驗，但效能、影片生命週期與 QA 都更重。

# 4. Recommendation Without Selection

若此次重啟的第一優先是建立一個能使用多年、清楚承接 Web Standardizer、容易擴增 Case Study 與 SEO 的品牌母體，選 Concept A。

若第一優先是讓 Instagram 導入的訪客立刻感受到 NeoRealm LAB 的 Motion、Fashion 與 Cinematic Art Direction，並願意承擔更高媒體與前端成本，選 Concept B。

我的創意推薦是 Concept B，因為它最直接兌現「I DESIGN NEW REALMS」與 AI Visual / Motion 的內容重心。我的策略推薦是 Concept A，因為它能讓新版網站本身的設計方法與前端能力更容易被閱讀。這不是折衷混合建議，兩者在首頁拓撲、視覺語法、動態密度與製作成本上仍應保持清楚選擇。

選定後的下一階段：

1. 先檢視雙 Tab 粗略原型，選定 Direction A 或 Direction B。
2. 取得候選作品的 Insights、caption、原始媒體、製作角色與權利資料，完成 3 組 Featured Work shortlist。
3. 確認語言、Case Credits、服務邊界、聯絡方式與可公開媒體權利。
4. 為選定概念製作 Visual Direction Board、完整首頁 Storyboard 與 Motion Prototype。
5. 完成 Content Inventory、Instagram Content Adapter、Route Schema、Performance Budget 與技術 Spike。
6. 經使用者核准後才開始正式網站實作。

Waiting for concept selection.
