import { intersects } from "@arcgis/core/geometry/geometryEngine";
import { hospitalLayer, earthquakeM6Layer } from "../layers";

export const queryHospitalsUnderDamage = async (filterExpression = "damage IN (3, 3.5)") => {
    try {
        console.log(`Using filter expression: ${filterExpression}`);
        
        const hospitalResult = await hospitalLayer.queryFeatures({
            where: "1=1", // Adjust query as needed
            outFields: ["*"],
            returnGeometry: true,
        });
        console.log(`Queried hospitals: ${hospitalResult.features.length}`);

        const earthquakeResult = await earthquakeM6Layer.queryFeatures({
            where: filterExpression, // Use the provided filter
            outFields: ["*"],
            returnGeometry: true,
        });
        console.log(`Queried earthquakes areas: ${earthquakeResult.features.length}`);

        const hospitalsUnderDamage = [];
        earthquakeResult.features.forEach((earthquakeFeature) => {
            hospitalResult.features.forEach((hospitalFeature) => {
                if (intersects(earthquakeFeature.geometry, hospitalFeature.geometry)) {
                    hospitalsUnderDamage.push({
                        damage: earthquakeFeature.attributes.damage,
                        hospital: hospitalFeature.attributes,
                        geometry: hospitalFeature.geometry,
                    });
                }
            });
        });

        console.log(`Hospitals under damage: ${hospitalsUnderDamage.length}`);
        return hospitalsUnderDamage;

    } catch (error) {
        console.error("Error querying features:", error);
        throw error;
    }
};
