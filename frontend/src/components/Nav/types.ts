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
export type Waypoint = {
    waypoint_id: number; //sequential
    location: { lat: number, long: number };
    type: WaypointType;
    title: string
}