import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import {
    hospitalLayer,
    fireStationLayer,
    earthquakeLayer,
    unreinforcedBuildingLayer,
    populationLayer,
    earthquakeM6Layer
} from "./src/layers/index.js";

import { handleRouteClick } from "./src/handlers/routeEventHandler.js";
import { setupLayerList } from "./src/handlers/layerListSetup.js";

import "./style.css";

esriConfig.apiKey = window.API_KEY;

hospitalLayer.visible = false;
fireStationLayer.visible = false;
earthquakeLayer.visible = false;
unreinforcedBuildingLayer.visible = false;
populationLayer.visible = false;

const map = new Map({
    basemap: "arcgis-navigation",
});

const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-122.3328, 47.6061],
    zoom: 12,
    constraints: {
        snapToZoom: false,
    },
});

// Add the layers to the map
map.addMany([
    hospitalLayer,
    fireStationLayer,
    earthquakeLayer,
    unreinforcedBuildingLayer,
    populationLayer,
    earthquakeM6Layer
]);

view.when(() => {
    // hospitalLayer
    //     .queryFeatures({
    //         where: "1=1",
    //         outFields: ["*"],
    //         returnGeometry: true,
    //     })
    //     .then((hospitalResults) => {
    //         fireStationLayer
    //             .queryFeatures({
    //                 where: "1=1",
    //                 outFields: ["*"],
    //                 returnGeometry: true,
    //             })
    //             // .then((fireStationResults) => {
    //             //     const hospitals = hospitalResults.features;
    //             //     const fireStations = fireStationResults.features;

    //             //     if (hospitals.length > 0 && fireStations.length > 0) {
    //             //         handleRouteClick(view, hospitals[0].geometry, "start");
    //             //         handleRouteClick(
    //             //             view,
    //             //             fireStations[0].geometry,
    //             //             "finish"
    //             //         );
    //             //     }
    //             // });
    //     });

    setupLayerList(view);
});

view.on("click", (event) => {
    view.hitTest(event).then((response) => {
        handleRouteClick(view, response);
    });
});
