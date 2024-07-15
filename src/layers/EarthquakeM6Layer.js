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
                { fieldName: "gov2i", label: "Government 2" },
                { fieldName: "com6i", label: "Commercial 6" },
                { fieldName: "edu1i", label: "Educational 1" },
                { fieldName: "total_buil", label: "Total Buildings" },
                { fieldName: "resident_1", label: "Residential 1" },
                { fieldName: "commerci_1", label: "Commercial 1" },
                { fieldName: "industri_1", label: "Industrial 1" },
                { fieldName: "agricult_1", label: "Agricultural 1" },
                { fieldName: "religiou_1", label: "Religious 1" },
                { fieldName: "governme_1", label: "Government 1" },
                { fieldName: "educatio_1", label: "Educational 1" },
                { fieldName: "gov2i_perc", label: "Government 2 %" },
                { fieldName: "com6i_perc", label: "Commercial 6 %" },
                { fieldName: "edu1i_perc", label: "Educational 1 %" },
                { fieldName: "population", label: "Population" },
                { fieldName: "estimated_", label: "Estimated" },
                { fieldName: "households", label: "Households" },
                { fieldName: "children_p", label: "Children %" },
                { fieldName: "adult_popu", label: "Adult Population" },
                { fieldName: "senior_pop", label: "Senior Population" },
                { fieldName: "children_1", label: "Children 1" },
                { fieldName: "adult_po_1", label: "Adult Population 1" },
                { fieldName: "senior_p_1", label: "Senior Population 1" },
                { fieldName: "incless10", label: "Income <10k" },
                { fieldName: "incless30", label: "Income <30k" },
                { fieldName: "incless50", label: "Income <50k" },
                { fieldName: "incless100", label: "Income <100k" },
                { fieldName: "incover100", label: "Income >100k" },
                { fieldName: "incless10_", label: "Income <10k %" },
                { fieldName: "incless30_", label: "Income <30k %" },
                { fieldName: "incless50_", label: "Income <50k %" },
                { fieldName: "incless1_1", label: "Income <10k 1" },
                { fieldName: "incover1_1", label: "Income >100k 1" },
                { fieldName: "hearing_di", label: "Hearing Disability" },
                { fieldName: "vision_dis", label: "Vision Disability" },
                { fieldName: "cognitive_", label: "Cognitive Disability" },
                { fieldName: "liquefacti", label: "Liquefaction" },
                { fieldName: "resident_d", label: "Residential Damage" },
                { fieldName: "resident_n", label: "Residential Number" },
                { fieldName: "builtbefor", label: "Built Before" },
                { fieldName: "built40to5", label: "Built 40s to 50s" },
                { fieldName: "built60to7", label: "Built 60s to 70s" },
                { fieldName: "built80to9", label: "Built 80s to 90s" },
                { fieldName: "builtafter", label: "Built After" },
                { fieldName: "builtbef_1", label: "Built Before 1" },
                { fieldName: "built40t_1", label: "Built 40s to 50s 1" },
                { fieldName: "built60t_1", label: "Built 60s to 70s 1" },
                { fieldName: "built80t_1", label: "Built 80s to 90s 1" },
                { fieldName: "builtaft_1", label: "Built After 1" },
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
                    width: 1
                }
            }),
            label: "<10% not damaged"
        },
        {
            value: "1",
            symbol: new SimpleFillSymbol({
                color: [255, 255, 0, 0.3], // Yellow with 30% opacity
                outline: {
                    color: [255, 255, 0, 0.6],
                    width: 1
                }
            }),
            label: ">10% light damage"
        },
        {
            value: "2",
            symbol: new SimpleFillSymbol({
                color: [255, 165, 0, 0.3], // Orange with 30% opacity
                outline: {
                    color: [255, 165, 0, 0.6],
                    width: 1
                }
            }),
            label: "10-50% major non-structural damage"
        },
        {
            value: "2.5",
            symbol: new SimpleFillSymbol({
                color: [255, 140, 0, 0.3], // Dark orange with 30% opacity
                outline: {
                    color: [255, 140, 0, 0.6],
                    width: 1
                }
            }),
            label: "50%+ major non-structural damage"
        },
        {
            value: "3",
            symbol: new SimpleFillSymbol({
                color: [255, 69, 0, 0.3], // Red-orange with 30% opacity
                outline: {
                    color: [255, 69, 0, 0.6],
                    width: 1
                }
            }),
            label: "10-50% structural damage"
        },
        {
            value: "3.5",
            symbol: new SimpleFillSymbol({
                color: [255, 0, 0, 0.3], // Red with 30% opacity
                outline: {
                    color: [255, 0, 0, 0.6],
                    width: 1
                }
            }),
            label: "50%+ structural damage"
        },
    ]
});


const earthquakeM6Layer = new FeatureLayer({
    url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Model_Deep_Earthquake_M6_8__Nisqually_2001/FeatureServer/4",  
    visible: false,
    renderer: renderer,
    popupTemplate: earthquakeM6Template,
});

export default earthquakeM6Layer;
