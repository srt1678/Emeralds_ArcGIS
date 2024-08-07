import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import Papa from "papaparse";

export async function loadPowerStationLayer() {
	try {
		const response = await fetch("../../Public-Source-Substations.csv");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const csvText = await response.text();

		const parsed = Papa.parse(csvText, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
		});

		const features = parsed.data;

		if (features.length === 0) {
			throw new Error("No valid features with latitude and longitude found");
		}

		const graphics = features.map((attributes) => {
			return new Graphic({
				geometry: new Point({
					longitude: parseFloat(attributes.Longitude),
					latitude: parseFloat(attributes.Latitude),
				}),
				attributes: attributes,
			});
		});

		const powerStationLayer = new FeatureLayer({
			title: "Power Stations",
			source: graphics,
			objectIdField: "OBJECTID",
			fields: [
				{ name: "OBJECTID", alias: "ObjectID", type: "oid" },
				{ name: "Substation", alias: "Substation", type: "string" },
				{ name: "Address", alias: "Address", type: "string" },
				{ name: "Zip", alias: "Zip Code", type: "string" },
				{ name: "Serving", alias: "Serving Areas", type: "string" },
				{ name: "Latitude", alias: "Latitude", type: "double" },
				{ name: "Longitude", alias: "Longitude", type: "double" },
			],
			geometryType: "point",
			spatialReference: { wkid: 4326 },
			renderer: {
				type: "simple",
				symbol: {
					type: "simple-marker",
					color: "purple",
					size: 8,
					outline: {
						color: "white",
						width: 1,
					},
				},
			},
			popupTemplate: {
				title: "Substation: {Substation}",
				content: [
					{
						type: "fields",
						fieldInfos: [
							{ fieldName: "Address", label: "Address" },
							{ fieldName: "Zip", label: "Zip Code" },
							{ fieldName: "Serving", label: "Serving Areas" },
						],
					},
				],
			},
			visible: false,
			listMode: "show",
		});

		return powerStationLayer;
	} catch (error) {
		console.error("Error in loadPowerStationLayer:", error);
		throw error;
	}
}
