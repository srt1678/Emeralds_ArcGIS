import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const populationTemplate = {
    title: "Population Data: {NAME}",
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "GEOID", label: "Geographic Identifier - FIPS Code" },
                { fieldName: "ALAND", label: "Area of Land (Square Meters)" },
                { fieldName: "AWATER", label: "Area of Water (Square Meters)" },
                { fieldName: "NAME", label: "Name" },
                { fieldName: "State", label: "State" },
                { fieldName: "County", label: "County" },
                { fieldName: "B01001_001E", label: "Total Population" },
            ],
        },
    ],
};
const populationLayer = new FeatureLayer({
    id: "populationLayer",
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Total_Population_Boundaries/FeatureServer/2",  
    visible: false,
    listMode: "show",
    popupTemplate: populationTemplate,
    opacity: 0.5,
    definitionExpression: "County = 'King County' AND State = 'Washington'",
});

export default populationLayer;
