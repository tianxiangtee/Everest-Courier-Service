const { processPackage } = require("./utils");
const args = process.argv.slice(2);

if (args.length % 4 !== 2) {
    console.log('Invalid input format. base_cost and num_packages should always follow by package1_id package1_weight package1_distance package1_offer_code...');
    process.exit(1);
}

const baseCost = parseFloat(args[0]);
const numPackages = parseInt(args[1]);

for (let i = 0; i < numPackages; i++) {
    const packageId = args[i * 4 + 2];
    const weight = parseFloat(args[i * 4 + 3]);
    const distance = parseFloat(args[i * 4 + 4]);
    const offerCode = args[i * 4 + 5];
    processPackage(packageId, weight, distance, offerCode, baseCost);
}
