import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";

const earthquakeM6Template = {
    
    title: "Earthquake M6 Data: {OBJECTID}",
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "residentia", label: "Residential" },
                { fieldName: "commercial", label: "Commercial" },
                { fieldName: "industrial", label: "Industrial" },
                { fieldName: "agricultur", label: "Agricultural" },
                { fieldName: "religious_", label: "Religious" },
                { fieldName: "government", label: "Government" },
                { fieldName: "educationa", label: "Educational" },
                { fieldName: "total_buil", label: "Total Buildings" },
                { fieldName: "population", label: "Population" },
                { fieldName: "estimated_", label: "Estimated" },
                { fieldName: "households", label: "Households" },
                { fieldName: "children_p", label: "Children %" },
                { fieldName: "adult_popu", label: "Adult Population" },
                { fieldName: "senior_pop", label: "Senior Population" },
                { fieldName: "children_1", label: "Children 1" },
                { fieldName: "adult_po_1", label: "Adult Population 1" },
                { fieldName: "senior_p_1", label: "Senior Population 1" },
                { fieldName: "hearing_di", label: "Hearing Disability" },
                { fieldName: "vision_dis", label: "Vision Disability" },
                { fieldName: "cognitive_", label: "Cognitive Disability" },
                { fieldName: "liquefacti", label: "Liquefaction" },
                { fieldName: "resident_d", label: "Residential Damage" },
                { fieldName: "resident_n", label: "Residential Number" },
                { fieldName: "emergency_", label: "Emergency" },
            ],
        },
    ],
};

const renderer = new UniqueValueRenderer({
    field: "damage",
    uniqueValueInfos: [
        {
            value: "0",
            symbol: new SimpleFillSymbol({
                color: [0, 255, 0, 0.3], // Green with 30% opacity
                outline: {
                    color: [0, 255, 0, 0.6],
                    width: 1,
                },
            }),
            label: "<10% not damaged",
        },
        {
            value: "1",
            symbol: new SimpleFillSymbol({
                color: [255, 255, 0, 0.3], // Yellow with 30% opacity
                outline: {
                    color: [255, 255, 0, 0.6],
                    width: 1,
                },
            }),
            label: ">10% light damage",
        },
        {
            value: "2",
            symbol: new SimpleFillSymbol({
                color: [255, 165, 0, 0.3], // Orange with 30% opacity
                outline: {
                    color: [255, 165, 0, 0.6],
                    width: 1,
                },
            }),
            label: "10-50% major non-structural damage",
        },
        {
            value: "2.5",
            symbol: new SimpleFillSymbol({
                color: [255, 140, 0, 0.3], // Dark orange with 30% opacity
                outline: {
                    color: [255, 140, 0, 0.6],
                    width: 1,
                },
            }),
            label: "50%+ major non-structural damage",
        },
        {
            value: "3",
            symbol: new SimpleFillSymbol({
                color: [255, 69, 0, 0.3], // Red-orange with 30% opacity
                outline: {
                    color: [255, 69, 0, 0.6],
                    width: 1,
                },
            }),
            label: "10-50% structural damage",
        },
        {
            value: "3.5",
            symbol: new SimpleFillSymbol({
                color: [255, 0, 0, 0.3], // Red with 30% opacity
                outline: {
                    color: [255, 0, 0, 0.6],
                    width: 1,
                },
            }),
            label: "50%+ structural damage",
        },
    ],
});

const earthquakeM6Layer = new FeatureLayer({
    id: "earthquakeM6Layer",
    url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Model_Deep_Earthquake_M6_8__Nisqually_2001/FeatureServer/4",
    title: "Seattle Earthquake M6.8",
    visible: false,
    listMode: "show",
    renderer: renderer,
    popupTemplate: earthquakeM6Template,
    id: "earthquakeM6Layer", // Unique ID for the layer
    note: "https://experience.arcgis.com/experience/2acb05d732134331bc05214740076373/page/Hazard-Explorer/?views=Ground-Shaking%2CEarthquake-Scenarios%2CNisqually-M6.8-View"
});

export default earthquakeM6Layer;
