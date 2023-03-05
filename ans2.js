const DeliveryService = require('./delivery/service/delivery-service');

const args = process.argv.slice(2);
const baseDeliveryCost = parseFloat(args.shift());
const numberOfPackages = parseInt(args.shift());

const packages = [];

for (let i = 0; i < numberOfPackages; i++) {
  const pkgId = args.shift();
  const pkgWeight = parseFloat(args.shift());
  const distance = parseFloat(args.shift());
  const offerCode = args.shift();

  packages.push({
    id: pkgId,
    weight: pkgWeight,
    distance,
    offerCode,
  });
}

const noOfVehicles = parseInt(args.shift());
const maxSpeed = parseInt(args.shift());
const maxCarriableWeight = parseInt(args.shift());

const deliveryService = new DeliveryService(
    baseDeliveryCost,
    numberOfPackages,
    packages,
    noOfVehicles,
    maxSpeed,
    maxCarriableWeight
  );

deliveryService.processPackage();
