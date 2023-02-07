
# BedyRiot

A simple library to communicate with Riot's League of Legend API.

## Features
- Request helpers (caching)
- Access the information about the summoner (rank, masteries)
- Get the current rotation (new player and normal)
- Validate region parameters

## Installation

```bash
npm install BedyRiot
```

## Usage

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
