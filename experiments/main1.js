// All hospitals and fire stations conncect as Graphic Layer
// Hospitals and fire stations are also in Graphic Layer
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet",
    "esri/request",
], function (
    esriConfig,
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    route,
    RouteParameters,
    FeatureSet,
    esriRequest
) {
    esriConfig.apiKey = window.API_KEY;

    const routeSymbol = {
        type: "simple-line",
        color: [50, 150, 255, 0.75],
        width: "2",
    };

    const hospitalUrl =
        "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
    const fireStationUrl =
        "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

    const routesLayer = new GraphicsLayer();
    const facilitiesLayer = new GraphicsLayer();
    const incidentsLayer = new GraphicsLayer();

    const map = new Map({
        basemap: "gray-vector",
        layers: [routesLayer, facilitiesLayer, incidentsLayer],
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

    view.popup.actions = [];

    // Graphics
    async function addFacilityGraphics() {
        const hospitalResponse = await esriRequest(hospitalUrl, {
            responseType: "json",
        });
        const fireStationResponse = await esriRequest(fireStationUrl, {
            responseType: "json",
        });

        const hospitalGraphics = hospitalResponse.data.features.map(
            (feature) => {
                return new Graphic({
                    geometry: {
                        type: "point",
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1],
                    },
                    symbol: {
                        type: "simple-marker",
                        color: "blue",
                        size: "8px",
                    },
                    attributes: feature.properties,
                });
            }
        );

        const fireStationGraphics = fireStationResponse.data.features.map(
            (feature) => {
                return new Graphic({
                    geometry: {
                        type: "point",
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1],
                    },
                    symbol: {
                        type: "simple-marker",
                        color: "red",
                        size: "8px",
                    },
                    attributes: feature.properties,
                });
            }
        );

        incidentsLayer.addMany(hospitalGraphics);
        facilitiesLayer.addMany(fireStationGraphics);
    }

    function findRoute(startFeature, endFeature) {
        const params = new RouteParameters({
            stops: new FeatureSet({
                features: [startFeature, endFeature],
            }),
            returnDirections: true,
        });

        const url =
            "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

        route.solve(url, params).then(
            (data) => {
                if (data.routeResults.length > 0) {
                    showRoute(data.routeResults[0].route);
                } else {
                    console.error("No route results found", data);
                }
            },
            (error) => {
                console.error("Error solving route", error);
            }
        );
    }

    function showRoute(routeResult) {
        const graphic = new Graphic({
            geometry: routeResult.geometry,
            symbol: routeSymbol,
        });
        routesLayer.add(graphic);
        console.log("Route added", routeResult);
    }

    // Main view setup
    view.when(() => {
        addFacilityGraphics().then(() => {
            if (
                incidentsLayer.graphics.length > 0 &&
                facilitiesLayer.graphics.length > 0
            ) {
                const firstHospital = incidentsLayer.graphics.getItemAt(0);
                const firstFireStation = facilitiesLayer.graphics.getItemAt(0);
                findRoute(firstHospital, firstFireStation);
            }
        });
    });
});
