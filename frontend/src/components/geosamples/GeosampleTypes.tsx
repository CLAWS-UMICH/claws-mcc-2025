export type Locatable = {
    latitude: number;
    longitude: number;
};

export const sampleElements = [
    "SiO2",
    "TiO2",
    "Ai2O3",
    "FeO",
    "MnO",
    "MgO",
    "CaO",
    "K2O",
    "P2O3",
    "Other",
] as const;

export type SampleElement = (typeof sampleElements)[number];

export const isSampleElement = (
    element: string | null | undefined,
): element is SampleElement => {
    if (element === null || element === undefined) {
        return false;
    }
    return sampleElements.includes(element as SampleElement);
};

export const sampleElementColors: Record<SampleElement, string> = {
    SiO2: "bg-purple-700",
    TiO2: "bg-red-500",
    Ai2O3: "bg-red-700",
    FeO: "bg-red-900",
    MnO: "bg-blue-600",
    MgO: "bg-green-500",
    CaO: "bg-purple-800",
    K2O: "bg-yellow-500",
    P2O3: "bg-green-800",
    Other: "bg-orange-500",
};

export const sampleShapes = [
    "Hexagon",
    "Circle",
    "Square",
    "Triangle",
] as const;

export const isSampleShape = (
    shape: string | null | undefined,
): shape is SampleShape => {
    if (shape === null || shape === undefined) {
        return false;
    }
    return sampleShapes.includes(shape as SampleShape);
};

export const sampleColors = [
    "Brown",
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Gold",
    "Silver",
    "Purple",
] as const;

export const isSampleColor = (
    color: string | null | undefined,
): color is SampleColor => {
    if (color === null || color === undefined) {
        return false;
    }
    return sampleColors.includes(color as SampleColor);
};

export type SampleShape = (typeof sampleShapes)[number];

export const shapeImages: Record<
    SampleShape,
    (props: React.SVGProps<SVGSVGElement>) => JSX.Element
> = {
    Hexagon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M2.46148 12.8001C2.29321 12.5087 2.20908 12.3629 2.17615 12.208C2.14701 12.0709 2.14701 11.9293 2.17615 11.7922C2.20908 11.6373 2.29321 11.4915 2.46148 11.2001L6.53772 4.13984C6.70598 3.8484 6.79011 3.70268 6.90782 3.5967C7.01196 3.50293 7.13465 3.43209 7.26793 3.38879C7.41856 3.33984 7.58683 3.33984 7.92336 3.33984H16.0758C16.4124 3.33984 16.5806 3.33984 16.7313 3.38879C16.8645 3.43209 16.9872 3.50293 17.0914 3.5967C17.2091 3.70268 17.2932 3.8484 17.4615 4.13984L21.5377 11.2001C21.706 11.4915 21.7901 11.6373 21.823 11.7922C21.8522 11.9293 21.8522 12.0709 21.823 12.208C21.7901 12.3629 21.706 12.5087 21.5377 12.8001L17.4615 19.8604C17.2932 20.1518 17.2091 20.2975 17.0914 20.4035C16.9872 20.4973 16.8645 20.5681 16.7313 20.6114C16.5806 20.6604 16.4124 20.6604 16.0758 20.6604H7.92336C7.58683 20.6604 7.41856 20.6604 7.26793 20.6114C7.13465 20.5681 7.01196 20.4973 6.90782 20.4035C6.79011 20.2975 6.70598 20.1518 6.53772 19.8604L2.46148 12.8001Z"
                stroke="white"
                stroke-width="2"
                stroke-linejoin="round"
            />
        </svg>
    ),
    Circle: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    ),
    Square: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    ),
    Triangle: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g stroke-width="0"></g>
            <g stroke-linecap="round" stroke-linejoin="round"></g>
            <g>
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.0001 5.94363L4.76627 18H19.2339L12.0001 5.94363ZM10.7138 4.20006C11.2964 3.22905 12.7037 3.22905 13.2863 4.20006L21.4032 17.7282C22.0031 18.728 21.2829 20 20.117 20H3.88318C2.71724 20 1.99706 18.728 2.59694 17.7282L10.7138 4.20006Z"
                    fill="#ffffff"
                ></path>
            </g>
        </svg>
    ),
} as const;

export type SampleColor = (typeof sampleColors)[number];

export type Geosample = {
    id: number;
    zoneId: string;
    starred: boolean;
    bookmarked: boolean;
    datetime: string;
    color: SampleColor;
    subcolor: string;
    shape: SampleShape;
    rockType: string;
    author: number;
    description: string;
    photoJpg: string;
    elementalComposition: Record<SampleElement, number>;
} & Locatable;

// export interface GeosamplesEvents {}
