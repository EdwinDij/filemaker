const { exec } = require('child_process');

exec('npm run generate-changelog', (error, stdout, stderr) => {
  if (error) {
    console.error('Erreur lors de la génération du journal des modifications :', error);
  } else {
    console.log('Journal des modifications généré avec succès !');
  }
});
