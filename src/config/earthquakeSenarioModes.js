import {
    earthquakeM6Layer,
    earthquakeM7Layer,
    earthquakeCustomScenarioLayer,
} from "../layers";
export const earthquakeScenarioModes = {
    earthquakeM6ImpactMode: {
        layer: earthquakeM6Layer,
        filterField: "damage",
        name: "M6.8 Impact Mode",
    },
    earthquakeM7ImpactMode: {
        layer: earthquakeM7Layer,
        filterField: "damage",
        name: "M7 Impact Mode",
    },
    // Add more modes here
    earthquakeCustomScenarioMode: {
        layer: earthquakeCustomScenarioLayer,
        filterField: null,
        name: "Custom Earthquake Scenario",
    },
};
