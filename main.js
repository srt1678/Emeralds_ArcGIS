import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import hospitalLayer from "./src/layers/HospitalLayer.js";
import fireStationLayer from "./src/layers/FireStationLayer.js";
import earthquakeLayer from "./src/layers/EarthquakeLayer.js";
import { handleViewClick, setupLayerList } from "./src/handlers/EventHandler.js";

import "./style.css";

esriConfig.apiKey = window.API_KEY;

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
map.addMany([hospitalLayer, fireStationLayer, earthquakeLayer]);

view.when(() => {
    hospitalLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
    }).then((hospitalResults) => {
        fireStationLayer.queryFeatures({
            where: "1=1",
            outFields: ["*"],
            returnGeometry: true,
        }).then((fireStationResults) => {
            const hospitals = hospitalResults.features;
            const fireStations = fireStationResults.features;

            if (hospitals.length > 0 && fireStations.length > 0) {
                handleViewClick(view, hospitals[0].geometry, "start");
                handleViewClick(view, fireStations[0].geometry, "finish");
            }
        });
    });

    setupLayerList(view);
});

view.on("click", (event) => {
    view.hitTest(event).then((response) => {
        handleViewClick(view, response);
    });
});
