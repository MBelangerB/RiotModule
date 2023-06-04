export interface IShardStatus {
    locales: Array<string>;
    hostname: string;
    name: string;
    services: Array<IService>;
    slug: string;
    region_tag: string;
}
export interface IService {
    name: string;
    slug: string;
    status: string;
    incidents: Array<IIncident>;
}
export interface IIncident {
    id: number;
    active: boolean;
    created_at: string;
    updates: Array<IMessage>;
}
export interface IMessage {
    id: string;
    author: string;
    heading: string;
    content: string;
    severity: string;
    created_at: string;
    updated_at: string;
    translations: Array<ITranslation>;
}
export interface ITranslation {
    updated_at: string;
    locale: string;
    content: string;
}
