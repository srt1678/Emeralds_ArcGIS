import React, { useState, useRef, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import DashboardComponent from "./components/DashboardComponent";
import {
    hospitalLayer,
    fireStationLayer,
    earthquakeLayer,
    unreinforcedBuildingLayer,
    populationLayer,
    earthquakeM6Layer,
} from "./layers";
import { getRoute } from "./utils/RouteService";
import "./style.css";

const App = () => {
    const [layers, setLayers] = useState([
        {
            id: hospitalLayer.id,
            title: "Hospital Layer",
            visible: hospitalLayer.visible,
        },
        {
            id: fireStationLayer.id,
            title: "Fire Station Layer",
            visible: fireStationLayer.visible,
        },
        {
            id: earthquakeLayer.id,
            title: "Earthquake Layer",
            visible: earthquakeLayer.visible,
        },
        {
            id: unreinforcedBuildingLayer.id,
            title: "Unreinforced Building Layer",
            visible: unreinforcedBuildingLayer.visible,
        },
        {
            id: populationLayer.id,
            title: "Population Layer",
            visible: populationLayer.visible,
        },
        {
            id: earthquakeM6Layer.id,
            title: "Earthquake M6 Layer",
            visible: earthquakeM6Layer.visible,
        },
    ]);

    const [selectedDamageValues, setSelectedDamageValues] = useState([]);
    const [view, setView] = useState(null);
    const [hospitalsUnderDamage, setHospitalsUnderDamage] = useState([]);
    const [dashboardWidth, setDashboardWidth] = useState(300); // Default width

    const toggleLayerVisibility = (layerId) => {
        setLayers(
            layers.map((layer) => {
                if (layer.id === layerId) {
                    const newVisibility = !layer.visible;
                    return { ...layer, visible: newVisibility };
                }
                return layer;
            })
        );
    };

    const handleFilterChange = (selectedValues = []) => {
        setSelectedDamageValues(selectedValues);

        const filterExpression =
            selectedValues.length > 0
                ? `damage IN (${selectedValues.map((v) => `${v}`).join(", ")})`
                : "damage IN (3, 3.5)";

        earthquakeM6Layer.definitionExpression = filterExpression;

        // Debugging line to ensure the filter expression is correctly set
        console.log(`Setting filter: ${filterExpression}`);

        if (earthquakeM6Layer.source) {
            earthquakeM6Layer.source.refresh();
        }
        // if (view) {
        //     getRoute(view, earthquakeM6Layer, selectedValues);
        // }
    };

    const resizerRef = useRef();

    useEffect(() => {
        const handleMouseDown = (e) => {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (e) => {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 200 && newWidth < window.innerWidth - 100) {
                // Minimum and maximum width constraints
                setDashboardWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const resizer = resizerRef.current;
        resizer.addEventListener("mousedown", handleMouseDown);

        return () => {
            resizer.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    return (
        <div className="App">
            <div
                className="MapContainer"
                style={{ flex: `0 0 calc(100% - ${dashboardWidth}px)` }}
            >
                <MapComponent
                    activeLayers={layers}
                    setView={setView}
                    setHospitalsUnderDamage={setHospitalsUnderDamage}
                    layers={layers}
                    toggleLayerVisibility={toggleLayerVisibility}
                    handleFilterChange={handleFilterChange}
                />
            </div>
            <div
                className="DashboardContainer"
                style={{ width: dashboardWidth }}
            >
                <DashboardComponent
                    hospitalsUnderDamage={hospitalsUnderDamage}
                    view={view}
                />
                <div ref={resizerRef} className="Resizer"></div>
            </div>
        </div>
    );
};

export default App;