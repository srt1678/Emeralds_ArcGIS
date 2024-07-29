import { queryEarthquakeFeatures } from "./EarthquakeService";
import { intersects } from "@arcgis/core/geometry/geometryEngine";

// Function to query features under damage
export const queryFeaturesUnderDamage = async (earthquakeLayer, infraLayer, damageValues, damageField) => {
    try {
        // Query earthquake features with the specified damage values
        const earthquakeFeatures = await queryEarthquakeFeatures(earthquakeLayer, damageValues, damageField);

        // Query infrastructure features
        const infraFeatures = await infraLayer.queryFeatures({
            where: "1=1", // Adjust query as needed
            outFields: ["*"],
            returnGeometry: true,
        });

        const featuresUnderDamage = [];
        earthquakeFeatures.forEach((earthquakeFeature) => {
            infraFeatures.features.forEach((infraFeature) => {
                // Check if the infrastructure feature intersects with the earthquake feature
                if (intersects(earthquakeFeature.geometry, infraFeature.geometry)) {
                    featuresUnderDamage.push({
                        damage: earthquakeFeature.attributes[damageField],
                        feature: infraFeature.attributes,
                        geometry: infraFeature.geometry,
                    });
                }
            });
        });

        return featuresUnderDamage;
    } catch (error) {
        console.error("Error querying features under damage:", error);
        throw error;
    }
};
