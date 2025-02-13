type Locatable = {
    latitude: number;
    longitude: number;
};

type SampleElements =
    | "SiO2"
    | "TiO2"
    | "Ai2O3"
    | "FeO"
    | "MnO"
    | "MgO"
    | "CaO"
    | "K2O"
    | "P2O3"
    | "Other";

export type Geosample = {
    id: number;
    zoneId: string;
    starred: boolean;
    bookmarked: boolean;
    datetime: string;
    color: string;
    subcolor: string;
    shape: string;
    rockType: string;
    author: number;
    description: string;
    photoJpg: string;
    elementalComposition: Record<SampleElements, number>;
} & Locatable;
