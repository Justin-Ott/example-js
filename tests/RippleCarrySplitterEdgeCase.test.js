const { expect, beforeAll, test, describe } = require("@jest/globals");
const { BitString, CircuitVerseLoader, loadCircuit } = require("@willow-dls/core");

let adder;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "circuits/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});

describe("Ripple-Carry Adder - Edge Cases & Patterns", () => {
  describe("Boundary Values", () => {
    test("should add zero to any value (identity property)", () => {
      const testValues = ["0001", "0101", "1010", "1111"];

      testValues.forEach((val) => {
        const result = adder.run({
          A: val,
          B: "0000",
          CarryIn: "0",
        });

        expect(result.outputs.Output.toString()).toBe(val);
        expect(result.outputs.CarryOut.toString()).toBe("0");
      });
    });

    test("should handle all zeros", () => {
      const result = adder.run({
        A: "0000",
        B: "0000",
        CarryIn: "0",
      });

      expect(result.outputs.Output.toString()).toBe("0000");
      expect(result.outputs.CarryOut.toString()).toBe("0");
    });

    test("should handle all ones", () => {
      const result = adder.run({
        A: "1111",
        B: "1111",
        CarryIn: "0",
      });

      expect(result.outputs.Output.toString()).toBe("1110");
      expect(result.outputs.CarryOut.toString()).toBe("1");
    });
  });

  describe("Commutativity (Addition Order)", () => {
    test("should produce same result regardless of operand order", () => {
      const testPairs = [
        ["0011", "0101"],
        ["1001", "0110"],
        ["0111", "1000"],
      ];

      testPairs.forEach(([a, b]) => {
        const result1 = adder.run({
          A: a,
          B: b,
          CarryIn: "0",
        });

        const result2 = adder.run({
          A: b,
          B: a,
          CarryIn: "0",
        });

        expect(result1.outputs.Output.toString()).toBe(result2.outputs.Output.toString());
        expect(result1.outputs.CarryOut.toString()).toBe(result2.outputs.CarryOut.toString());
      });
    });
  });

  describe("Carry In Propagation", () => {
    test("carry in should increment result by one", () => {
      const testValues = ["0001", "0010", "0100", "0111"];

      testValues.forEach((val) => {
        const resultNoCin = adder.run({
          A: val,
          B: "0000",
          CarryIn: "0",
        });

        const resultWithCin = adder.run({
          A: val,
          B: "0000",
          CarryIn: "1",
        });

        const expectedWithCin = (parseInt(val, 2) + 1) % 16;
        expect(parseInt(resultWithCin.outputs.Output.toString(), 2)).toBe(expectedWithCin);
      });
    });
  });

  describe("Carry Out Generation", () => {
    test("should set carry out when result exceeds 15", () => {
      const overflowCases = [
        { a: "1111", b: "0001" }, // 15 + 1 = overflow
        { a: "1000", b: "1000" }, // 8 + 8 = overflow
        { a: "1110", b: "0011" }, // 14 + 3 = overflow
      ];

      overflowCases.forEach(({ a, b }) => {
        const result = adder.run({
          A: a,
          B: b,
          CarryIn: "0",
        });

        expect(result.outputs.CarryOut.toString()).toBe("1");
      });
    });

    test("should not set carry out when result fits in 4 bits", () => {
      const noOverflowCases = [
        { a: "0111", b: "0001" }, // 7 + 1 = 8 (no overflow)
        { a: "0101", b: "0011" }, // 5 + 3 = 8 (no overflow)
        { a: "1000", b: "0111" }, // 8 + 7 = 15 (no overflow)
      ];

      noOverflowCases.forEach(({ a, b }) => {
        const result = adder.run({
          A: a,
          B: b,
          CarryIn: "0",
        });

        expect(result.outputs.CarryOut.toString()).toBe("0");
      });
    });
  });

  describe("Pattern Verification", () => {
    test("adding same value to itself should double it (with wrap)", () => {
      const testValues = ["0001", "0010", "0011", "0100", "0111"];

      testValues.forEach((val) => {
        const result = adder.run({
          A: val,
          B: val,
          CarryIn: "0",
        });

        // Calculate expected result: double the value, wrapped to 4 bits (modulo 16)
        const resultValue = parseInt(val, 2) * 2;
        const expectedDouble = (resultValue % 16).toString(2).padStart(4, "0");

        expect(result.outputs.Output.toString()).toBe(expectedDouble);
      });
    });

    test("adding incrementally should build up correctly", () => {
      // Start at 0, add 1 repeatedly
      let current = 0;
      const expectedSequence = [0, 1, 2, 3, 4];

      expectedSequence.forEach((expected) => {
        expect(current).toBe(expected);
        
        const result = adder.run({
          A: current.toString(2).padStart(4, "0"),
          B: "0001",
          CarryIn: "0",
        });

        current = parseInt(result.outputs.Output.toString(), 2);
      });
    });
  });
});