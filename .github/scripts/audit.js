// .github/scripts/audit.js
module.exports = async ({ github, context }) => {
    const fs = require('fs');
    const audit = JSON.parse(fs.readFileSync('audit-result.json', 'utf8'));
    const vulnerabilities = audit.metadata.vulnerabilities || {};
  
    let message = '### NPM Audit Report\n\n';
    message += `Critical: ${vulnerabilities.critical || 0}\n`;
    message += `High: ${vulnerabilities.high || 0}\n`;
    message += `Moderate: ${vulnerabilities.moderate || 0}\n`;
    message += `Low: ${vulnerabilities.low || 0}\n\n`;
  
    if ((vulnerabilities.critical || 0) > 0) {
      message += '**Attention:** Des vulnérabilités critiques ont été détectées! 🚨\n';
    } else {
      message += 'Aucune vulnérabilité critique détectée. ✅\n';
    }
  
    // Chercher ancien commentaire
    const comments = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    });
    const botComment = comments.data.find(c => c.user.type === 'Bot' && c.body.includes('### NPM Audit Report'));
  
    if (botComment) {
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id,
        body: message,
      });
    } else {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: message,
      });
    }
  };
  