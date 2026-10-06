# 停留所データの出典

`hachioji_stops.csv` は `cazuto107/hachioji-geofence-testbench` の `data/hachioji_stops.csv` をコピーしたもの。

元データは OpenStreetMap。

- © OpenStreetMap contributors
- ライセンス: Open Database License (ODbL) https://opendatacommons.org/licenses/odbl/

`data/spots.json` はこの CSV を `scripts/build-spots.mjs` で加工したもので、同じく ODbL で提供する。

## 市の境界

`hachioji_boundary.json` は OpenStreetMap の八王子市の境界(relation 5301639)を Nominatim から取得したもの(2026-10-02)。
`polygon_threshold=0.003` で47点に間引いてある。簡略地図(`scripts/build-map.mjs`)の輪郭に使う。

- © OpenStreetMap contributors
- ライセンス: Open Database License (ODbL)

## 主な道路

`hachioji_roads.json` は OpenStreetMap の八王子市内の道路のうち、高速道路・国道・主要地方道・県道(`highway` が motorway / trunk / primary / secondary)を Overpass API から取得したもの(2026-10-02、923本)。
取り直すときは `npm run map:roads`。簡略地図の道路に使う。

- © OpenStreetMap contributors
- ライセンス: Open Database License (ODbL)

## すべての道路(アプリの地図画面用)

`hachioji_roads_all.json` は上の主な道路に加え、住宅街の道・歩道など(tertiary / unclassified / residential / living_street / service / pedestrian / footway / path / steps)も含めて取得したもの(2026-10-02、29,794本)。
取り直すときは `npm run map:roads -- --all --out data/source/hachioji_roads_all.json`。
`npm run map:data`(`scripts/build-map-data.mjs`)がこれと市の境界から `public/map/base.json`・`detail.json` を作る。

- © OpenStreetMap contributors
- ライセンス: Open Database License (ODbL)
