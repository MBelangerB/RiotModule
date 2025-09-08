// outdated.cjs
const fs = require('fs');
const Mustache = require('mustache');

module.exports = async ({ github, context }) => {
  // Lire et parser le JSON généré par npm outdated
  const outdatedRaw = fs.readFileSync('outdated.json', 'utf8');
  const result = JSON.parse(outdatedRaw);

  // Préparer les données pour le template
  const packageList = {
    data: []
  };

  Object.keys(result).forEach(depName => {
    const depInfo = result[depName];
    packageList.data.push({
      name: depName,
      current: depInfo.current,
      wanted: depInfo.wanted,
      latest: depInfo.latest
    });
  });

  // Lire le template Mustache externe (ex: .github/template/outdated.md)
  const templatePath = '.github/template/outdated.md';
  const templateFile = fs.readFileSync(templatePath, 'utf8');

  // Générer le corps du commentaire avec Mustache
  const commentBody = Mustache.render(templateFile, packageList);

  // Trouver un commentaire existant du bot pour le mettre à jour si nécessaire
  const existingComments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  });
  const commentToUpdate = existingComments.data.find(c =>
    c.user.type === 'Bot' && c.body.includes('<!-- outdated-comment -->')
  );

  // Créer ou mettre à jour le commentaire
  if (commentToUpdate) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: commentToUpdate.id,
      body: commentBody
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: commentBody
    });
  }
};
