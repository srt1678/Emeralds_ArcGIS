import { queryEarthquakeFeatures } from "./EarthquakeService";
import { intersects } from "@arcgis/core/geometry/geometryEngine";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";

export const queryFeaturesUnderDamage = async (
    earthquakeLayer,
    infraLayer,
    damageValues,
    damageField,
    neighborhoodGeometries,
    customGeometry
) => {
    try {
        // Ensure the projection module is loaded
        await projection.load();
        // console.log(earthquakeLayer.title)
        // Check if damageValues is null, undefined, or an empty array
        if (earthquakeLayer.title != "Custom Earthquake Scenario") {
            if (damageValues == null || damageValues.length === 0) {
                console.log("No damage values provided, skipping query.");
                return [];
            }
        }
        
        // console.log(JSON.stringify(infraLayer, null, 2));

        let featuresUnderDamage = [];

        // Query infrastructure features
        const infraFeatures = await infraLayer.queryFeatures({
            where: "1=1", // Adjust query as needed
            outFields: ["*"],
            returnGeometry: true,
        });
        
        if (customGeometry) {
            // Reproject customGeometry to match the spatial reference of infra features
            const targetSpatialReference =
                infraFeatures.features[0].geometry.spatialReference;
            
            const reprojectedCustomGeometry = projection.project(
                customGeometry,
                targetSpatialReference
            );
            

            // For custom scenario, use the reprojected custom geometry directly
            infraFeatures.features.forEach((infraFeature) => {
                if (infraFeature.geometry === null) return;
                if (
                    intersects(reprojectedCustomGeometry, infraFeature.geometry)
                ) {
                    featuresUnderDamage.push({
                        feature: infraFeature.attributes,
                        geometry: infraFeature.geometry,
                    });
                }
            });
        } else {
            // For M6 and M7 scenarios, use the existing logic
            const earthquakeFeatures = await queryEarthquakeFeatures(
                earthquakeLayer,
                damageValues,
                damageField,
                neighborhoodGeometries
            );
            // console.log(JSON.stringify(infraFeatures, null, 2))
            
            earthquakeFeatures.forEach((earthquakeFeature) => {
                infraFeatures.features.forEach((infraFeature) => {
                    // console.log(JSON.stringify(infraFeature.geometry))
                    if (infraFeature.geometry === null) return;
                    if (
                        intersects(
                            earthquakeFeature.geometry,
                            infraFeature.geometry
                        )
                    ) {
                        featuresUnderDamage.push({
                            damage: earthquakeFeature.attributes[damageField],
                            feature: infraFeature.attributes,
                            geometry: infraFeature.geometry,
                        });
                    }
                });
            });
        }

        console.log(
            "Features Under Damage:",
            featuresUnderDamage.length,
            featuresUnderDamage
        );
        // console.log(JSON.stringify(featuresUnderDamage, null, 2));
        return featuresUnderDamage;
    } catch (error) {
        console.error("Error querying features under damage:", error);
        throw error;
    }
};
