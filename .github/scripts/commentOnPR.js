const fs = require('fs');
const { GitHub, context } = require('@actions/github');
const { exec } = require('@actions/exec');

async function commentOnPullRequest() {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN);

    const { data } = await github.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });

    const outdated = await exec.exec('npm', ['outdated', '--json']);
    const result = JSON.parse(outdated.stdout);

    // Organiser les dépendances par niveau de sévérité
    const updatesBySeverity = {
      major: [],
      minor: [],
      patch: [],
    };

    Object.keys(result).forEach(depName => {
      const depInfo = result[depName];
      const currentVersion = depInfo.current;
      const wantedVersion = depInfo.wanted;
      const latestVersion = depInfo.latest;

      if (isMajorUpdate(currentVersion, wantedVersion)) {
        updatesBySeverity.major.push({ name: depName, current: currentVersion, wanted: wantedVersion, latest: latestVersion });
      } else if (isMinorUpdate(currentVersion, wantedVersion)) {
        updatesBySeverity.minor.push({ name: depName, current: currentVersion, wanted: wantedVersion, latest: latestVersion });
      } else if (isPatchUpdate(currentVersion, wantedVersion)) {
        updatesBySeverity.patch.push({ name: depName, current: currentVersion, wanted: wantedVersion, latest: latestVersion });
      }
    });

    let commentBody = '';

    // Générer le corps du commentaire en fonction du niveau de sévérité
    if (updatesBySeverity.major.length > 0) {
      commentBody += '### Major Updates:\n';
      commentBody += generateTable(updatesBySeverity.major);
    }

    if (updatesBySeverity.minor.length > 0) {
      commentBody += '### Minor Updates:\n';
      commentBody += generateTable(updatesBySeverity.minor);
    }

    if (updatesBySeverity.patch.length > 0) {
      commentBody += '### Patch Updates:\n';
      commentBody += generateTable(updatesBySeverity.patch);
    }

    if (commentBody) {
      const templatePath = `${process.env.GITHUB_WORKSPACE}/outdated.md`;
      let template = fs.readFileSync(templatePath, 'utf8');

      // Remplacer {{#each dependencies}}...{{/each}} dans le modèle par le contenu du tableau
      template = template.replace('{{#each dependencies}}\n{{/each}}', commentBody);

      await github.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.pull_request.number,
        body: template,
      });
    } else {
      console.log('No critical updates found.');
    }
  } catch (error) {
    console.error('Error commenting on pull request:', error);
    process.exit(1);
  }
}

// Fonction utilitaire pour générer le contenu du tableau
function generateTable(dependencies) {
  let tableContent = '| Package Name | Current Version | Wanted Version | Latest Version |\n';
  tableContent += '|--------------|-----------------|----------------|----------------|\n';

  dependencies.forEach(dep => {
    tableContent += `| ${dep.name} | ${dep.current} | ${dep.wanted} | ${dep.latest} |\n`;
  });

  return tableContent;
}

// Fonctions utilitaires pour déterminer le niveau de mise à jour
function isMajorUpdate(currentVersion, wantedVersion) {
  // Exemple : si la version souhaitée est une mise à jour majeure par rapport à la version actuelle
  // Vous pouvez adapter cette logique selon vos besoins spécifiques
  return currentVersion !== wantedVersion && wantedVersion.startsWith('1');
}

function isMinorUpdate(currentVersion, wantedVersion) {
  // Exemple : si la version souhaitée est une mise à jour mineure par rapport à la version actuelle
  // Vous pouvez adapter cette logique selon vos besoins spécifiques
  return currentVersion !== wantedVersion && wantedVersion.startsWith('0');
}

function isPatchUpdate(currentVersion, wantedVersion) {
  // Exemple : si la version souhaitée est une mise à jour patch par rapport à la version actuelle
  // Vous pouvez adapter cette logique selon vos besoins spécifiques
  return currentVersion !== wantedVersion && wantedVersion.startsWith('0.');
}

commentOnPullRequest().catch(error => {
  console.error('Error commenting on pull request:', error);
  process.exit(1);
});
