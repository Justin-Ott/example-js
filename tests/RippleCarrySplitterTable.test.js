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

// Test cases with specific values representing common scenarios
const testCases = [
  // { a, b, carryIn, expectedSum, expectedCarryOut, description }
  { a: "0000", b: "0000", carryIn: "0", expectedSum: "0000", expectedCarryOut: "0", description: "Zero plus zero" },
  { a: "0001", b: "0000", carryIn: "0", expectedSum: "0001", expectedCarryOut: "0", description: "One plus zero" },
  { a: "0001", b: "0001", carryIn: "0", expectedSum: "0010", expectedCarryOut: "0", description: "One plus one" },
  { a: "0101", b: "0011", carryIn: "0", expectedSum: "1000", expectedCarryOut: "0", description: "Five plus three" },
  { a: "0111", b: "0001", carryIn: "0", expectedSum: "1000", expectedCarryOut: "0", description: "Seven plus one" },
  { a: "1111", b: "0001", carryIn: "0", expectedSum: "0000", expectedCarryOut: "1", description: "Max value plus one (carry out)" },
  { a: "1111", b: "1111", carryIn: "0", expectedSum: "1110", expectedCarryOut: "1", description: "Max plus max" },
  { a: "1010", b: "0101", carryIn: "0", expectedSum: "1111", expectedCarryOut: "0", description: "Ten plus five" },
  { a: "0101", b: "0111", carryIn: "1", expectedSum: "1101", expectedCarryOut: "0", description: "Five plus seven with carry in" },
  { a: "1100", b: "0110", carryIn: "0", expectedSum: "0010", expectedCarryOut: "1", description: "Twelve plus six (carry out)" },
];

test.each(testCases)(
  "Table-driven: $a + $b (carry in: $carryIn) => $expectedSum (carry out: $expectedCarryOut) - $description",
  ({ a, b, carryIn, expectedSum, expectedCarryOut, description }) => {
    const result = adder.run({
      A: a,
      B: b,
      CarryIn: carryIn,
    });

    expect(result.outputs.Output.toString()).toBe(expectedSum);
    expect(result.outputs.CarryOut.toString()).toBe(expectedCarryOut);
  }
);