module.exports = class Package {
    constructor(id, weight, distance, offerCode) {
        this.id = id;
        this.weight = weight;
        this.distance = distance;
        this.offerCode = offerCode;
        this.discount = 0;
        this.totalCost = 0;
        this.deliveryTime = 0;
    }
}