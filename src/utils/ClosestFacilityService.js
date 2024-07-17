import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import { fireStationLayer } from "../layers";
import esriConfig from "@arcgis/core/config";

esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

export const findClosestFireStations = async (hospital, view) => {
    console.log("Hospital:", JSON.stringify(hospital, null, 2));
    
    const url = "https://route-api.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";

    // Create start feature (hospital)
    const startFeature = new Graphic({
        geometry: hospital.geometry,
        attributes: {
            ObjectID: 1,
            ...hospital.hospital
        }
    });

    // Query fire stations
    const fireStations = await fireStationLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
    });
    console.log("Number of fire stations:", fireStations.features.length);

    const params = new ClosestFacilityParameters({
        incidents: new FeatureSet({
            features: [startFeature],
        }),
        facilities: new FeatureSet({
            features: fireStations.features,
        }),
        returnRoutes: true,
        returnFacilities: true,
        defaultTargetFacilityCount: 3,
    });

    try {
        const results = await closestFacility.solve(url, params);
        
        showRoutes(results.routes, view);
        addStartGraphic(hospital.geometry, view);
        addClosestFacilityGraphics(results.facilities, view);
        return results;
    } catch (error) {
        console.error("Error solving closest facility:", error);
        if (error.details) {
            console.error("Error details:", error.details);
        }
        throw error;
    }
};

function showRoutes(routes, view) {
    view.graphics.removeAll();
    routes.features.forEach((route, i) => {
        const routeGraphic = new Graphic({
            geometry: route.geometry,
            symbol: {
                type: "simple-line",
                color: [255, 0, 0, 0.5],
                width: 5
            }
        });
        view.graphics.add(routeGraphic);
    });

    // Zoom to the extent of the graphics
    const graphicsExtent = view.graphics.extent;
    if (graphicsExtent) {
        view.goTo(graphicsExtent.expand(1.2));
    }
}

function addStartGraphic(point, view) {
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

function addClosestFacilityGraphics(facilities, view) {
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
