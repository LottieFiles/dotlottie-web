const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packageDirs = fs.readdirSync(packagesDir);

const packages = packageDirs
  .map((dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      return {
        name: packageJson.name,
        path: path.join(__dirname, packageJson.repository.directory, packageJson.module),
        import: '*',
      };
    }

    return null;
  })
  .filter(Boolean);

module.exports = packages;
