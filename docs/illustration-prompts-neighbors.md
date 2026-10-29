# 日野市・町田市・多摩市の駅カードの絵の指示書(ChatGPT 用)

3市の23駅ぶんの図柄 23枚の指示。物ごとに1枚。物の名前で作り、そのあと駅名つきの名前(例: `日野の錠前.png`)に変えた。

このファイルは手で書いたもの(ほかの指示書と違い、`src/items.ts` からは作らない)。駅と物の組み合わせは `src/items.ts` の `NEIGHBOR_NOUNS`。

## 決まりごと(2026-10-29)

| 項目 | 決まりごと |
|---|---|
| 駅 | 23駅。多摩センター(京王・小田急・モノレール)と永山(京王・小田急)は、それぞれ1駅にまとめる(お互い200m以内のため) |
| 物 | 新しく23語。八王子の22駅・裏カードの24語、バス停カードの20語とは重ならない |
| 今のカード | 八王子の22駅の名前・番号・絵は変えない |
| 絵柄 | 今の GPT 版の駅の絵と同じ。金の線だけで描き、後ろに放射状の光・丸い光の輪・小さな星。背景はほぼ黒の濃紺 |
| 構図 | 物は1つだけ、真ん中に、画面の6〜7割。端で切れないよう余白を取る |
| 描かないもの | 文字・数字、カードの枠、人や手 |

## 使い方

1. まず「まず試す3枚」を作り、今の駅の絵(`GPT-駅` の灯台・風車など)と並べて、同じシリーズに見えるか確かめる
2. ずれる場合は、今の絵を1枚添えて「添付の絵と同じ絵柄で」と書き足して試す
3. ChatGPT に、枠の中の英文を1枚ずつそのまま貼る。共通の部分は変えない(変えると絵柄がそろわなくなる)
4. 正方形で作られているか、物が端で切れていないか確かめる
5. `C:\Users\cazut\Desktop\大学\卒業制作\カード\GPT-駅\` に、書いてある日本語の名前で保存する(作ったあと、駅名つきの名前に変えた)

## まず試す3枚

### 鏡

保存する名前: `鏡.png` / アプリでの名前: `art/special/mirror`

```
Square image. A single ornate oval standing mirror on a small footed stand; the mirror glass is left dark, with only two short diagonal gold shine lines. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 気球

保存する名前: `気球.png` / アプリでの名前: `art/special/balloon`

```
Square image. A single hot air balloon with a small basket hanging below it. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 城

保存する名前: `城.png` / アプリでの名前: `art/special/castle`

```
Square image. A single small castle with one tall central tower and two shorter side towers, standing on a stepped base. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

## 残りの20枚

### 扇

保存する名前: `扇.png` / アプリでの名前: `art/special/fan`

```
Square image. A single open folding fan, spread into a half circle, with its pivot at the bottom. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 盾

保存する名前: `盾.png` / アプリでの名前: `art/special/shield`

```
Square image. A single heraldic shield with a pointed bottom and a simple geometric pattern on its face. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 兜

保存する名前: `兜.png` / アプリでの名前: `art/special/helmet`

```
Square image. A single knight's helmet with a closed visor and a short crest on top, empty, with no head or face inside. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 弓

保存する名前: `弓.png` / アプリでの名前: `art/special/bow`

```
Square image. A single archery bow standing upright, with its string pulled straight, and no arrow. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 玉座

保存する名前: `玉座.png` / アプリでの名前: `art/special/throne`

```
Square image. A single empty royal throne with a tall pointed back and two armrests. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 宝箱

保存する名前: `宝箱.png` / アプリでの名前: `art/special/chest`

```
Square image. A single closed treasure chest with a rounded lid, metal bands and a small lock plate. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 望遠鏡

保存する名前: `望遠鏡.png` / アプリでの名前: `art/special/telescope`

```
Square image. A single old brass telescope on a three-legged stand, pointing up toward the upper right. Shown from the side, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 鳥籠

保存する名前: `鳥籠.png` / アプリでの名前: `art/special/birdcage`

```
Square image. A single empty domed birdcage with a ring on top, with no bird inside. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 貝

保存する名前: `貝.png` / アプリでの名前: `art/special/shell`

```
Square image. A single scallop seashell with ribs fanning out from the bottom. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 結晶

保存する名前: `結晶.png` / アプリでの名前: `art/special/snowflake`

```
Square image. A single six-pointed snowflake crystal. Shown flat, from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 錠前

保存する名前: `錠前.png` / アプリでの名前: `art/special/padlock`

```
Square image. A single closed padlock with a keyhole on its body, and no key. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 壺

保存する名前: `壺.png` / アプリでの名前: `art/special/urn`

```
Square image. A single tall urn with a narrow neck and two curved handles. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 瓶

保存する名前: `瓶.png` / アプリでの名前: `art/special/bottle`

```
Square image. A single small round potion bottle with a long neck and a cork stopper. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 神殿

保存する名前: `神殿.png` / アプリでの名前: `art/special/temple`

```
Square image. A single small ancient temple front: a triangular roof resting on four columns, standing on steps. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 柱

保存する名前: `柱.png` / アプリでの名前: `art/special/column`

```
Square image. A single classical stone column with a decorated top and base. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 傘

保存する名前: `傘.png` / アプリでの名前: `art/special/umbrella`

```
Square image. A single open umbrella with a curved handle, standing upright. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 首飾り

保存する名前: `首飾り.png` / アプリでの名前: `art/special/necklace`

```
Square image. A single necklace hanging in a U shape, with one large teardrop jewel at the bottom, not worn by anyone. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 斧

保存する名前: `斧.png` / アプリでの名前: `art/special/axe`

```
Square image. A single battle axe standing upright, with a double-sided blade at the top of a long handle. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 馬車

保存する名前: `馬車.png` / アプリでの名前: `art/special/carriage`

```
Square image. A single old-fashioned carriage with two large wheels, with no horse and no driver. Shown from the side, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```

### 風見鶏

保存する名前: `風見鶏.png` / アプリでの名前: `art/special/weathervane`

```
Square image. A single weathervane: a rooster figure on top of a pole, with four plain direction arms below it and no letters on them. Shown from the front, centered, filling about 60 to 70 percent of the image, with an empty margin so no part is cut off at the edges. Art deco emblem style: drawn only with glowing warm gold lines of even medium thickness, outline only, no color fill, no shading. Behind the object: sunburst rays, a thin circular halo with a dotted ring, a few small four-pointed star sparkles and short dotted lines. Symmetrical, simple and bold, so it still reads clearly when shown small on a phone. Plain, solid, very dark navy blue background, almost black, with no pattern or texture. Only one object. No text, letters or numbers. No card frame or border. No people or hands. Not photorealistic, not 3D.
```
