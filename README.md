# BedyRiot

A simple library to communicate with Riot's League of Legend API.


## Prerequisites
This is an example of how to list things you need to use the software and how to install them.

## Features
- Request helpers (caching) [TODO]
- Access the informations about the summoner (rank, masteries)
- Get the current rotation (new player and normal)
- Validate region parameters
## Installation
This is a **Node.js** module available through the npm registry.

Before installing, download and install **Node.js**. 
Node.js 16.0 or higher is required.

If this is a brand new project, make sure to create a package.json first with the `npm init` command.

Installation is done using the npm install command:

```bash
npm install BedyRiot
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`Riot_LolToken` and  `Riot_TftToken`

In developpement `Riot_APIDevKey`

## Exemple

```typescript
import { RiotService, ValidationService, RiotHttpStatusCode} from 'bedyriot';

# Initialize 'RiotService'
const service: RiotService = new RiotService();

# Validate Region
let valideRegion: string = ValidationService.convertToRealRegion(region);

# Get SummonerDTO
import { ISummonerDTO } from 'bedyriot';
const apiSummoner: ISummonerDTO = await service.SummonerV4.getBySummonerName(summonerName, region);
```


## Authors

- [@MBelangerB](https://www.github.com/MBelangerB)

