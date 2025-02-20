import { useState } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel
} from "@fluentui/react-components";
import {
    ChevronUp16Regular,
    ChevronDown16Regular
} from "@fluentui/react-icons";
import "./Geosamples.css";
import { Geosample } from "./GeosampleTypes";

type GeosampleDetailProps = {
    sample: Geosample;
    onDelete: () => void;
};

const GeosampleDetail = ({ sample, onDelete }: GeosampleDetailProps) => {
    // Hardcoded geosample data
    const [openItems, setOpenItems] = useState<string[]>([]);

    const handleToggle = (_, data) => {
        setOpenItems(data.openItems);
    };

    return (
        <Accordion
            defaultOpenItems={sample}
            onToggle={handleToggle}
            openItems={openItems}
            multiple
            collapsible
        >
            <AccordionItem key={sample.id} value={sample.zoneId}>
                <AccordionHeader
                    size="large"
                    expandIcon={
                        openItems.includes(sample.zoneId) ? (
                            <ChevronDown16Regular />
                        ) : (
                            <ChevronUp16Regular />
                        )
                    }
                    expandIconPosition="end"
                >
                    <b>{sample.description}</b>
                </AccordionHeader>
                <AccordionPanel>
                    {/* Main Container */}
                    <div className="geosample-container">
                        {/* Header Section */}
                        <div className="header">
                            <h3>{sample.description}</h3>
                            <span className="status">Well Examined</span>
                        </div>

                        {/* ID, Date/Time, and Location */}
                        <div className="info-row">
                            <p>
                                <b>ID:</b> {sample.id}
                            </p>
                            <p>
                                <b>Date/Time:</b>{" "}
                                {new Date(sample.datetime).toLocaleString()}
                            </p>
                            <p>
                                <b>Location:</b> Zone {sample.zoneId} (
                                {sample.latitude}, {sample.longitude})
                            </p>
                        </div>

                        {/* Shape, Color, Rock Type */}
                        <div className="attributes-row">
                            <p>
                                <b>Shape:</b> {sample.shape}
                            </p>
                            <p>
                                <b>Color:</b> {sample.color}
                            </p>
                            <p>
                                <b>Rock Type:</b> {sample.rockType}
                            </p>
                        </div>

                        {/* Photo and Description */}
                        <div className="photo-description">
                            {sample.photoJpg && (
                                <img
                                    src={sample.photoJpg}
                                    alt="Sample"
                                    className="photo"
                                />
                            )}
                            <textarea
                                readOnly
                                value={sample.description}
                                className="description-box"
                            ></textarea>
                        </div>

                        {/* Composition Bar */}
                        <div className="composition-bar">
                            {Object.entries(sample.elementalComposition).map(
                                ([key, value]) => (
                                    <div
                                        key={key}
                                        className="composition-item"
                                        style={{ flex: value }}
                                    >
                                        {key}: {value}%
                                    </div>
                                )
                            )}
                        </div>

                        {/* Export and Delete Buttons */}
                        <div className="actions">
                            <button className="export-button">Export</button>
                            <button
                                className="delete-button"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default GeosampleDetail;
