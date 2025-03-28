export enum WaypointType {
    // Blue
    STATION,
    // Pink
    NAV,
    // Green
    GEO,
    // Red
    DANGER
}

export enum AuthorType {
    ASTRO1 = 1, // had to so it's not zero indexed for AR
    ASTRO2 = 2,
    LMCC = 3
}
export type Waypoint = {
    waypoint_id: number; //sequential
    location: { lat: number, long: number };
    type: WaypointType;
    title: string;
    author: AuthorType; 
}

export type WaypointAR = {
    room: string;
    use: string;
    data: {
        id: number;
        name: string;
        location:  { lat: number, long: number };
        type: number;
        author: number;
    }
}