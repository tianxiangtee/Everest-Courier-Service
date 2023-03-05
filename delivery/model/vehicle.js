class Vehicle {
    constructor(maxCarriableWeight, maxSpeed) {
      this.maxCarriableWeight = maxCarriableWeight;
      this.maxSpeed = maxSpeed;
    }
  
    canCarryPackage(packageWeight) {
      return packageWeight <= this.maxCarriableWeight;
    }
  
    calculateDeliveryTime(distanceInKm) {
      return distanceInKm / this.maxSpeed;
    }
  }
  
  module.exports = Vehicle;
  