import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

// Define the popup template for the Neighborhood layer
const neighborhoodTemplate = {
    title: "Neighborhood: {GEN_ALIAS}",
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "CRA_NO", label: "CRA ID" },
                { fieldName: "CRA_GRP", label: "Neighborhood ID" },
                { fieldName: "GEN_ALIAS", label: "Community Reporting Area Name" },
                { fieldName: "DETL_NAMES", label: "Neighborhood Names" },
                { fieldName: "NEIGHDIST", label: "Neighborhood District Name" },
            ],
        },
    ],
};

// Define the Neighborhood layer
const neighborhoodLayer = new FeatureLayer({
    id: "neighborhoodLayer",
    url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Community_Reporting_Areas_ACS5Y10/FeatureServer/0", 
    outFields: ["*"],
    visible: false,
    listMode: "show",
    popupTemplate: neighborhoodTemplate,
});

export default neighborhoodLayer;
