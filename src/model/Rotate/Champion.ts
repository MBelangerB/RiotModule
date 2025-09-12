export interface IChampion {
    id: number;
    name?: string;
    squareUrl?: string;
    loadingScreenUrl?: string;
    skins?: IChampionSkin[];
}

export interface IChampionSkin {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
    squareUrl?: string;
    loadingScreenUrl?: string;
}