const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Faire une copie du package.json
const prodPackage = { ...packageJson };

const filePath = path.join(__dirname, '..', 'build', 'package.json');

// Supprimer les devDependencies
delete prodPackage.devDependencies;

// Vérifier et modifier les chemins dans "exports"
if (prodPackage.exports) {
  for (const key in prodPackage.exports) {
    const exportEntry = prodPackage.exports[key];
    if (typeof exportEntry === 'object' && exportEntry !== null) {
      for (const subKey of ['import', 'types', 'require', 'default']) {
        if (exportEntry[subKey]) {
          exportEntry[subKey] = exportEntry[subKey].replace('/build/', '/');
        }
      }
    }
  }
}

// Autres modifications souhaitées, par exemple :
prodPackage.scripts = {
  start: 'node index.js',
};

prodPackage.main = 'index.js';
prodPackage.module = 'index.js';
prodPackage.types = 'index.d.ts';
prodPackage.files = ['**', 'changelog.md', 'readme.md'];

// Créer le fichier s'il n'existe pas
try {
  fs.openSync(filePath, 'a+');
} catch (e) {
  console.error('Erreur lors de la création du fichier (PROD) package.json :', e);
  process.exit(1);
}

try {
  // Écrire le package-prod.json
  fs.writeFileSync(filePath, JSON.stringify(prodPackage, null, 2), 'utf8');
  console.log('(PROD) package.json généré avec succès dans le répertoire build');
} catch (e) {
  console.error('Erreur lors de la sauvegarde du fichier (PROD) package.json :', e);
  process.exit(1);
}

try {
  fs.existsSync(filePath);
  console.log('Le fichier « build/package.json » existe.');
} catch (e) {
  console.error('Erreur lors de la validation du fichier (PROD) package.json :', e);
  process.exit(1);
}

// Copie des fichiers MD
try {
  const destinationFolder = path.join(__dirname, '..', 'build', 'README.md');
  const markdownFile = path.join(__dirname, '..', 'README.md');
  fs.copyFileSync(markdownFile, destinationFolder);
  fs.existsSync(markdownFile);
  console.log('Copie du fichier « README.md ».');

  // destinationFolder = path.join(__dirname, '..', 'build', 'CHANGELOG.md');
  // markdownFile = path.join(__dirname, '..', 'CHANGELOG.md');
  // fs.copyFileSync(markdownFile, destinationFolder);
  // fs.existsSync(markdownFile);
  // console.log('Copie du fichier « CHANGELOG.md ».');

} catch (e) {
  console.error('Erreur lors de la copie des fichiers Markdown :', e);
  process.exit(1);
}
