/* This is the code from Figure 1 in our WCAE submission. */

const {expect, beforeAll, test} = require("@jest/globals");
const {CircuitVerseLoader, 
       loadCircuit} = require("@willow-dls/core")

let adder;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "circuits/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});


test('Verbose Example', () => {
    // This object's keys are the labels for the
    // circuit's inputs. Values may be 
    // * binary strings (e.g., "0010")
    // * hexadecimal strings (e.g., "0xa4") or 
    // * a BitString object. 
    const inputs = {
        A: "0010",
        B: "0001",
        CarryIn: "0",
    };

    // Run the circuit to compute the results.
    const result = adder.run(inputs);

    // The run method returns an object where the keys 
    // are the labels for the circuit's outputs, and 
    // the values are the values on those outputs as 
    // BitString objects.
    const outputs = result.outputs;

    // The simplest way to compare the expected and
    // observed results is to convert the BitString
    // to a binary string.
    expect(outputs.Output.toString()).toBe("0011");
    expect(outputs.CarryOut.toString()).toBe("0");
});


// This is a shorthand example, which shows how a
// test may be written more concisely.
test('Concise Example', () => {
    const {Output, CarryOut} = adder.run({
        A: "1010",
        B: "1001",
        CarryIn: "0"
    }).outputs;

    expect(Output.toString()).toBe("0011");
    expect(CarryOut.toString()).toBe("1");
});
