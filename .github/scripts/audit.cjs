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
    const cvssScore = vuln.cvss?.score ?? 0;

    const severity = cvssScore >= 9 ? 'Critical'
      : cvssScore >= 7 ? 'High'
      : cvssScore >= 4 ? 'Moderate'
      : 'Low';

    severities[severity].push({
      name: vuln.package_name,
      dependency: vuln.dependency_name || '',
      title: vuln.title || '',
      cwe: vuln.cwe || '',
      cvss: cvssScore.toFixed(1),
      range: vuln.vulnerable_versions || ''
    });
  });

  return severities;
}

function extractVulnerabilities(vulnerabilitiesObj) {
  const allVulns = [];

  Object.values(vulnerabilitiesObj).forEach(pkg => {
    const viaArr = Array.isArray(pkg.via) ? pkg.via : [pkg.via];

    viaArr.forEach(vuln => {
      if (typeof vuln === 'object' && vuln !== null) {
        allVulns.push({
          package_name: vuln.name || pkg.name,
          dependency_name: pkg.name,
          title: vuln.title || '',
          cwe: (vuln.cwe && Array.isArray(vuln.cwe)) ? vuln.cwe.join(', ') : '',
          cvss: vuln.cvss?.score ?? 0,
          cvss_score: vuln.cvss?.score ?? 0,  // deprecated, for compatibility
          vulnerable_versions: vuln.range || pkg.range || '',
        });
      }
    });
  });

  return allVulns;
}

module.exports = async ({ github, context }) => {
  // Lire le fichier audit JSON généré par 'npm audit --json'
  const auditRaw = fs.readFileSync('audit-result.json', 'utf8');
  const auditData = JSON.parse(auditRaw);

  const vulnerabilitiesRaw = auditData.vulnerabilities || {};
  const vulnerabilitiesDetailed = extractVulnerabilities(vulnerabilitiesRaw);

  const grouped = groupBySeverity(vulnerabilitiesDetailed);

  const groupedArray = [
    { severity: "Critique", vulnerabilities: grouped.Critical },
    { severity: "Élevée", vulnerabilities: grouped.High },
    { severity: "Modérée", vulnerabilities: grouped.Moderate },
    { severity: "Faible", vulnerabilities: grouped.Low }
  ].filter(g => g.vulnerabilities.length > 0);

  const templatePath = '.github/template/audit.md';
  const templateRaw = fs.readFileSync(templatePath, 'utf8');

  const commentBody = Mustache.render(templateRaw, { grouped: groupedArray });

  // Chercher les commentaires existants pour mettre à jour ou créer nouveau
  const existingComments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  });

  const commentToUpdate = existingComments.data.find(c =>
    c.user.type === 'Bot' && c.body.includes('<!-- audit-comment -->')
  );

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
