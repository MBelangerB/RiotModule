// -----------------------------
// Local
// -----------------------------
export interface IDragonVersion {
    internalVersion: string | null,
    previousVersion?: string,
    onlineVersion?: string,
    requiredUpdate?: boolean
}

export class DragonVersion implements IDragonVersion {
    internalVersion: string | null = null;
    previousVersion?: string | undefined;
    onlineVersion?: string | undefined;
    requiredUpdate?: boolean | undefined;

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

export class DragonFile<T> implements IDragonFile<T> {
    type!: string;
    format!: string;
    version!: string;
    data!: T;
}

// -----------------------------
// Dragon Version
// -----------------------------
export interface IVersionData {
    version: string[];
}

export class VersionData implements IVersionData {
    version: string[] = [];
}

// -----------------------------
// Dragon Champion
// -----------------------------

export interface IDragonChampion {
    id: string;
    key: string;
    name: string;
    title: string;
    image: IChampDataImage;
    skins?: IChampSkinData[];
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

export interface IChampSkinData {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
}

export class DragonChampion implements IDragonChampion {
    id = '';
    key = '';
    name = '';
    title = '';
    image!: IChampDataImage;
    skins?: IChampSkinData[];
}
