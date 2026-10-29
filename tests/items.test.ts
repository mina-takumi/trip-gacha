import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ART_KEYS, NOUNS, SPECIAL_NOUNS, createCatalog, toRoman, type Spot } from '../src/items.ts';

const { spots } = JSON.parse(readFileSync(new URL('../data/spots.json', import.meta.url), 'utf8')) as { spots: Spot[] };
const catalog = createCatalog(spots);
const cards = Object.values(catalog.stations);
const cityOf = (spotId: string) => spots.find((s) => s.id === spotId)!.city;

test('駅カードは八王子市の22枚と、周りの市の23枚', () => {
  assert.equal(cards.length, 45);
  assert.equal(cards.filter((c) => !cityOf(c.spotId)).length, 22);
  for (const city of ['日野市', '町田市', '多摩市']) assert.ok(cards.some((c) => cityOf(c.spotId) === city), city);
});

test('周りの市の駅の番号は XXII からの続きで、八王子市の番号と重ならない', () => {
  const own = cards.filter((c) => !cityOf(c.spotId)).map((c) => c.number);
  const added = cards.filter((c) => cityOf(c.spotId)).map((c) => c.number);
  assert.deepEqual(own, Array.from({ length: 22 }, (_, i) => toRoman(i)));
  assert.deepEqual(added, Array.from({ length: 23 }, (_, i) => toRoman(22 + i)));
});

test('周りの市の駅の物は、駅どうし・八王子市の物・バス停の物と重ならず、絵がある', () => {
  const added = cards.filter((c) => cityOf(c.spotId));
  assert.equal(new Set(added.map((c) => c.noun)).size, 23);
  for (const c of added) {
    assert.ok(!SPECIAL_NOUNS.includes(c.noun) && !NOUNS.includes(c.noun), c.name);
    assert.ok(ART_KEYS[c.noun], c.name);
  }
});

test('会社ごとの同じ駅は1つにまとめてある', () => {
  const names = spots.filter((s) => s.city).map((s) => s.name);
  assert.ok(names.includes('多摩センター') && names.includes('永山'));
  assert.ok(!names.some((n) => /^(京王|小田急)(多摩センター|永山)$/.test(n)));
});
