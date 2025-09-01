Badges generation

https://shields.io/badges/git-hub-last-commit-branch
`![GitHub last commit (branch)](https://img.shields.io/github/last-commit/MBelangerB/RiotModule/dev)`


https://shields.io/badges/git-hub-pre-release-date
`![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/MBelangerB/RiotModule?label=Last%20Release)`

-- npm install ./lib/mbelangerb-riotentity-2024.1.1.tgz
Coverage badge :
https://app.codecov.io/gh/MBelangerB/RiotModule/settings/badge
https://shields.io/badges/codecov

`![Codecov](https://img.shields.io/codecov/c/gh/MBelangerB/RiotModule?token=VZ7R9KTH4M)`
`

`https://github.com/badges/shields`


----------------------
Version Badge :
https://shields.io/badges/git-hub-package-json-version-subfolder-of-monorepo
`![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/MBelangerB/RiotModule)`


Static badge : 
https://shields.io/badges/static-badge
`![Static Badge](https://img.shields.io/badge/implemented-v1-blue?style=for-the-badge&label=implemented&labelColor=grey&link=https%3A%2F%2Fdeveloper.riotgames.com%2Fapis%23account-v1%2F)`

`![Static Badge](https://img.shields.io/badge/implemented-v1-blue?style=for-the-badge&label=implemented&labelColor=grey)`


--------------------------


Doc Riot/Dragon
- https://developer.riotgames.com/docs/lol
- https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html
- https://cdn.communitydragon.org/endpoints
- https://github.com/communitydragon/docs/blob/master/assets.md


Image ex
- https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/99/
- https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-chroma-images/99/
- https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/
- https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/

# Gestion des différents exports

## Export default X
`export default EnvVars;`

Cette syntaxe exporte l'objet EnvVars comme la valeur par défaut du module. Cela signifie que lorsque vous importez ce module dans un autre fichier, vous pouvez utiliser l'objet EnvVars sans avoir à spécifier son nom.

Exemple :
```typescript
// env-vars.ts
export default EnvVars;

// autre-fichier.ts
import EnvVars from './env-vars';
```
Dans ce cas, EnvVars est la valeur par défaut du module, donc vous pouvez l'importer sans avoir à spécifier son nom.

## Export X;

`export EnvVars;`

Cette syntaxe exporte l'objet EnvVars comme une propriété du module. Cela signifie que lorsque vous importez ce module dans un autre fichier, vous devez spécifier le nom de l'objet EnvVars pour l'utiliser.

Exemple :

```typescript
// env-vars.ts
export EnvVars;

// autre-fichier.ts
import { EnvVars } from './env-vars';
```
Dans ce cas, EnvVars est une propriété du module, donc vous devez l'importer en spécifiant son nom entre accolades.

## Export X as const

`export default EnvVars as const;`

Cette syntaxe exporte l'objet EnvVars comme une valeur par défaut du module, mais avec une différence importante : l'objet EnvVars est considéré comme une constante, ce qui signifie qu'il ne peut pas être modifié après son exportation.

Exemple :
```typescript
// env-vars.ts
export default EnvVars as const;

// autre-fichier.ts
import EnvVars from './env-vars';
```
Dans ce cas, EnvVars est la valeur par défaut du module, mais il est considéré comme une constante, donc vous ne pouvez pas le modifier après l'avoir importé.


##
En résumé :

`export default EnvVars;` : exporte l'objet EnvVars comme la valeur par défaut du module, sans restriction sur sa modification.
`export EnvVars;` : exporte l'objet EnvVars comme une propriété du module, sans restriction sur sa modification.
`export default EnvVars as const;` : exporte l'objet EnvVars comme la valeur par défaut du module, mais comme une constante, ce qui signifie qu'il ne peut pas être modifié après son exportation.