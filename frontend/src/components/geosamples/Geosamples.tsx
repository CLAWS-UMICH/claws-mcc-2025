// Geosamples.tsx
import React, { useReducer, useState } from "react";
import {
    Button,
    Divider,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    InlineDrawer,
    makeStyles,
    shorthands
} from "@fluentui/react-components";
import { Search20Regular } from "@fluentui/react-icons";
import DetailScreen from "./DetailScreen.tsx";
import GeosampleMap from "./GeosampleMap.tsx";
import GeosampleList from "./GeoSampleList.tsx";
import { ManagerAction, ManagerState } from "./GeosampleTypes.tsx";

const useStyles = makeStyles({
    root: {
        ...shorthands.overflow("hidden"),
        display: "flex",
        height: "100vh",
        backgroundColor: "#000"
    },
    dividerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...shorthands.gap("10px"),
        backgroundColor: "#0F0F0F"
    },
    header: {
        paddingTop: "11px",
        paddingBottom: "11px"
    }
});

export const geosampleReducer = (
    state: ManagerState,
    action: ManagerAction
): ManagerState => {
    switch (action.type) {
        case "set":
            return {
                ...state,
                geosamples: action.payload.samples,
                sample_zones: action.payload.zones
            };
        case "delete":
            return {
                ...state,
                geosamples: state.geosamples.filter(
                    (geosample) =>
                        geosample.geosample_id !== action.payload.geosample_id
                ),
                sample_zones: state.sample_zones.map((zone) => ({
                    ...zone,
                    geosample_ids: zone.ZoneGeosamplesIds.filter(
                        (id) => id !== action.payload.geosample_id
                    )
                }))
            };
        case "update":
            if (action.payload === undefined) {
                return state;
            }

            return {
                ...state,
                geosamples: state.geosamples.map((sample) => {
                    if (sample.geosample_id === action.payload.geosample_id) {
                        return action.payload;
                    }
                    return sample;
                }),
                sample_zones: state.sample_zones.map((zone) => ({
                    ...zone,
                    geosample_ids: zone.ZoneGeosamplesIds.map((id) => {
                        if (id === action.payload.geosample_id) {
                            return action.payload.geosample_id;
                        }
                        return id;
                    })
                }))
            };
        case "select":
            return {
                ...state,
                selected: action.payload
            };
        case "deselect":
            return {
                ...state,
                selected: undefined
            };
        default:
            return state;
    }
};

const initialState: ManagerState = {
    geosamples: [],
    sample_zones: [],
    selected: undefined
};

// TODO :( -> get astronaut location to add icon to geosample list & map
const GeosampleManager: React.FC = () => {
    const styles = useStyles();
    const [state, dispatch] = useReducer(geosampleReducer, initialState);
    const [showSearchBar, setShowSearchBar] = useState(false);

    return (
        <div className={styles.root}>
            <InlineDrawer
                style={{
                    width: "220px",
                    background: "#141414",
                    borderTopColor: "rgb(82, 82, 82)",
                    borderRightColor: "rgb(82, 82, 82)"
                }}
                separator
                open
            >
                <DrawerHeader className={styles.header}>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                size="medium"
                                icon={<Search20Regular />}
                                onClick={() => setShowSearchBar(!showSearchBar)}
                            ></Button>
                        }
                    >
                        <b style={{ fontSize: "18px" }}>Samples</b>
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <div className={styles.dividerContainer}>
                    <Divider></Divider>
                    {showSearchBar && (
                        <div style={{ flexGrow: "1" }}>
                            <Divider></Divider>
                        </div>
                    )}
                </div>
                <DrawerBody style={{ background: "#0F0F0F" }}>
                    <GeosampleList
                        geosamples={state.geosamples}
                        sample_zones={state.sample_zones}
                        selected={state.selected}
                        dispatch={dispatch}
                        ready={true}
                    />
                </DrawerBody>
            </InlineDrawer>
            <DrawerBody
                style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    background: "black"
                }}
            >
                <DetailScreen
                    geosample={state.selected}
                    dispatch={dispatch}
                    ready={true}
                />
                {state.selected && state.geosamples && state.sample_zones && (
                    <GeosampleMap
                        geosamples={state.geosamples}
                        zones={state.sample_zones}
                        dispatch={dispatch}
                        selected={state.selected}
                        ready={true}
                    />
                )}
            </DrawerBody>
        </div>
    );
};

export default GeosampleManager;
