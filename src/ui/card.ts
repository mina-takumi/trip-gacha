import type { Rarity, StationCard } from '../items.ts';
import { esc } from './html.ts';

const artUrl = (art: string) => `${import.meta.env.BASE_URL}art/${art}.webp`;

/** 表のカード。size: big(結果画面)/ md(図鑑の詳細)/ sm(一覧) */
export function cardHtml(card: StationCard, rarity: Rarity, size: 'big' | 'md' | 'sm' = 'md'): string {
  return `<div class="card r-${rarity} ${size === 'sm' ? 'sm' : size === 'big' ? 'big' : ''}">
    <div class="in">
      <div class="num">${esc(card.number)}</div>
      <div class="art"><img src="${artUrl(card.art)}" alt="${esc(card.name)}の絵" onerror="this.classList.add('missing')"></div>
      <div class="nm">${esc(card.name)}</div>
    </div>
  </div>`;
}

/** まだ持っていないカード。名前は伏せ、番号だけを点線の丸に入れる */
export function placeholderHtml(number: string): string {
  return `<div class="ph"><b>${esc(number)}</b></div>`;
}
