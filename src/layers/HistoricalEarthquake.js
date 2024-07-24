import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";

const historicalEarthquakeTemplate = {
	title: "Earthquake Date: {EQ_DATE}",
	content: [
		{
			type: "fields",
			fieldInfos: [
				{ fieldName: "OBSERV_DATE", label: "Observation Date" },
        { fieldName: "LATITUDE", label: "Latitude" },
        { fieldName: "LONGITUDE", label: "Longitude" },
        { fieldName: "NEAREST_CITY", label: "Closest Geographic Location or City" },
        { fieldName: "COUNTY", label: "County" },
				{ fieldName: "GROUND_CRACKING_FLAG", label: "Ground Cracking" },
				{ fieldName: "HOUSE_DAMAGE_FLAG", label: "House Damage" },
				{ fieldName: "BUILDING_DAMAGE_FLAG", label: "Building Damage" },
				{ fieldName: "ROAD_DAMAGE_FLAG", label: "Road Damage" },
        { fieldName: "BRIDGE_DAMAGE_FLAG", label: "Bridge Damage" },
        { fieldName: "UTILITY_DAMAGE_FLAG", label: "Utility Damage" },
        { fieldName: "LANDLEVEL_CHANGE_FLAG", label: "Land-Level Change" },
        { fieldName: "WAVE_FLAG", label: "Wave Flag" },
        { fieldName: "RAIL_DAMAGE_FLAG", label: "Rail Damage Flag" },
        { fieldName: "COST_ESTIMATE", label: "Cost Estimate (dollars)" },
        { fieldName: "DAMAGE_DESC", label: "Damage Description" },
			],
		},
	],
};

const renderer = new UniqueValueRenderer({
  field: "EQ_DATE",
  defaultSymbol: new SimpleMarkerSymbol({
    color: [128, 128, 128],
    size: 10,
    outline: { color: [255, 255, 255], width: 0.5 }
  }),
});
const historicalEarthquakeLayer = new FeatureLayer({
	//url: "https://gis.dnr.wa.gov/site1/rest/services/Public_Geology/Earthquake/MapServer/1",
	
  portalItem: {
    id: "e001a7c687f945438d41dfdd9858f40a",
    portal: "https://www.arcgis.com",
  },
  
	outFields: ["*"],
  //renderer: renderer,
	visible: false,
  popupTemplate: historicalEarthquakeTemplate
});

export default historicalEarthquakeLayer;
