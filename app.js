const DeliveryService = require('./delivery/delivery-service');

const args = process.argv.slice(2);

const baseDeliveryCost = parseFloat(args.shift());

if (isNaN(baseDeliveryCost)) {
  console.error('Invalid base delivery cost');
  process.exit(1);
}

const numberOfPackages = parseInt(args.shift());

if (isNaN(numberOfPackages)) {
  console.error('Invalid number of packages');
  process.exit(1);
}

const packages = [];

for (let i = 0; i < numberOfPackages; i++) {
  const pkgId = args.shift();
  const pkgWeight = parseFloat(args.shift());
  const distance = parseFloat(args.shift());
  const offerCode = args.shift();

  if (!pkgId || isNaN(pkgWeight) || isNaN(distance)) {
    console.error('Invalid package parameters');
    process.exit(1);
  }

  packages.push({
    id: pkgId,
    weight: pkgWeight,
    distance,
    offerCode,
  });
}

const noOfVehicles = parseInt(args.shift());

if (isNaN(noOfVehicles)) {
  console.error('Invalid number of vehicles');
  process.exit(1);
}

const maxSpeed = parseInt(args.shift());

if (isNaN(maxSpeed)) {
  console.error('Invalid maximum speed');
  process.exit(1);
}

const maxCarriableWeight = parseInt(args.shift());

if (isNaN(maxCarriableWeight)) {
  console.error('Invalid maximum carriable weight');
  process.exit(1);
}

const deliveryService = new DeliveryService(
  baseDeliveryCost,
  numberOfPackages,
  packages,
  noOfVehicles,
  maxSpeed,
  maxCarriableWeight
);

deliveryService.processPackage();
