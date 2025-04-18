import { useState, useMemo } from "react";
import "./SideBar.css";
import { type Geosample } from "./GeosampleTypes";
import {
    LocationRegular,
    ClockRegular,
    ArrowSyncRegular,
    TemperatureRegular,
    StarFilled,
    StarRegular,
    SearchRegular,
    EditRegular,
} from "@fluentui/react-icons";

interface SideBarProps {
    geosamples: Geosample[];
    selectedSample: Geosample | null;
    onSelectSample: (sample: Geosample) => void;
}

const SideBar = ({
    geosamples,
    selectedSample,
    onSelectSample,
}: SideBarProps) => {
    const initialOpenZones = useMemo(() => {
        return geosamples.reduce(
            (acc, sample) => {
                acc[sample.zoneId] = true;
                return acc;
            },
            {} as Record<string, boolean>,
        );
    }, [geosamples]);

    const [openZones, setOpenZones] = useState(initialOpenZones);
    const [isTraverseEnabled, setIsTraverseEnabled] = useState(false);

    const toggleZone = (zoneId: string) => {
        setOpenZones((prev) => ({ ...prev, [zoneId]: !prev[zoneId] }));
    };

    const groupedByZone = useMemo(() => {
        return geosamples.reduce(
            (acc, sample) => {
                acc[sample.zoneId] = acc[sample.zoneId] || [];
                acc[sample.zoneId].push(sample);
                return acc;
            },
            {} as Record<string, Geosample[]>,
        );
    }, [geosamples]);

    const getSampleIcon = (sample: Geosample, index: number) => {
        const iconText = `${sample.zoneId}${index + 1}`;
        const iconStyle = {
            backgroundColor: sample.color,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            marginRight: "8px",
        };

        let shapeStyle = {};
        switch (sample.shape) {
            case "Square":
                shapeStyle = { borderRadius: "0" };
                break;
            case "Hexagon":
                shapeStyle = {
                    clipPath:
                        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                };
                break;
            default:
                shapeStyle = { borderRadius: "50%" };
                break;
        }

        return <div style={{ ...iconStyle, ...shapeStyle }}>{iconText}</div>;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3 className="sidebar-title">All Samples</h3>
                <div className="icon-group">
                    <EditRegular className="header-icon" />
                    <SearchRegular className="header-icon" />
                </div>
            </div>

            {Object.entries(groupedByZone).map(([zoneId, samples]) => (
                <div key={zoneId} className="zone">
                    <div
                        className="zone-header"
                        onClick={() => toggleZone(zoneId)}
                    >
                        <h4 className="zone-title">
                            <strong>{`Zone ${zoneId}`}</strong>
                        </h4>
                        <span>{openZones[zoneId] ? "▼" : "▲"}</span>
                    </div>
                    {openZones[zoneId] && (
                        <ul className="sample-list">
                            {samples.map((sample, index) => (
                                <li
                                    key={sample.id}
                                    className={`sample-item ${
                                        selectedSample?.id === sample.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => onSelectSample(sample)}
                                >
                                    {getSampleIcon(sample, index)}
                                    <div className="sample-info">
                                        <span className="sample-name">
                                            {sample.description}
                                        </span>
                                        <span className="sample-rock-type">
                                            {sample.rockType}
                                        </span>
                                    </div>
                                    {sample.starred ? (
                                        <StarFilled className="star-icon" />
                                    ) : (
                                        <StarRegular className="star-icon" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            <div className="map-data">
                <h4 className="map-data-title">Map Data</h4>
                {selectedSample && (
                    <>
                        <div className="map-data-content">
                            <div className="map-data-row">
                                <LocationRegular />
                                <p className="data-text">
                                    <strong>Sample:</strong>
                                    {`Zone ${selectedSample.zoneId}, ${selectedSample.description}`}
                                </p>
                            </div>
                            <div className="map-data-row">
                                <LocationRegular />
                                <p className="data-text">
                                    <strong>Location:</strong>{" "}
                                    {`${selectedSample.latitude}, ${selectedSample.longitude}`}
                                </p>
                            </div>
                            <div className="map-data-row">
                                <ClockRegular />
                                <p className="data-text">
                                    <strong>Collected Time:</strong>{" "}
                                    {selectedSample.datetime.split("T")[1]}
                                </p>
                            </div>
                        </div>

                        <div className="map-data-row black-section">
                            <ArrowSyncRegular />
                            <p className="data-text">Traverse</p>
                            <label className="toggle-container">
                                <input
                                    type="checkbox"
                                    checked={isTraverseEnabled}
                                    onChange={() =>
                                        setIsTraverseEnabled(!isTraverseEnabled)
                                    }
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="map-data-row black-section">
                            <TemperatureRegular />
                            <p className="data-text">Temperature: ?</p>
                        </div>

                        <div className="map-data-row black-section">
                            <ArrowSyncRegular />
                            <p className="data-text">Slope: ?</p>
                        </div>

                        <div className="map-data-row black-section">
                            <ArrowSyncRegular />
                            <p className="data-text">Elevation: ?</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SideBar;
