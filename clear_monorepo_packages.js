// Хз, может есть лучшие способы, но иногда не хочется тащить зависимости лишние пакеты с монорепы. Поэтому просто их удалим

const package = process.argv[2];
const fs = require('fs');
const execSync = require('child_process').execSync;

const PACKAGES_PATH = __dirname + '/packages/';

const packages = fs.readdirSync(PACKAGES_PATH);

const packagesJsons = {};

for (const _package of packages) {
  try {
    const path = PACKAGES_PATH + _package;
    const packageJsonRaw = fs.readFileSync(path + '/package.json');
    const packageJson = JSON.parse(packageJsonRaw);
    packagesJsons[packageJson.name] = {
      path,
      file: packageJson,
    };
  } catch (e) {
    console.log('Parse package json ' + package, e);
  }
}

function getNeededPackages(_package, _neededPackages = []) {
  if (_neededPackages.includes(_package)) return _neededPackages;

  const monorepoPackagesNames = Object.keys(packagesJsons);
  const deps = Object.keys(packagesJsons[_package].file.dependencies);
  _neededPackages.push(_package);

  for (const dep of deps) {
    if (monorepoPackagesNames.includes(dep)) {
      getNeededPackages(dep, _neededPackages);
    }
  }

  return _neededPackages;
}

const neededPackages = getNeededPackages(package);

for (const o of Object.values(packagesJsons)) {
  if (neededPackages.includes(o.file.name)) {
    continue;
  }

  execSync('rm -rf ' + o.path);
  fs.mkdirSync(o.path);
  o.file = {
    ...o.file,
    dependencies: {},
    devDependencies: {},
    scripts: {
      babel: `echo skipped ${o.file.name}`,
    },
  };
  fs.writeFileSync(o.path + '/package.json', JSON.stringify(o.file, null, 2));
}
