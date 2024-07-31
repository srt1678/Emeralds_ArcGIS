import { intersects } from "@arcgis/core/geometry/geometryEngine";
import { hospitalLayer, earthquakeM6Layer } from "../layers";
import { queryEarthquakes } from "./EarthquakeService";

// Function to query hospital features
export const queryHospitals = async () => {
    try {
        const hospitalResult = await hospitalLayer.queryFeatures({
            where: "1=1", // Adjust query as needed
            outFields: ["*"],
            returnGeometry: true,
        });
        // console.log(`Queried hospitals: ${hospitalResult.features.length}`);
        return hospitalResult.features;
    } catch (error) {
        console.error("Error querying hospital features:", error);
        throw error;
    }
};

// Function to query hospitals under damage
export const queryHospitalsUnderDamage = async (
    filterExpression = "damage IN (3, 3.5)"
) => {
    try {
        // console.log("For hospitals under damage");
        // console.log(`Using filter expression: ${filterExpression}`);

        const hospitalFeatures = await queryHospitals();
        const earthquakeFeatures = await queryEarthquakes(filterExpression);

        const hospitalsUnderDamage = [];
        earthquakeFeatures.forEach((earthquakeFeature) => {
            hospitalFeatures.forEach((hospitalFeature) => {
                if (
                    intersects(
                        earthquakeFeature.geometry,
                        hospitalFeature.geometry
                    )
                ) {
                    hospitalsUnderDamage.push({
                        damage: earthquakeFeature.attributes.damage,
                        hospital: hospitalFeature.attributes,
                        geometry: hospitalFeature.geometry,
                    });
                }
            });
        });

        // console.log(`Hospitals under damage: ${hospitalsUnderDamage.length}`);
        return hospitalsUnderDamage;
    } catch (error) {
        console.error("Error querying features:", error);
        throw error;
    }
};


