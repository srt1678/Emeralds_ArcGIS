// Past earth quake layer
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

// Set the API key
esriConfig.apiKey = window.API_KEY;

// Create the map
const map = new Map({
    basemap: "gray-vector",
});

// Create the view
const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 6,
    center: [-120, 47], // Centered on Washington State
});

// Define the popup template for the Earthquakes >1M layer
const earthquakeTemplate = {
    title: "Earthquake Magnitude: {EARTHQUAKE_MAGNITUDE}",
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "EARTHQUAKE_DEPTH_KM", label: "Depth (km)" },
                { fieldName: "DATE_TIME_UTC", label: "UTC Time" },
                { fieldName: "DATE_TIME_LOCAL", label: "Local Time" },
                { fieldName: "LATITUDE_DECIMAL_DEGREES", label: "Latitude" },
                { fieldName: "LONGITUDE_DECIMAL_DEGREES", label: "Longitude" },
                { fieldName: "COUNTY_NAME", label: "County" },
            ],
        },
    ],
};

// Define the Earthquakes >1M layer
const earthquakeLayer = new FeatureLayer({
    url: "https://gis.dnr.wa.gov/site1/rest/services/Public_Geology/Earthquake/MapServer/5",
    outFields: ["*"],
    popupTemplate: earthquakeTemplate,
});

// Add the layer to the map
map.add(earthquakeLayer);

view.when(() => {
    console.log("Map and View are ready");
});
