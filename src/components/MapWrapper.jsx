import React, { useState, useEffect, useCallback } from "react";
import MapComponent from "./MapComponent";
import CustomLayerList from "./CustomLayerList";
import AnalysisComponent from "./AnalysisComponent";
import LayerSelector from "./LayerSelector";
import {
    clearCurrentHighlights,
    highlightFeature,
    highlightArea,
} from "../utils/HighlightService";
import "../styles.css";

import { queryPopulation } from "../utils/PopulationService";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import { earthquakeCustomScenarioLayer } from "../layers";
import Sketch from "@arcgis/core/widgets/Sketch";
import Menu from "./Menu";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import * as projection from "@arcgis/core/geometry/projection";
import Point from "@arcgis/core/geometry/Point";
import { RECORD_SEP } from "papaparse";

const MapWrapper = ({
    featuresUnderDamage,
    setFeaturesUnderDamage,
    handleFilterChange,
    sourceInfra,
    targetInfra,
    neighborhoodGeometries,
    handleOptionSelect,
    setSourceInfra,
    setTargetInfra,
    setSelectedNeighborhoods,
    infrastructureLayers,
}) => {
    const [view, setView] = useState(null);
    const [populationData, setPopulationData] = useState([]);
    const [activeLayer, setActiveLayer] = useState(null);
    const [showAdvanceSelection, setShowAdvanceSelection] = useState(false);
    // const [showAnalysis, setShowAnalysis] = useState(true);
    const [clearLayersFlag, setClearLayersFlag] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);

    // Search bar
    const [searchResult, setSearchResult] = useState(null);
    const [showSearchMenu, setShowSearchMenu] = useState(false);
    const [isCustomSearch, setIsCustomSearch] = useState(false);

    // Modeled earthquake scenarios
    const [isModeledScenario, setIsModeledScenario] = useState(false);

    // Custom earthquake scenarios
    const [sketchWidget, setSketchWidget] = useState(null);
    const [isCustomScenario, setIsCustomScenario] = useState(false);
    const [customScenarioGeometry, setCustomScenarioGeometry] = useState(null);
    const [isCustomSketchComplete, setIsCustomSketchComplete] = useState(false);

    // Clear all states
    const handleClearAll = useCallback(() => {
        setShowSearchMenu(false);
        setIsCustomSearch(false);
        setFeaturesUnderDamage([]);
        setActiveLayer(null);
        setIsCustomScenario(false);
        setCustomScenarioGeometry(null);
        setIsCustomSketchComplete(false);
        // trigger layer clearing in CustomLayerList
        setClearLayersFlag(true);
        setClearTrigger((prev) => prev + 1);

        if (view) {
            // Clear all graphics from the view
            view.graphics.removeAll();

            // Clear any sketched geometries
            if (sketchWidget) {
                sketchWidget.layer.removeAll();
                view.ui.remove(sketchWidget);
                setSketchWidget(null);
            }

            // Clear any highlighted features
            view.highlightOptions.remove();
        }

        // Reset the earthquake custom scenario layer if it exists
        if (earthquakeCustomScenarioLayer) {
            earthquakeCustomScenarioLayer.removeAll();
        }

        // Reset all layer visibilities
        Object.values(earthquakeScenarioModes).forEach((mode) => {
            if (mode.layer) {
                mode.layer.visible = false;
            }
        });
    }, [view, sketchWidget, setFeaturesUnderDamage]);

    const handleZoomToFeature = useCallback(
        async (x, y, spatialReference) => {
            if (!view) {
                console.warn("View is not available. Zoom operation skipped.");
                return;
            }
            if (view) {
                try {
                    // Ensure the projection module is loaded
                    await projection.load();

                    // Define the target spatial reference (view's spatial reference)
                    const targetSpatialReference = view.spatialReference;

                    // Create a point geometry from x, y
                    const point = new Point({
                        x,
                        y,
                        spatialReference,
                    });

                    // Reproject the point to match the view's spatial reference
                    const reprojectedPoint = projection.project(
                        point,
                        targetSpatialReference
                    );

                    // Zoom to the reprojected point
                    view.goTo({
                        target: reprojectedPoint,
                        zoom: 15,
                    }).catch((error) => {
                        if (error.name !== "AbortError") {
                            console.error("Error in view.goTo():", error);
                        }
                    });
                } catch (error) {
                    console.error("Error in projecting geometry:", error);
                }
            } else {
                console.error("View is not available");
            }
        },
        [view]
    );

    // Reset clearLayersFlag after it's been consumed
    useEffect(() => {
        if (clearLayersFlag) {
            setClearLayersFlag(false);
        }
    }, [clearLayersFlag]);

    // highlighting features and fetching population data
    useEffect(() => {
        if (view && featuresUnderDamage.length == 0) {
            clearCurrentHighlights(view);
        }
        if (view && featuresUnderDamage && featuresUnderDamage.length > 0) {
            clearCurrentHighlights(view);
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
        }
    }, [featuresUnderDamage, view]);

    // highlighting neighborhood geometries
    useEffect(() => {
        if (view) {
            clearCurrentHighlights(view);
            if (neighborhoodGeometries && neighborhoodGeometries.length > 0) {
                neighborhoodGeometries.forEach((neighborhood) => {
                    highlightArea(view, neighborhood);
                });
            }
        }
    }, [neighborhoodGeometries, view]);

    // creating the sketch widget
    useEffect(() => {
        if (view && activeLayer && isCustomScenario && !sketchWidget) {
            console.log("Creating Sketch widget");
            const sketch = new Sketch({
                layer: earthquakeCustomScenarioLayer,
                view: view,
                creationMode: "single",
                defaultCreateOptions: { mode: "freehand" },
            });
            setSketchWidget(sketch);

            sketch.on("create", (event) => {
                console.log("Sketch event:", event.state);
                if (event.state === "complete") {
                    setCustomScenarioGeometry(event.graphic.geometry);
                    setIsCustomSketchComplete(true);
                }
            });

            view.ui.add(sketch, "bottom-left");
            console.log("Sketch widget added to view");
        }
    }, [view, activeLayer, isCustomScenario, sketchWidget]);

    // adding/removing the sketch widget from the UI
    useEffect(() => {
        if (view && sketchWidget) {
            if (activeLayer && isCustomScenario) {
                // view.ui.add(sketchWidget, "bottom-left");
                // console.log("Sketch widget added to view", sketchWidget);
                // console.log("Active layer:", activeLayer);
                // console.log("Is custom scenario:", isCustomScenario);
            } else {
                view.ui.remove(sketchWidget);
                // console.log("Sketch widget removed from view");
            }
        }
    }, [view, sketchWidget, activeLayer, isCustomScenario]);

    // Get analysis title
    const getTitle = () => {
        let len = featuresUnderDamage.length;
        if (sourceInfra && infrastructureLayers[sourceInfra]) {
            return `${len} ${infrastructureLayers[sourceInfra].name} Under Damage`;
        }
        return "Infrastructure Under Damage";
    };

    // custom
    const handleLayerSelect = (layer) => {
        // console.log("Layer selected:", layer != null);
        setActiveLayer(layer);
        setShowAdvanceSelection(true);
        if (layer === earthquakeCustomScenarioLayer) {
            // console.log("Setting custom scenario mode");
            setIsCustomScenario(true);
            setIsCustomSketchComplete(false);
            setFeaturesUnderDamage([]);
        } else if (
            layer === earthquakeScenarioModes.earthquakeM6ImpactMode.layer ||
            layer === earthquakeScenarioModes.earthquakeM7ImpactMode.layer
        ) {
            setIsCustomScenario(false);
            setIsModeledScenario(true);
        } else {
            // console.log("Exiting custom scenario mode");
            // When activeLayer is null
            setIsCustomScenario(false);
            setIsModeledScenario(false);
            if (view && sketchWidget) {
                view.ui.remove(sketchWidget);
                setSketchWidget(null);
            }
        }
    };

    const applyFilter = (values) => {
        if (!activeLayer) return;

        if (isCustomScenario && customScenarioGeometry) {
            handleFilterChange(
                activeLayer,
                "damage",
                [],
                customScenarioGeometry
            );
        } else {
            if (values.length > 0) {
                activeLayer.definitionExpression = `damage IN (${values
                    .map((v) => `'${v}'`)
                    .join(", ")})`;
            } else {
                activeLayer.definitionExpression = null;
            }
            handleFilterChange(activeLayer, "damage", values);
        }
    };

    // Search
    const handleSearchComplete = useCallback(
        (result) => {
            setSearchResult(result);
            // console.log(JSON.stringify(result, null, 2));
            if (result && result.feature && result.feature.geometry) {
                setShowSearchMenu(true);
                setIsCustomSearch(true);
                try {
                    const { x, y, spatialReference } = result.feature.geometry;
                    if (view) {
                        handleZoomToFeature(x, y, spatialReference);
                    }
                } catch (error) {
                    console.error("Error processing search result:", error);
                }
            } else {
                console.log("Search result does not contain valid geometry.");
                setShowSearchMenu(false);
                setIsCustomSearch(false);
            }
        },
        [handleZoomToFeature]
    );

    // Handle menu visibility
    useEffect(() => {
        if (searchResult && showSearchMenu) {
            setShowAdvanceSelection(true);
        } else if (!activeLayer && !isCustomScenario) {
            setShowAdvanceSelection(false);
        }
    }, [searchResult, showSearchMenu, activeLayer, isCustomScenario]);

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <MapComponent
                    view={view}
                    setView={setView}
                    onSearchComplete={handleSearchComplete}
                    onClearAll={handleClearAll}
                />
                {view && (
                    <CustomLayerList
                        view={view}
                        onLayerSelect={handleLayerSelect}
                        earthquakeM6Layer={
                            earthquakeScenarioModes.earthquakeM6ImpactMode.layer
                        }
                        earthquakeM7Layer={
                            earthquakeScenarioModes.earthquakeM7ImpactMode.layer
                        }
                        earthquakeCustomScenarioLayer={
                            earthquakeScenarioModes.earthquakeCustomScenarioMode
                                .layer
                        }
                        clearLayersFlag={clearLayersFlag}
                    />
                )}

                {/* Search Result Menu */}
                {searchResult && showSearchMenu && (
                    <div className="advance-selection-container">
                        <div
                            className={
                                showAdvanceSelection
                                    ? "advance-selection-visible"
                                    : "advance-selection-nonvisible"
                            }
                        >
                            <div className="advance-selection">
                                <Menu
                                    onOptionSelect={handleOptionSelect}
                                    onSourceInfraSelect={setSourceInfra}
                                    onTargetInfraSelect={setTargetInfra}
                                    onNeighborhoodSelect={
                                        setSelectedNeighborhoods
                                    }
                                    infrastructureLayers={infrastructureLayers}
                                    isCustomScenario={isCustomScenario}
                                    isCustomSketchComplete={
                                        isCustomSketchComplete
                                    }
                                    isCustomSearch={isCustomSearch}
                                    applyFilter={applyFilter}
                                />
                                <br />
                                {/* <LayerSelector
                                    layer={activeLayer}
                                    onFilterChange={applyFilter}
                                /> */}
                                <AnalysisComponent
                                    view={view}
                                    featuresUnderDamage={featuresUnderDamage}
                                    title={"Search"}
                                    populationData={populationData}
                                    targetInfra={targetInfra}
                                    onZoomToFeature={handleZoomToFeature}
                                    isCustomSearch={isCustomSearch}
                                    searchResult={searchResult}
                                />
                            </div>
                            <div
                                className="advance-selection-toggle"
                                onClick={() =>
                                    setShowAdvanceSelection(
                                        !showAdvanceSelection
                                    )
                                }
                            >
                                {showAdvanceSelection ? (
                                    <MdKeyboardDoubleArrowLeft />
                                ) : (
                                    <MdKeyboardDoubleArrowRight />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Custom Earthquake Scenario */}
                {activeLayer && isCustomScenario && isCustomSketchComplete && (
                    <>
                        <div className="advance-selection-container">
                            <div
                                className={
                                    showAdvanceSelection
                                        ? "advance-selection-visible"
                                        : "advance-selection-nonvisible"
                                }
                            >
                                <div className="advance-selection">
                                    <Menu
                                        onOptionSelect={handleOptionSelect}
                                        onSourceInfraSelect={setSourceInfra}
                                        onTargetInfraSelect={setTargetInfra}
                                        onNeighborhoodSelect={
                                            setSelectedNeighborhoods
                                        }
                                        infrastructureLayers={
                                            infrastructureLayers
                                        }
                                        isCustomScenario={isCustomScenario}
                                        isCustomSketchComplete={
                                            isCustomSketchComplete
                                        }
                                        applyFilter={applyFilter}
                                    />
                                    <br />
                                    {!isCustomScenario && (
                                        <LayerSelector
                                            layer={activeLayer}
                                            onFilterChange={applyFilter}
                                        />
                                    )}
                                    <AnalysisComponent
                                        view={view}
                                        featuresUnderDamage={
                                            featuresUnderDamage
                                        }
                                        title={getTitle()}
                                        populationData={populationData}
                                        targetInfra={targetInfra}
                                        onZoomToFeature={handleZoomToFeature}
                                    />
                                </div>
                                <div
                                    className="advance-selection-toggle"
                                    onClick={() =>
                                        setShowAdvanceSelection(
                                            !showAdvanceSelection
                                        )
                                    }
                                >
                                    {showAdvanceSelection ? (
                                        <MdKeyboardDoubleArrowLeft />
                                    ) : (
                                        <MdKeyboardDoubleArrowRight />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* M6 & M7 Earthquake Scenario */}
                {activeLayer && !isCustomScenario && isModeledScenario && (
                    <>
                        <div className="advance-selection-container">
                            <div
                                className={
                                    showAdvanceSelection
                                        ? "advance-selection-visible"
                                        : "advance-selection-nonvisible"
                                }
                            >
                                <div className="advance-selection">
                                    <Menu
                                        onOptionSelect={handleOptionSelect}
                                        onSourceInfraSelect={setSourceInfra}
                                        onTargetInfraSelect={setTargetInfra}
                                        onNeighborhoodSelect={
                                            setSelectedNeighborhoods
                                        }
                                        infrastructureLayers={
                                            infrastructureLayers
                                        }
                                        isCustomScenario={isCustomScenario}
                                        isCustomSketchComplete={
                                            isCustomSketchComplete
                                        }
                                        applyFilter={applyFilter}
                                    />
                                    {!isCustomScenario && (
                                        <LayerSelector
                                            layer={activeLayer}
                                            onFilterChange={applyFilter}
                                        />
                                    )}
                                    <br />
                                    <AnalysisComponent
                                        view={view}
                                        featuresUnderDamage={
                                            featuresUnderDamage
                                        }
                                        title={getTitle()}
                                        populationData={populationData}
                                        targetInfra={targetInfra}
                                        onZoomToFeature={handleZoomToFeature}
                                    />
                                </div>
                                <div
                                    className="advance-selection-toggle"
                                    onClick={() =>
                                        setShowAdvanceSelection(
                                            !showAdvanceSelection
                                        )
                                    }
                                >
                                    {showAdvanceSelection ? (
                                        <MdKeyboardDoubleArrowLeft />
                                    ) : (
                                        <MdKeyboardDoubleArrowRight />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MapWrapper;
