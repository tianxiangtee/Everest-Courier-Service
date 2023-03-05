
const offers = require("../../utils/offer");
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


    processPackage() {
        // Calculate cost for all packages
        for (const pkg of this.packages) {
            const deliveryCost = this.calculateCost(this.baseDeliveryCost, pkg.weight, pkg.distance)
            const discount = this.applyDiscount(this.baseDeliveryCost, pkg.offerCode, pkg.weight, pkg.distance);
            const totalCost = deliveryCost - discount;
            pkg.discount = discount
            pkg.totalCost = totalCost
        }

        // Calculate the estimate delivery time for each package 
        let excludedIds = [];
        let resultsPackages = []
        let vechicleId = 1
        let vehicles = Array.from({ length: this.noOfVehicles }, () => ({
            id: vechicleId++,
            availableTime: 0,
        }));


        while (excludedIds.length < this.packages.length) {
            const result = this.getCombinations(this.packages, this.maxCarriableWeight, excludedIds);
            for (const pkg of result) {
                excludedIds.push(pkg.id);
                pkg.deliveryTime = (this.getEstimatedDeliveryTime(pkg, this.maxSpeed));
            }
            let availableVehicle = this.getAvailableVehicle(vehicles)
                        
            result.sort((a, b) => b.deliveryTime - a.deliveryTime);
            const longestDeliveryTime = result[0].deliveryTime // since it is same route, only longest distance delivery time will be count
            result.forEach(pkg => {
                pkg.deliveryTime +=availableVehicle.availableTime
                resultsPackages.push(pkg)
            });
            availableVehicle.availableTime += longestDeliveryTime * 2 // including time spent on retrn
            // console.log('vehicles', vehicles)
        }

        console.log('results', resultsPackages)





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
        return discountAmount;
    }

    //test
    getCombinations(packages, maxCarriableWeight, excludedIds) {
        let combinations = [];
        for (let len = 1; len <= packages.length; len++) {
            const subsetCombinations = this.getCombinationsWithLength(packages, len);
            for (const combination of subsetCombinations) {
                const totalWeight = combination.reduce((acc, pkg) => acc + pkg.weight, 0);
                if (totalWeight <= maxCarriableWeight) {
                    combination.totalWeight = totalWeight;
                    if (combination.every(pkg => !excludedIds.includes(pkg.id))) {
                        combinations.push(combination);
                    }
                }
            }
        }
        combinations.sort((a, b) => b.totalWeight - a.totalWeight);
        delete combinations[0].totalWeight;
        return combinations[0];
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

    // getEstimatedDeliveryTime(bestCombination, maxSpeed) {
    //     bestCombination.sort((a, b) => b.distance - a.distance);
    //     const longestDistance = bestCombination[0].distance // since it is same route, only longest distance will be count
    //     let deliveryTime = Math.floor((longestDistance / maxSpeed) * 100) / 100; // truncate the number to 2 decimal places without rounding       
    //     // const totalTime =  Math.floor((deliveryTime * 2) * 100) / 100; // multiply by 2 since the vehicle must travel to and from the destination
    //     return deliveryTime;
    // }

    getAvailableVehicle(vehicles) {
        let min = Math.min(...vehicles.map(vehicle => vehicle.availableTime))
        return vehicles.filter(vehicle => vehicle.availableTime === min)[0]
    }




}

module.exports = DeliveryService;
