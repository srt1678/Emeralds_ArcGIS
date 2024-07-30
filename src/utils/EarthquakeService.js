import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";

// Function to query features from any layer
export const queryEarthquakeFeatures = async (
    layer,
    damageValues,
    damageField,
    neighborhoodGeometries
) => {
    // Create a filter expression based on damage values
    const filterExpression =
        damageValues.length > 0
            ? `${damageField} IN (${damageValues
                  .map((v) => `'${v}'`)
                  .join(", ")})`
            : "1=1"; // Default to all features if no filters are applied

    try {
        // Query features from the specified layer using the filter expression
        const result = await layer.queryFeatures({
            where: filterExpression,
            outFields: ["*"],
            returnGeometry: true,
        });

        const filteredFeatures = result.features.filter(feature => 
            neighborhoodGeometries.some(neighborhood => 
                intersects(feature.geometry, neighborhood.geometry)
            )
        );

        return result.features;
    } catch (error) {
        console.error(`Error querying features from layer ${layer.id}:`, error);
        throw error;
    }
};
// export const queryEarthquakeFeatures = async (
//     layer,
//     damageValues,
//     damageField,
//     pageSize = 1000
// ) => {
//     const filterExpression =
//         damageValues.length > 0
//             ? `${damageField} IN (${damageValues
//                   .map((v) => `'${v}'`)
//                   .join(", ")})`
//             : "1=1";

//     let allFeatures = [];
//     let resultOffset = 0;
//     let moreFeaturesToFetch = true;

//     while (moreFeaturesToFetch) {
//         try {
//             const result = await layer.queryFeatures({
//                 where: filterExpression,
//                 outFields: ["*"],
//                 returnGeometry: true,
//                 resultOffset: resultOffset,
//                 resultRecordCount: pageSize,
//             });

//             allFeatures = allFeatures.concat(result.features);
//             resultOffset += result.features.length;

//             // Check if we've fetched all features
//             if (result.features.length < pageSize) {
//                 moreFeaturesToFetch = false;
//             }
//         } catch (error) {
//             console.error(
//                 `Error querying features from layer ${layer.id}:`,
//                 error
//             );
//             throw error;
//         }
//     }
//     console.log(allFeatures)
//     return allFeatures;
// };
// Function to query barriers from any layer
export const queryFeaturesBarriers = async (
    layer,
    filterExpression = "1=1"
) => {
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
