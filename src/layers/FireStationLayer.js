import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const fireStationUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0";

const fireStationLayer = new FeatureLayer({
    id: "fireStationLayer",
    url: fireStationUrl,
    outFields: ["*"],
    visible: false,
    listMode: "show",
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
    },
    fields: [
        { name: "OBJECTID", alias: "ObjectID", type: "oid" },
        { name: "STNID", alias: "Name", type: "string" },
        { name: "ADDRESS", alias: "Address", type: "string" }
    ]
});

export default fireStationLayer;
