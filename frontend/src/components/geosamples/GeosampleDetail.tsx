import React from "react";
import {
    Dropdown,
    Input,
    Button,
    Switch,
    Option,
} from "@fluentui/react-components";
import {
    StarRegular,
    StarFilled,
    BookmarkRegular,
    BookmarkFilled,
    CalendarRegular,
    ClockRegular,
    LocationRegular,
    GlobeSurfaceRegular,
    DeleteRegular,
} from "@fluentui/react-icons";
import {
    type Geosample,
    type SampleElement,
    sampleColors,
    sampleShapes,
    sampleElementColors,
    isSampleColor,
    isSampleShape,
    shapeImages,
} from "./GeosampleTypes";

// TODO: Swap with Varun's map component
import mapImage from "assets/map-sample.png";
// TODO: Swap with real data
import rockImage from "assets/rock-sample.png";

const ElementDisplay = ({ element }: { element: SampleElement }) => {
    // If element is "Other" or doesn't contain numbers, render it as-is
    if (element === "Other" || !/\d/.test(element)) {
        return <div className="mb-1 font-bold">{element}</div>;
    }

    // For elements with numbers, split and format with subscripts
    const parts: React.ReactNode[] = [];
    let currentText = "";
    let currentNumber = "";

    for (let i = 0; i < element.length; i++) {
        const char = element[i];

        // Check if the character is a digit
        if (/\d/.test(char)) {
            // If we have text accumulated, add it to parts
            if (currentText) {
                parts.push(currentText);
                currentText = "";
            }
            // Accumulate digits
            currentNumber += char;
        } else {
            // If we have a number accumulated, add it as subscript
            if (currentNumber) {
                parts.push(
                    <sub key={`sub-${parts.length}`}>{currentNumber}</sub>,
                );
                currentNumber = "";
            }
            // Accumulate text
            currentText += char;
        }
    }

    // Add any remaining text or number
    if (currentText) {
        parts.push(currentText);
    }
    if (currentNumber) {
        parts.push(<sub key={`sub-${parts.length}`}>{currentNumber}</sub>);
    }

    return <div className="mb-1 font-bold">{parts}</div>;
};

const CompositionBar = ({
    elements,
}: {
    elements: { element: SampleElement; percentage: number; color: string }[];
}) => {
    return (
        <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-gray-400">Composition</label>
                <div className="flex items-center gap-2">
                    <span>Approximate (%)</span>
                    <Switch defaultChecked />
                </div>
            </div>
            <div className="mb-2 flex h-5 overflow-hidden rounded">
                {/* Composition color bars */}
                {elements.map(({ element, percentage, color }) => (
                    <div
                        key={element}
                        className={`h-full ${color}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                ))}
            </div>
            <div className="mt-2 grid grid-cols-10 gap-1">
                {/* Composition labels */}
                {elements.map(({ element, percentage }) => (
                    <div
                        key={element}
                        className="flex flex-col items-center text-center text-xs"
                    >
                        <ElementDisplay element={element} />
                        <div className="text-gray-400">{percentage}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

type GeosampleDetailProps = {
    sample: Geosample;
    onUpdate: (sample: Geosample) => void;
    onDelete: () => void;
};

const GeosampleDetail = ({
    sample,
    onUpdate: updateSample,
}: GeosampleDetailProps) => {
    return (
        // Max height and scrollable content
        <div className="overflow-scroll bg-gray-900 p-5 font-sans text-white">
            {/* Header with title and actions */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center">
                    <h2 className="m-0 mr-2">Geo Sample {sample.id}</h2>
                    <div className="flex">
                        <Button
                            appearance="subtle"
                            icon={
                                sample.starred ? (
                                    <StarFilled color="yellow" />
                                ) : (
                                    <StarRegular />
                                )
                            }
                            onClick={() =>
                                updateSample({
                                    ...sample,
                                    starred: !sample.starred,
                                })
                            }
                        />
                        <Button
                            appearance="subtle"
                            icon={
                                sample.bookmarked ? (
                                    <BookmarkFilled />
                                ) : (
                                    <BookmarkRegular />
                                )
                            }
                            onClick={() =>
                                updateSample({
                                    ...sample,
                                    bookmarked: !sample.bookmarked,
                                })
                            }
                        />
                    </div>
                </div>
                <Button
                    appearance="primary"
                    iconPosition="before"
                    icon={<DeleteRegular />}
                >
                    Delete
                </Button>
            </div>
            {/* ID, Date/Time, Location section */}
            <div className="mb-5 grid grid-cols-5">
                <div className="flex w-min flex-col">
                    <label className="mb-2 text-sm text-gray-400">ID</label>
                    <Input value={sample.id.toLocaleString("us-en")} readOnly />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Date / Time</label>
                    <div className="flex flex-row">
                        <Input
                            value={new Date(sample.datetime).toLocaleDateString(
                                "us-en",
                            )}
                            readOnly
                            contentBefore={<CalendarRegular />}
                            className="w-min"
                        />
                        <Input
                            value={new Date(
                                sample.datetime,
                            ).toLocaleTimeString()}
                            readOnly
                            contentBefore={<ClockRegular />}
                            className="w-min"
                        />
                    </div>
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Location</label>
                    <div className="flex flex-row">
                        <Input
                            className="w-min"
                            value="Zone A"
                            readOnly
                            contentBefore={<GlobeSurfaceRegular />}
                        />
                        <Input
                            className="w-min"
                            value="42.265869, -83.750031"
                            readOnly
                            contentBefore={<LocationRegular />}
                        />
                    </div>
                </div>
            </div>

            {/* Shape, Rock Type, Color, Sub-Color section */}
            <div className="mb-5">
                <div className="mb-2 grid grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">
                            Shape
                        </label>
                        <Dropdown
                            value={sample.shape}
                            onOptionSelect={(_, value) => {
                                if (isSampleShape(value.optionValue)) {
                                    updateSample({
                                        ...sample,
                                        shape: value.optionValue,
                                    });
                                } else {
                                    console.error(`Invalid color: ${value}`);
                                }
                            }}
                        >
                            {sampleShapes.map((shape) => {
                                const Icon = shapeImages[shape];
                                return (
                                    <Option
                                        key={shape}
                                        value={shape}
                                        text={shape}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-5 w-5" />
                                            <span>{shape}</span>
                                        </div>
                                    </Option>
                                );
                            })}
                        </Dropdown>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">
                            Rock Type
                        </label>
                        <Input value={sample.rockType} />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">
                            Color
                        </label>
                        <Dropdown
                            value={sample.color}
                            onOptionSelect={(_, value) => {
                                if (isSampleColor(value.optionValue)) {
                                    updateSample({
                                        ...sample,
                                        color: value.optionValue,
                                    });
                                } else {
                                    console.error(`Invalid color: ${value}`);
                                }
                            }}
                        >
                            {sampleColors.map((color) => (
                                <Option key={color} value={color}>
                                    {color}
                                </Option>
                            ))}
                        </Dropdown>
                    </div>
                    <div className="relative flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">
                            Sub-Color
                        </label>
                        <Dropdown
                            placeholder="Need to fill"
                            defaultSelectedOptions={["Need to fill"]}
                        />
                        <span className="absolute top-0 right-0 rounded bg-green-700 px-1.5 py-0.5 text-xs text-white">
                            Recommended
                        </span>
                    </div>
                </div>
            </div>

            {/* Photo and Description section */}
            <div className="mb-5 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Photo</label>
                    <div className="h-40 overflow-hidden rounded bg-gray-800">
                        <img
                            src={rockImage}
                            alt="Rock sample"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">
                        Description
                    </label>
                    <textarea
                        value={sample.description}
                        className="h-40 resize-none rounded border-0 bg-gray-800 p-2 text-white"
                        onChange={(e) =>
                            updateSample({
                                ...sample,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            <CompositionBar
                elements={Object.entries(sample.elementalComposition).map(
                    ([element, percentage]) => ({
                        element: element as SampleElement,
                        percentage,
                        color: sampleElementColors[element as SampleElement],
                    }),
                )}
            />

            {/* Map section */}
            <div className="mt-5">
                <img
                    src={mapImage}
                    alt="Location map"
                    className="h-96 w-full rounded object-cover"
                />
            </div>
        </div>
    );
};

export default GeosampleDetail;
