import { IChampion, IChampionSkin } from './Rotate/Champion.js';
import { IChampionMastery, ChampionMasteries, ChampionMastery } from './Rotate/ChampionMastery.js';
import { IRotation, Rotation } from './Rotate/Rotation.js';
export * from './DragonModel.js';

export type {
	IChampion, IChampionSkin,
    IChampionMastery,
    IRotation,
};

export {
    ChampionMasteries, ChampionMastery, Rotation,
};

// export type IChampion = IChampion;
// export type INextSeasonMilestonesDTO = INextSeasonMilestonesDTO_v4;
// export type IRewardConfigDTO = IRewardConfigDTO_v4;