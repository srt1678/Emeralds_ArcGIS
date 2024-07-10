import Map from "@arcgis/core/Map.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import "./style.css";

//Data url
const hospitalUrl =
	"https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const cityLightLineUrl =
	"https://gisdata.seattle.gov/server/rest/services/COS/SCL_Poles_Lines/MapServer/1/query?outFields=*&where=1%3D1&f=geojson";
const fireStationUrl =
	"https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

const templateZoneUrl =
	"https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2";
const landZoneUrl =
	"https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Current_Land_Use_Zoning_Detail_2/FeatureServer/0/query?outFields=*&where=1%3D1";

//Create basemap & view (essential)
const map = new Map({
	basemap: "gray-vector",
});
const view = new MapView({
	container: "viewDiv",
	map: map,
	zoom: 12,
	center: [-122.3328, 47.6061],
});

//PopupTemplate for Hospital
const hospitalTemplate = {
	title: "{FACILITY}",
	content: [
		{
			type: "fields",
			fieldInfos: [
				{
					fieldName: "ADDRESS",
					label: "ADDRESS",
				},
				{
					fieldName: "CITY",
					label: "CITY",
				},
				{
					fieldName: "URL",
					label: "URL",
				},
				{
					fieldName: "TELEPHONE",
					label: "TELEPHONE",
				},
				{
					fieldName: "GLOBALID",
					label: "GLOBAL ID",
				},
			],
		},
	],
};

//Optional section, can delete this
const uniqueValueInfos = [
	{ value: "Neighborhood Residential 1", label: "Neighborhood Residential 1" },
	{ value: "Neighborhood Residential 2", label: "Neighborhood Residential 2" },
	{ value: "Neighborhood Residential 3", label: "Neighborhood Residential 3" },
	{ value: "Residential Small Lot", label: "Residential Small Lot" },
	{ value: "Lowrise 1", label: "Lowrise 1" },
	{ value: "Lowrise 2", label: "Lowrise 2" },
	{ value: "Lowrise 3", label: "Lowrise 3" },
	{ value: "Midrise", label: "Midrise" },
	{ value: "Highrise", label: "Highrise" },
	{ value: "Seattle Mixed", label: "Seattle Mixed" },
	{ value: "Neighborhood Commercial 1", label: "Neighborhood Commercial 1" },
	{ value: "Neighborhood Commercial 2", label: "Neighborhood Commercial 2" },
	{ value: "Neighborhood Commercial 3", label: "Neighborhood Commercial 3" },
	{ value: "Commercial 1", label: "Commercial 1" },
	{ value: "Commercial 2", label: "Commercial 2" },
	{ value: "Downtown Office Core", label: "Downtown Office Core" },
	{ value: "Downtown Retail Core", label: "Downtown Retail Core" },
	{ value: "Downtown Mixed", label: "Downtown Mixed" },
	{ value: "Downtown Harborfront", label: "Downtown Harborfront" },
	{ value: "Pike Market", label: "Pike Market" },
	{ value: "Pioneer Square", label: "Pioneer Square" },
	{ value: "International District", label: "International District" },
	{ value: "Industrial Buffer", label: "Industrial Buffer" },
	{ value: "Industrial Commercial", label: "Industrial Commercial" },
	{ value: "Urban Industrial", label: "Urban Industrial" },
	{ value: "Industry and Innovation", label: "Industry and Innovation" },
	{
		value: "Maritime Manufacturing and Logistics",
		label: "Maritime Manufacturing and Logistics",
	},
	{ value: "Master Planned Community", label: "Master Planned Community" },
	{ value: "Major Institution Overlay", label: "Major Institution Overlay" },
];
const createUniqueValueInfosWithColor = (color) => {
	return uniqueValueInfos.map((info) => ({
		value: info.value,
		label: info.label,
		symbol: {
			type: "simple-fill",
			color: color, 
			outline: {
				type: "simple-line",
				color: [255, 255, 255],
				width: 1,
			},
		},
	}));
};
const newColor = [168, 202, 231];
const landZoneRenderer = {
	type: "unique-value",
	field: "DETAIL_DESC",
	uniqueValueInfos: createUniqueValueInfosWithColor(newColor),
};


//Building featureLayer
const hospitalLayer = new FeatureLayer({
	url: hospitalUrl,
	popupTemplate: hospitalTemplate,
});
const fireStationLayer = new FeatureLayer({
	url: fireStationUrl,
});

//Optional featureLayer
const areaZoneFeatureLayer = new FeatureLayer({
	url: landZoneUrl,
	renderer: landZoneRenderer,
});

//Adding new layers to the map
map.addMany([ hospitalLayer, fireStationLayer]);
