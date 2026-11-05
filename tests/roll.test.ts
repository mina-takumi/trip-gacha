import assert from 'node:assert/strict';
import { test } from 'node:test';
import { digitsHtml, rollHtml, rollPlan, type RollDigit } from '../src/ui/roll.ts';

const digits = (from: string, to: string, long: boolean) => rollPlan(from, to, long).filter((c): c is RollDigit => c !== '.');
const steps = (d: RollDigit) => d.seq.length - 1;

test('開いたときは全部の桁が回り、右の桁ほど多く回り、目的の数字で止まる', () => {
  const [ten, one, tenth] = digits('0.0', '12.4', true);
  assert.deepEqual([ten.fromRight, one.fromRight, tenth.fromRight], [2, 1, 0]);
  assert.equal(steps(ten), 21);
  assert.equal(steps(one), 32);
  assert.equal(steps(tenth), 54);
  assert.deepEqual([ten, one, tenth].map((d) => d.seq.at(-1)), ['1', '2', '4']);
});

test('開いたときに数字が同じ桁も回る', () => {
  const [one, tenth] = digits('0.0', '0.0', true);
  assert.equal(steps(one), 30);
  assert.equal(steps(tenth), 50);
});

test('歩いて増えたときは、変わった桁だけ送る', () => {
  const [one, tenth] = digits('2.4', '2.5', false);
  assert.equal(steps(one), 0);
  assert.deepEqual(tenth.seq, ['4', '5']);
});

test('繰り上がりは両方の桁が進む', () => {
  const [one, tenth] = digits('2.9', '3.0', false);
  assert.deepEqual(one.seq, ['2', '3']);
  assert.deepEqual(tenth.seq, ['9', '0']);
});

test('桁が増えるとき、増えた桁は空白から始まる', () => {
  const [ten, one, tenth] = digits('9.9', '10.0', false);
  assert.deepEqual(ten.seq, [' ', '1']);
  assert.deepEqual(one.seq, ['9', '0']);
  assert.deepEqual(tenth.seq, ['9', '0']);
});

test('日付が変わって減るときも、増える向きに回って止まる', () => {
  const [one, tenth] = digits('12.4', '0.0', false);
  assert.deepEqual(one.seq, ['2', '3', '4', '5', '6', '7', '8', '9', '0']);
  assert.equal(tenth.seq.at(-1), '0');
});

test('小数点は回さず同じ位置に出る', () => {
  assert.equal(rollPlan('0.0', '12.4', true)[2], '.');
  assert.equal((digitsHtml('12.4').match(/class="d"/g) ?? []).length, 3);
  assert.equal((rollHtml(rollPlan('0.0', '2.4', false)).match(/class="p"/g) ?? []).length, 1);
});
