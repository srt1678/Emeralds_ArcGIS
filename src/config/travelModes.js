// travelModes.js

export const walkingMode = {
    distanceAttributeName: "Kilometers",
    description:
        "Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.",
    impedanceAttributeName: "Kilometers",
    // simplificationToleranceUnits: "esriMeters",
    // uturnAtJunctions: "esriNFSBAllowBacktrack",
    useHierarchy: false,
    name: "Walking Distance",
    simplificationTolerance: 2,
    timeAttributeName: "WalkTime",
    restrictionAttributeNames: [
        "Avoid Private Roads",
        "Avoid Roads Unsuitable for Pedestrians",
        "Preferred for Pedestrians",
        "Avoid Ferries",
        "Walking",
    ],
    type: "walk",
    id: "yFuMFwIYblqKEefX",
    attributeParameterValues: [
        {
            parameterName: "Restriction Usage",
            attributeName: "Avoid Private Roads",
            value: "AVOID_MEDIUM",
        },
        {
            parameterName: "Restriction Usage",
            attributeName: "Walking",
            value: "PROHIBITED",
        },
        {
            parameterName: "Restriction Usage",
            attributeName: "Avoid Ferries",
            value: "PROHIBITED",
        },
        {
            parameterName: "Restriction Usage",
            attributeName: "Preferred for Pedestrians",
            value: "PREFER_LOW",
        },
        {
            parameterName: "Walking Speed (km/h)",
            attributeName: "WalkTime",
            value: 5,
        },
        {
            parameterName: "Restriction Usage",
            attributeName: "Avoid Roads Unsuitable for Pedestrians",
            value: "AVOID_HIGH",
        },
    ],
};



export const drivingModeWithHighways = {
    distanceAttributeName: "Kilometers",
    description: "Follows roads and finds solutions that optimize travel time for automobiles.",
    impedanceAttributeName: "TravelTime",
    useHierarchy: true,
    simplificationTolerance: 10,
    timeAttributeName: "TravelTime",
    type: "automobile",
    id: "FEwLMpmQSxnxfFt8",
    name: "Driving Time (With Highways)",
    restrictionAttributeNames: [
        "Driving an Automobile",
        "Avoid Ferries"
    ],
    attributeParameterValues: [
        // {
        //     attributeName: "Driving an Automobile",
        //     parameterName: "Restriction Usage",
        //     value: "ALLOWED"
        // },
        // {
        //     attributeName: "TravelTime",
        //     parameterName: "Vehicle Maximum Speed (km/h)",
        //     value: 120
        // }
    ]
};

export const drivingModeAvoidHighways = {
    distanceAttributeName: "Kilometers",
    description: "Follows roads and finds solutions that optimize travel time for automobiles.",
    impedanceAttributeName: "TravelTime",
    useHierarchy: true,
    simplificationTolerance: 10,
    timeAttributeName: "TravelTime",
    type: "automobile",
    id: "FEwLMpmQSxnxfFt8",
    name: "Driving Time (Avoid Highways)",
    restrictionAttributeNames: [
        "Avoid Limited Access Roads",
        "Avoid Express Lanes",
        "Avoid Toll Roads",
        "Driving an Automobile",
        "Avoid Ferries"
    ],
    attributeParameterValues: [
        {
            attributeName: "Avoid Limited Access Roads",
            parameterName: "Restriction Usage",
            value: "PROHIBITED"
        },
        {
            attributeName: "Avoid Express Lanes",
            parameterName: "Restriction Usage",
            value: "PROHIBITED"
        },
        {
            attributeName: "Avoid Toll Roads",
            parameterName: "Restriction Usage",
            value: "PROHIBITED"
        },
        // {
        //     attributeName: "Driving an Automobile",
        //     parameterName: "Restriction Usage",
        //     value: "ALLOWED"
        // },
        // {
        //     attributeName: "TravelTime",
        //     parameterName: "Vehicle Maximum Speed (km/h)",
        //     value: 120
        // }
    ]
};
