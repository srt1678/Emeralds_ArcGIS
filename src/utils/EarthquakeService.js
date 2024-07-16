import { earthquakeM6Layer } from "../layers";

// Function to query earthquake features
export const queryEarthquakes = async (filterExpression = "damage IN (3, 3.5)") => {
    try {
        const earthquakeResult = await earthquakeM6Layer.queryFeatures({
            where: filterExpression, // Use the provided filter
            outFields: ["*"],
            returnGeometry: true,
        });
        console.log(`Queried earthquakes areas: ${earthquakeResult.features.length}`);
        return earthquakeResult.features;
    } catch (error) {
        console.error("Error querying earthquake features:", error);
        throw error;
    }
};
