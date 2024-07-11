// All hospitals and fire stations conncect as Graphic Layer
// https://developers.arcgis.com/documentation/mapping-and-location-services/routing-and-directions/route-and-directions/
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/FeatureLayer",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet",
    "esri/request",
], function (
    esriConfig,
    Map,
    MapView,
    Graphic,
    FeatureLayer,
    route,
    RouteParameters,
    FeatureSet,
    esriRequest
) {
    esriConfig.apiKey = window.API_KEY

    // Data URLs
    const hospitalUrl =
        "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0";
    const fireStationUrl =
        "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0";

    // Symbol for the route
    const routeSymbol = {
        type: "simple-line",
        color: [50, 150, 255, 0.75],
        width: "2",
    };

    // Create the map
    const map = new Map({
        basemap: "gray-vector",
    });

    // Create the view
    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 12,
        center: [-122.3328, 47.6061],
    });

    // Popup template for hospitals
    const hospitalTemplate = {
        title: "{FACILITY}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "ADDRESS", label: "ADDRESS" },
                    { fieldName: "CITY", label: "CITY" },
                    { fieldName: "URL", label: "URL" },
                    { fieldName: "TELEPHONE", label: "TELEPHONE" },
                    { fieldName: "GLOBALID", label: "GLOBAL ID" },
                ],
            },
        ],
    };

    // Popup template for fire stations
    const fireStationTemplate = {
        title: "{STNID}",
        content: [
            {
                type: "fields",
                fieldInfos: [{ fieldName: "ADDRESS", label: "ADDRESS" }],
            },
        ],
    };

    // Define the hospital layer with popup template
    const hospitalLayer = new FeatureLayer({
        url: hospitalUrl,
        outFields: ["*"],
        popupTemplate: hospitalTemplate,
    });

    // Define the fire station layer with popup template
    const fireStationLayer = new FeatureLayer({
        url: fireStationUrl,
        outFields: ["*"],
        popupTemplate: fireStationTemplate,
    });

    // Define the routes layer as a feature layer
    const routeFeatureLayer = new FeatureLayer({
        source: [], // initial empty source
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid",
            },
            {
                name: "name",
                alias: "Name",
                type: "string",
            },
        ],
        objectIdField: "ObjectID",
        geometryType: "polyline",
        spatialReference: { wkid: 4326 },
        renderer: {
            type: "simple",
            symbol: routeSymbol,
        },
    });

    // Ensure route layer doesn't block interaction with underlying layers
    routeFeatureLayer.elevationInfo = {
        mode: "on-the-ground",
    };

    map.addMany([hospitalLayer, fireStationLayer, routeFeatureLayer]);

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
            attributes: {
                name: "Route",
            },
        });
        routeFeatureLayer
            .applyEdits({
                addFeatures: [graphic],
            })
            .then((response) => {
                console.log("Route added", response);
            })
            .catch((error) => {
                console.error("Error adding route", error);
            });
    }

    // Main view setup
    view.when(() => {
        // Wait for the hospital and fire station layers to load
        Promise.all([hospitalLayer.when(), fireStationLayer.when()])
            .then(() => {
                // Query all hospitals
                hospitalLayer
                    .queryFeatures({
                        where: "1=1",
                        outFields: ["*"],
                        returnGeometry: true,
                    })
                    .then((hospitalResults) => {
                        // Query all fire stations
                        fireStationLayer
                            .queryFeatures({
                                where: "1=1",
                                outFields: ["*"],
                                returnGeometry: true,
                            })
                            .then((fireStationResults) => {
                                const hospitals = hospitalResults.features;
                                const fireStations =
                                    fireStationResults.features;

                                // Find routes between all hospitals and fire stations
                                hospitals.forEach((hospital) => {
                                    fireStations.forEach((fireStation) => {
                                        findRoute(hospital, fireStation);
                                    });
                                });
                            });
                    });
            })
            .catch((error) => {
                console.error(
                    "Error loading layers or querying features",
                    error
                );
            });
    });
});
