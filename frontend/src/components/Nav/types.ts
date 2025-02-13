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
    location: { latitude: number, longitude: number };
    type: WaypointType;
    title: String
}