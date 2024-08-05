// infrastructureLayers.js
import {
    hospitalLayer,
    fireStationLayer,
    privateSchoolsLayer,
    publicSchoolsLayer,
} from "../layers";

export const infrastructureLayers = {
    hospitalLayer: {
        layer: hospitalLayer,
        name: "Hospitals",
    },
    fireStationLayer: {
        layer: fireStationLayer,
        name: "Fire Stations",
    },
    privateSchoolsLayer: {
        layer: privateSchoolsLayer,
        name: "Private Schools",
    },
    publicSchoolsLayer: {
        layer: publicSchoolsLayer,
        name: "Public Schools"
    }
};
