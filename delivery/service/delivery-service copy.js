
class DeliveryService {
  constructor(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight) {
    this.baseDeliveryCost = baseDeliveryCost;
    this.noOfPackages = noOfPackages;
    this.packages = packages;
    this.noOfVehicles = noOfVehicles;
    this.maxSpeed = maxSpeed;
    this.maxCarriableWeight = maxCarriableWeight;
    this.deliveryTimeMap = new Map();
  }

  calculateEstimatedDeliveryTime() {
    // Calculate the total weight and cost of all packages
    let totalWeight = 0;
    let totalCost = 0;
    for (const pkg of this.packages) {
      totalWeight += pkg.weight;
      totalCost += this.calculateDeliveryCost(pkg.distance, pkg.offerCode);
    }

    // Calculate the number of trips needed
    const trips = Math.ceil(totalWeight / this.maxCarriableWeight);

    // Calculate the delivery time for each package
    for (let i = 0; i < this.noOfPackages; i++) {
      const pkg = this.packages[i];
      const deliveryTime = tgetEstimatedDeliveryTime(pkg.distance, this.maxSpeed, trips);
      this.deliveryTimeMap.set(pkg.id, deliveryTime);
    }
  }

  calculateDeliveryCost(distance, offerCode) {
    let cost = this.baseDeliveryCost * distance;
    if (offerCode === 'OFR001') {
      cost *= 0.9;
    } else if (offerCode === 'OFR002') {
      cost -= 100;
    } else if (offerCode === 'OFR003') {
      cost = Math.max(cost, 500);
    }
    return cost;
  }

  printDeliveryDetails() {
    for (let i = 0; i < this.noOfPackages; i++) {
      const pkg = this.packages[i];
      const deliveryTime = this.deliveryTimeMap.get(pkg.id);
      console.log(`${pkg.id} ${pkg.distance} ${this.calculateDeliveryCost(pkg.distance, pkg.offerCode)} ${deliveryTime.toFixed(2)}`);
    }
  }

  getEstimatedDeliveryTime(distance, maxSpeed, trips) {
    const totalTime = (distance / maxSpeed) * 2; // multiply by 2 since the vehicle must travel to and from the destination
    const totalTrips = Math.ceil(trips / 2); // divide by 2 since two trips are required for each full trip of the vehicle
    const totalDeliveryTime = totalTime * totalTrips;
    return totalDeliveryTime;
  }
    
}

module.exports = DeliveryService;
