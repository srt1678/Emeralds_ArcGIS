import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

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
    id: "earthquakeLayer",
    url: "https://gis.dnr.wa.gov/site1/rest/services/Public_Geology/Earthquake/MapServer/5",
    outFields: ["*"],
    visible: false,
    listMode: "show",
    popupTemplate: earthquakeTemplate,
});

export default earthquakeLayer;
