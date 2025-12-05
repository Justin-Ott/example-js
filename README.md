# Willow DLS Example Repository (JavaScript)

A learning-focused example repository demonstrating different testing strategies for digital logic circuits using [Willow DLS](https://github.com/willow-dls/core) and Jest, written in plain JavaScript.

## Quick Start

Clone this repository and install dependencies:

```bash
git clone https://github.com/willow-dls/example-js.git
cd example-js
npm install
npm test
```

## What's Included

This repository contains a 4-bit ripple-carry adder circuit from CircuitVerse with three different testing approaches. Each test file demonstrates a different testing philosophy—all written in straightforward JavaScript (no TypeScript required).
<img width="953" height="539" alt="image" src="https://github.com/user-attachments/assets/c3899228-8bd6-46c4-ab9a-48bf95c00eec" />


### Test Files

#### 1. **ripple-carry-table.test.js** — Start Here!
A straightforward, table-driven test using specific values. This is the best file to read first if you're new to Willow testing.

**Why use this approach?**
- Easy to understand and modify
- Good for documentation—the test table doubles as a specification
- Perfect for testing known edge cases and important scenarios
- Minimal setup required
- Great for sharing test cases with non-programmers (educators, stakeholders)

**What to learn:**
- How to structure basic test cases
- How to use Jest's `test.each()` for parameterized tests
- What kinds of cases matter (zero, overflow, wraparound)
- How to test multiple outputs (Output and CarryOut)

**Example:**
```javascript
const testCases = [
  { a: "0000", b: "0000", carryIn: "0", expectedSum: "0000", expectedCarryOut: "0", description: "Zero plus zero" },
  { a: "0101", b: "0011", carryIn: "0", expectedSum: "1000", expectedCarryOut: "0", description: "Five plus three" },
];

test.each(testCases)(
  "Table-driven: $a + $b => $expectedSum",
  ({ a, b, carryIn, expectedSum, expectedCarryOut }) => {
    const result = adder.run({ A: a, B: b, CarryIn: carryIn });
    expect(result.outputs.Output.toString()).toBe(expectedSum);
    expect(result.outputs.CarryOut.toString()).toBe(expectedCarryOut);
  }
);
```

#### 2. **ripple-carry-edge-cases.test.js** — Learn Testing Patterns
Organized by testing category (boundary values, commutativity, carry propagation, etc.). Shows how to verify mathematical properties and circuit behavior.

**Why use this approach?**
- Verifies not just results, but patterns and properties
- More thorough than a simple table
- Documents expected circuit behavior through test organization
- Great for catching subtle bugs
- Demonstrates important concepts like commutativity and identity

**What to learn:**
- How to organize tests with `describe()` blocks
- How to test mathematical properties (commutativity, identity elements)
- How to verify carry propagation explicitly
- How to verify overflow behavior
- Using loops within tests for related cases

**Example:**
```javascript
describe("Boundary Values", () => {
  test("should add zero to any value (identity property)", () => {
    testValues.forEach((val) => {
      const result = adder.run({ A: val, B: "0000", CarryIn: "0" });
      expect(result.outputs.Output.toString()).toBe(val);
    });
  });
});

describe("Commutativity (Addition Order)", () => {
  test("should produce same result regardless of operand order", () => {
    // Verifies that a + b === b + a
  });
});
```

#### 3. **ripple-carry-exhaustive.test.js** — Complete Coverage
Tests all 256 possible 4-bit additions by iterating through every combination of inputs.

**Why use this approach?**
- Absolute confidence in correctness—no case is left untested
- Excellent for critical circuits (ALUs, adders, etc.)
- Catches corner cases you might not think of
- Much simpler in JavaScript than in other languages
- Trade-off: Takes longer to run (but 256 tests is still fast)

**What to learn:**
- How to programmatically generate tests
- When exhaustive testing is justified
- How to calculate expected values mathematically
- Performance considerations with large test suites

**Example:**
```javascript
for (let a = 0; a < 16; a++) {
  for (let b = 0; b < 16; b++) {
    const aStr = numToBits(a);
    const bStr = numToBits(b);
    const sum = a + b;
    const expectedOutput = numToBits(sum % 16);
    const expectedCarryOut = sum > 15 ? "1" : "0";

    test(`Exhaustive: ${aStr} + ${bStr} => ${expectedOutput}`, () => {
      // Test runs here
    });
  }
}
```

## How to Use This Repository

### For Learning
1. Start by reading **ripple-carry-table.test.js**
2. Study **ripple-carry-edge-cases.test.js** to see more advanced patterns
3. Review **ripple-carry-exhaustive.test.js** to understand when comprehensive testing makes sense

### For Your Own Circuits
1. Export your circuit from CircuitVerse (or another supported simulator)
2. Place the `.cv` file in the `circuits/` directory
3. Copy one of the test files and modify it for your circuit
4. Run `npm test` to verify your circuit works as expected

**Recommended workflow:**
- Start with the table-driven approach (file #1)
- Add edge case tests as you think of important scenarios (file #2)
- Consider exhaustive testing for critical circuits (file #3)

## Project Structure

```
.
├── circuits/
│   └── RippleCarrySplitter.cv          # The CircuitVerse circuit file
├── ripple-carry-table.test.js          # Table-driven tests
├── ripple-carry-edge-cases.test.js     # Pattern-based tests
├── ripple-carry-exhaustive.test.js     # Exhaustive coverage tests
├── package.json
├── babel.config.cjs                    # Jest/Babel configuration
└── README.md
```

## Running Tests

Run all tests:
```bash
npm test
```

Run a specific test file:
```bash
npm test ripple-carry-table.test.js
```

Run tests in watch mode (re-run on file changes):
```bash
npm test -- --watch
```

Run tests with verbose output:
```bash
npm test -- --verbose
```

## Key Willow DLS Concepts

### Loading a Circuit
```javascript
const { loadCircuit, CircuitVerseLoader } = require("@willow-dls/core");

const circuit = await loadCircuit(
  CircuitVerseLoader,
  "path/to/circuit.cv",
  "Circuit Name"
);
```

### Running a Circuit
```javascript
const result = circuit.run({
  A: "0101",
  B: "0011",
  CarryIn: "0",
});

// Access outputs
console.log(result.outputs.Output.toString());    // "1000"
console.log(result.outputs.CarryOut.toString());  // "0"
```

### Working with BitStrings
```javascript
const { BitString } = require("@willow-dls/core");

// Create from binary string
const bits = new BitString("0101");

// Convert to string
console.log(bits.toString()); // "0101"

// Perform operations
const incremented = bits.add("0001");
```

### Converting Numbers to Binary Strings (Useful Helper)
```javascript
function numToBits(num, width = 4) {
  return num.toString(2).padStart(width, "0");
}

console.log(numToBits(5));    // "0101"
console.log(numToBits(15, 8)); // "00001111"
```

## Testing Your Circuits

### Step 1: Export Your Circuit
From CircuitVerse, click **Project → Export as File** and save the `.cv` file to the `circuits/` directory.

### Step 2: Assign Labels to I/O
Make sure every input and output in your circuit has a **unique label**. Willow needs these to identify which values to send where.

### Step 3: Create Your Test File
Copy one of the example test files and modify it:

```javascript
const { expect, beforeAll, test } = require("@jest/globals");
const { CircuitVerseLoader, loadCircuit } = require("@willow-dls/core");

let myCircuit;

beforeAll(async () => {
  myCircuit = await loadCircuit(
    CircuitVerseLoader,
    "circuits/MyCircuit.cv",
    "Main" // Circuit name from CircuitVerse
  );
});

// Write your tests here
test("your test name", () => {
  const result = myCircuit.run({
    InputA: "1010",
    InputB: "0101",
  });

  expect(result.outputs.Output.toString()).toBe("1111");
});
```

### Step 4: Run Tests
```bash
npm test
```

## Common Patterns

### Test Every Input Combination (Small Number of Inputs)
```javascript
const inputs = ["0", "1"];
inputs.forEach((a) => {
  inputs.forEach((b) => {
    test(`${a} AND ${b}`, () => {
      const result = circuit.run({ A: a, B: b });
      // assertions here
    });
  });
});
```

### Test with Specific Data Ranges
```javascript
const testCases = [];
for (let i = 0; i < 16; i++) {
  testCases.push({ input: i.toString(2).padStart(4, "0"), expected: calculateExpected(i) });
}

test.each(testCases)("input $input", ({ input, expected }) => {
  // test here
});
```

### Test a Circuit Property
```javascript
test("output never exceeds input", () => {
  for (let i = 0; i < 256; i++) {
    const result = circuit.run({ input: numToBits(i) });
    const output = parseInt(result.outputs.Output.toString(), 2);
    expect(output).toBeLessThanOrEqual(i);
  }
});
```

## Tips for Your Own Tests

- **Start simple.** Use table-driven tests first, then expand if needed.
- **Test edge cases.** Boundaries, maximum values, zeros, and wraparound.
- **Document your tests.** Good descriptions help others (and future you) understand what's being tested.
- **Use meaningful variable names.** Compare `a`, `b`, `carry` to `inputA`, `inputB`, `carryIn`.
- **Group related tests.** Use `describe()` blocks to organize by functionality.
- **Don't over-test.** Exhaustive testing is powerful but slow—use it selectively.
- **Check all outputs.** Don't forget to verify carry-out, flags, or other secondary outputs.
- **Use helper functions.** JavaScript makes it easy to abstract away repetitive logic.

## Debugging Failed Tests

When a test fails, Jest shows you:
- Which test failed
- What you expected
- What you actually got

```
Expected: "0110"
Received: "0111"
```

This usually means either:
1. Your circuit has a bug
2. Your test expectations are wrong
3. You misunderstood how your circuit works

**Debugging tip:** Run a single test with verbose output to see what's happening:
```bash
npm test -- --verbose ripple-carry-table.test.js
```

## Next Steps

- Read the [Willow DLS documentation](https://github.com/willow-dls/core)
- Explore different circuit types (multiplexers, decoders, state machines, etc.)
- Check out the TypeScript example repository if you want to use TypeScript
- Contribute your own example tests back to the community

## License

This example repository is released under the MIT license, the same as Willow DLS.
