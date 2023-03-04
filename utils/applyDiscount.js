const offers = require("./offer");
const calculateCost = require('./calculateCost')
module.exports = function applyDiscount(baseCost, offerCode, weight, distance) {
    const offer = offers[offerCode];
    if (!offer) {
        return 0;
    }
    const { distance: distanceCriteria, weight: weightCriteria, discount } = offer;
    if (distanceCriteria && (distance < distanceCriteria.min || distance > distanceCriteria.max)) {
        return 0;
    }
    if (weightCriteria && (weight < weightCriteria.min || weight > weightCriteria.max)) {
        return 0;
    }
    const discountAmount = calculateCost(baseCost, weight, distance) * discount;
    return discountAmount;
}
