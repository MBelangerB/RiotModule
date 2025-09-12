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
    let severityRaw = vuln.severity || (vuln.cvss_score ? (
      vuln.cvss_score >= 9 ? 'critical' :
      vuln.cvss_score >= 7 ? 'high' :
      vuln.cvss_score >= 4 ? 'moderate' : 'low'
    ) : 'low');

    let severity;

    switch (severityRaw.toString().toLowerCase()) {
      case "critical":
        severity = "Critical";
        break;
      case "high":
        severity = "High";
        break;
      case "moderate":
        severity = "Moderate";
        break;
      case "low":
      default:
        severity = "Low";
        break;
    }

    severities[severity].push({
      name: vuln.package_name,
      dependency: vuln.dependency_name || '',
      title: vuln.title || '',
      cwe: vuln.cwe || '',
      cvss: vuln.cvss?.score !== undefined ? vuln.cvss.score : vuln.cvss_score,
      range: vuln.vulnerable_versions || '',
      url: vuln.url || '', 
      severity: severityRaw
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
          cvss: vuln.cvss,
          cvss_score: vuln.cvss?.score ?? 0,
          vulnerable_versions: vuln.range || pkg.range || '',
          severity: vuln.severity || pkg.severity || 'low',
          url: vuln.url || '',
        });
      }
    });
  });

  return allVulns;
}

module.exports = async ({ github, context }) => {
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
