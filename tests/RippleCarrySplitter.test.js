const { expect, beforeAll, test } = require("@jest/globals");
const { BitString, CircuitVerseLoader, loadCircuit } = require("@willow-dls/core");

let adder;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "circuits/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});

test('0 + 0 (no carry in)', () => {
  const result = adder.run({ A: "0000", B: "0000", CarryIn: "0" })
  expect(result.outputs).toStrictEqual({ Output: new BitString("0000"), CarryOut: new BitString("0") })
});

test('1 + 1 (no carry in)', () => {
  const result = adder.run({ A: "0001", B: "0001", CarryIn: "0" })
  expect(result.outputs).toStrictEqual({ Output: new BitString("0010"), CarryOut: new BitString("0") })
});

test('foobar ', () => {
  const result = adder.run({ A: "0001", B: "0001", CarryIn: "0" })
  expect(result.outputs.Output.toString()).toBe("0010")
});


test('Add 5 + 7 (no carry in)', () => {
  const result = adder.run({ A: new BitString("0101"), B: new BitString("0111"), CarryIn: "0" })
  expect(result.outputs).toStrictEqual({ Output: new BitString("1100"), CarryOut: new BitString("0") })
});

test('Add 5 + 7 (carry in)', () => {
  const result = adder.run({ A: new BitString("0101"), B: new BitString("0111"), CarryIn: "1" })
  expect(result.outputs).toStrictEqual({ Output: new BitString("1101"), CarryOut: new BitString("0") })
});

test('Carry Out set', () => {
  const result = adder.run({ A: new BitString("1100"), B: new BitString("0110"), CarryIn: "0" })
  expect(result.outputs).toStrictEqual({ Output: new BitString("0010"), CarryOut: new BitString("1") })
});
