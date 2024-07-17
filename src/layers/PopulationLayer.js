import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const populationTemplate = {
    title: "Population Data: {NAME}",  // Adjust the field name as necessary
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "GEOID_20", label: "GEOID20" },
                { fieldName: "GROSS_ACRES", label: "Gross Acres" },
                { fieldName: "ACRES_LAND", label: "Land Acres" },
                { fieldName: "ACRES_WATER", label: "Water Acres" },
                { fieldName: "TRBL_STR", label: "Tract and Block" },
                { fieldName: "NAME", label: "Block Name" },
                { fieldName: "TRACT_NUMB", label: "Tract" },
                { fieldName: "TRACT_LABEL", label: "Census Tract Label" },
                { fieldName: "WATER", label: "Water (=1)" },
                { fieldName: "VILLNUMB", label: "Urban Village Number" },
                { fieldName: "VILLNAME", label: "Urban Village Name" },
                { fieldName: "CRA_NO", label: "Community Reporting Area ID" },
                { fieldName: "CRA_GRP", label: "Community Reporting Area Group" },
                { fieldName: "GEN_ALIAS", label: "Community Reporting Area Name" },
                { fieldName: "DETL_NAMES", label: "Community Reporting Area Neighborhoods" },
                { fieldName: "COUNCIL_DIST_13", label: "Council District (2013)" },
                { fieldName: "COUNCIL_DIST_24", label: "Council District (2024)" },
                { fieldName: "COMP_PLAN_NAME", label: "Comprehensive Plan Name" },
                { fieldName: "Shape__Area", label: "Shape Area" },
                { fieldName: "Shape__Length", label: "Shape Length" },
            ],
        },
    ],
};

const populationLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/2020_Census_Blocks_-_Seattle/FeatureServer",  
    visible: false,
    popupTemplate: populationTemplate,
});

export default populationLayer;
