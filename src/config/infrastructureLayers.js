// infrastructureLayers.js
import { hospitalLayer, fireStationLayer } from "../layers";

export const infrastructureLayers = {
    hospitalLayer: {
        layer: hospitalLayer,
        name: "Hospitals",
    },
    fireStationLayer: {
        layer: fireStationLayer,
        name: "Fire Stations",
    },
    // Add more layers here
};
