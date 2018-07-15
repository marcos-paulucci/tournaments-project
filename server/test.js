import test from 'ava';
import nextBattleCalculator from './src/services/nextBattleCalculator';

test('16 1', t => {
    const result = nextBattleCalculator(1,16);
    t.is(result, 9);
});

test('16 2', t => {
    const result = nextBattleCalculator(2,16);
    t.is(result, 9);
});

test('16 3', t => {
    const result = nextBattleCalculator(3,16);
    t.is(result, 10);
});

test('16 4', t => {
    const result = nextBattleCalculator(4,16);
    t.is(result, 10);
});

test('16 5', t => {
    const result = nextBattleCalculator(5,16);
    t.is(result, 11);
});

test('16 6', t => {
    const result = nextBattleCalculator(6,16);
    t.is(result, 11);
});

test('16 7', t => {
    const result = nextBattleCalculator(7,16);
    t.is(result, 12);
});

test('16 8', t => {
    const result = nextBattleCalculator(8,16);
    t.is(result, 12);
});

test('16 9', t => {
    const result = nextBattleCalculator(9,16);
    t.is(result, 13);
});

test('16 10', t => {
    const result = nextBattleCalculator(10,16);
    t.is(result, 13);
});

test('16 11', t => {
    const result = nextBattleCalculator(11,16);
    t.is(result, 14);
});

test('16 12', t => {
    const result = nextBattleCalculator(12,16);
    t.is(result, 14);
});

test('16 13', t => {
    const result = nextBattleCalculator(13,16);
    t.is(result, 15);
});

test('16 14', t => {
    const result = nextBattleCalculator(14,16);
    t.is(result, 15);
});

test('16 15', t => {
    const result = nextBattleCalculator(15,16);
    t.is(result, 16);
});


test('8 1', t => {
    const result = nextBattleCalculator(1,8);
    t.is(result, 5);
});

test('8 2', t => {
    const result = nextBattleCalculator(2,8);
    t.is(result, 5);
});

test('8 3', t => {
    const result = nextBattleCalculator(3,8);
    t.is(result, 6);
});

test('8 4', t => {
    const result = nextBattleCalculator(4,8);
    t.is(result, 6);
});

test('8 5', t => {
    const result = nextBattleCalculator(5,8);
    t.is(result, 7);
});

test('8 6', t => {
    const result = nextBattleCalculator(6,8);
    t.is(result, 7);
});

test('8 7', t => {
    const result = nextBattleCalculator(7,8);
    t.is(result, 8);
});


test('32 1', t => {
    const result = nextBattleCalculator(1,32);
    t.is(result, 17);
});

test('32 2', t => {
    const result = nextBattleCalculator(2,32);
    t.is(result, 17);
});

test('32 15', t => {
    const result = nextBattleCalculator(15,32);
    t.is(result, 24);
});

test('32 16', t => {
    const result = nextBattleCalculator(16,32);
    t.is(result, 24);
});

test('32 17', t => {
    const result = nextBattleCalculator(17,32);
    t.is(result, 25);
});

test('32 18', t => {
    const result = nextBattleCalculator(18,32);
    t.is(result, 25);
});

test('32 29', t => {
    const result = nextBattleCalculator(29,32);
    t.is(result, 31);
});

test('32 30', t => {
    const result = nextBattleCalculator(30,32);
    t.is(result, 31);
});

test('32 31', t => {
    const result = nextBattleCalculator(31,32);
    t.is(result, 32);
});