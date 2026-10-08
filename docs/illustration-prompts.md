<!-- このファイルは scripts/export-art-prompts.mjs が src/items.ts から自動で作る。手で編集しない。 -->

# イラスト指示書(SeaArt AI 用)

カードの真ん中の図柄 144枚ぶんの指示。枠・ローマ数字・名前はアプリ側で描くので、絵には入れない。

## 使い方

1. **モデルを選ぶ**: 下の「まず試す3枚」を、候補のモデル2〜3個で作ってみて、3枚の絵柄が一番そろうモデルに決める
2. **モデルの利用条件を確かめる**: モデルごとに、作った絵の公開や利用についての条件が決まっている。将来ほかの人に配る予定なので、公開してよいモデルか必ず確かめる
3. **設定を記録する**: 決めたモデルと設定を下の「記録欄」に書く。全カードを同じモデル・同じ設定で作る。途中で日が空いても、ここを見て同じ条件で再開する
4. **画像の大きさは必ず正方形(1024 × 1024)にする**: 縦長にすると、AIがタロットカード1枚の形を思い浮かべ、枠・番号・名前の帯まで描いてしまう
5. **1枚ずつ作る**: 各カードの枠の中の英文を「プロンプト」欄に、「描いてほしくないこと」を「ネガティブプロンプト」欄に貼る
6. **保存する**: 書いてあるファイル名で保存し、このフォルダの `art/bus/` か `art/special/` に置く

共通の指示の部分(各英文の後半)は1文字も変えないこと。変えると絵柄がそろわなくなる。

## 絵柄の決まりごと

| 項目 | 決まりごと |
|---|---|
| 様式 | アール・デコ風。直線・円・放射状の線の幾何学的な飾り、左右対称 |
| 線 | 落ち着いた金。太さは中くらいでそろえる(スマホで小さく表示しても消えないように)。陰影は付けない |
| 塗り | 輪郭線だけで描き、色は塗らない(「黒い」のカードだけ黒い影絵にする) |
| 色の修飾 | 銀・白・紅・蒼は物の線だけその色にし、後ろの飾りは金のまま(シリーズとしてそろえるため) |
| 背景 | ほぼ黒に近い無地の濃紺。模様や質感は付けない(「夜明けの」「真夜中の」のカードだけ背景が変わる) |
| 構図 | 真正面から見た形で中央に。物は画面の6〜7割 |
| バス停カード | 物が主役。後ろの飾りは短い放射状の線を少しだけで、円は描かない |
| 特別カード | 太陽光線のような放射状の飾り・階段状の模様・かすかな光の輪。バス停カードより豪華にして特別感を出す |
| 金の修飾 | 「金の」カードだけ、物をいつもの落ち着いた金ではなく強く輝く金にする |

## 記録欄

| 項目 | 値 |
|---|---|
| モデル名 | |
| モデルの利用条件を確認した日 | |
| 画像の大きさ | 1024 × 1024(正方形) |
| サンプラー | |
| ステップ数 | |
| CFG | |
| シード | (1つの値に固定して全カード同じにする) |

## 描いてほしくないこと(ネガティブプロンプト欄に貼る)

### 特別カード用

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed
```

### バス停カード用

特別カード用の文に、円の飾りや小さすぎる物を防ぐ言葉を足したもの。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal
```

## まず試す3枚

色の修飾・効果の修飾・特別カードを1枚ずつ。この3枚が並べて同じシリーズに見えるモデルを選ぶ。

### XLVII 蒼い月

保存するファイル名: `art/bus/moon-azure.png` / 意味: 月(物を蒼色に(飾りは金のまま))

```
single azure blue moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the whole moon drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden moon
```

### XLV 燃える鍵

保存するファイル名: `art/bus/key-burning.png` / 意味: 鍵(炎に包まれている)

```
single antique key, burning, wreathed in stylized flames, the antique key is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIV 京王八王子の灯台

保存するファイル名: `art/special/lighthouse.png` / 意味: 灯台(特別カード。装飾多め・後ろに光の輪)

```
single lighthouse, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

## バス停カードの試し(12枚)

2回目で修飾(黒い・色・夜明け・真夜中・欠けた・砕けた・双子)が絵に出なかったので、修飾ごとの書き方を直した。残りを作る前にこの12枚で試す。修飾によっては、このカードだけの「描いてほしくないこと」がある(各カードの下)。

### XVIII 黒い冠

保存するファイル名: `art/bus/crown-black.png` / 意味: 冠(黒く塗った物、ふちだけ金)

```
single crown, painted solid matte black, the crown is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### XVI 蒼い扉

保存するファイル名: `art/bus/door-azure.png` / 意味: 扉(物を蒼色に(飾りは金のまま))

```
single azure blue arched door, a tall arched door with two panels and a round handle, the arched door is the main subject, large and clearly recognizable, the whole arched door drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden arched door
```

### VIII 白い鍵

保存するファイル名: `art/bus/key-white.png` / 意味: 鍵(物を白に(飾りは金のまま))

```
single pure white antique key, the antique key is the main subject, large and clearly recognizable, the whole antique key drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden antique key
```

### X 紅い目

保存するファイル名: `art/bus/eye-crimson.png` / 意味: 目(物を紅色に(飾りは金のまま))

```
single crimson red eye, an open eye with an almond shaped outline and a round iris, the eye is the main subject, large and clearly recognizable, the whole eye drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden eye
```

### XXXVII 銀の砂時計

保存するファイル名: `art/bus/hourglass-silver.png` / 意味: 砂時計(物を銀色に(飾りは金のまま))

```
single silver hourglass, the hourglass is the main subject, large and clearly recognizable, the whole hourglass drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden hourglass
```

### V 夜明けの炎

保存するファイル名: `art/bus/flame-dawn.png` / 意味: 炎(背景の下の地平線だけ朝焼けの光)

```
single flame, the flame is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### XXIV 真夜中の星

保存するファイル名: `art/bus/star-midnight.png` / 意味: 星(背景が濃紺の夜空、白く小さな星)

```
single star, the star is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### XVII 欠けた錨

保存するファイル名: `art/bus/anchor-chipped.png` / 意味: 錨(一部が大きく欠けている)

```
single anchor, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXVII 砕けた鍵

保存するファイル名: `art/bus/key-cracked.png` / 意味: 鍵(大きなひびが入り、かけらが浮く)

```
single antique key, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the antique key is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXV 双子の杖

保存するファイル名: `art/bus/wand-twin.png` / 意味: 杖(同じものが2つ並ぶ)

```
exactly two identical magic staff, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two magic staff are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XIV 双子の剣

保存するファイル名: `art/bus/sword-twin.png` / 意味: 剣(同じものが2つ並ぶ)

```
exactly two identical sword, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two sword are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XXXV 凍てる天秤

保存するファイル名: `art/bus/scales-frozen.png` / 意味: 天秤(霜の結晶に覆われている)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, frozen, covered in frost crystals, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

## 作り直すカード(3枚)

何度作っても名前の物が描かれなかったカード。4回目は、形のたとえに使った物(チェスの駒・金管楽器・立っている人)が描かれたため、たとえを外して物そのものだけで説明し直し、描かれた物を「描いてほしくないこと」に足している。角笛は描けなかったため、物を鎌(長い柄の大鎌)に差し替えた。下の特別カードの一覧にも同じ内容が入っている。

### X 八王子の指輪

保存するファイル名: `art/special/ring.png` / 意味: 指輪(特別カード。装飾多め・後ろに光の輪)

```
single diamond ring, a piece of jewelry, a plain gold ring band with one large faceted diamond set on top, the diamond ring is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, hand, fingers, person, human figure, silhouette, cloak, hood, glossy, shiny reflections, realistic metal
```

### XXI 京王堀之内の印章

保存するファイル名: `art/special/seal.png` / 意味: 印章(特別カード。装飾多め・後ろに光の輪)

```
single ink stamp, an old ink stamp tool, a short wooden handle on top and a square stamp block at the bottom with an engraved flat face, the ink stamp is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, chess piece, chess king, crown, glossy, shiny reflections, realistic metal
```

### 特別カード(鎌)

保存するファイル名: `art/special/scythe.png` / 意味: 鎌(特別カード。装飾多め・後ろに光の輪)

```
single scythe, a long straight wooden pole standing vertically with a large curved steel blade attached at the top, the blade sweeping out to one side, a small grip in the middle of the pole, the scythe is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, person, human figure, grim reaper, skeleton, skull, hood, cloak, hand, crescent moon, sickle, glossy, shiny reflections, realistic metal
```

## 特別カード(24枚)

装飾を少し増やし、後ろにかすかな光の輪を描く。

### 0 八王子みなみ野の門

保存するファイル名: `art/special/gate.png` / 意味: 門(特別カード。装飾多め・後ろに光の輪)

```
single ornate gate, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### I 片倉の羅針盤

保存するファイル名: `art/special/compass.png` / 意味: 羅針盤(特別カード。装飾多め・後ろに光の輪)

```
single compass, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XII 高尾の旗

保存するファイル名: `art/special/banner.png` / 意味: 旗(特別カード。装飾多め・後ろに光の輪)

```
single banner flag, a waving banner flag hanging from a tall vertical pole, the banner flag is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### XIV 京王八王子の灯台

保存するファイル名: `art/special/lighthouse.png` / 意味: 灯台(特別カード。装飾多め・後ろに光の輪)

```
single lighthouse, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### II 狭間の橋

保存するファイル名: `art/special/bridge.png` / 意味: 橋(特別カード。装飾多め・後ろに光の輪)

```
single arched bridge, a stone arch bridge with one large arch spanning from left to right, the arched bridge is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### III めじろ台の船

保存するファイル名: `art/special/ship.png` / 意味: 船(特別カード。装飾多め・後ろに光の輪)

```
single sailing ship, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIX 北野の燭台

保存するファイル名: `art/special/candlestick.png` / 意味: 燭台(特別カード。装飾多め・後ろに光の輪)

```
single candlestick with a candle, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XV 中央大学・明星大学の竪琴

保存するファイル名: `art/special/harp.png` / 意味: 竪琴(特別カード。装飾多め・後ろに光の輪)

```
single harp, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVI 大塚・帝京大学の書

保存するファイル名: `art/special/book.png` / 意味: 書(特別カード。装飾多め・後ろに光の輪)

```
single open book, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XI 西八王子の巻物

保存するファイル名: `art/special/scroll.png` / 意味: 巻物(特別カード。装飾多め・後ろに光の輪)

```
single scroll, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVIII 長沼の松明

保存するファイル名: `art/special/torch.png` / 意味: 松明(特別カード。装飾多め・後ろに光の輪)

```
single torch, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVII 松が谷の泉

保存するファイル名: `art/special/fountain.png` / 意味: 泉(特別カード。装飾多め・後ろに光の輪)

```
single fountain, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### VIII 清滝の樹

保存するファイル名: `art/special/tree.png` / 意味: 樹(特別カード。装飾多め・後ろに光の輪)

```
single tree, a single large tree with a thick trunk, spreading branches and a round leafy crown, the tree is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### V 京王片倉の山

保存するファイル名: `art/special/mountain.png` / 意味: 山(特別カード。装飾多め・後ろに光の輪)

```
single mountain, a single large triangular mountain peak with a snow cap and clear slopes, the mountain is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### IV 山田の階段

保存するファイル名: `art/special/staircase.png` / 意味: 階段(特別カード。装飾多め・後ろに光の輪)

```
single staircase, a straight flight of stone steps rising upward, seen from the front, the staircase is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### IX 高尾山の窓

保存するファイル名: `art/special/window.png` / 意味: 窓(特別カード。装飾多め・後ろに光の輪)

```
single arched window, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIII 高尾山口の歯車

保存するファイル名: `art/special/gear.png` / 意味: 歯車(特別カード。装飾多め・後ろに光の輪)

```
single gear, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### VII 小宮の風車

保存するファイル名: `art/special/windmill.png` / 意味: 風車(特別カード。装飾多め・後ろに光の輪)

```
single windmill, a traditional windmill tower with four large cross-shaped sails, the windmill is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only
```

### VI 北八王子の仮面

保存するファイル名: `art/special/mask.png` / 意味: 仮面(特別カード。装飾多め・後ろに光の輪)

```
single mask, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### X 八王子の指輪

保存するファイル名: `art/special/ring.png` / 意味: 指輪(特別カード。装飾多め・後ろに光の輪)

```
single diamond ring, a piece of jewelry, a plain gold ring band with one large faceted diamond set on top, the diamond ring is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, hand, fingers, person, human figure, silhouette, cloak, hood, glossy, shiny reflections, realistic metal
```

### XX 南大沢の宝珠

保存するファイル名: `art/special/orb.png` / 意味: 宝珠(特別カード。装飾多め・後ろに光の輪)

```
single orb, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXI 京王堀之内の印章

保存するファイル名: `art/special/seal.png` / 意味: 印章(特別カード。装飾多め・後ろに光の輪)

```
single ink stamp, an old ink stamp tool, a short wooden handle on top and a square stamp block at the bottom with an engraved flat face, the ink stamp is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, chess piece, chess king, crown, glossy, shiny reflections, realistic metal
```

### 特別カード(鎌)

保存するファイル名: `art/special/scythe.png` / 意味: 鎌(特別カード。装飾多め・後ろに光の輪)

```
single scythe, a long straight wooden pole standing vertically with a large curved steel blade attached at the top, the blade sweeping out to one side, a small grip in the middle of the pole, the scythe is the main subject, large and clearly recognizable, in front of the ornament, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, compass rose, sun disc, clock hands, empty medallion, abstract ornament only, person, human figure, grim reaper, skeleton, skull, hood, cloak, hand, crescent moon, sickle, glossy, shiny reflections, realistic metal
```

### 特別カード(天球儀)

保存するファイル名: `art/special/armillary.png` / 意味: 天球儀(特別カード。装飾多め・後ろに光の輪)

```
single armillary sphere, warm muted gold lines, ornate art deco ornament, sunburst rays behind the object, stepped geometric details, faint radiant halo, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

## バス停カード(120枚)

### I 金の星

保存するファイル名: `art/bus/star-gold.png` / 意味: 星(物がいつもより強く輝く金)

```
single star, the star is the main subject, large and clearly recognizable, the star drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### II 白い杯

保存するファイル名: `art/bus/chalice-white.png` / 意味: 杯(物を白に(飾りは金のまま))

```
single pure white chalice, the chalice is the main subject, large and clearly recognizable, the whole chalice drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden chalice
```

### III 翼ある炎

保存するファイル名: `art/bus/flame-winged.png` / 意味: 炎(翼が生えている)

```
single flame, with a pair of feathered wings, the flame is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### IV 銀の羽

保存するファイル名: `art/bus/feather-silver.png` / 意味: 羽(物を銀色に(飾りは金のまま))

```
single silver feather, the feather is the main subject, large and clearly recognizable, the whole feather drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden feather
```

### V 夜明けの炎

保存するファイル名: `art/bus/flame-dawn.png` / 意味: 炎(背景の下の地平線だけ朝焼けの光)

```
single flame, the flame is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### VI 銀の冠

保存するファイル名: `art/bus/crown-silver.png` / 意味: 冠(物を銀色に(飾りは金のまま))

```
single silver crown, the crown is the main subject, large and clearly recognizable, the whole crown drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden crown
```

### VII 紅い雫

保存するファイル名: `art/bus/droplet-crimson.png` / 意味: 雫(物を紅色に(飾りは金のまま))

```
single crimson red water droplet, a teardrop shape, round at the bottom and pointed at the top, the water droplet is the main subject, large and clearly recognizable, the whole water droplet drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden water droplet
```

### VIII 白い鍵

保存するファイル名: `art/bus/key-white.png` / 意味: 鍵(物を白に(飾りは金のまま))

```
single pure white antique key, the antique key is the main subject, large and clearly recognizable, the whole antique key drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden antique key
```

### IX 砕けた杖

保存するファイル名: `art/bus/wand-cracked.png` / 意味: 杖(大きなひびが入り、かけらが浮く)

```
single magic staff, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the magic staff is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### X 紅い目

保存するファイル名: `art/bus/eye-crimson.png` / 意味: 目(物を紅色に(飾りは金のまま))

```
single crimson red eye, an open eye with an almond shaped outline and a round iris, the eye is the main subject, large and clearly recognizable, the whole eye drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden eye
```

### XI 逆さの剣

保存するファイル名: `art/bus/sword-inverted.png` / 意味: 剣(上下逆さま)

```
single sword, upside down, the sword is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XII 金の月

保存するファイル名: `art/bus/moon-gold.png` / 意味: 月(物がいつもより強く輝く金)

```
single moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the moon drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIII 翼ある冠

保存するファイル名: `art/bus/crown-winged.png` / 意味: 冠(翼が生えている)

```
single crown, with a pair of feathered wings, the crown is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XIV 双子の剣

保存するファイル名: `art/bus/sword-twin.png` / 意味: 剣(同じものが2つ並ぶ)

```
exactly two identical sword, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two sword are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XV 欠けた輪

保存するファイル名: `art/bus/wheel-chipped.png` / 意味: 輪(一部が大きく欠けている)

```
single wheel, a spoked wagon wheel with a hub and a rim, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the wheel is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVI 蒼い扉

保存するファイル名: `art/bus/door-azure.png` / 意味: 扉(物を蒼色に(飾りは金のまま))

```
single azure blue arched door, a tall arched door with two panels and a round handle, the arched door is the main subject, large and clearly recognizable, the whole arched door drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden arched door
```

### XVII 欠けた錨

保存するファイル名: `art/bus/anchor-chipped.png` / 意味: 錨(一部が大きく欠けている)

```
single anchor, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XVIII 黒い冠

保存するファイル名: `art/bus/crown-black.png` / 意味: 冠(黒く塗った物、ふちだけ金)

```
single crown, painted solid matte black, the crown is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### XIX 夜明けの剣

保存するファイル名: `art/bus/sword-dawn.png` / 意味: 剣(背景の下の地平線だけ朝焼けの光)

```
single sword, the sword is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### XX 真夜中の天秤

保存するファイル名: `art/bus/scales-midnight.png` / 意味: 天秤(背景が濃紺の夜空、白く小さな星)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### XXI 逆さの杖

保存するファイル名: `art/bus/wand-inverted.png` / 意味: 杖(上下逆さま)

```
single magic staff, upside down, the magic staff is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXII 砕けた扉

保存するファイル名: `art/bus/door-cracked.png` / 意味: 扉(大きなひびが入り、かけらが浮く)

```
single arched door, a tall arched door with two panels and a round handle, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the arched door is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXIII 凍てる矢

保存するファイル名: `art/bus/arrow-frozen.png` / 意味: 矢(霜の結晶に覆われている)

```
single arrow, frozen, covered in frost crystals, the arrow is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXIV 真夜中の星

保存するファイル名: `art/bus/star-midnight.png` / 意味: 星(背景が濃紺の夜空、白く小さな星)

```
single star, the star is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### XXV 双子の杖

保存するファイル名: `art/bus/wand-twin.png` / 意味: 杖(同じものが2つ並ぶ)

```
exactly two identical magic staff, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two magic staff are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XXVI 夜明けの灯

保存するファイル名: `art/bus/lantern-dawn.png` / 意味: 灯(背景の下の地平線だけ朝焼けの光)

```
single lantern, the lantern is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### XXVII 砕けた鍵

保存するファイル名: `art/bus/key-cracked.png` / 意味: 鍵(大きなひびが入り、かけらが浮く)

```
single antique key, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the antique key is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXVIII 燃える輪

保存するファイル名: `art/bus/wheel-burning.png` / 意味: 輪(炎に包まれている)

```
single wheel, a spoked wagon wheel with a hub and a rim, burning, wreathed in stylized flames, the wheel is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXIX 欠けた太陽

保存するファイル名: `art/bus/sun-chipped.png` / 意味: 太陽(一部が大きく欠けている)

```
single sun, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the sun is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXX 燃える錨

保存するファイル名: `art/bus/anchor-burning.png` / 意味: 錨(炎に包まれている)

```
single anchor, burning, wreathed in stylized flames, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXI 黒い羽

保存するファイル名: `art/bus/feather-black.png` / 意味: 羽(黒く塗った物、ふちだけ金)

```
single feather, painted solid matte black, the feather is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### XXXII 金の灯

保存するファイル名: `art/bus/lantern-gold.png` / 意味: 灯(物がいつもより強く輝く金)

```
single lantern, the lantern is the main subject, large and clearly recognizable, the lantern drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXIII 金の杯

保存するファイル名: `art/bus/chalice-gold.png` / 意味: 杯(物がいつもより強く輝く金)

```
single chalice, the chalice is the main subject, large and clearly recognizable, the chalice drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXIV 燃える杖

保存するファイル名: `art/bus/wand-burning.png` / 意味: 杖(炎に包まれている)

```
single magic staff, burning, wreathed in stylized flames, the magic staff is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXV 凍てる天秤

保存するファイル名: `art/bus/scales-frozen.png` / 意味: 天秤(霜の結晶に覆われている)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, frozen, covered in frost crystals, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXVI 双子の太陽

保存するファイル名: `art/bus/sun-twin.png` / 意味: 太陽(同じものが2つ並ぶ)

```
exactly two identical sun, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two sun are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XXXVII 銀の砂時計

保存するファイル名: `art/bus/hourglass-silver.png` / 意味: 砂時計(物を銀色に(飾りは金のまま))

```
single silver hourglass, the hourglass is the main subject, large and clearly recognizable, the whole hourglass drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden hourglass
```

### XXXVIII 逆さの太陽

保存するファイル名: `art/bus/sun-inverted.png` / 意味: 太陽(上下逆さま)

```
single sun, upside down, the sun is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XXXIX 蒼い鐘

保存するファイル名: `art/bus/bell-azure.png` / 意味: 鐘(物を蒼色に(飾りは金のまま))

```
single azure blue bell, the bell is the main subject, large and clearly recognizable, the whole bell drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden bell
```

### XL 欠けた鐘

保存するファイル名: `art/bus/bell-chipped.png` / 意味: 鐘(一部が大きく欠けている)

```
single bell, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the bell is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XLI 燃える扉

保存するファイル名: `art/bus/door-burning.png` / 意味: 扉(炎に包まれている)

```
single arched door, a tall arched door with two panels and a round handle, burning, wreathed in stylized flames, the arched door is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XLII 砕けた鐘

保存するファイル名: `art/bus/bell-cracked.png` / 意味: 鐘(大きなひびが入り、かけらが浮く)

```
single bell, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the bell is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XLIII 黒い砂時計

保存するファイル名: `art/bus/hourglass-black.png` / 意味: 砂時計(黒く塗った物、ふちだけ金)

```
single hourglass, painted solid matte black, the hourglass is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### XLIV 欠けた目

保存するファイル名: `art/bus/eye-chipped.png` / 意味: 目(一部が大きく欠けている)

```
single eye, an open eye with an almond shaped outline and a round iris, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the eye is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XLV 燃える鍵

保存するファイル名: `art/bus/key-burning.png` / 意味: 鍵(炎に包まれている)

```
single antique key, burning, wreathed in stylized flames, the antique key is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XLVI 白い羽

保存するファイル名: `art/bus/feather-white.png` / 意味: 羽(物を白に(飾りは金のまま))

```
single pure white feather, the feather is the main subject, large and clearly recognizable, the whole feather drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden feather
```

### XLVII 蒼い月

保存するファイル名: `art/bus/moon-azure.png` / 意味: 月(物を蒼色に(飾りは金のまま))

```
single azure blue moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the whole moon drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden moon
```

### XLVIII 銀の雫

保存するファイル名: `art/bus/droplet-silver.png` / 意味: 雫(物を銀色に(飾りは金のまま))

```
single silver water droplet, a teardrop shape, round at the bottom and pointed at the top, the water droplet is the main subject, large and clearly recognizable, the whole water droplet drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden water droplet
```

### XLIX 翼ある矢

保存するファイル名: `art/bus/arrow-winged.png` / 意味: 矢(翼が生えている)

```
single arrow, with a pair of feathered wings, the arrow is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### L 逆さの輪

保存するファイル名: `art/bus/wheel-inverted.png` / 意味: 輪(上下逆さま)

```
single wheel, a spoked wagon wheel with a hub and a rim, upside down, the wheel is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LI 逆さの錨

保存するファイル名: `art/bus/anchor-inverted.png` / 意味: 錨(上下逆さま)

```
single anchor, upside down, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LII 金の羽

保存するファイル名: `art/bus/feather-gold.png` / 意味: 羽(物がいつもより強く輝く金)

```
single feather, the feather is the main subject, large and clearly recognizable, the feather drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LIII 黒い杯

保存するファイル名: `art/bus/chalice-black.png` / 意味: 杯(黒く塗った物、ふちだけ金)

```
single chalice, painted solid matte black, the chalice is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### LIV 黒い灯

保存するファイル名: `art/bus/lantern-black.png` / 意味: 灯(黒く塗った物、ふちだけ金)

```
single lantern, painted solid matte black, the lantern is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### LV 蒼い砂時計

保存するファイル名: `art/bus/hourglass-azure.png` / 意味: 砂時計(物を蒼色に(飾りは金のまま))

```
single azure blue hourglass, the hourglass is the main subject, large and clearly recognizable, the whole hourglass drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden hourglass
```

### LVI 凍てる輪

保存するファイル名: `art/bus/wheel-frozen.png` / 意味: 輪(霜の結晶に覆われている)

```
single wheel, a spoked wagon wheel with a hub and a rim, frozen, covered in frost crystals, the wheel is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LVII 凍てる錨

保存するファイル名: `art/bus/anchor-frozen.png` / 意味: 錨(霜の結晶に覆われている)

```
single anchor, frozen, covered in frost crystals, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LVIII 燃える太陽

保存するファイル名: `art/bus/sun-burning.png` / 意味: 太陽(炎に包まれている)

```
single sun, burning, wreathed in stylized flames, the sun is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LIX 凍てる杖

保存するファイル名: `art/bus/wand-frozen.png` / 意味: 杖(霜の結晶に覆われている)

```
single magic staff, frozen, covered in frost crystals, the magic staff is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LX 紅い扉

保存するファイル名: `art/bus/door-crimson.png` / 意味: 扉(物を紅色に(飾りは金のまま))

```
single crimson red arched door, a tall arched door with two panels and a round handle, the arched door is the main subject, large and clearly recognizable, the whole arched door drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden arched door
```

### LXI 双子の炎

保存するファイル名: `art/bus/flame-twin.png` / 意味: 炎(同じものが2つ並ぶ)

```
exactly two identical flame, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two flame are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### LXII 翼ある星

保存するファイル名: `art/bus/star-winged.png` / 意味: 星(翼が生えている)

```
single star, with a pair of feathered wings, the star is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXIII 真夜中の剣

保存するファイル名: `art/bus/sword-midnight.png` / 意味: 剣(背景が濃紺の夜空、白く小さな星)

```
single sword, the sword is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### LXIV 蒼い雫

保存するファイル名: `art/bus/droplet-azure.png` / 意味: 雫(物を蒼色に(飾りは金のまま))

```
single azure blue water droplet, a teardrop shape, round at the bottom and pointed at the top, the water droplet is the main subject, large and clearly recognizable, the whole water droplet drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden water droplet
```

### LXV 真夜中の灯

保存するファイル名: `art/bus/lantern-midnight.png` / 意味: 灯(背景が濃紺の夜空、白く小さな星)

```
single lantern, the lantern is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### LXVI 蒼い目

保存するファイル名: `art/bus/eye-azure.png` / 意味: 目(物を蒼色に(飾りは金のまま))

```
single azure blue eye, an open eye with an almond shaped outline and a round iris, the eye is the main subject, large and clearly recognizable, the whole eye drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden eye
```

### LXVII 夜明けの星

保存するファイル名: `art/bus/star-dawn.png` / 意味: 星(背景の下の地平線だけ朝焼けの光)

```
single star, the star is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### LXVIII 金の冠

保存するファイル名: `art/bus/crown-gold.png` / 意味: 冠(物がいつもより強く輝く金)

```
single crown, the crown is the main subject, large and clearly recognizable, the crown drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXIX 白い雫

保存するファイル名: `art/bus/droplet-white.png` / 意味: 雫(物を白に(飾りは金のまま))

```
single pure white water droplet, a teardrop shape, round at the bottom and pointed at the top, the water droplet is the main subject, large and clearly recognizable, the whole water droplet drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden water droplet
```

### LXX 白い砂時計

保存するファイル名: `art/bus/hourglass-white.png` / 意味: 砂時計(物を白に(飾りは金のまま))

```
single pure white hourglass, the hourglass is the main subject, large and clearly recognizable, the whole hourglass drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden hourglass
```

### LXXI 砕けた錨

保存するファイル名: `art/bus/anchor-cracked.png` / 意味: 錨(大きなひびが入り、かけらが浮く)

```
single anchor, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the anchor is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXXII 砕けた輪

保存するファイル名: `art/bus/wheel-cracked.png` / 意味: 輪(大きなひびが入り、かけらが浮く)

```
single wheel, a spoked wagon wheel with a hub and a rim, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the wheel is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXXIII 白い目

保存するファイル名: `art/bus/eye-white.png` / 意味: 目(物を白に(飾りは金のまま))

```
single pure white eye, an open eye with an almond shaped outline and a round iris, the eye is the main subject, large and clearly recognizable, the whole eye drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden eye
```

### LXXIV 紅い鍵

保存するファイル名: `art/bus/key-crimson.png` / 意味: 鍵(物を紅色に(飾りは金のまま))

```
single crimson red antique key, the antique key is the main subject, large and clearly recognizable, the whole antique key drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden antique key
```

### LXXV 紅い杯

保存するファイル名: `art/bus/chalice-crimson.png` / 意味: 杯(物を紅色に(飾りは金のまま))

```
single crimson red chalice, the chalice is the main subject, large and clearly recognizable, the whole chalice drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden chalice
```

### LXXVI 逆さの矢

保存するファイル名: `art/bus/arrow-inverted.png` / 意味: 矢(上下逆さま)

```
single arrow, upside down, the arrow is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXXVII 双子の矢

保存するファイル名: `art/bus/arrow-twin.png` / 意味: 矢(同じものが2つ並ぶ)

```
exactly two identical arrow, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two arrow are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### LXXVIII 真夜中の炎

保存するファイル名: `art/bus/flame-midnight.png` / 意味: 炎(背景が濃紺の夜空、白く小さな星)

```
single flame, the flame is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### LXXIX 翼ある天秤

保存するファイル名: `art/bus/scales-winged.png` / 意味: 天秤(翼が生えている)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, with a pair of feathered wings, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXXX 夜明けの矢

保存するファイル名: `art/bus/arrow-dawn.png` / 意味: 矢(背景の下の地平線だけ朝焼けの光)

```
single arrow, the arrow is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### LXXXI 紅い鐘

保存するファイル名: `art/bus/bell-crimson.png` / 意味: 鐘(物を紅色に(飾りは金のまま))

```
single crimson red bell, the bell is the main subject, large and clearly recognizable, the whole bell drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden bell
```

### LXXXII 白い月

保存するファイル名: `art/bus/moon-white.png` / 意味: 月(物を白に(飾りは金のまま))

```
single pure white moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the whole moon drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden moon
```

### LXXXIII 凍てる剣

保存するファイル名: `art/bus/sword-frozen.png` / 意味: 剣(霜の結晶に覆われている)

```
single sword, frozen, covered in frost crystals, the sword is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### LXXXIV 双子の天秤

保存するファイル名: `art/bus/scales-twin.png` / 意味: 天秤(同じものが2つ並ぶ)

```
exactly two identical balance scales, one on the left and one on the right, with a clear gap between them, not overlapping, only two, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, the two balance scales are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### LXXXV 銀の星

保存するファイル名: `art/bus/star-silver.png` / 意味: 星(物を銀色に(飾りは金のまま))

```
single silver star, the star is the main subject, large and clearly recognizable, the whole star drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden star
```

### LXXXVI 紅い月

保存するファイル名: `art/bus/moon-crimson.png` / 意味: 月(物を紅色に(飾りは金のまま))

```
single crimson red moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the whole moon drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden moon
```

### LXXXVII 白い鐘

保存するファイル名: `art/bus/bell-white.png` / 意味: 鐘(物を白に(飾りは金のまま))

```
single pure white bell, the bell is the main subject, large and clearly recognizable, the whole bell drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden bell
```

### LXXXVIII 真夜中の冠

保存するファイル名: `art/bus/crown-midnight.png` / 意味: 冠(背景が濃紺の夜空、白く小さな星)

```
single crown, the crown is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### LXXXIX 銀の月

保存するファイル名: `art/bus/moon-silver.png` / 意味: 月(物を銀色に(飾りは金のまま))

```
single silver moon, a large crescent moon shape, the moon is the main subject, large and clearly recognizable, the whole moon drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden moon
```

### XC 金の雫

保存するファイル名: `art/bus/droplet-gold.png` / 意味: 雫(物がいつもより強く輝く金)

```
single water droplet, a teardrop shape, round at the bottom and pointed at the top, the water droplet is the main subject, large and clearly recognizable, the water droplet drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XCI 紅い砂時計

保存するファイル名: `art/bus/hourglass-crimson.png` / 意味: 砂時計(物を紅色に(飾りは金のまま))

```
single crimson red hourglass, the hourglass is the main subject, large and clearly recognizable, the whole hourglass drawn in crimson red lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden hourglass
```

### XCII 凍てる太陽

保存するファイル名: `art/bus/sun-frozen.png` / 意味: 太陽(霜の結晶に覆われている)

```
single sun, frozen, covered in frost crystals, the sun is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XCIII 黒い月

保存するファイル名: `art/bus/moon-black.png` / 意味: 月(黒く塗った物、ふちだけ金)

```
single moon, a large crescent moon shape, painted solid matte black, the moon is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### XCIV 凍てる炎

保存するファイル名: `art/bus/flame-frozen.png` / 意味: 炎(霜の結晶に覆われている)

```
single flame, frozen, covered in frost crystals, the flame is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XCV 砕けた目

保存するファイル名: `art/bus/eye-cracked.png` / 意味: 目(大きなひびが入り、かけらが浮く)

```
single eye, an open eye with an almond shaped outline and a round iris, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the eye is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### XCVI 双子の錨

保存するファイル名: `art/bus/anchor-twin.png` / 意味: 錨(同じものが2つ並ぶ)

```
exactly two identical anchor, one on the left and one on the right, with a clear gap between them, not overlapping, only two, the two anchor are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XCVII 真夜中の羽

保存するファイル名: `art/bus/feather-midnight.png` / 意味: 羽(背景が濃紺の夜空、白く小さな星)

```
single feather, the feather is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### XCVIII 双子の輪

保存するファイル名: `art/bus/wheel-twin.png` / 意味: 輪(同じものが2つ並ぶ)

```
exactly two identical wheel, one on the left and one on the right, with a clear gap between them, not overlapping, only two, a spoked wagon wheel with a hub and a rim, the two wheel are the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, three objects, crossed, overlapping
```

### XCIX 黒い星

保存するファイル名: `art/bus/star-black.png` / 意味: 星(黒く塗った物、ふちだけ金)

```
single star, painted solid matte black, the star is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### C 翼ある剣

保存するファイル名: `art/bus/sword-winged.png` / 意味: 剣(翼が生えている)

```
single sword, with a pair of feathered wings, the sword is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CI 夜明けの天秤

保存するファイル名: `art/bus/scales-dawn.png` / 意味: 天秤(背景の下の地平線だけ朝焼けの光)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### CII 逆さの天秤

保存するファイル名: `art/bus/scales-inverted.png` / 意味: 天秤(上下逆さま)

```
single balance scales, a balance scale with a central upright post, a horizontal beam on top and two pans hanging from both ends, upside down, the balance scales is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CIII 銀の灯

保存するファイル名: `art/bus/lantern-silver.png` / 意味: 灯(物を銀色に(飾りは金のまま))

```
single silver lantern, the lantern is the main subject, large and clearly recognizable, the whole lantern drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden lantern
```

### CIV 銀の杯

保存するファイル名: `art/bus/chalice-silver.png` / 意味: 杯(物を銀色に(飾りは金のまま))

```
single silver chalice, the chalice is the main subject, large and clearly recognizable, the whole chalice drawn in silver lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden chalice
```

### CV 夜明けの羽

保存するファイル名: `art/bus/feather-dawn.png` / 意味: 羽(背景の下の地平線だけ朝焼けの光)

```
single feather, the feather is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### CVI 欠けた鍵

保存するファイル名: `art/bus/key-chipped.png` / 意味: 鍵(一部が大きく欠けている)

```
single antique key, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the antique key is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CVII 夜明けの冠

保存するファイル名: `art/bus/crown-dawn.png` / 意味: 冠(背景の下の地平線だけ朝焼けの光)

```
single crown, the crown is the main subject, large and clearly recognizable, warm muted gold lines, the object stays warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue sky background, with a soft warm orange sunrise glow only on the horizon at the very bottom, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, orange object, orange fill
```

### CVIII 白い扉

保存するファイル名: `art/bus/door-white.png` / 意味: 扉(物を白に(飾りは金のまま))

```
single pure white arched door, a tall arched door with two panels and a round handle, the arched door is the main subject, large and clearly recognizable, the whole arched door drawn in pure white lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden arched door
```

### CIX 翼ある灯

保存するファイル名: `art/bus/lantern-winged.png` / 意味: 灯(翼が生えている)

```
single lantern, with a pair of feathered wings, the lantern is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CX 蒼い鍵

保存するファイル名: `art/bus/key-azure.png` / 意味: 鍵(物を蒼色に(飾りは金のまま))

```
single azure blue antique key, the antique key is the main subject, large and clearly recognizable, the whole antique key drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden antique key
```

### CXI 黒い雫

保存するファイル名: `art/bus/droplet-black.png` / 意味: 雫(黒く塗った物、ふちだけ金)

```
single water droplet, a teardrop shape, round at the bottom and pointed at the top, painted solid matte black, the water droplet is the main subject, large and clearly recognizable, thin warm muted gold edge, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, object filled solid black with a thin warm muted gold edge only, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, person, human figure, woman, hood, cloak
```

### CXII 金の砂時計

保存するファイル名: `art/bus/hourglass-gold.png` / 意味: 砂時計(物がいつもより強く輝く金)

```
single hourglass, the hourglass is the main subject, large and clearly recognizable, the hourglass drawn in radiant bright gold lines with a strong golden glow, ornament in warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXIII 燃える目

保存するファイル名: `art/bus/eye-burning.png` / 意味: 目(炎に包まれている)

```
single eye, an open eye with an almond shaped outline and a round iris, burning, wreathed in stylized flames, the eye is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXIV 真夜中の矢

保存するファイル名: `art/bus/arrow-midnight.png` / 意味: 矢(背景が濃紺の夜空、白く小さな星)

```
single arrow, the arrow is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, deep dark navy blue night sky background with many tiny white stars scattered, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, brown background, sepia, orange background
```

### CXV 逆さの炎

保存するファイル名: `art/bus/flame-inverted.png` / 意味: 炎(上下逆さま)

```
single flame, upside down, the flame is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXVI 蒼い杯

保存するファイル名: `art/bus/chalice-azure.png` / 意味: 杯(物を蒼色に(飾りは金のまま))

```
single azure blue chalice, the chalice is the main subject, large and clearly recognizable, the whole chalice drawn in azure blue lines, only the short radiating lines behind it are warm muted gold, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

このカードは「描いてほしくないこと」に、共通の文の代わりに次を貼る。

```
text, letters, words, numbers, roman numerals, typography, title banner, watermark, signature, logo, tarot card, playing card, card layout, border, frame, card border, ornamental border, corner ornaments, light blue background, sky blue, cyan, bright background, colored fill, painted, multicolored, cluttered, busy background, shading, hatching, cross-hatching, paper texture, grunge, floral ornament, vines, perspective, photo, photorealistic, 3d render, blurry, low quality, jpeg artifacts, deformed, circular frame, empty medallion, compass rose, tiny object, small object, object off center, glossy, shiny reflections, realistic metal, golden chalice
```

### CXVII 欠けた扉

保存するファイル名: `art/bus/door-chipped.png` / 意味: 扉(一部が大きく欠けている)

```
single arched door, a tall arched door with two panels and a round handle, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the arched door is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXVIII 欠けた杖

保存するファイル名: `art/bus/wand-chipped.png` / 意味: 杖(一部が大きく欠けている)

```
single magic staff, with one large wedge-shaped piece clearly broken off its edge, a visible missing chunk, the magic staff is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXIX 燃える鐘

保存するファイル名: `art/bus/bell-burning.png` / 意味: 鐘(炎に包まれている)

```
single bell, burning, wreathed in stylized flames, the bell is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```

### CXX 砕けた太陽

保存するファイル名: `art/bus/sun-cracked.png` / 意味: 太陽(大きなひびが入り、かけらが浮く)

```
single sun, split by large jagged cracks running across it, a few small broken fragments floating slightly apart, the sun is the main subject, large and clearly recognizable, warm muted gold lines, very few subtle short radiating lines behind the object, minimal ornament, art deco emblem, single icon illustration, outline drawing only, no color fill, geometric, symmetrical, front view, centered, object fills 60 to 70 percent of the image, clean medium line weight, consistent line weight, flat line art, no shading, very dark navy blue background, almost black, solid flat color, subtle glow, generous empty margin, original design
```
