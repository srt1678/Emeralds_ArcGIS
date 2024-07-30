import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import CustomLayerList from "./CustomLayerList";
import AnalysisComponent from "./AnalysisComponent";
import LayerSelector from "./LayerSelector";
import {
    clearHighlights,
    highlightFeature,
    highlightArea,
} from "../utils/HighlightService";
import "../styles.css";
import Graphic from "@arcgis/core/Graphic";
import { queryPopulation } from "../utils/PopulationService";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import { infrastructureLayers } from "../config/infrastructureLayers";

const MapWrapper = ({
    activeMode,
    featuresUnderDamage,
    handleFilterChange,
    sourceInfra,
    targetInfra,
    neighborhoodGeometries,
}) => {
    const [view, setView] = useState(null);
    const [populationData, setPopulationData] = useState([]);

    useEffect(() => {
        if (view && featuresUnderDamage && featuresUnderDamage.length > 0) {
            clearHighlights(view);
            featuresUnderDamage.forEach((feature, index) => {
                highlightFeature(view, feature);
            });
            const fetchPopulationData = async () => {
                const data = await queryPopulation(featuresUnderDamage);
                setPopulationData(data);
                // console.log(
                //     "Final population results:",
                //     JSON.stringify(data, null, 2)
                // );
            };
            fetchPopulationData();

            // Zoom to the features
            // const geometries = featuresUnderDamage.map(feature => feature.geometry);
            // view.goTo(geometries);
        }
    }, [featuresUnderDamage, view]);
    
    useEffect(() => {
        if (view) {
            clearHighlights(view);
            if (neighborhoodGeometries && neighborhoodGeometries.length > 0) {
                neighborhoodGeometries.forEach((neighborhood) => {
                    highlightArea(view, neighborhood);
                });
            }
        }
    }, [neighborhoodGeometries, view]);

    // Get analysis title
    const getTitle = () => {
        if (sourceInfra && infrastructureLayers[sourceInfra]) {
            return `${infrastructureLayers[sourceInfra].name} Under Damage`;
        }
        return "Infrasture Under Damage";
    };

    return (
        <div className="map-wrapper">
            <div className="analysis-container" style={{ flex: "0 0 auto" }}>
                <AnalysisComponent
                    view={view}
                    featuresUnderDamage={featuresUnderDamage}
                    title={getTitle()}
                    populationData={populationData}
                    targetInfra={targetInfra}
                />
            </div>
            <div
                className="map-container"
                style={{ flex: "1 1 auto", position: "relative" }}
            >
                <MapComponent setView={setView} activeMode={activeMode} />
                {view && <CustomLayerList view={view} />}
                {activeMode && earthquakeScenarioModes[activeMode] && (
                    <div className="layer-selector-wrapper">
                        <LayerSelector
                            layer={earthquakeScenarioModes[activeMode].layer}
                            filterField={
                                earthquakeScenarioModes[activeMode].filterField
                            }
                            onFilterChange={(values) =>
                                handleFilterChange(
                                    earthquakeScenarioModes[activeMode].layer,
                                    earthquakeScenarioModes[activeMode]
                                        .filterField,
                                    values
                                )
                            }
                            isVisible={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapWrapper;
