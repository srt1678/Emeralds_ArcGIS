// config/infrastructureConfig.js
import { hospitalLayer, fireStationLayer } from "../layers";

export const infrastructureTypes = {
    hospital: {
        layer: hospitalLayer,
        name: "Hospital",
        symbol: {
            type: "simple-marker",
            color: [255, 0, 0],
            size: 12,
        },
    },
    fireStation: {
        layer: fireStationLayer,
        name: "Fire Station",
        symbol: {
            type: "simple-marker",
            color: [0, 255, 0],
            size: 12,
        },
    },
    // Add more infrastructure types as needed
};
