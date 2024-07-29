import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Query from "@arcgis/core/rest/support/Query";
import { populationLayer } from "../layers";
import Polyline from "@arcgis/core/geometry/Polyline";

export const queryPopulation = async (features) => {
    // console.log("Starting queryPopulation with features:", features);

    if (!features || features.length === 0) {
        // console.warn("No features provided to queryPopulation");
        return [];
    }

    const populationResults = [];

    for (const feature of features) {
        // console.log("Processing feature:", feature);

        if (!feature.geometry) {
            console.warn("Feature has no geometry:", feature);
            continue;
        }

        const query = new Query({
            geometry: feature.geometry,
            spatialRelationship: "intersects",
            outFields: ["GEOID", "B01001_001E"],
            returnGeometry: false,
        });

        try {
            // console.log("Querying population layer with:", query);
            const results = await populationLayer.queryFeatures(query);
            // console.log("Query results:", results);

            if (results.features.length === 0) {
                console.warn("No intersecting features found for:", feature);
            }

            let totalPopulation = 0;
            results.features.forEach((populationFeature) => {
                totalPopulation +=
                    populationFeature.attributes.B01001_001E || 0;
            });

            populationResults.push({
                feature: feature,
                population: totalPopulation,
            });
        } catch (error) {
            console.error(
                `Error querying population for feature:`,
                feature,
                error
            );
            populationResults.push({
                feature: feature,
                population: null,
                error: error.message,
            });
        }
    }

    return populationResults;
};

export const queryPopulationAlongRoute = async (routeGeometry) => {
    if (
        !routeGeometry ||
        !routeGeometry.paths ||
        routeGeometry.paths.length === 0
    ) {
        console.warn(
            "Invalid route geometry provided to queryPopulationAlongRoute"
        );
        return 0;
    }

    try {
        const polyline = new Polyline({
            paths: routeGeometry.paths,
            spatialReference: routeGeometry.spatialReference,
        });

        // Expand the extent to ensure we catch all relevant features
        const expandedExtent = polyline.extent.expand(1.5);

        const query = new Query({
            geometry: expandedExtent,
            spatialRelationship: "intersects",
            outFields: ["GEOID", "B01001_001E"],
            returnGeometry: false,
        });

        const results = await populationLayer.queryFeatures(query);

        if (results.features.length === 0) {
            console.warn("No population features found near the route");
            return 0;
        }

        let totalPopulation = 0;
        results.features.forEach((populationFeature) => {
            totalPopulation += populationFeature.attributes.B01001_001E || 0;
        });

        return totalPopulation;
    } catch (error) {
        console.error("Error in queryPopulationAlongRoute:", error);
        console.error("Route geometry:", JSON.stringify(routeGeometry));
        return 0;
    }
};
