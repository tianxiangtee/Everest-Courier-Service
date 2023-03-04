const applyDiscount = require("./applyDiscount");
const calculateCost = require("./calculateCost");

module.exports = function processPackage(packageId, weight, distance, offerCode, baseCost) {
  const deliveryCost = calculateCost(baseCost, weight, distance)
  const discount = applyDiscount(baseCost, offerCode, weight, distance);
  const totalCost = deliveryCost - discount;
  console.log(`${packageId} ${discount} ${totalCost}`);
}