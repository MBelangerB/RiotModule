// -----------------------------
// Local
// -----------------------------
export interface IDragonVersion {
    internalVersion: string | null,
    previousVersion?: string,
    onlineVersion?: string,
}

// -----------------------------
// Dragon
// -----------------------------
export interface IDragonFile<T> {
    type: string;
    format: string;
    version: string;
    data: T;
}
// export type VersionData = {
//     [versions: string] : string[];
//     // version: string[];   
// }

// -----------------------------
// Dragon Version
// -----------------------------
export interface IVersionData {
    version: string[];   
}

// -----------------------------
// Dragon Champion
// -----------------------------
export interface IChampionData {
    [championName: string]: IDragonChampion
}

export interface IDragonChampion {
    id: string;
    key: string;
    name: string;
    title: string;
    image: IChampDataImage;
}

export interface IChampDataImage {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
