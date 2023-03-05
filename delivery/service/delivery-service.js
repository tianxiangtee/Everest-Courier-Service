
const offers = require("../../utils/offer");
class DeliveryService {
    constructor(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight) {
        this.baseDeliveryCost = baseDeliveryCost;
        this.noOfPackages = noOfPackages;
        this.packages = packages;
        this.noOfVehicles = noOfVehicles;
        this.maxSpeed = maxSpeed;
        this.maxCarriableWeight = maxCarriableWeight;
    }


    processPackage() {
        // Calculate cost and discount for all packages
        const packageInfo = this.packages.map(pkg => {
            const deliveryCost = this.calculateCost(this.baseDeliveryCost, pkg.weight, pkg.distance);
            const discount = this.applyDiscount(this.baseDeliveryCost, pkg.offerCode, pkg.weight, pkg.distance);
            const totalCost = deliveryCost - discount;
            return {
                ...pkg,
                discount,
                totalCost,
                deliveryTime: 0,
            };
        });

        // Calculate the estimate delivery time for each package
        let excludedIds = [];
        let resultsPackages = [];
        let vechicleId = 1;
        let vehicles = Array.from({ length: this.noOfVehicles }, () => ({
            id: vechicleId++,
            availableTime: 0,
        }));

        while (excludedIds.length < packageInfo.length) {
            const result = this.getCombinations(packageInfo, this.maxCarriableWeight, excludedIds);
            for (const pkg of result) {
                excludedIds.push(pkg.id);
                pkg.deliveryTime = this.getEstimatedDeliveryTime(pkg, this.maxSpeed);
            }
            let availableVehicle = this.getAvailableVehicle(vehicles);

            let longestDeliveryTime = 0;
            for (const pkg of result) {
                pkg.deliveryTime += availableVehicle.availableTime;

                // Special handling rounding due to  inherent imprecision of floating-point arithmetic in computers, 
                // where certain decimal values cannot be represented exactly in binary.
                // for example : 1.35 + 2.84 will always return 4.1899999999999995
                pkg.deliveryTime = Math.round((pkg.deliveryTime + Number.EPSILON) * 100) / 100

                longestDeliveryTime = Math.max(longestDeliveryTime, pkg.deliveryTime);
                resultsPackages.push(pkg);
            }
            availableVehicle.availableTime += Math.floor((longestDeliveryTime * 2) * 100) / 100; // including return time
        }
        resultsPackages.sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        });

        // console.log('results', resultsPackages)
        resultsPackages.forEach(x => console.log(`${x.id} ${x.discount} ${x.totalCost} ${x.deliveryTime}`))

    }

    calculateCost(baseCost, weight, distance) {
        const weightCost = weight * 10;
        const distanceCost = distance * 5;
        const totalCost = baseCost + weightCost + distanceCost;
        return totalCost;
    }

    applyDiscount(baseCost, offerCode, weight, distance) {
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
        const discountAmount = this.calculateCost(baseCost, weight, distance) * discount;
        return Math.floor(discountAmount * 100) / 100;;
    }

    getCombinations(packages, maxCarriableWeight, excludedIds) {
        let maxPackages = [];
        let maxTotalWeight = 0;
        let minDistance = Infinity;

        for (let len = 1; len <= packages.length; len++) {
            const subsetCombinations = this.getCombinationsWithLength(packages, len);
            for (const combination of subsetCombinations) {
                const totalWeight = combination.reduce((acc, pkg) => acc + pkg.weight, 0);
                if (totalWeight <= maxCarriableWeight) {
                    if (combination.every(pkg => !excludedIds.includes(pkg.id))) {
                        const distance = combination.reduce((acc, pkg) => acc + pkg.distance, 0);
                        if (combination.length > maxPackages.length ||
                            (combination.length === maxPackages.length && totalWeight > maxTotalWeight) ||
                            (combination.length === maxPackages.length && totalWeight === maxTotalWeight && distance < minDistance)) {
                            maxPackages = combination;
                            maxTotalWeight = totalWeight;
                            minDistance = distance;
                        }
                    }
                }
            }
        }

        return maxPackages;
    }


    getCombinationsWithLength(arr, len) {
        const combinations = [];

        function generate(start, combination) {
            if (combination.length === len) {
                combinations.push(combination);
                return;
            }

            for (let i = start; i < arr.length; i++) {
                generate(i + 1, [...combination, arr[i]]);
            }
        }

        generate(0, []);
        return combinations;
    }

    getEstimatedDeliveryTime(pkg, maxSpeed) {
        let deliveryTime = Math.floor((pkg.distance / maxSpeed) * 100) / 100; // truncate the number to 2 decimal places without rounding       
        return deliveryTime;
    }

    getAvailableVehicle(vehicles) {
        let min = Math.min(...vehicles.map(vehicle => vehicle.availableTime))
        return vehicles.filter(vehicle => vehicle.availableTime === min)[0]
    }
}

module.exports = DeliveryService;
