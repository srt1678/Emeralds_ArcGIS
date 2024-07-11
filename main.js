import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Graphic from "@arcgis/core/Graphic.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import * as route from "@arcgis/core/rest/route.js";

import hospitalLayer from "./src/layers/HospitalLayer.js";
import fireStationLayer from "./src/layers/FireStationLayer.js";
import earthquakeLayer from "./src/layers/EarthquakeLayer.js";

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

const routeSymbol = {
    type: "simple-line",
    color: [5, 150, 255],
    width: 3,
};

function addGraphic(type, point) {
    let color = "#ffffff";
    let outlineColor = "#000000";
    let size = "12px";
    if (type === "start") {
        color = "#ffffff";
    } else if (type === "stop") {
        color = "#000000";
        outlineColor = "#ffffff";
        size = "8px";
    } else {
        color = "#000000";
        outlineColor = "#ffffff";
    }
    const graphic = new Graphic({
        symbol: {
            type: "simple-marker",
            color: color,
            size: size,
            outline: {
                color: outlineColor,
                width: "1px",
            },
        },
        geometry: point,
    });
    view.graphics.add(graphic);
}

function getRoute() {
    const routeUrl =
        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    const routeParams = new RouteParameters({
        stops: new FeatureSet({
            features: view.graphics.toArray(),
        }),
        // returnDirections: true,
        // directionsLanguage: "en",
    });

    route
        .solve(routeUrl, routeParams)
        .then((data) => {
            if (data.routeResults.length > 0) {
                showRoute(data.routeResults[0].route);
                showDirections(data.routeResults[0].directions.features);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function showRoute(routeResult) {
    routeResult.symbol = routeSymbol;
    view.graphics.add(routeResult, 0);
}

function showDirections(directions) {
    const directionsElement = document.createElement("div");
    directionsElement.innerHTML = "<h3>Directions</h3>";
    directionsElement.classList =
        "esri-widget esri-widget--panel esri-directions__scroller directions";
    directionsElement.style.marginTop = "0";
    directionsElement.style.padding = "0 15px";
    directionsElement.style.minHeight = "365px";

    const directionsList = document.createElement("ol");
    directions.forEach((result) => {
        const direction = document.createElement("li");
        direction.innerHTML =
            result.attributes.text +
            (result.attributes.length > 0
                ? " (" + result.attributes.length.toFixed(2) + " miles)"
                : "");
        directionsList.appendChild(direction);
    });
    directionsElement.appendChild(directionsList);

    view.ui.empty("top-right");
    view.ui.add(
        new Expand({
            view: view,
            content: directionsElement,
            expanded: true,
            mode: "floating",
        }),
        "top-right"
    );
}

function handleSelection(feature) {
    if (view.graphics.length === 0) {
        addGraphic("start", feature.geometry);
    } else if (view.graphics.length === 1) {
        addGraphic("finish", feature.geometry);
        getRoute();
    } else {
        view.graphics.removeAll();
        view.ui.empty("top-right");
        addGraphic("start", feature.geometry);
    }
}

view.on("click", (event) => {
    view.hitTest(event).then((response) => {
        const results = response.results;
        if (results.length > 0) {
            const graphic = results.filter((result) => {
                return (
                    result.graphic.layer === hospitalLayer ||
                    result.graphic.layer === fireStationLayer
                );
            })[0];
            if (graphic) {
                handleSelection(graphic.graphic);
            }
        }
    });
});

view.when(() => {
    hospitalLayer
        .queryFeatures({
            where: "1=1",
            outFields: ["*"],
            returnGeometry: true,
        })
        .then((hospitalResults) => {
            fireStationLayer
                .queryFeatures({
                    where: "1=1",
                    outFields: ["*"],
                    returnGeometry: true,
                })
                .then((fireStationResults) => {
                    const hospitals = hospitalResults.features;
                    const fireStations = fireStationResults.features;

                    if (hospitals.length > 0 && fireStations.length > 0) {
                        addGraphic("start", hospitals[0].geometry);
                        addGraphic("finish", fireStations[0].geometry);
                        getRoute();
                    }
                });
        });
    const layerList = new LayerList({
        view: view,
    });

    view.ui.add(layerList, "top-right");
});
