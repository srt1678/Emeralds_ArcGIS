import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";
import allLayersConfig from "../config/allLayersConfig";
import LegendComponent from "./LegendComponent";
import "../styles.css";
import "./SearchBar.css";
import "./LegendComponent.css";
import { loadPowerStationLayer } from "../layers/PowerStationLayer";

const MapComponent = ({ view, setView, onSearchComplete, onClearAll, clearTrigger }) => {
    const mapRef = useRef(null);
    const legendRef = useRef(null);
    // const searchRef = useRef(null);
    const searchWidgetRef = useRef(null);
    const viewRef = useRef(null);
    const visibleLayers = Object.values(allLayersConfig);
    const [isLegendVisible, setIsLegendVisible] = useState(false);

    const clearGraphics = () => {
        if (viewRef.current) {
            viewRef.current.graphics.removeAll();
        }
        if (searchWidgetRef.current) {
            searchWidgetRef.current.clear();
        }
        onSearchComplete(null);
        onClearAll();
    };

    useEffect(() => {
        if (clearTrigger > 0) {
            clearGraphics();
        }
    }, [clearTrigger, onClearAll, onSearchComplete]);

    useEffect(() => {
        // console.log("MapComponent useEffect called");
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
            container: document.createElement("div"),
        });

        map.addMany(visibleLayers);

        newView
            .when(() => {
                console.log("View is ready");
                viewRef.current = newView;
                setView(newView);

                loadPowerStationLayer()
                    .then((powerStationLayer) => {
                        map.add(powerStationLayer);
                    })
                    .catch((error) => {
                        console.error(
                            "Error loading power station layer:",
                            error
                        );
                    });
            })
            .catch((error) => {
                console.error("Error in view.when():", error);
            });

        newView.ui.remove("zoom");

        // Search bar
        searchWidgetRef.current = new Search({
            view: newView,
            locationEnabled: false,
        });
        // Add event listener for search-complete
        searchWidgetRef.current.on("search-complete", (event) => {
            if (
                event.results &&
                event.results[0] &&
                event.results[0].results[0]
            ) {
                const result = event.results[0].results[0];
                // console.log("Search result address:", result.name);
                // console.log("Full search result:", result);
                // Call the callback function with the search result
                onSearchComplete(result);
            } else {
                console.log("No results found or search was cleared");
                onSearchComplete(null);
            }
        });

        // Clear graphics button
        const clearButton = document.createElement("button");
        clearButton.innerHTML = `
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm6.605-17.581l-10.677 10.68 5.658 5.659 10.676-10.682-5.657-5.657z"/></svg>
        `;
        clearButton.title = "Clear Graphics";
        clearButton.className = "custom-clear-button";
        clearButton.addEventListener("click", clearGraphics);

        // Add search widget and clear button to the UI
        newView.ui.add(searchWidgetRef.current, "top-right");
        newView.ui.add(clearButton, "top-right");

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
            if (searchWidgetRef.current) {
                searchWidgetRef.current.destroy();
                searchWidgetRef.current = null;
            }
        };
    }, [setView]);

    useEffect(() => {
        // console.log("View prop updated:", view);
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
            <LegendComponent
                toggleLegend={toggleLegend}
                isLegendVisible={isLegendVisible}
                view={viewRef.current}
                clearTrigger={clearTrigger}
            />
            <div ref={mapRef} className="map-view"></div>
        </>
    );
};

export default MapComponent;
