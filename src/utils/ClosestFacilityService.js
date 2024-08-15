import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import { queryPopulationAlongRoute } from "./PopulationService";
import * as projection from "@arcgis/core/geometry/projection";
import {
    walkingMode,
    drivingModeWithHighways,
    drivingModeAvoidHighways,
} from "../config/travelModes";

const URL = "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

async function prepareIncidentFeature(incident, facilityLayerSR) {
    await projection.load();
    const projectedGeometry = projection.project(incident.geometry, facilityLayerSR);
    return new Graphic({
        geometry: projectedGeometry,
        attributes: {
            ObjectID: 1,
            ...incident.attributes,
        },
    });
}

function getTravelModeConfig(travelModeType, avoidHighways, impedanceAttribute) {
    let travelModeConfig;
    if (travelModeType === "Walking") {
        travelModeConfig = walkingMode;
        if (impedanceAttribute === "TravelTime") {
            travelModeConfig.impedanceAttributeName = "WalkTime";
        }
    } else {
        travelModeConfig = avoidHighways ? drivingModeAvoidHighways : drivingModeWithHighways;
        if (impedanceAttribute !== "TravelTime") {
            travelModeConfig.impedanceAttributeName = "Kilometers";
        }
    }
    return travelModeConfig;
}

async function performClosestFacilityAnalysis(params) {
    const results = await closestFacility.solve(URL, params);

    const facilitiesResult = results.facilities ? results.facilities.features : [];
    const routesResult = results.routes ? results.routes.features : [];

    const routesWithPopulation = await Promise.all(
        routesResult.map(async (route) => {
            try {
                const population = await queryPopulationAlongRoute(route.geometry);
                return { facilityId: route.attributes.FacilityID, population };
            } catch (error) {
                console.error("Error calculating population for route:", error);
                return { facilityId: route.attributes.FacilityID, population: 0 };
            }
        })
    );

    const facilityPopulationMap = new Map(
        routesWithPopulation.map(({ facilityId, population }) => [facilityId, population])
    );

    const sortedRoutes = routesResult.sort((a, b) => {
        const populationA = facilityPopulationMap.get(a.attributes.FacilityID) || 0;
        const populationB = facilityPopulationMap.get(b.attributes.FacilityID) || 0;
        return populationB - populationA;
    });

    const closestRoutes = sortedRoutes.slice(0, params.defaultTargetFacilityCount);
    const closestFacilities = closestRoutes.map((route) =>
        facilitiesResult.find((facility) => facility.attributes.ObjectID === route.attributes.FacilityID)
    );

    return { closestFacilities, closestRoutes };
}

function addGraphicsToView(view, routes, incidentGeometry, facilities) {
    const addedGraphics = [];

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

    const incidentGraphic = new Graphic({
        symbol: {
            type: "simple-marker",
            color: [255, 255, 255, 1.0],
            size: 8,
            outline: { color: [50, 50, 50], width: 1 },
        },
        geometry: incidentGeometry,
    });
    view.graphics.add(incidentGraphic);
    addedGraphics.push(incidentGraphic);

    facilities.forEach((facility) => {
        const facilityGraphic = new Graphic({
            symbol: {
                type: "simple-marker",
                color: [0, 255, 0],
                size: 8,
                outline: { color: [50, 50, 50], width: 1 },
            },
            geometry: facility.geometry,
        });
        view.graphics.add(facilityGraphic);
        addedGraphics.push(facilityGraphic);
    });

    const graphicsExtent = view.graphics.extent;
    if (graphicsExtent) {
        view.goTo(graphicsExtent.expand(1.2));
    }

    return addedGraphics;
}

export async function findClosestFacilities(
    incident,
    facilityLayer,
    view,
    maxFacilities = 5,
    travelTime = 30,
    bufferDistance = 10,
    avoidHighways = false,
    travelModeType = "Driving",
    impedanceAttribute = "TravelTime",
    isCustomSearch = false,
    searchResult = null
) {
    let incidentFeature;

    if (isCustomSearch && searchResult) {
        incidentFeature = await prepareIncidentFeature(searchResult.feature, facilityLayer.spatialReference);
    } else {
        incidentFeature = new Graphic({
            geometry: incident.geometry,
            attributes: {
                ObjectID: 1,
                ...incident.attributes,
            },
        });
    }

    const facilities = await facilityLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
    });

    const travelModeConfig = getTravelModeConfig(travelModeType, avoidHighways, impedanceAttribute);

    const params = new ClosestFacilityParameters({
        incidents: new FeatureSet({ features: [incidentFeature] }),
        facilities: new FeatureSet({
            features: facilities.features,
            fields: facilityLayer.fields.map(field => ({ name: field.name, type: field.type })),
        }),
        returnRoutes: true,
        returnFacilities: true,
        defaultTargetFacilityCount: maxFacilities,
        defaultCutoff: travelTime,
        travelMode: travelModeConfig,
    });

    try {
        const { closestFacilities, closestRoutes } = await performClosestFacilityAnalysis(params);
        const addedGraphics = addGraphicsToView(view, closestRoutes, incidentFeature.geometry, closestFacilities);

        return { facilities: closestFacilities, routes: closestRoutes, addedGraphics };
    } catch (error) {
        console.error("Error solving closest facility:", error);
        if (error.details) {
            console.error("Error details:", error.details);
        }
        throw error;
    }
}

export const findClosestFacilitiesWithOutSrc = findClosestFacilities;
