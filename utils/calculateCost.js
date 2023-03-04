module.exports = function calculateCost(baseCost, weight, distance) {
  const weightCost = weight * 10;
  const distanceCost = distance * 5;
  const totalCost = baseCost + weightCost + distanceCost;
  return totalCost;
}