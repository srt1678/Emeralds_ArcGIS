import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer.js";

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

// Define a custom renderer
const earthquakeRenderer = new ClassBreaksRenderer({
    field: "EARTHQUAKE_DEPTH_KM",
    defaultSymbol: new SimpleMarkerSymbol({
        style: "square",
        size: 8,
        color: [128, 128, 128, 0.5],
        outline: {
            color: [128, 128, 128],
            width: 1
        }
    }),
    classBreakInfos: [
        {
            minValue: 0.1,
            maxValue: 5.5,
            symbol: new SimpleMarkerSymbol({
                style: "square",
                size: 8,
                color: [255, 255, 0, 0.5],  // Yellow
                outline: { color: [255, 255, 0], width: 1 }
            }),
            label: "0.1 - 5.5"
        },
        {
            minValue: 5.5,
            maxValue: 13,
            symbol: new SimpleMarkerSymbol({
                style: "square",
                size: 8,
                color: [255, 165, 0, 0.5],  // Orange
                outline: { color: [255, 165, 0], width: 1 }
            }),
            label: "5.5 - 13.0"
        },
        {
            minValue: 13,
            maxValue: 22,
            symbol: new SimpleMarkerSymbol({
                style: "square",
                size: 8,
                color: [255, 192, 203, 0.5],  // Pink
                outline: { color: [255, 192, 203], width: 1 }
            }),
            label: "13.0 - 22.0"
        },
        {
            minValue: 22,
            maxValue: 30,
            symbol: new SimpleMarkerSymbol({
                style: "square",
                size: 8,
                color: [255, 0, 0, 0.5],  // Red
                outline: { color: [255, 0, 0], width: 1 }
            }),
            label: "22.0 - 30.0"
        },
        {
            minValue: 30,
            maxValue: 98.5,
            symbol: new SimpleMarkerSymbol({
                style: "square",
                size: 8,
                color: [0, 0, 255, 0.5],  // Blue
                outline: { color: [0, 0, 255], width: 1 }
            }),
            label: "30.0 - 98.5"
        }
    ]
});

// Define the Earthquakes >1M layer
const earthquakeLayer = new FeatureLayer({
    id: "earthquakeLayer",
    url: "https://gis.dnr.wa.gov/site1/rest/services/Public_Geology/Earthquake/MapServer/5",
    title: "Seattle Earthquakes >1M",
    outFields: ["*"],
    visible: false,
    listMode: "show",
    popupTemplate: earthquakeTemplate,
    // renderer: earthquakeRenderer,
    note: "Earthquakes are sudden releases of crustal stress, generating seismic waves, which are then detected by seismometers located throughout the world. This point feature class includes earthquake hypocenters throughout the state of Washington. For each event, there are latitude and longitude coordinates, earthquake depth, an observed date and time, and an earthquake magnitude. Earthquake data were obtained from the Pacific Northwest Seismic Network (PNSN). Funding for this data compilation was provided through a U.S. Department of Energy geothermal grant.",
});
export default earthquakeLayer;
