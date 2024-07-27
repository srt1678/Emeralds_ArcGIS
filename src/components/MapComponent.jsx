import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import Legend from "@arcgis/core/widgets/Legend.js";
import LayerList from "@arcgis/core/widgets/LayerList";
import Search from "@arcgis/core/widgets/Search.js";
import {
	hospitalLayer,
	fireStationLayer,
	earthquakeLayer,
	unreinforcedBuildingLayer,
	populationLayer,
	earthquakeM6Layer,
	dWWMainlinesLayer,
	historicalEarthquakeLayer,
} from "../layers";
import {
	ClearRouteButton,
	LayerSelector,
	LegendComponent,
	SearchBar,
} from "./ComponentsIndex";
import { clearRouteLayer } from "../utils/RouteService";
import { queryHospitalsUnderDamage } from "../utils/HospitalService";

const MapComponent = ({
	activeLayers,
	setView,
	setHospitalsUnderDamage,
	layers,
	toggleLayerVisibility,
	handleFilterChange,
}) => {
	const [isLegendVisible, setIsLegendVisible] = useState(false);
	const mapRef = useRef(null);
	const viewRef = useRef(null);
	const legendRef = useRef(null);
	const searchWidgetRef = useRef(null);

	useEffect(() => {
		esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

		const map = new Map({ basemap: "arcgis-navigation" });

		const view = new MapView({
			container: mapRef.current,
			map: map,
			center: [-122.3328, 47.6061],
			zoom: 12,
			constraints: { snapToZoom: false },
		});

		legendRef.current = new Legend({
			view: view,
		});

		const allLayers = [
			earthquakeM6Layer,
			hospitalLayer,
			fireStationLayer,
			earthquakeLayer,
			unreinforcedBuildingLayer,
			populationLayer,
			dWWMainlinesLayer,
			historicalEarthquakeLayer,
		];

		map.addMany(allLayers);

		view.when(() => {
			viewRef.current = view;
			setView(view); // Set the view reference in the parent component
			const layerList = new LayerList({
				view: view,
			});

			// view.ui.add(layerList, "top-right");

			queryInitialData(); // Initial query to populate the dashboard
		});
		view.ui.remove("zoom"); //remove zoom in and out button

		/*
        // ArcGis build-in search bar + functionalities (alternative way)
        const searchWidget = new Search({
            view: view
        })
        view.ui.add(searchWidget, {
            position: "top-right",
            
        })
        */

		searchWidgetRef.current = new Search({
			view: view,
			id: "searchWidget",
		});

		return () => {
			if (view) {
				view.destroy();
				view.container = null;
			}
		};
	}, [setView]);

	useEffect(() => {
		if (viewRef.current) {
			activeLayers.forEach((layer) => {
				const mapLayer = getLayerById(layer.id);
				if (mapLayer) {
					mapLayer.visible = layer.visible;
				}
			});
			queryInitialData(); // Query again when active layers change
		}
	}, [activeLayers, layers]);

	const queryInitialData = async (
		filterExpression = "damage IN ('3', '3.5')"
	) => {
		try {
			const hospitalsUnderDamage = await queryHospitalsUnderDamage(
				filterExpression
			);
			console.log("Hospitals under damage:", hospitalsUnderDamage);
			setHospitalsUnderDamage(hospitalsUnderDamage);
		} catch (error) {
			console.error("Error querying data:", error);
		}
	};

	const getLayerById = (layerId) => {
		switch (layerId) {
			case hospitalLayer.id:
				return hospitalLayer;
			case fireStationLayer.id:
				return fireStationLayer;
			case earthquakeLayer.id:
				return earthquakeLayer;
			case unreinforcedBuildingLayer.id:
				return unreinforcedBuildingLayer;
			case populationLayer.id:
				return populationLayer;
			case earthquakeM6Layer.id:
				return earthquakeM6Layer;
			case dWWMainlinesLayer.id:
				return dWWMainlinesLayer;
			case historicalEarthquakeLayer.id:
				return historicalEarthquakeLayer;
			default:
				return null;
		}
	};

	const clearRoute = () => {
		if (viewRef.current) {
			viewRef.current.graphics.removeAll();
			clearRouteLayer();
		}
	};

	const toggleLegend = () => {
		setIsLegendVisible((prev) => {
			const newIsVisible = !prev;
			if (newIsVisible) {
				viewRef.current.ui.add(legendRef.current, "bottom-left");
			} else {
				viewRef.current.ui.remove(legendRef.current);
			}
			return newIsVisible;
		});
	};

	const handleSearch = (searchTerm) => {
		if (searchWidgetRef.current) {
			searchWidgetRef.current.search(searchTerm);
		}
	};

	return (
		<div style={{ position: "relative", height: "100%", width: "100%" }}>
			<div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
			<ClearRouteButton clearRoute={clearRoute} />
			<SearchBar onSearch={handleSearch} viewRef={viewRef} />
			<LayerSelector
				layers={layers}
				toggleLayerVisibility={toggleLayerVisibility}
				onFilterChange={(selectedValues) => {
					handleFilterChange(selectedValues);

					const filterExpression =
						selectedValues.length > 0
							? `damage IN (${selectedValues.map((v) => `${v}`).join(", ")})`
							: "damage IN ('3', '3.5')";
					queryInitialData(filterExpression);
				}}
			/>
			<LegendComponent toggleLegend={toggleLegend} />
		</div>
	);
};

export default MapComponent;
