import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";

// Function to query features from any layer
export const queryEarthquakeFeatures = async (layer, damageValues, damageField) => {
    // Create a filter expression based on damage values
    const filterExpression = damageValues.length > 0
        ? `${damageField} IN (${damageValues.map((v) => `'${v}'`).join(", ")})`
        : "1=1"; // Default to all features if no filters are applied

    try {
        // Query features from the specified layer using the filter expression
        const result = await layer.queryFeatures({
            where: filterExpression,
            outFields: ["*"],
            returnGeometry: true,
        });

        return result.features;
    } catch (error) {
        console.error(`Error querying features from layer ${layer.id}:`, error);
        throw error;
    }
};

// Function to query barriers from any layer
export const queryFeaturesBarriers = async (layer, filterExpression = "1=1") => {
    try {
        // Query features from the specified layer using the filter expression
        const result = await layer.queryFeatures({
            where: filterExpression,
            outFields: ["damage"], // Only get necessary attribute
            returnGeometry: true,
        });

        // Create polygon barriers from the features
        const polygonBarriers = result.features.map((feature) => {
            return new Graphic({
                geometry: feature.geometry,
                attributes: {
                    BarrierType: 0, // Assuming restriction barrier for this example
                },
            });
        });

        return new FeatureSet({
            features: polygonBarriers,
        });
    } catch (error) {
        console.error(`Error querying barriers from layer ${layer.id}:`, error);
        throw error;
    }
};
