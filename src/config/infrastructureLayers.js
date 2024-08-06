// infrastructureLayers.js
import {
    hospitalLayer,
    fireStationLayer,
    privateSchoolsLayer,
    publicSchoolsLayer,
    dwwPumpStationsLayer,
    emergencyHubsLayer,
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
        name: "Public Schools",
    },
    dwwPumpStationsLayer: {
        layer: dwwPumpStationsLayer,
        name: "Pump Stations"
    },
    emergencyHubsLayer: {
        layer: emergencyHubsLayer,
        name: "Emergency Hubs"
    }
};
