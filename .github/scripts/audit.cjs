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
    // const severity = vuln.cvss_score >= 9 ? 'Critical'
    //   : vuln.cvss_score >= 7 ? 'High'
    //   : vuln.cvss_score >= 4 ? 'Moderate'
    //   : 'Low';
    const severity = vuln.severity;

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

function extractVulnerabilities(vulnerabilitiesObj) {
  const allVulns = [];

  // Pour chaque paquet vulnérable
  Object.values(vulnerabilitiesObj).forEach(pkg => {
    // pkg.via peut être un tableau de vulnérabilités ou un seul objet
    const viaArr = Array.isArray(pkg.via) ? pkg.via : [pkg.via];

    viaArr.forEach(vuln => {
      // Certains items 'via' peuvent être des strings, on filtre
      if (typeof vuln === 'object' && vuln !== null) {
        allVulns.push({
          package_name: vuln.name || pkg.name,
          dependency_name: pkg.name,
          title: vuln.title || '',
          cwe: (vuln.cwe && Array.isArray(vuln.cwe)) ? vuln.cwe.join(', ') : '',
          cvss_score: (vuln.cvss && typeof vuln.cvss.score === 'number') ? vuln.cvss.score : 0,
          vulnerable_versions: vuln.range || pkg.range || '',
        });
      }
    });
  });

  return allVulns;
}


module.exports = async ({ github, context }) => {
  // Lire les vulnérabilités générées par l'audit (ex: audit.json à adapter à votre fichier)
  const auditRaw = fs.readFileSync('audit-result.json', 'utf8');
  const auditData = JSON.parse(auditRaw);

  // Dans la fonction principale / module.exports
  const vulnerabilitiesRaw = auditData.vulnerabilities || {};
  const vulnerabilitiesDetailed = extractVulnerabilities(vulnerabilitiesRaw);

  const grouped = groupBySeverity(vulnerabilitiesDetailed);

  // Supposons que les vulnérabilités sont dans auditData.vulnerabilities (adapter selon votre fichier)
  // const vulnerabilities = auditData.vulnerabilities || [];

  // const grouped = groupBySeverity(vulnerabilities);

  // Lire le template Mustache
  const templatePath = '.github/template/audit.md';
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
