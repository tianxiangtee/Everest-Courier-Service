const DeliveryService = require("../delivery/delivery-service");

describe("DeliveryService", () => {
    const baseDeliveryCost = 100;
    const noOfPackages = 5;
    const packages = [
        { id: "PKG1", weight: 50, distance: 30, offerCode: "OFR001" },
        { id: "PKG2", weight: 75, distance: 125, offerCode: "OFR008" },
        { id: "PKG3", weight: 175, distance: 100, offerCode: "OFR003" },
        { id: "PKG4", weight: 110, distance: 60, offerCode: "OFR002" },
        { id: "PKG5", weight: 155, distance: 95, offerCode: "NA" },
    ];
    const noOfVehicles = 2;
    const maxSpeed = 70;
    const maxCarriableWeight = 200;

    describe("calculateCost", () => {
        it("should calculate the correct delivery cost", () => {
            const deliveryService = new DeliveryService(
                baseDeliveryCost,
                noOfPackages,
                packages,
                noOfVehicles,
                maxSpeed,
                maxCarriableWeight
            );

            expect(deliveryService.calculateCost(100, 50, 30)).toBe(750);
            expect(deliveryService.calculateCost(100, 75, 125)).toBe(1475);
        });
    });

    describe("applyDiscount", () => {
        it("should apply the correct discount for a valid offer code", () => {
            const deliveryService = new DeliveryService(
                baseDeliveryCost,
                noOfPackages,
                packages,
                noOfVehicles,
                maxSpeed,
                maxCarriableWeight
            );

            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR003", 10, 100)
            ).toBe(35);
            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR002", 110, 60)
            ).toBe(105);
        });

        it("should not apply a discount for an invalid offer code", () => {
            const deliveryService = new DeliveryService(
                baseDeliveryCost,
                noOfPackages,
                packages,
                noOfVehicles,
                maxSpeed,
                maxCarriableWeight
            );

            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "INVALID", 3, 10)
            ).toBe(0);
        });

        it("should not apply a discount if criteria are not met", () => {
            const deliveryService = new DeliveryService(
                baseDeliveryCost,
                noOfPackages,
                packages,
                noOfVehicles,
                maxSpeed,
                maxCarriableWeight
            );

            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR002", 2, 5)
            ).toBe(0);
            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR002", 3, 10)
            ).toBe(0);
            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR002", 2, 5)
            ).toBe(0);
            expect(
                deliveryService.applyDiscount(baseDeliveryCost, "OFR002", 10, 50)
            ).toBe(0);
        });
    });

    describe('processPackage', () => {
        it('should calculate package information and estimate delivery time for each package', () => {
            const deliveryService = new DeliveryService(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight);
            const consoleSpy = jest.spyOn(console, 'log');
            deliveryService.processPackage();
            expect(consoleSpy).toHaveBeenCalledWith('PKG1 0 750 3.98');
            expect(consoleSpy).toHaveBeenCalledWith('PKG2 0 1475 1.78');
            expect(consoleSpy).toHaveBeenCalledWith('PKG3 0 2350 1.42');
            expect(consoleSpy).toHaveBeenCalledWith('PKG4 105 1395 0.85');
            expect(consoleSpy).toHaveBeenCalledWith('PKG5 0 2125 4.19');
        });
    });

    describe('getCombinations', () => {
        it('should return combinations of packages that have a total weight not greater than maxCarriableWeight and are not excluded', () => {
            const deliveryService = new DeliveryService(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight);
            const excludedIds = ["PKG2", "PKG4"];
            const combinations = deliveryService.getCombinations(packages, maxCarriableWeight, excludedIds);
            expect(combinations).toEqual([
                { id: 'PKG3', weight: 175, distance: 100, offerCode: 'OFR003' }
            ]);
        });
    });

    //   describe('getCombinationsWithLength', () => {
    //     it('should return all possible combinations of arr with length len', () => {
    //       const deliveryService = new DeliveryService(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight);
    //       const arr = [1, 2, 3];
    //       const len = 2;
    //       const combinations = deliveryService.getCombinationsWithLength(arr, len);
    //       expect(combinations).toEqual([
    //         [1, 2],
    //         [1, 3],
    //         [2, 3],
    //       ]);
    //     });
    //   });

    describe('getEstimatedDeliveryTime', () => {
        it('should return the estimated delivery time for a package', () => {
            const deliveryService = new DeliveryService(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight);
            // packages[1] = { id: "PKG2", weight: 75, distance: 125, offerCode: "OFR008" },
            const deliveryTime = deliveryService.getEstimatedDeliveryTime(packages[1], maxSpeed);
            expect(deliveryTime).toBe(1.78);
        });
    });

    describe('getAvailableVehicle', () => {
        it('should return the vehicle with the earliest available time', () => {
            const vehicles = [{ id: 1, availableTime: 3.56 }, { id: 2, availableTime: 2.84 }];
            const deliveryService = new DeliveryService(baseDeliveryCost, noOfPackages, packages, noOfVehicles, maxSpeed, maxCarriableWeight);
            const availableVehicle = deliveryService.getAvailableVehicle(vehicles);
            expect(availableVehicle).toEqual({ id: 2, availableTime: 2.84 });
        });
    });

});
