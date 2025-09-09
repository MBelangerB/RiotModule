<!-- audit-comment -->

# Rapport d'audit de vulnérabilités

{{#grouped}}
### {{severity}}

| Nom du paquet | Dépendance | Titre | CWE | CVSS | Versions affectées | Lien |
|--------------|------------|-------|-----|------|--------------------|------|
{{#vulnerabilities}}
| {{name}} | {{dependency}} | {{title}} | {{cwe}} | {{cvss}} | {{range}} | [Details]({{url}}) |
{{/vulnerabilities}}

{{/grouped}}
