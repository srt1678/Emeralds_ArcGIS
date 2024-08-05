import React, { useState, useEffect, useCallback } from "react";
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
import {
    addressToLocations,
    locationToAddress,
} from "@arcgis/core/rest/locator";
import { queryPopulation } from "../utils/PopulationService";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import { infrastructureLayers } from "../config/infrastructureLayers";
import { earthquakeCustomScenarioLayer } from "../layers";
import Sketch from "@arcgis/core/widgets/Sketch";
import Menu from "./Menu";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import * as projection from "@arcgis/core/geometry/projection";
import Point from "@arcgis/core/geometry/Point";

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

    // custom earthqukae scenarios
    const [sketchWidget, setSketchWidget] = useState(null);
    const [isCustomScenario, setIsCustomScenario] = useState(false);
    const [customScenarioGeometry, setCustomScenarioGeometry] = useState(null);
    const [isCustomSketchComplete, setIsCustomSketchComplete] = useState(false);

    // highlighting features and fetching population data
    useEffect(() => {
        if (view && featuresUnderDamage && featuresUnderDamage.length > 0) {
            // clearHighlights(view);
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

    // highlighting neighborhood geometries
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
                console.log("Sketch widget removed from view");
            }
        }
    }, [view, sketchWidget, activeLayer, isCustomScenario]);

    // Get analysis title
    const getTitle = () => {
        if (sourceInfra && infrastructureLayers[sourceInfra]) {
            return `${infrastructureLayers[sourceInfra].name} Under Damage`;
        }
        return "Infrastructure Under Damage";
    };

    // custom
    const handleLayerSelect = (layer) => {
        console.log("Layer selected:", layer != null);
        setActiveLayer(layer);
        setShowAdvanceSelection(true);
        if (layer === earthquakeCustomScenarioLayer) {
            console.log("Setting custom scenario mode");
            setIsCustomScenario(true);
            setIsCustomSketchComplete(false);
            setFeaturesUnderDamage([]);
        } else {
            console.log("Exiting custom scenario mode");
            // When activeLayer is null
            setIsCustomScenario(false);
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

    const handleZoomToFeature = useCallback(
        async (x, y, spatialReference) => {
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
                        zoom: 15, // Adjust this value as needed
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

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <MapComponent view={view} setView={setView} />
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
                    />
                )}

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
                                <AnalysisComponent
                                    view={view}
                                    featuresUnderDamage={featuresUnderDamage}
                                    title={getTitle()}
                                    populationData={populationData}
                                    targetInfra={targetInfra}
                                    onZoomToFeature={handleZoomToFeature}
                                />
                            </div>
                        </div>
                    </>
                )}
                {activeLayer && !isCustomScenario && (
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
                                <AnalysisComponent
                                    view={view}
                                    featuresUnderDamage={featuresUnderDamage}
                                    title={getTitle()}
                                    populationData={populationData}
                                    targetInfra={targetInfra}
                                    onZoomToFeature={handleZoomToFeature}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MapWrapper;
