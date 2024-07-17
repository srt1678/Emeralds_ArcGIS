import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";


const unreinforcedBuildingTemplate = {
    title: "Unreinforced Masonry Building: {BUILDING_NAME}",  // Adjust the field name as necessary
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "preliminar", label: "Preliminary" },
                { fieldName: "neighborho", label: "Neighborhood" },
                { fieldName: "address", label: "Address" },
                { fieldName: "city", label: "City" },
                { fieldName: "state", label: "State" },
                { fieldName: "zip_code", label: "Zip Code" },
                { fieldName: "year_built", label: "Year Built" },
                { fieldName: "no_stories", label: "Number of Stories" },
                { fieldName: "retrofit_l", label: "Retrofit Level" },
                { fieldName: "building_u", label: "Building Use" },
                { fieldName: "estimated_", label: "Estimated" },
                { fieldName: "confirmati", label: "Confirmation" },
                // { fieldName: "F_computed_", label: "Computed 1" },
                // { fieldName: "F_compute_2", label: "Computed 2" },
                // { fieldName: "F_compute_3", label: "Computed 3" },
                // { fieldName: "F_compute_4", label: "Computed 4" },
                // { fieldName: "F_compute_5", label: "Computed 5" },
            ],
        },
    ],
};
const unreinforcedBuildingLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Unreinforced_Masonry_Buildings/FeatureServer",  
    visible: false,
    opacity: 0.3,
    popupTemplate: unreinforcedBuildingTemplate,
});


export default unreinforcedBuildingLayer;
