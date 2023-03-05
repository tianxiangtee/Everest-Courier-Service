const baseDeliveryCost = parseFloat(process.argv[2]);
const numPackages = parseInt(process.argv[3]);

const packages = [];
let i = 4;
while (i < process.argv.length - 3) {
    const pkgId = process.argv[i];
    const weight = parseFloat(process.argv[i + 1]);
    const distance = parseFloat(process.argv[i + 2]);
    const offerCode = process.argv[i + 3] !== 'NA' ? process.argv[i + 3] : null;
    packages.push({ pkgId, weight, distance, offerCode });
    i += 4;
}

const numVehicles = parseInt(process.argv[process.argv.length - 3]);
const maxSpeed = parseFloat(process.argv[process.argv.length - 2]);
const maxCarriableWeight = parseFloat(process.argv[process.argv.length - 1]);

packages.sort((a, b) => {
    if (a.weight !== b.weight) {
        return b.weight - a.weight;
    } else {
        return b.distance - a.distance;
    }
});

const shipments = [];
let shipment = { packages: [], weight: 0, distance: 0 };
for (const pkg of packages) {
    if (shipment.packages.length === 0 ||
        shipment.packages.length < numVehicles &&
        shipment.weight + pkg.weight <= maxCarriableWeight) {
        shipment.packages.push(pkg);
        shipment.weight += pkg.weight;
        shipment.distance += pkg.distance;
    } else {
        shipments.push(shipment);
        shipment = { packages: [pkg], weight: pkg.weight, distance: pkg.distance };
    }
}
if (shipment.packages.length > 0) {
    console.log('shipment',shipment)
    shipments.push(shipment);
}

for (const shipment of shipments) {
    const numVehiclesNeeded = Math.ceil(shipment.packages.length / numVehicles);
    const timeNeeded = shipment.distance / maxSpeed;
    shipment.deliveryTime = baseDeliveryCost * shipment.distance * numVehiclesNeeded +
        timeNeeded * 2; // multiply by 2 for roundtrip
}

shipments.sort((a, b) => a.deliveryTime - b.deliveryTime);

for (const pkg of packages) {
    for (const shipment of shipments) {
        if (shipment.packages.includes(pkg)) {
            continue; // skip packages that are already assigned to a shipment
        }
        if (shipment.weight + pkg.weight <= maxCarriableWeight) {
            shipment.packages.push(pkg);
            shipment.weight += pkg.weight;
            shipment.distance += pkg.distance;
            break; // assign package to shipment and move to next package
        }
    }
}

for (const shipment of shipments) {
    console.log(`Shipment ${shipments.indexOf(shipment) + 1}:`);
    for (const pkg of shipment.packages) {
        console.log(`- ${pkg.pkgId} (${pkg.weight} kg, ${pkg.distance} km)`);
    }
    console.log(`Estimated delivery time: ${shipment.deliveryTime.toFixed(2)} hrs`);
}

