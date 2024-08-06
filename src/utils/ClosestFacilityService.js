// import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
// import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters";
// import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
// import Graphic from "@arcgis/core/Graphic";
// import { queryPopulationAlongRoute } from "./PopulationService";
// import TravelMode from "@arcgis/core/rest/support/TravelMode";

// export const findClosestFacilities = async (
//     incident,
//     facilityLayer,
//     view,
//     maxFacilities = 5,
//     travelTime = 30, // travel time of 30 min
//     bufferDistance = 10, // buffer distance in meters
//     avoidHighways = false,
//     travelModeType = "Driving Time",
//     impedanceAttribute = "TravelTime"
// ) => {
//     console.log(
//         "findClosestFacilities called with avoidHighways:",
//         avoidHighways
//     );
//     const url =
//         "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

//     const incidentFeature = new Graphic({
//         geometry: incident.geometry,
//         attributes: {
//             ObjectID: 1,
//             ...incident.attributes,
//         },
//     });

//     const facilities = await facilityLayer.queryFeatures({
//         where: "1=1",
//         outFields: ["*"],
//         returnGeometry: true,
//     });

//     // console.log(JSON.stringify(facilities, 2, null));
//     const restrictionAttributes = [];
//     const attributeParameterValues = [];

//     if (avoidHighways) {
//         restrictionAttributes.push(
//             "Avoid Limited Access Roads",
//             "Avoid Express Lanes",
//             "Avoid Toll Roads"
//         );
//         attributeParameterValues.push(
//             {
//                 attributeName: "Avoid Limited Access Roads",
//                 parameterName: "Restriction Usage",
//                 value: "Prohibited",
//             },
//             {
//                 attributeName: "Avoid Express Lanes",
//                 parameterName: "Restriction Usage",
//                 value: "Prohibited",
//             },
//             {
//                 attributeName: "Avoid Toll Roads",
//                 parameterName: "Restriction Usage",
//                 value: "Prohibited",
//             }
//         );
//     }

//     if (travelModeType === "Walking Time") {
//         restrictionAttributes.push(
//             "Avoid Roads Unsuitable for Pedestrians",
//             "Preferred for Pedestrians"
//         );
//         attributeParameterValues.push(
//             {
//                 attributeName: "Avoid Roads Unsuitable for Pedestrians",
//                 parameterName: "Restriction Usage",
//                 value: "Avoid_High",
//             },
//             {
//                 attributeName: "Preferred for Pedestrians",
//                 parameterName: "Restriction Usage",
//                 value: "Prefer_High",
//             },
//             {
//                 attributeName: "WalkTime",
//                 parameterName: "Walking Speed (km/h)",
//                 value: 5,
//             }
//         );
//     } else {
//         restrictionAttributes.push("Driving an Automobile");
//         attributeParameterValues.push({
//             attributeName: "Driving an Automobile",
//             parameterName: "Restriction Usage",
//             value: "Prohibited",
//         });
//     }
//     console.log("Number of facilities:", facilities.features.length);

//     const params = new ClosestFacilityParameters({
//         incidents: new FeatureSet({
//             features: [incidentFeature],
//         }),
//         facilities: new FeatureSet({
//             features: facilities.features,
//         }),
//         returnRoutes: true,
//         returnFacilities: true,
//         defaultTargetFacilityCount: maxFacilities,
//         defaultCutoff: travelTime,
//         // restrictionAttributes: restrictionAttributes,
//         attributeParameterValues: attributeParameterValues,
//     });

//     const addedGraphics = [];

//     try {
//         const results = await closestFacility.solve(url, params);

//         const facilitiesResult = results.facilities
//             ? results.facilities.features
//             : [];
//         const routesResult = results.routes ? results.routes.features : [];

//         const routesWithPopulation = await Promise.all(
//             routesResult.map(async (route) => {
//                 try {
//                     const population = await queryPopulationAlongRoute(
//                         route.geometry
//                     );
//                     return {
//                         facilityId: route.attributes.FacilityID,
//                         population,
//                     };
//                 } catch (error) {
//                     console.error(
//                         "Error calculating population for route:",
//                         error
//                     );
//                     return {
//                         facilityId: route.attributes.FacilityID,
//                         population: 0,
//                     };
//                 }
//             })
//         );

//         const facilityPopulationMap = new Map();
//         routesWithPopulation.forEach((route) => {
//             facilityPopulationMap.set(route.facilityId, route.population);
//         });

//         const sortedRoutes = routesResult.sort((a, b) => {
//             const populationA =
//                 facilityPopulationMap.get(a.attributes.FacilityID) || 0;
//             const populationB =
//                 facilityPopulationMap.get(b.attributes.FacilityID) || 0;
//             return populationB - populationA;
//         });

//         const closestRoutes = sortedRoutes.slice(0, maxFacilities);

//         const closestFacilities = closestRoutes.map((route) => {
//             return facilitiesResult.find(
//                 (facility) =>
//                     facility.attributes.ObjectID === route.attributes.FacilityID
//             );
//         });

//         showRoutes(closestRoutes, view);
//         addIncidentGraphic(incident.geometry, view);
//         addFacilityGraphics(closestFacilities, view);

//         return {
//             facilities: closestFacilities,
//             routes: closestRoutes,
//             addedGraphics: addedGraphics,
//         };
//     } catch (error) {
//         console.error("Error solving closest facility:", error);
//         if (error.details) {
//             console.error("Error details:", error.details);
//         }
//         throw error;
//     }

//     function showRoutes(routes, view) {
//         routes.forEach((route, index) => {
//             const routeGraphic = new Graphic({
//                 geometry: route.geometry,
//                 symbol: {
//                     type: "simple-line",
//                     color: index === 0 ? [0, 255, 0, 0.7] : [255, 0, 0, 0.5],
//                     width: index === 0 ? 6 : 4,
//                 },
//             });
//             view.graphics.add(routeGraphic);
//             addedGraphics.push(routeGraphic);
//         });

//         const graphicsExtent = view.graphics.extent;
//         if (graphicsExtent) {
//             view.goTo(graphicsExtent.expand(1.2));
//         }
//     }

//     function addIncidentGraphic(point, view) {
//         const graphic = new Graphic({
//             symbol: {
//                 type: "simple-marker",
//                 color: [255, 255, 255, 1.0],
//                 size: 8,
//                 outline: {
//                     color: [50, 50, 50],
//                     width: 1,
//                 },
//             },
//             geometry: point,
//         });
//         view.graphics.add(graphic);
//         addedGraphics.push(graphic);
//     }

//     function addFacilityGraphics(facilities, view) {
//         facilities.forEach((facility) => {
//             const facilityGraphic = new Graphic({
//                 symbol: {
//                     type: "simple-marker",
//                     color: [0, 255, 0],
//                     size: 8,
//                     outline: {
//                         color: [50, 50, 50],
//                         width: 1,
//                     },
//                 },
//                 geometry: facility.geometry,
//             });
//             view.graphics.add(facilityGraphic);
//             addedGraphics.push(facilityGraphic);
//         });
//     }
// };

import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import { queryPopulationAlongRoute } from "./PopulationService";
// import TravelMode from "@arcgis/core/rest/support/TravelMode";
import {
    walkingMode,
    drivingModeWithHighways,
    drivingModeAvoidHighways,
} from "../config/travelModes";

export const findClosestFacilities = async (
    incident,
    facilityLayer,
    view,
    maxFacilities = 5,
    travelTime = 30, // travel time of 30 min
    bufferDistance = 10, // buffer distance in meters
    avoidHighways = false,
    travelModeType = "Driving",
    impedanceAttribute = "TravelTime"
) => {
    console.log(
        "findClosestFacilities called with avoidHighways:",
        avoidHighways
    );
    const url =
        "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

    const incidentFeature = new Graphic({
        geometry: incident.geometry,
        attributes: {
            ObjectID: 1,
            ...incident.attributes,
        },
    });

    const facilities = await facilityLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
    });

    // Get the fields from the facility layer
    const facilityFields = facilityLayer.fields.map((field) => ({
        name: field.name,
        type: field.type,
    }));

    // console.log(JSON.stringify(facilities, 2, null));
    let travelModeConfig;
    if (travelModeType === "Walking") {
        travelModeConfig = walkingMode;
    } else {
        travelModeConfig = avoidHighways
            ? drivingModeAvoidHighways
            : drivingModeWithHighways;
    }

    console.log("Number of facilities:", facilities.features.length);

    const params = new ClosestFacilityParameters({
        incidents: new FeatureSet({
            features: [incidentFeature],
        }),
        facilities: new FeatureSet({
            features: facilities.features,
            fields: facilityFields
        }),
        returnRoutes: true,
        returnFacilities: true,
        defaultTargetFacilityCount: maxFacilities,
        defaultCutoff: travelTime,
        travelMode: travelModeConfig,
    });

    const addedGraphics = [];

    try {
        
        const results = await closestFacility.solve(url, params);

        const facilitiesResult = results.facilities
            ? results.facilities.features
            : [];
        const routesResult = results.routes ? results.routes.features : [];

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

        const facilityPopulationMap = new Map();
        routesWithPopulation.forEach((route) => {
            facilityPopulationMap.set(route.facilityId, route.population);
        });

        const sortedRoutes = routesResult.sort((a, b) => {
            const populationA =
                facilityPopulationMap.get(a.attributes.FacilityID) || 0;
            const populationB =
                facilityPopulationMap.get(b.attributes.FacilityID) || 0;
            return populationB - populationA;
        });

        const closestRoutes = sortedRoutes.slice(0, maxFacilities);

        const closestFacilities = closestRoutes.map((route) => {
            return facilitiesResult.find(
                (facility) =>
                    facility.attributes.ObjectID === route.attributes.FacilityID
            );
        });

        showRoutes(closestRoutes, view);
        addIncidentGraphic(incident.geometry, view);
        addFacilityGraphics(closestFacilities, view);

        return {
            facilities: closestFacilities,
            routes: closestRoutes,
            addedGraphics: addedGraphics,
        };
    } catch (error) {
        console.error("Error solving closest facility:", error);
        if (error.details) {
            console.error("Error details:", error.details);
        }
        throw error;
    }

    function showRoutes(routes, view) {
        routes.forEach((route, index) => {
            const routeGraphic = new Graphic({
                geometry: route.geometry,
                symbol: {
                    type: "simple-line",
                    color: index === 0 ? [0, 255, 0, 0.7] : [255, 0, 0, 0.5],
                    width: index === 0 ? 6 : 4,
                },
            });
            view.graphics.add(routeGraphic);
            addedGraphics.push(routeGraphic);
        });

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
        addedGraphics.push(graphic);
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
            addedGraphics.push(facilityGraphic);
        });
    }
};
