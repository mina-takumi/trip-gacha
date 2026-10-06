import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CONFIG } from '../config.ts';
import type { Fix } from '../geofence.ts';
import type { Spot, StationCard } from '../items.ts';
import { esc } from './html.ts';

const OWNED = '#E8552F';
const NOT_YET = '#B9AE9C';
const RING = '#2FA9A0';
const NAVY = '#22303C';
const PANEL = '#FBF6EC';

/** この倍率から、住宅街の道・歩道も描く */
const DETAIL_ZOOM = 15;

/** この倍率から、全部の駅名を出す(それより縮小したときは大きな駅だけ) */
const LABEL_ALL_ZOOM = 13;
const BIG_STATIONS = new Set(['八王子', '京王八王子', '高尾']);
/** 駅名を置く向き。近くの駅と重ならないように駅ごとに決める。書いていない駅は右 */
const LABEL_DIR: Record<string, L.Direction> = {
  八王子: 'left', 西八王子: 'top', 北野: 'top', 長沼: 'bottom', 京王片倉: 'top', 山田: 'bottom', めじろ台: 'bottom',
  狭間: 'top', 高尾: 'left', 高尾山口: 'bottom', 清滝: 'top', 高尾山: 'left', 八王子みなみ野: 'left', 北八王子: 'left',
  小宮: 'left', 中央大学・明星大学: 'left', 大塚・帝京大学: 'left', 南大沢: 'left',
};
const LABEL_OFFSET: Record<string, L.PointTuple> = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 10] };

type Encoded = number[];
interface BaseData { city: Encoded; big: Encoded[]; mid: Encoded[]; small: Encoded[] }
interface DetailData { roads: Encoded[] }

/** scripts/build-map-data.mjs の形(1/100000 度の整数、2点目からは差)を緯度経度に戻す */
function decode(e: Encoded): L.LatLngTuple[] {
  const pts: L.LatLngTuple[] = [];
  let lon = 0, lat = 0;
  for (let i = 0; i < e.length; i += 2) {
    lon += e[i]; lat += e[i + 1];
    pts.push([lat / 1e5, lon / 1e5]);
  }
  return pts;
}

const loadJson = <T>(name: string): Promise<T> => fetch(`map/${name}.json`).then((r) => r.json() as Promise<T>);

/** 地図の画面。Leaflet は作り直すと重いので、一度作ったら表示・非表示を切り替えて使い回す */
export function createMapView(el: HTMLElement, stations: Spot[], cards: Record<string, StationCard>, onTap?: (lat: number, lon: number) => void) {
  const map = L.map(el, { zoomControl: false, attributionControl: true, minZoom: 11, maxZoom: 18 }).setView([35.655, 139.33], 12);
  map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // 下から: 市の形(ずらした影つき) → 細い道 → 主な道 → 駅。道は面ごとに薄める(重なりで濃くならないように)
  for (const [name, z] of [['city', 250], ['detail', 260], ['roads', 270]] as const) map.createPane(name).style.zIndex = String(z);
  map.getPane('city')!.classList.add('map-city');
  map.getPane('detail')!.classList.add('map-roads');
  map.getPane('roads')!.classList.add('map-roads');
  const cityRenderer = L.svg({ pane: 'city' });
  const detailRenderer = L.canvas({ pane: 'detail' });
  const roadRenderer = L.canvas({ pane: 'roads' });

  const line = (pts: Encoded[], color: string, weight: number, renderer: L.Renderer) =>
    L.polyline(pts.map(decode), { color, weight, renderer, interactive: false, lineCap: 'round', lineJoin: 'round', smoothFactor: 1.5 });

  loadJson<BaseData>('base').then((d) => {
    L.polygon(decode(d.city), { renderer: cityRenderer, color: NAVY, weight: 3, fillColor: PANEL, fillOpacity: 1, interactive: false }).addTo(map);
    // 太い道は「紺の縁+中を白抜き」の二重線、県道は細い1本線
    line(d.small, NAVY, 1.3, roadRenderer).addTo(map);
    line(d.mid, NAVY, 4.5, roadRenderer).addTo(map);
    line(d.big, NAVY, 6.5, roadRenderer).addTo(map);
    line(d.mid, PANEL, 2, roadRenderer).addTo(map);
    line(d.big, PANEL, 3.5, roadRenderer).addTo(map);
  });

  // 細い道は数が多い(約3万本)ので、初めて拡大したときに読み込み、縮小したら外す
  let detail: L.Polyline | null = null;
  let loading = false;
  const syncDetail = () => {
    const want = map.getZoom() >= DETAIL_ZOOM;
    if (want && !detail && !loading) {
      loading = true;
      loadJson<DetailData>('detail').then((d) => {
        detail = line(d.roads, NAVY, .8, detailRenderer);
        syncDetail();
      });
    }
    if (detail) {
      if (want && !map.hasLayer(detail)) detail.addTo(map);
      if (!want && map.hasLayer(detail)) detail.remove();
    }
  };
  map.on('zoomend', syncDetail);

  const dots = new Map<string, L.CircleMarker>();
  for (const s of stations) {
    L.circle([s.lat, s.lon], { radius: CONFIG.enterRadiusM, color: RING, weight: 2, opacity: .7, dashArray: '6 6', fillColor: RING, fillOpacity: .08, interactive: false }).addTo(map);
    const dot = L.circleMarker([s.lat, s.lon], { radius: 8, color: NAVY, weight: 2, fillColor: NOT_YET, fillOpacity: 1 }).addTo(map);
    const dir = LABEL_DIR[s.name] ?? 'right';
    dot.bindTooltip(esc(s.name), { permanent: true, direction: dir, offset: LABEL_OFFSET[dir], className: `st-label${BIG_STATIONS.has(s.name) ? ' big' : ''}` });
    dots.set(s.id, dot);
  }
  // 縮小しているときは駅が混み合うので、大きな駅の名前だけ出す
  const syncLabels = () => map.getContainer().classList.toggle('labels-few', map.getZoom() < LABEL_ALL_ZOOM);
  map.on('zoomend', syncLabels);
  syncLabels();
  const me = L.marker([0, 0], { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18] }), interactive: false });
  if (onTap) map.on('click', (e) => onTap(e.latlng.lat, e.latlng.lng));

  let lastFix: Fix | null = null;
  return {
    /** 持っている駅はオレンジ、まだの駅は灰色。ポップアップには、持っていればカードの名前を出す */
    update(fix: Fix | null, ownedSpotIds: Set<string>) {
      for (const s of stations) {
        const owned = ownedSpotIds.has(s.id);
        const dot = dots.get(s.id)!;
        dot.setStyle({ fillColor: owned ? OWNED : NOT_YET });
        dot.bindPopup(`<b>${esc(cards[s.id].number)} ${esc(s.name)}</b><br>${owned ? esc(cards[s.id].name) : 'まだカードがありません'}`);
      }
      if (fix) {
        me.setLatLng([fix.lat, fix.lon]);
        if (!map.hasLayer(me)) me.addTo(map);
        if (!lastFix) map.setView([fix.lat, fix.lon], 15);
      }
      lastFix = fix;
      syncDetail();
    },
    center() {
      if (lastFix) map.setView([lastFix.lat, lastFix.lon], Math.max(map.getZoom(), 15));
    },
    /** 非表示から表示に戻したときに、地図の大きさを測り直す */
    resize() {
      map.invalidateSize();
    },
  };
}

export type MapView = ReturnType<typeof createMapView>;
