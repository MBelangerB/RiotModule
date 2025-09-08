// audit.cjs
const fs = require('fs');
const Mustache = require('mustache');

function groupBySeverity(vulnerabilities) {
  const severities = {
    Critical: [],
    High: [],
    Moderate: [],
    Low: []
  };

  vulnerabilities.forEach(vuln => {
    const severity = vuln.cvss_score >= 9 ? 'Critical'
      : vuln.cvss_score >= 7 ? 'High'
      : vuln.cvss_score >= 4 ? 'Moderate'
      : 'Low';

    severities[severity].push({
      name: vuln.package_name,
      dependency: vuln.dependency_name || '',
      title: vuln.title || '',
      cwe: vuln.cwe || '',
      cvss: vuln.cvss_score.toFixed(1),
      range: vuln.vulnerable_versions || ''
    });
  });

  return severities;
}

module.exports = async ({ github, context }) => {
  // Lire les vulnérabilités générées par l'audit (ex: audit.json à adapter à votre fichier)
  const auditRaw = fs.readFileSync('audit-result.json', 'utf8');
  const auditData = JSON.parse(auditRaw);

  // Supposons que les vulnérabilités sont dans auditData.vulnerabilities (adapter selon votre fichier)
  const vulnerabilities = auditData.vulnerabilities || [];

  const grouped = groupBySeverity(vulnerabilities);

  // Lire le template Mustache
  const templatePath = '.github/template/audit.mustache';
  const templateRaw = fs.readFileSync(templatePath, 'utf8');

  // Rendre le template avec les données groupées
  const commentBody = Mustache.render(templateRaw, grouped);

  // Chercher un commentaire bot existant
  const existingComments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  });
  const commentToUpdate = existingComments.data.find(c =>
    c.user.type === 'Bot' && c.body.includes('<!-- audit-comment -->')
  );

  // Mettre à jour ou créer le commentaire
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
