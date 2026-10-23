import type { CardRarity } from '../items.ts';
import { esc } from './html.ts';

const artUrl = (art: string) => `${import.meta.env.BASE_URL}art/${art}.webp`;

/** カードに描くもの。駅カード・バス停カードのどちらでもよい */
export interface CardFace { name: string; number: string; art: string }

/**
 * 表のカード。size: big(結果画面)/ md(図鑑の詳細)/ sm(一覧)。
 * 絵の色味を珍しさで変えるのは駅カードだけ(tint)。バス停カードは修飾の色(紅・翠・蒼など)があるので、絵はそのまま
 */
export function cardHtml(card: CardFace, rarity: CardRarity, size: 'big' | 'md' | 'sm' = 'md', tint = true): string {
  return `<div class="card r-${rarity} ${size === 'sm' ? 'sm' : size === 'big' ? 'big' : ''}${tint ? '' : ' plain'}">
    <div class="in">
      <div class="num">${esc(card.number)}</div>
      <div class="art"><img src="${artUrl(card.art)}" alt="${esc(card.name)}の絵" onerror="this.classList.add('missing')"></div>
      <div class="nm">${esc(card.name)}</div>
    </div>
  </div>`;
}

/** まだ持っていないカード。名前は伏せ、番号だけを点線の丸に入れる */
export function placeholderHtml(number: string): string {
  return `<div class="ph"><b class="${number.length > 4 ? 'long' : ''}">${esc(number)}</b></div>`;
}
