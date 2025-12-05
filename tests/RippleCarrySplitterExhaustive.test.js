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

// Helper function to convert number to 4-bit binary string
function numToBits(num) {
  return num.toString(2).padStart(4, "0");
}

// Generate and run exhaustive tests for all 4-bit additions
for (let a = 0; a < 16; a++) {
  for (let b = 0; b < 16; b++) {
    const aStr = numToBits(a);
    const bStr = numToBits(b);
    
    // Calculate expected output (sum wraps to 4 bits, carry out is bit 4)
    const sum = a + b;
    const expectedOutput = numToBits(sum % 16);
    const expectedCarryOut = sum > 15 ? "1" : "0";

    test(`Exhaustive: ${aStr} + ${bStr} => ${expectedOutput} (carry: ${expectedCarryOut})`, () => {
      const result = adder.run({
        A: aStr,
        B: bStr,
        CarryIn: "0",
      });

      expect(result.outputs.Output.toString()).toBe(expectedOutput);
      expect(result.outputs.CarryOut.toString()).toBe(expectedCarryOut);
    });
  }
}