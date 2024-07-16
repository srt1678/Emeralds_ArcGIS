import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import LayerList from "@arcgis/core/widgets/LayerList";
import {
    hospitalLayer,
    fireStationLayer,
    earthquakeLayer,
    unreinforcedBuildingLayer,
    populationLayer,
    earthquakeM6Layer,
} from "../layers";
import { handleRouteClick } from "../handlers/routeClickHandler";
import ClearRouteButton from "./ClearRouteButton";
import LayerSelector from "./LayerSelector";
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
    const mapRef = useRef(null);
    const viewRef = useRef(null);

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

        const allLayers = [
            earthquakeM6Layer,
            hospitalLayer,
            fireStationLayer,
            earthquakeLayer,
            unreinforcedBuildingLayer,
            populationLayer,
        ];

        map.addMany(allLayers);

        view.when(() => {
            viewRef.current = view;
            setView(view);
            const layerList = new LayerList({
                view: view,
            });

            // view.ui.add(layerList, "top-right");
            // Initial query to populate the dashboard
            queryHospitals();
        });

        view.on("click", (event) => {
            // view.hitTest(event).then((response) => {
            // handleRouteClick(view, response, null);
            // });
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
            queryHospitals(earthquakeM6Layer.definitionExpression); // Query again when active layers change
        }
    }, [activeLayers, layers]);

    const queryHospitals = (filterExpression) => {
        queryHospitalsUnderDamage(filterExpression)
            .then((hospitalsUnderDamage) => {
                // Debugging line to ensure the correct data is being set
                console.log("Hospitals under damage:", hospitalsUnderDamage);
                setHospitalsUnderDamage(hospitalsUnderDamage);
            })
            .catch((error) => {
                console.error(error);
            });
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

    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
            <ClearRouteButton clearRoute={clearRoute} />
            <LayerSelector
                layers={layers}
                toggleLayerVisibility={toggleLayerVisibility}
                onFilterChange={(selectedValues) => {
                    handleFilterChange(selectedValues);

                    const filterExpression =
                        selectedValues.length > 0
                            ? `damage IN (${selectedValues
                                  .map((v) => `${v}`)
                                  .join(", ")})`
                            : "damage IN ('3', '3.5')";
                    queryHospitals(filterExpression);
                }}
            />
        </div>
    );
};

export default MapComponent;
