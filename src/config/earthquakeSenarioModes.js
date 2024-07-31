import { earthquakeM6Layer, earthquakeM7Layer } from "../layers";
export const earthquakeScenarioModes = {
    earthquakeM6ImpactMode: {
        layer: earthquakeM6Layer,
        filterField: "damage",
        name: "M6 Impact Mode",
    },
    earthquakeM7ImpactMode: {
        layer: earthquakeM7Layer, 
        filterField: "damage",
        name: "M7 Impact Mode",
    },
    // Add more modes here
};
