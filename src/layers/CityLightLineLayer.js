import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const cityLightLineLayerUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Seattle_City_Light_Lines/FeatureServer/2";

const cityLightLineLayer = new FeatureLayer({
    id: "cityLightLineLayer",
    url: cityLightLineLayerUrl,
    outFields: ["*"],
    visible: false,
    listMode: "show",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-line", 
            style: "solid",
            color: [126, 155, 52, 255],
            width: 1
        }
    },
    spatialReference: { wkid: 2926 }, 
    extent: {
        xmin: 1248913.35998535,
        ymin: 166299.17401123,
        xmax: 1297968.34118652,
        ymax: 287623.328613281,
        spatialReference: { wkid: 2926 }
    },
    popupTemplate: {
        title: "City Light Line",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "OBJECTID", label: "OBJECTID" },
                    { fieldName: "SUBTYPECD", label: "Subtype" },
                    { fieldName: "ConductorType1", label: "Conductor Type 1" },
                    { fieldName: "F_GEOMETRY_Length", label: "F_GEOMETRY Length" },
                    { fieldName: "Shape__Length", label: "Shape Length" }
                ]
            }
        ]
    }
});

export default cityLightLineLayer;
