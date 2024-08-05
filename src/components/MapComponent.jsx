import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";
import allLayersConfig from "../config/allLayersConfig";
import LegendComponent from "./LegendComponent";
import "../styles.css";
import "./SearchBar.css";

const MapComponent = ({ view, setView }) => {
    const mapRef = useRef(null);
    const legendRef = useRef(null);
    const searchRef = useRef(null);
    const viewRef = useRef(null);
    const visibleLayers = Object.values(allLayersConfig);
    const [isLegendVisible, setIsLegendVisible] = useState(false);
    
    useEffect(() => {
        console.log("MapComponent useEffect called");
        if (!mapRef.current) {
            console.log("mapRef.current is null");
            return;
        }
        const map = new Map({ basemap: "arcgis-navigation" });
        const newView = new MapView({
            container: mapRef.current,
            map: map,
            center: [-122.3328, 47.6061],
            zoom: 12,
            constraints: { snapToZoom: false },
            attribution: false,
        });

        legendRef.current = new Legend({
            view: newView,
        });

        map.addMany(visibleLayers);

        newView
            .when(() => {
                console.log("View is ready");
                viewRef.current = newView;
                setView(newView);
            })
            .catch((error) => {
                console.error("Error in view.when():", error);
            });

        newView.ui.remove("zoom");

        // Search bar
        const searchWidget = new Search({
            view: newView,
            container: searchRef.current,
            locationEnabled: false,
        });

        newView.ui.add(searchWidget, {
            position: "top-right",
        });

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
            if (searchRef.current) {
                searchRef.current.destroy();
                searchRef.current = null;
            }
        };
    }, [setView]);

    useEffect(() => {
        console.log("View prop updated:", view);
        if (view && view !== viewRef.current) {
            viewRef.current = view;
        }
    }, [view]);

    const toggleLegend = () => {
        setIsLegendVisible((prev) => {
            const newIsVisible = !prev;
            if (newIsVisible && viewRef.current) {
                viewRef.current.ui.add(legendRef.current, "bottom-right");
            } else if (viewRef.current) {
                viewRef.current.ui.remove(legendRef.current);
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
