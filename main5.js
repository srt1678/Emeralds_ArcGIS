// https://developers.arcgis.com/documentation/mapping-and-location-services/routing-and-directions/route-and-directions/
// Selects 2 facily -> provive best route
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet",
    "esri/config",
    "esri/widgets/Expand",
    "esri/layers/FeatureLayer",
    "esri/core/urlUtils"
], function (Map, MapView, Graphic, route, RouteParameters, FeatureSet, esriConfig, Expand, FeatureLayer, urlUtils) {

    esriConfig.apiKey = window.API_KEY

    const map = new Map({
        basemap: "arcgis-navigation"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-122.3328, 47.6061],
        zoom: 12,
        constraints: {
            snapToZoom: false
        }
    });

    // URLs for hospital and fire station data
    const hospitalUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0";
    const fireStationUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0";

    // Define the hospital layer with popup template
    const hospitalLayer = new FeatureLayer({
        url: hospitalUrl,
        outFields: ["*"],
        popupTemplate: {
            title: "{FACILITY}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        { fieldName: "ADDRESS", label: "ADDRESS" },
                        { fieldName: "CITY", label: "CITY" },
                        { fieldName: "URL", label: "URL" },
                        { fieldName: "TELEPHONE", label: "TELEPHONE" },
                        { fieldName: "GLOBALID", label: "GLOBAL ID" }
                    ]
                }
            ]
        }
    });

    // Define the fire station layer with popup template
    const fireStationLayer = new FeatureLayer({
        url: fireStationUrl,
        outFields: ["*"],
        popupTemplate: {
            title: "{STNID}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        { fieldName: "ADDRESS", label: "ADDRESS" }
                    ]
                }
            ]
        }
    });

    // Add the layers to the map
    map.addMany([hospitalLayer, fireStationLayer]);

    // Symbol for route line
    const routeSymbol = {
        type: "simple-line",
        color: [5, 150, 255],
        width: 3
    };

    // Function to add graphics for start, stop, and end points
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
                    width: "1px"
                }
            },
            geometry: point
        });
        view.graphics.add(graphic);
    }

    // Function to get and display the route
    function getRoute() {
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: view.graphics.toArray()
            }),
            returnDirections: true,
            directionsLanguage: "en"
        });

        route.solve(routeUrl, routeParams)
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

    // Function to display the route on the map
    function showRoute(routeResult) {
        routeResult.symbol = routeSymbol;
        view.graphics.add(routeResult, 0);
    }

    // Function to display directions
    function showDirections(directions) {
        const directionsElement = document.createElement("div");
        directionsElement.innerHTML = "<h3>Directions</h3>";
        directionsElement.classList = "esri-widget esri-widget--panel esri-directions__scroller directions";
        directionsElement.style.marginTop = "0";
        directionsElement.style.padding = "0 15px";
        directionsElement.style.minHeight = "365px";

        const directionsList = document.createElement("ol");
        directions.forEach((result) => {
            const direction = document.createElement("li");
            direction.innerHTML = result.attributes.text + ((result.attributes.length > 0) ? " (" + result.attributes.length.toFixed(2) + " miles)" : "");
            directionsList.appendChild(direction);
        });
        directionsElement.appendChild(directionsList);

        view.ui.empty("top-right");
        view.ui.add(new Expand({
            view: view,
            content: directionsElement,
            expanded: true,
            mode: "floating"
        }), "top-right");
    }

    // Function to handle selection of hospital or fire station
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

    // Handle map click event
    view.on("click", (event) => {
        view.hitTest(event).then((response) => {
            const results = response.results;
            if (results.length > 0) {
                const graphic = results.filter(result => {
                    return result.graphic.layer === hospitalLayer || result.graphic.layer === fireStationLayer;
                })[0];
                if (graphic) {
                    handleSelection(graphic.graphic);
                }
            }
        });
    });

    view.when(() => {
        // Query all hospitals and fire stations
        hospitalLayer.queryFeatures({
            where: "1=1",
            outFields: ["*"],
            returnGeometry: true
        }).then((hospitalResults) => {
            fireStationLayer.queryFeatures({
                where: "1=1",
                outFields: ["*"],
                returnGeometry: true
            }).then((fireStationResults) => {
                const hospitals = hospitalResults.features;
                const fireStations = fireStationResults.features;

                if (hospitals.length > 0 && fireStations.length > 0) {
                    // Add graphics for the first hospital and fire station
                    addGraphic("start", hospitals[0].geometry);
                    addGraphic("finish", fireStations[0].geometry);
                    getRoute();
                }
            });
        });
    });
});
