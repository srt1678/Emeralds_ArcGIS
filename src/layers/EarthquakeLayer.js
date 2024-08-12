import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import Point from "@arcgis/core/geometry/Point.js";
import Circle from "@arcgis/core/geometry/Circle.js";
import Graphic from "@arcgis/core/Graphic.js";

// Define the popup template for the Earthquakes >1M layer
const earthquakeTemplate = {
    title: "Earthquake Magnitude: {EARTHQUAKE_MAGNITUDE}",
    content: [
        {
            type: "fields",
            fieldInfos: [
                { fieldName: "EARTHQUAKE_DEPTH_KM", label: "Depth (km)" },
                { fieldName: "DATE_TIME_UTC", label: "UTC Time" },
                { fieldName: "DATE_TIME_LOCAL", label: "Local Time" },
                { fieldName: "LATITUDE_DECIMAL_DEGREES", label: "Latitude" },
                { fieldName: "LONGITUDE_DECIMAL_DEGREES", label: "Longitude" },
                { fieldName: "COUNTY_NAME", label: "County" },
            ],
        },
    ],
};

// Define the Earthquakes >1M layer
const earthquakeLayer = new FeatureLayer({
    id: "earthquakeLayer",
    url: "https://gis.dnr.wa.gov/site1/rest/services/Public_Geology/Earthquake/MapServer/5",
		title: "Seattle Earthquakes >1M",
    outFields: ["*"],
    visible: false,
    listMode: "show",
    popupTemplate: earthquakeTemplate,
});

function addEarthquakeGraphics() {
	const seattleExtent = new Extent({
		xmin: -122.45,
		ymin: 47.5,
		xmax: -122.2,
		ymax: 47.7,
		spatialReference: {
			wkid: 4326,
		},
	});
	const query = earthquakeLayer.createQuery();
	query.geometry = seattleExtent;
	query.spatialRelationship = "intersects";
	query.outFields = ["*"];
	query.returnGeometry = true;

	return earthquakeLayer
		.queryFeatures(query)
		.then((featureSet) => {
			const graphics = featureSet.features.map((feature) => {
				const attributes = feature.attributes;
				const latitude = attributes.LATITUDE_DECIMAL_DEGREES;
				const longitude = attributes.LONGITUDE_DECIMAL_DEGREES;
				const magnitude = attributes.EARTHQUAKE_MAGNITUDE;

				// Calculate affected radius
				const radiusMeter = Math.pow(10, 0.43 * magnitude - 1.55) * 1000;

				// Create a center point of earthquake
				const point = new Point({
					latitude: latitude,
					longitude: longitude,
				});

				// Create a circle representing the earthquake
				const circle = new Circle({
					center: point,
					geodesic: true,
					radius: radiusMeter,
					radiusUnit: "meters",
				});

				// Create a graphic for the affected area circle
				return new Graphic({
					geometry: circle,
					symbol: {
						type: "simple-fill",
						color: [255, 0, 0, 0.25],
						outline: {
							color: "red",
							width: 1,
						},
					},
				});
			});

			return graphics;
		})
		.catch((error) => {
			console.error("Error querying earthquake features:", error);
			return [];
		});
}

export { earthquakeLayer, addEarthquakeGraphics };
