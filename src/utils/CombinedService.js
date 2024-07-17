import { queryHospitalsUnderDamage } from "./HospitalService";
import { queryEarthquakes } from "./EarthquakeService";

export const queryHospitalsAndEarthquakes = async (filterExpression) => {
    try {
        const hospitalsUnderDamage = await queryHospitalsUnderDamage(filterExpression);
        const earthquakes = await queryEarthquakes(filterExpression);
        return { hospitalsUnderDamage, earthquakes };
    } catch (error) {
        console.error("Error querying data:", error);
        throw error;
    }
};
