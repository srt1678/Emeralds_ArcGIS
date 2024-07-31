
import React, { useState, useEffect } from "react";
import MapWrapper from "./components/MapWrapper";
import Menu from "./components/Menu";
import { queryFeaturesUnderDamage } from "./utils/DamagedInfraQueryService";
import { queryNeighborhoodGeometries } from "./utils/NeighborhoodQueryService";
import "./styles.css";
import esriConfig from "@arcgis/core/config";
import { earthquakeScenarioModes } from "./config/earthquakeSenarioModes";
import { infrastructureLayers } from "./config/infrastructureLayers";

const apiKey = esriConfig.apiKey;

const App = () => {
    const [activeMode, setActiveMode] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [featuresUnderDamage, setFeaturesUnderDamage] = useState([]);
    const [sourceInfra, setSourceInfra] = useState(null);
    const [targetInfra, setTargetInfra] = useState(null);
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
    const [neighborhoodGeometries, setNeighborhoodGeometries] = useState([]);

    // Select earthquake senarios
    const handleOptionSelect = (option) => {
        if (option && earthquakeScenarioModes[option]) {
            setActiveMode(option);
        } else {
            setActiveMode(null);
            setFeaturesUnderDamage([]);
        }
    };

    const handleFilterChange = async (earthquakeLayer, filterField, values) => {
        setSelectedValues(values);
        if (sourceInfra) {
            const features = await queryFeaturesUnderDamage(
                earthquakeLayer,
                infrastructureLayers[sourceInfra].layer,
                values,
                filterField,
                neighborhoodGeometries
            );
            setFeaturesUnderDamage(features);
        }
    };

    useEffect(() => {
        const fetchNeighborhoodGeometries = async () => {
            if (selectedNeighborhoods.length > 0) {
                const geometries = await queryNeighborhoodGeometries(
                    selectedNeighborhoods.map((n) => n.value)
                );
                setNeighborhoodGeometries(geometries);
            } else {
                setNeighborhoodGeometries([]);
            }
        };

        fetchNeighborhoodGeometries();
    }, [selectedNeighborhoods]);

    return (
        <div className="app">
            <div className="menu-container">
                <div className="menu-inner">
                    <Menu
                        onOptionSelect={handleOptionSelect}
                        onSourceInfraSelect={setSourceInfra}
                        onTargetInfraSelect={setTargetInfra}
                        onNeighborhoodSelect={setSelectedNeighborhoods}
                        infrastructureLayers={infrastructureLayers}
                    />
                </div>
            </div>
            <div className="main-container">
                <div className="map-container">
                    <MapWrapper
                        activeMode={activeMode}
                        featuresUnderDamage={featuresUnderDamage}
                        handleFilterChange={handleFilterChange}
                        sourceInfra={sourceInfra}
                        targetInfra={targetInfra}
                        neighborhoodGeometries={neighborhoodGeometries}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;