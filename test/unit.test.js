const { calculateCost, applyDiscount } = require("../utils");


describe('calculateCost', () => {
  test('should calculate delivery cost correctly', () => {
    const baseCost = 100;
    const weight = 5;
    const distance = 5;
    const totalCost = calculateCost(baseCost, weight, distance);
    expect(totalCost).toBe(175);
  });
});

describe('applyDiscount', () => {
  test('should apply discount correctly when offer criteria are met', () => {
    const baseCost = 100;
    const weight = 10;
    const distance = 100;
    const discount = applyDiscount(baseCost, 'OFR003', weight, distance);
    expect(discount).toBe(35);
  });

  test('should not apply discount when offer code is invalid', () => {
    const baseCost = 100;
    const weight = 100;
    const distance = 100;
    const discount = applyDiscount(baseCost, 'OFR004', weight, distance);
    expect(discount).toBe(0);
  });

  test('should not apply discount when package does not meet offer criteria', () => {
    const baseCost = 100;
    const weight = 5;
    const distance = 5;
    const discount = applyDiscount(baseCost, 'OFR001', weight, distance);
    expect(discount).toBe(0);
  });
});
