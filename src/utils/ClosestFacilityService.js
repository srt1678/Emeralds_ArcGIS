import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import { checkIncidentFacilityConnection } from "./RouteHelper";
import { queryPopulationAlongRoute } from "./PopulationService";

export const findClosestFacilities = async (
    incident,
    facilityLayer,
    view,
    maxFacilities = 5,
    driveTime = 30, // drive time of 30 min
    bufferDistance = 10 // buffer distance in meters
) => {
    const url =
        "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

    // Create incident feature (e.g., hospital)
    const incidentFeature = new Graphic({
        geometry: incident.geometry,
        attributes: {
            ObjectID: 1,
            ...incident.attributes,
        },
    });
    // Query facilities (e.g., fire stations)
    const facilities = await facilityLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
    });
    console.log("Number of facilities:", facilities.features.length);

    const params = new ClosestFacilityParameters({
        incidents: new FeatureSet({
            features: [incidentFeature],
        }),
        facilities: new FeatureSet({
            features: facilities.features,
        }),
        returnRoutes: true,
        returnFacilities: true,
        defaultTargetFacilityCount: maxFacilities,
        travelTime: driveTime * 60,
    });

    try {
        const results = await closestFacility.solve(url, params);

        const facilitiesResult = results.facilities
            ? results.facilities.features
            : [];
        const routesResult = results.routes ? results.routes.features : [];
        // console.log("Routes result", JSON.stringify(routesResult, null, 2));

        // Calculate population field to each route
        const routesWithPopulation = await Promise.all(
            routesResult.map(async (route) => {
                try {
                    const population = await queryPopulationAlongRoute(
                        route.geometry
                    );
                    return {
                        facilityId: route.attributes.FacilityID,
                        population,
                    };
                } catch (error) {
                    console.error(
                        "Error calculating population for route:",
                        error
                    );
                    return {
                        facilityId: route.attributes.FacilityID,
                        population: 0,
                    };
                }
            })
        );

        // console.log(
        //     routesWithPopulation,
        //     JSON.stringify(routesWithPopulation, null, 2)
        // );
        // Create a mapping of FacilityID to population
        const facilityPopulationMap = new Map();
        routesWithPopulation.forEach((route) => {
            facilityPopulationMap.set(route.facilityId, route.population);
        });

        // Sort routes by population (descending)
        const sortedRoutes = routesResult.sort((a, b) => {
            const populationA =
                facilityPopulationMap.get(a.attributes.FacilityID) || 0;
            const populationB =
                facilityPopulationMap.get(b.attributes.FacilityID) || 0;
            return populationB - populationA;
        });

        // Take the top 'maxFacilities' routes
        const closestRoutes = sortedRoutes.slice(0, maxFacilities);

        // console.log("Routes result", JSON.stringify(closestRoutes, null, 2));

        // Map facilities to the sorted routes
        const closestFacilities = closestRoutes.map((route) => {
            return facilitiesResult.find(
                (facility) =>
                    facility.attributes.ObjectID === route.attributes.FacilityID
            );
        });

        // console.log(
        //     closestFacilities,
        //     JSON.stringify(closestFacilities, null, 2)
        // );

        // Map routes back to the original route results

        showRoutes(closestRoutes, view);
        addIncidentGraphic(incident.geometry, view);
        addFacilityGraphics(closestFacilities, view);

        return {
            facilities: closestFacilities,
            routes: closestRoutes,
        };
    } catch (error) {
        console.error("Error solving closest facility:", error);
        if (error.details) {
            console.error("Error details:", error.details);
        }
        throw error;
    }
};

function showRoutes(routes, view) {
    // view.graphics.removeAll();
    routes.forEach((route, index) => {
        const routeGraphic = new Graphic({
            geometry: route.geometry,
            symbol: {
                type: "simple-line",
                // Best route in green, others in red
                color: index === 0 ? [0, 255, 0, 0.7] : [255, 0, 0, 0.5],
                // Best route slightly thicker
                width: index === 0 ? 6 : 4,
            },
        });
        view.graphics.add(routeGraphic);
    });

    // Zoom to the extent of the graphics
    const graphicsExtent = view.graphics.extent;
    if (graphicsExtent) {
        view.goTo(graphicsExtent.expand(1.2));
    }
}

function addIncidentGraphic(point, view) {
    const graphic = new Graphic({
        symbol: {
            type: "simple-marker",
            color: [255, 255, 255, 1.0],
            size: 8,
            outline: {
                color: [50, 50, 50],
                width: 1,
            },
        },
        geometry: point,
    });
    view.graphics.add(graphic);
}

function addFacilityGraphics(facilities, view) {
    facilities.forEach((facility) => {
        const facilityGraphic = new Graphic({
            symbol: {
                type: "simple-marker",
                color: [0, 255, 0],
                size: 8,
                outline: {
                    color: [50, 50, 50],
                    width: 1,
                },
            },
            geometry: facility.geometry,
        });
        view.graphics.add(facilityGraphic);
    });
}
