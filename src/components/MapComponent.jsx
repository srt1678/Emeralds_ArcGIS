import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import {
    hospitalLayer,
    fireStationLayer,
    earthquakeLayer,
    unreinforcedBuildingLayer,
    populationLayer,
    earthquakeM6Layer,
    cityLightLineLayer,
} from "../layers";
import CustomLayerList from "./CustomLayerList";
import LayerSelector from "./LayerSelector";
import "../styles.css";

const MapComponent = ({ setView, activeMode }) => {
    const mapRef = useRef(null);
    // const viewRef = useRef(null);
    const visibleLayers = [
        earthquakeM6Layer,
        earthquakeLayer,
        unreinforcedBuildingLayer,
        populationLayer,
        cityLightLineLayer,
        hospitalLayer,
        fireStationLayer,
    ];

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
        });

        map.addMany(visibleLayers);

        view.when(() => {
            // viewRef.current = view;
            setView(view);

            // Move the zoom control to the bottom left
            view.ui.move("zoom", "bottom-left");
        });

        return () => {
            if (view) {
                view.destroy();
                view.container = null;
            }
        };
    }, [setView]);

    const handleFilterChange = (newSelectedValues) => {
        // Handle the filter change to update the analysis part
        console.log("Filter changed:", newSelectedValues);
    };

    return <div ref={mapRef} className="map-view"></div>;
};

export default MapComponent;
