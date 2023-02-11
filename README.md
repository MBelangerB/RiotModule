# BedyRiot

A simple library to communicate with Riot's League of Legend API.

## Prerequisites
To use this library you will need an API key to access the Riot API.

To get this key you need to make a request to Riot.

[Riot Developer Portal](https://developer.riotgames.com)

## Features
- Request helpers (caching)
- Dragon helpers
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

To run this project, you will need to add the following environment variables to your **.env** file

In production, to be able to communicate with the Riot API, you must add the following keys.
`Riot_LolToken` and  `Riot_TftToken`

If you are in development mode `NODE_ENV="development"` you can use a unique key valid for **24 hours** that is provided to you by Riot and allows access to all features (League of Legend & TFT) with the key : `Riot_APIDevKey`

If you want enabled the cache system you need to add key `CacheEnabled=true`

#### .env Exemple
```bash
# Production Mode
Riot_LolToken='RGAPI-'
Riot_TftToken='RGAPI-'

# Developper Mode
Riot_APIDevKey='RGAPI-'
```

## Exemple

```ts
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

