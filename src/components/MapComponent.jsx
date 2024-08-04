import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";
import allLayersConfig from "../config/allLayersConfig";
import CustomLayerList from "./CustomLayerList";
import LayerSelector from "./LayerSelector";
import LegendComponent from "./LegendComponent";
import "../styles.css";
import "./SearchBar.css";

const MapComponent = ({ view, setView }) => {
	const mapRef = useRef(null);
	const legendRef = useRef(null);
	const searchRef = useRef(null);
	// const viewRef = useRef(null);
	const visibleLayers = Object.values(allLayersConfig);
	const [isLegendVisible, setIsLegendVisible] = useState(false);

	useEffect(() => {
		// console.log("MapComponent useEffect called");
		if (!mapRef.current) {
			console.log("mapRef.current is null");
			return;
		}
		const map = new Map({ basemap: "arcgis-navigation" });

		const view = new MapView({
			container: mapRef.current,
			map: map,
			center: [-122.3328, 47.6061],
			zoom: 12,
			constraints: { snapToZoom: false },
			attribution: false,
		});
		legendRef.current = new Legend({
			view: view,
		});

		map.addMany(visibleLayers);

		view.when(() => {
			// viewRef.current = view;
			setView(view);
		});

		view.ui.remove("zoom");
		// Search bar
		const searchWidget = new Search({
			view: view,
			container: searchRef.current,
			locationEnabled: false,
		});
		view.ui.add(searchWidget, {
			position: "top-right",
		});

		return () => {
			if (view) {
				view.destroy();
				view.container = null;
			}
			if (searchRef.current) {
				searchRef.current.destroy();
				searchRef.current = null;
			}
		};
	}, [setView]);

	const handleFilterChange = (newSelectedValues) => {
		// Handle the filter change to update the analysis part
		console.log("Filter changed:", newSelectedValues);
	};

	const toggleLegend = () => {
		setIsLegendVisible((prev) => {
			const newIsVisible = !prev;
			if (newIsVisible) {
				view.ui.add(legendRef.current, "bottom-right");
			} else {
				view.ui.remove(legendRef.current);
			}
			return newIsVisible;
		});
	};

	return (
		<>
			<LegendComponent toggleLegend={toggleLegend} />
			<div ref={mapRef} className="map-view"></div>
		</>
	);
};

export default MapComponent;
