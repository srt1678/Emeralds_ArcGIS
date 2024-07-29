import { earthquakeM6Layer } from "../layers";
export const earthquakeScenarioModes = {
    earthquakeM6ImpactMode: {
        layer: earthquakeM6Layer,
        filterField: "damage",
        name: "M6 Impact Mode",
    },
    // earthquakeM8ImpactMode: {
    //     layer: earthquakeM8Layer, // Assuming you have this layer defined
    //     filterField: "damage",
    //     name: "M8 Impact Mode",
    // },
    // Add more modes here
};
