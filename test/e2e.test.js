const { execSync } = require('child_process');

describe('Courier service application', () => {
  test('should calculate delivery cost for packages with offer codes', () => {
    const command = 'node app.js 100 2 PKG1 5 5 OFR001 PKG2 15 5 OFR002';
    const output = execSync(command).toString();
    expect(output).toContain('PKG1');
    expect(output).toContain('0');
    expect(output).toContain('175');
    expect(output).toContain('PKG2');
    expect(output).toContain('0');
    expect(output).toContain('275');
  });

  test('should not apply discount for invalid offer code', () => {
    const command = 'node app.js 100 1 PKG1 5 5 OFR004';
    const output = execSync(command).toString();
    expect(output).toContain('PKG1');
    expect(output).toContain('0');
    expect(output).toContain('175');
  });

  test('should not apply discount for package that does not meet offer criteria', () => {
    const command = 'node app.js 100 1 PKG1 5 5 OFR001';
    const output = execSync(command).toString();
    expect(output).toContain('PKG1');
    expect(output).toContain('0');
    expect(output).toContain('175');
  });
});
