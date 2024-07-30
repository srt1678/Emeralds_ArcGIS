import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import { neighborhoodLayer } from "../layers";

export const queryNeighborhoodGeometries = async (neighborhoodIds) => {
    try {
        // console.log("Querying neighborhoods with IDs:", neighborhoodIds);
        const whereClause = neighborhoodIds.map(id => {
            const numericId = parseFloat(id);
            const lowerBound = (numericId - 0.05).toFixed(2);
            const upperBound = (numericId + 0.05).toFixed(2);
            return `(CRA_NO >= ${lowerBound} AND CRA_NO < ${upperBound})`;
        }).join(" OR ");
        
        const queryResult = await neighborhoodLayer.queryFeatures({
            where: whereClause,
            outFields: ["CRA_NO", "GEN_ALIAS"],
            returnGeometry: true
        });

        // console.log("Query results:", JSON.stringify(queryResult.features, null, 2));
        return queryResult.features;
    } catch (error) {
        console.error("Error querying neighborhood geometries:", error);
        return [];
    }
};
