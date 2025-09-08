<!-- audit-comment -->

# Rapport d'audit de vulnérabilités

{{#grouped}}
### {{severity}}

| Nom du paquet | Dépendance | Titre | CWE | CVSS | Versions affectées |
|---------------|------------|-------|-----|------|--------------------|
{{#vulnerabilities}}
| {{name}} | {{dependency}} | {{title}} | {{cwe}} | {{cvss}} | {{range}} |
{{/vulnerabilities}}

{{/grouped}}
