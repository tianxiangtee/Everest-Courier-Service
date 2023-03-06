const DeliveryService = require("../delivery/delivery-service");

describe('DeliveryService', () => {
    it('should process packages correctly', () => {
        const baseDeliveryCost = 100;
        const numberOfPackages = 5;
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

        const deliveryService = new DeliveryService(
            baseDeliveryCost,
            numberOfPackages,
            packages,
            noOfVehicles,
            maxSpeed,
            maxCarriableWeight
        );

        deliveryService.processPackage();

        expect(deliveryService.getPackageById('PKG1').totalCost).toEqual(750);
        expect(deliveryService.getPackageById('PKG2').totalCost).toEqual(1475);
        expect(deliveryService.getPackageById('PKG3').totalCost).toEqual(2350);
        expect(deliveryService.getPackageById('PKG4').totalCost).toEqual(1395);
        expect(deliveryService.getPackageById('PKG5').totalCost).toEqual(2125);

        expect(deliveryService.getPackageById('PKG1').discount).toEqual(0);
        expect(deliveryService.getPackageById('PKG2').discount).toEqual(0);
        expect(deliveryService.getPackageById('PKG3').discount).toEqual(0);
        expect(deliveryService.getPackageById('PKG4').discount).toEqual(105);
        expect(deliveryService.getPackageById('PKG5').discount).toEqual(0);

        expect(deliveryService.getPackageById('PKG1').deliveryTime).toEqual(3.98);
        expect(deliveryService.getPackageById('PKG2').deliveryTime).toEqual(1.78);
        expect(deliveryService.getPackageById('PKG3').deliveryTime).toEqual(1.42);
        expect(deliveryService.getPackageById('PKG4').deliveryTime).toEqual(0.85);
        expect(deliveryService.getPackageById('PKG5').deliveryTime).toEqual(4.19);
    });
});
