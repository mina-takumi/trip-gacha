import { gsap } from 'gsap';
import { digitsHtml, rollHtml, rollPlan, type RollDigit } from './roll.ts';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 全画面の演出を1つ出す。押すか、アプリを裏に回すと最後まで飛ばす */
function overlay(cls: string, html: string): { el: HTMLElement; bind(tl: gsap.core.Timeline): void; remove(): void } {
  const el = document.createElement('div');
  el.className = `fx ${cls}`;
  el.innerHTML = html;
  document.body.appendChild(el);
  let timeline: gsap.core.Timeline | null = null;
  const skip = () => { timeline?.progress(1); };
  const onHide = () => { if (document.hidden) skip(); };
  el.addEventListener('pointerdown', skip);
  document.addEventListener('visibilitychange', onHide);
  return {
    el,
    bind(tl) { timeline = tl; },
    remove() {
      document.removeEventListener('visibilitychange', onHide);
      el.remove();
    },
  };
}

// ---------- 開いたとき ----------
/** 起動したときに1回。色の帯が伸び、ロゴをスタンプのように押してホームへ */
export async function playIntro(): Promise<void> {
  if (reduced() || document.hidden) return;
  const fx = overlay('fx-intro', '<div class="fx-bar"><i></i><i></i><i></i><i></i></div><div class="fx-logo">トリップガチャ</div>');
  const q = gsap.utils.selector(fx.el);
  gsap.set(q('.fx-logo'), { autoAlpha: 0 });
  // ロゴの書体が届く前に押すと、別の書体で一瞬見えてしまう
  await Promise.race([document.fonts.load('400 34px "Yusei Magic"', 'トリップガチャ'), new Promise((r) => setTimeout(r, 300))]).catch(() => {});
  await new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { fx.remove(); resolve(); } });
    fx.bind(tl);
    tl.from(q('.fx-bar'), { scaleX: 0, duration: 0.3, ease: 'power2.out' }, 0)
      .fromTo(q('.fx-logo'), { scale: 2, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: -3, autoAlpha: 1, duration: 0.28, ease: 'back.out(2)' }, 0.2)
      .to(fx.el, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 0.68);
  });
}

// ---------- 回す ----------
/**
 * ガチャガチャが揺れてカプセルが開く演出。終わったら reveal を呼び、その後ろに結果の画面を用意してから演出を消す。
 * 結果は呼ぶ前に保存してあるので、途中で閉じてもカードは失われない。
 * secret(裏カードが出た)のときは、落ちたカプセルが紫に変わって光り、はじけてから結果へ(約2.6秒)
 */
export function playSpin(reveal: () => void, secret = false): void {
  if (reduced() || document.hidden) { reveal(); return; }
  const sparks = secret ? '<i></i>'.repeat(12) : '';
  const fx = overlay('fx-spin', `<div class="fx-stage">
      ${secret ? `<div class="fx-rays"></div><div class="fx-glow"></div><div class="fx-sparks">${sparks}</div>` : ''}
      <div class="fx-mach"><div class="fx-dome"><i></i><i></i><i></i><i></i></div><div class="fx-base"><div class="fx-knob"></div><div class="fx-slot"></div></div></div>
      <div class="fx-cap"><i class="t"></i><i class="b"></i></div>
    </div>
    ${secret ? '<div class="fx-flash"></div>' : ''}
    <p class="fx-skip">押すと、飛ばせる。</p>`);
  const q = gsap.utils.selector(fx.el);
  gsap.set(q('.fx-cap'), { autoAlpha: 0 });
  // 飛ばしたときに途中の呼び出しと終わりの両方が走っても、結果は1回だけ出す
  let revealed = false;
  const show = () => { if (!revealed) { revealed = true; reveal(); } };
  const tl = gsap.timeline({ onComplete: () => { show(); fx.remove(); } });
  fx.bind(tl);
  tl.to(q('.fx-knob'), { rotation: 360, duration: 0.6, ease: 'power2.inOut' }, 0)
    .to(q('.fx-mach'), { keyframes: { rotation: [0, -3, 3, -2, 2, 0] }, duration: 0.6, ease: 'none' }, 0)
    .fromTo(q('.fx-cap'), { y: -48, scale: 0.6, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power2.in' }, 0.54)
    .to(q('.fx-cap'), { y: -16, duration: 0.09, ease: 'sine.out', yoyo: true, repeat: 1 }, 0.76)
    .to(q('.fx-skip'), { autoAlpha: 0, duration: 0.15 }, 0.9);
  if (secret) {
    secretTimeline(tl, q, fx.el, show, 1.0);
    return;
  }
  tl.to(q('.fx-cap .t'), { y: -64, rotation: -24, duration: 0.24, ease: 'power2.out' }, 0.94)
    .to(q('.fx-cap .b'), { y: 64, rotation: 18, duration: 0.24, ease: 'power2.out' }, 0.94)
    .to(q('.fx-mach'), { autoAlpha: 0, duration: 0.2 }, 0.96)
    .to(fx.el, { backgroundColor: '#22303C', duration: 0.24, ease: 'power1.inOut' }, 0.96)
    .to(q('.fx-cap'), { autoAlpha: 0, duration: 0.1 }, 1.12);
}

/**
 * まとめて回した結果から離れるときに、残しておいた裏カードを見せる演出。ガチャガチャは出さず、
 * 画面が暗くなって紫のカプセルが現れ、震えて光ってはじける(約1.9秒)
 */
export function playSecretBurst(reveal: () => void): void {
  if (reduced() || document.hidden) { reveal(); return; }
  const fx = overlay('fx-spin', `<div class="fx-stage">
      <div class="fx-rays"></div><div class="fx-glow"></div><div class="fx-sparks">${'<i></i>'.repeat(12)}</div>
      <div class="fx-cap"><i class="t"></i><i class="b"></i></div>
    </div>
    <div class="fx-flash"></div>
    <p class="fx-skip">押すと、飛ばせる。</p>`);
  const q = gsap.utils.selector(fx.el);
  gsap.set(fx.el, { backgroundColor: 'rgba(42, 24, 70, 0)' });
  gsap.set(q('.fx-cap .t'), { backgroundColor: '#6E4BA0' });
  gsap.set(q('.fx-cap .b'), { backgroundColor: '#D6C8F0' });
  let revealed = false;
  const show = () => { if (!revealed) { revealed = true; reveal(); } };
  const tl = gsap.timeline({ onComplete: () => { show(); fx.remove(); } });
  fx.bind(tl);
  tl.fromTo(q('.fx-cap'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2)' }, 0.15)
    .to(q('.fx-skip'), { autoAlpha: 0, duration: 0.15 }, 1.2);
  secretTimeline(tl, q, fx.el, show, 0.3);
}

/** 裏カードの続き。紫に変わって震える → 光の輪と銀の筋 → きらめき → はじけて白く光る → 光が引くと結果の画面 */
function secretTimeline(tl: gsap.core.Timeline, q: (s: string) => Element[], el: HTMLElement, show: () => void, t0: number): void {
  const at = (t: number) => t0 + t;
  const sparks = q('.fx-sparks i');
  gsap.set([...q('.fx-rays'), ...q('.fx-glow'), ...sparks, ...q('.fx-flash')], { autoAlpha: 0 });
  tl.to(q('.fx-cap .t'), { backgroundColor: '#6E4BA0', duration: 0.3 }, at(0))
    .to(q('.fx-cap .b'), { backgroundColor: '#D6C8F0', duration: 0.3 }, at(0))
    .to(el, { backgroundColor: '#2A1846', duration: 0.45, ease: 'power1.inOut' }, at(0))
    .to(q('.fx-mach'), { autoAlpha: 0, y: 30, duration: 0.4, ease: 'power1.in' }, at(0))
    // 震えはだんだん強く
    .to(q('.fx-cap'), { keyframes: { x: [0, -2, 2, -2, 2, -3, 3, -4, 4, -5, 5, 0] }, duration: 0.9, ease: 'none' }, at(0.05))
    .to(q('.fx-cap'), { y: -90, scale: 1.15, duration: 0.9, ease: 'power1.inOut' }, at(0.05))
    .fromTo(q('.fx-glow'), { scale: 0.2, autoAlpha: 0, y: -90 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, at(0.1))
    .to(q('.fx-glow'), { scale: 1.25, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at(0.6))
    .fromTo(q('.fx-rays'), { scale: 0.3, autoAlpha: 0, rotation: 0, y: -90 }, { scale: 1, autoAlpha: 1, rotation: 40, duration: 0.9, ease: 'power2.out' }, at(0.4))
    .fromTo(sparks, { x: 0, y: -90, scale: 0, autoAlpha: 1 }, {
      x: (i: number) => Math.cos((i / sparks.length) * Math.PI * 2) * (90 + (i % 3) * 30),
      y: (i: number) => -90 + Math.sin((i / sparks.length) * Math.PI * 2) * (90 + (i % 3) * 30),
      scale: 1, duration: 0.55, ease: 'power2.out', stagger: 0.02,
    }, at(0.45))
    .to(sparks, { autoAlpha: 0, duration: 0.25, stagger: 0.02 }, at(0.85))
    .to(q('.fx-cap .t'), { y: -64, rotation: -24, duration: 0.18, ease: 'power2.out' }, at(1))
    .to(q('.fx-cap .b'), { y: 64, rotation: 18, duration: 0.18, ease: 'power2.out' }, at(1))
    .to(q('.fx-flash'), { autoAlpha: 1, duration: 0.12, ease: 'power1.in' }, at(1))
    // 白で隠れている間に結果の画面を用意し、演出の背景を抜いて、光が引くと結果が見える
    .call(show, [], at(1.12))
    .set([...q('.fx-stage'), ...q('.fx-skip')], { autoAlpha: 0 }, at(1.12))
    .set(el, { backgroundColor: 'transparent' }, at(1.12))
    .to(q('.fx-flash'), { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, at(1.18));
}

/**
 * 裏カードの結果の画面。大きいカードが裏向きで出て、くるっと回って表になり、そのあと「???」のスタンプを押す。
 * 結果の画面を描いた直後に1回だけ呼ぶ(描き直しでは呼ばないので、回るのは最初の1回だけ)
 */
export function playSecretCard(root: HTMLElement): void {
  if (reduced() || document.hidden) return;
  const card = root.querySelector<HTMLElement>('.rays .card');
  const stamp = root.querySelector<HTMLElement>('.res .stamp');
  if (!card) return;
  const back = document.createElement('div');
  back.className = 'card-back';
  back.innerHTML = '<b>?</b>';
  card.appendChild(back);
  const tl = gsap.timeline({ onComplete: () => { back.remove(); gsap.set(card, { clearProps: 'transform' }); } });
  if (stamp) gsap.set(stamp, { autoAlpha: 0 });
  tl.fromTo(card, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' }, 0)
    .to(card, { rotationY: 90, transformPerspective: 900, duration: 0.22, ease: 'power1.in' }, 0.45)
    .call(() => back.remove(), [], 0.67)
    .fromTo(card, { rotationY: -90 }, { rotationY: 0, transformPerspective: 900, duration: 0.4, ease: 'back.out(1.6)' }, 0.67);
  if (stamp) tl.fromTo(stamp, { scale: 2.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2)' }, 1.0);
}

// ---------- 距離の数字 ----------
let shown: string | null = null;
let target: string | null = null;
/** 回っている途中の数字。画面が作り直されても、これを入れ直して回し続ける */
let live: HTMLElement | null = null;
/** 演出が終わるまで、数字を出発点のまま止めておく */
let held = false;
/** この時刻までに数字が変わったら、全部の桁を回す */
let longUntil = 0;

/** 起動の演出の間、距離を text のまま止める */
export function holdDistance(text: string): void {
  shown = text;
  held = true;
}

/** 止めるのをやめる。次に描いたときに回り始める */
export function releaseDistance(): void {
  held = false;
  markLongRoll();
}

/** 開いたとき・裏から戻ったとき。少しの間に数字が変わったら全部の桁を回す */
export function markLongRoll(): void {
  longUntil = Date.now() + 10_000;
}

function roll(el: HTMLElement, root: HTMLElement, from: string, to: string, long: boolean): void {
  const cells = rollPlan(from, to, long);
  el.innerHTML = rollHtml(cells);
  live = el;
  const digits = cells.filter((c): c is RollDigit => c !== '.');
  const strips = el.querySelectorAll<HTMLElement>('.strip');
  const tl = gsap.timeline({
    onComplete: () => {
      el.innerHTML = digitsHtml(to);
      live = null;
      shown = to;
      // 回っている間にまた増えていたら、続けて回す
      if (target && target !== to) syncDistance(root, target);
    },
  });
  digits.forEach((d, i) => {
    const steps = d.seq.length - 1;
    if (steps === 0) return;
    const at = (n: number) => ({ yPercent: (-100 * n) / d.seq.length });
    if (!long) {
      tl.to(strips[i], { ...at(steps), duration: 0.38, ease: 'back.out(2.2)' }, 0.14 * d.fromRight);
      return;
    }
    // 右の桁から止まる。最後の2コマはカチッと1コマずつ送る
    const landing = 0.95 + 0.2 * d.fromRight;
    tl.to(strips[i], { ...at(steps - 2), duration: landing, ease: 'power4.out' }, 0)
      .to(strips[i], { ...at(steps - 1), duration: 0.11, ease: 'back.out(3)' }, landing)
      .to(strips[i], { ...at(steps), duration: 0.13, ease: 'back.out(3)' }, landing + 0.11);
  });
}

/** 画面を描いたあとに呼ぶ。ホームが出ていて数字が変わっていれば回す */
export function syncDistance(root: HTMLElement, text: string): void {
  target = text;
  const el = root.querySelector<HTMLElement>('.huge-n');
  if (!el) return;
  if (live) {
    if (el !== live) el.replaceWith(live);
    return;
  }
  if (held && shown != null) {
    el.innerHTML = digitsHtml(shown);
    return;
  }
  if (shown == null || reduced()) {
    shown = text;
    return;
  }
  if (shown !== text) roll(el, root, shown, text, Date.now() < longUntil);
}
