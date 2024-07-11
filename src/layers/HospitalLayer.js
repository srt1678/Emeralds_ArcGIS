import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const hospitalUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0";

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

export default hospitalLayer;
