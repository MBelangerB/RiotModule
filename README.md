# Bedy Riot module
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/MBelangerB/RiotModule)

A simple library to communicate with Riot's League of Legend API.

![GitHub last commit (branch)](https://img.shields.io/github/last-commit/MBelangerB/RiotModule/dev)
![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/MBelangerB/RiotModule?label=Last%20Release)
[![codecov](https://codecov.io/gh/MBelangerB/RiotModule/graph/badge.svg?token=VZ7R9KTH4M)](https://codecov.io/gh/MBelangerB/RiotModule)


# Table of Contents
- [Bedy Riot module](#bedy-riot-module)
- [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [Features](#features)
  - [Installation](#installation)
    - [Login to Github registry package](#login-to-github-registry-package)
- [Requirement](#requirement)
  - [Environment Variables](#environment-variables)
    - [.env Exemple](#env-exemple)
- [How to use](#how-to-use)
  - [Exemple](#exemple)
- [League of Legends API](#league-of-legends-api)
  - [API Versions](#api-versions)
- [Authors](#authors)


# Prerequisites
To use this library you will need an API key to access the Riot API.

To get this key you need to make a request to Riot.

[Riot Developer Portal](https://developer.riotgames.com)

# Features
- Request helpers (caching)
- Dragon helpers
- Access the informations about the summoner (rank, masteries)
- Get the current rotation (new player and normal)
- Validate region parameters

## Installation
This is a **Node.js** module available through the npm registry.

Before installing, download and install **Node.js**. 
Node.js 18.0 or higher is required.

If this is a brand new project, make sure to create a package.json first with the `npm init` command.

### Login to Github registry package
Require PAT *(Personal access token)* for install the package
```bash
npm login --scope=@mbelangerb --auth-type=legacy --registry=https://npm.pkg.github.com
```

Installation is done using the **npm install** command:
```bash
npm install @mbelangerb/riotmodule
```

# Requirement

## Environment Variables

To run this project, you will need to add the following environment variables to your **.env** file

In production, to be able to communicate with the Riot API, you must add the following keys.
`Riot_LolToken` and  `Riot_TftToken`

If you are in development mode `NODE_ENV="development"` you can use a unique key valid for **24 hours** that is provided to you by Riot and allows access to all features (League of Legend & TFT) with the key : `Riot_APIDevKey`

If you want enabled the cache system you need to add key `CacheEnabled=true`

### .env Exemple
```bash
# Production Mode
Riot_LolToken='RGAPI-'
Riot_TftToken='RGAPI-'

# Developper Mode (24 hours tokens)
Riot_APIDevKey='RGAPI-'
```

# How to use

## Exemple

```ts
import { RiotService, ValidationService, RiotHttpStatusCode } from '@mbelangerb/riotmodule';

# Initialize 'RiotService'
const service: RiotService = new RiotService();

# Validate Region
let valideRegion: string = ValidationService.convertToRealRegion(region);

# Get SummonerDTO
import { ISummonerDTO } from '@mbelangerb/riotmodule';
const apiSummoner: ISummonerDTO = await service.SummonerV4.getBySummonerName(summonerName, region);
```

# League of Legends API
For more information about Riot's Developer API, please consult the official API access. : [link](https://developer.riotgames.com/apis)

## API Versions
| Route | Status |
|--|--|
| Account | ![Static Badge](https://img.shields.io/badge/implemented-v1-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| Champion | ![Static Badge](https://img.shields.io/badge/implemented-v3-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| Champion-Mastery | ![Static Badge](https://img.shields.io/badge/implemented-v4-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| League | ![Static Badge](https://img.shields.io/badge/implemented-v4-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| Summoner | ![Static Badge](https://img.shields.io/badge/implemented-v4-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| TFTLeague* | ![Static Badge](https://img.shields.io/badge/implemented-v1-blue?style=for-the-badge&label=implemented&labelColor=grey) |
| TFTSummoner* | ![Static Badge](https://img.shields.io/badge/implemented-v1-blue?style=for-the-badge&label=implemented&labelColor=grey) |

> *The TFT entity used for summoner and league information is the same as that used for League of Legend.


# Authors

- [@MBelangerB](https://www.github.com/MBelangerB)

