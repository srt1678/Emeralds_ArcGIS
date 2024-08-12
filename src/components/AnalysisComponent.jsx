import React, { useState, useMemo } from "react";
import "./AnalysisComponent.css";
import { findClosestFacilities } from "../utils/ClosestFacilityService";
import { infrastructureLayers } from "../config/infrastructureLayers";
import ClearRouteButton from "./ClearRouteButton";

const AnalysisComponent = ({
    view,
    featuresUnderDamage,
    title,
    populationData,
    targetInfra,
    onZoomToFeature,
}) => {
    const [sortBy, setSortBy] = useState("damage");
    const [analysisResults, setAnalysisResults] = useState({});
    const [currentAnalysisGraphics, setCurrentAnalysisGraphics] = useState([]);

    // Route parameter
    const [maxFacilities, setMaxFacilities] = useState(5);
    const [travelTime, setTravelTime] = useState(30);
    const [avoidHighways, setAvoidHighways] = useState(false);
    const [travelMode, setTravelMode] = useState("Driving Time");
    const [impedanceAttribute, setImpedanceAttribute] = useState("TravelTime");

    // console.log(JSON.stringify(featuresUnderDamage, null, 2));
    // Sort features
    const sortedFeatures = useMemo(() => {
        if (!featuresUnderDamage) return [];

        return [...featuresUnderDamage].sort((a, b) => {
            if (sortBy === "damage") {
                return b.damage - a.damage;
            } else if (sortBy === "population") {
                const popA =
                    populationData.find(
                        (p) => p.feature.feature.OBJECTID === a.feature.OBJECTID
                    )?.population || 0;
                const popB =
                    populationData.find(
                        (p) => p.feature.feature.OBJECTID === b.feature.OBJECTID
                    )?.population || 0;
                return popB - popA;
            }
            return 0;
        });
    }, [featuresUnderDamage, populationData, sortBy]);

    const handleClosestFacilityAnalysis = async (srcInfra) => {
        try {
            const results = await findClosestFacilities(
                srcInfra,
                targetInfra ? infrastructureLayers[targetInfra].layer : null,
                view,
                maxFacilities,
                travelTime,
                10, // bufferDistance, useless for now
                avoidHighways,
                travelMode,
                impedanceAttribute
            );
            setAnalysisResults((prev) => ({
                ...prev,
                [srcInfra.feature.OBJECTID]: results,
            }));
            setCurrentAnalysisGraphics(results.addedGraphics);
        } catch (error) {
            console.error("Error in closest facility analysis:", error);
            alert("An error occurred during the analysis. Please try again.");
        }
    };

    const clearRoute = () => {
        // Clear only the current analysis graphics
        currentAnalysisGraphics.forEach((graphic) =>
            view.graphics.remove(graphic)
        );
        setCurrentAnalysisGraphics([]);

        // Clear the analysis results
        setAnalysisResults({});
    };

    return (
        <div className="analysis">
            <div className="analysis-title">{title}</div>
            <div className="section-divider"></div>
            {sortedFeatures.length === 0 ? (
                <div className="no-infrastructure-text">
                    No {title.toLowerCase()}.
                </div>
            ) : (
                <>
                    <div className="analysis-parameters-container">
                        <div className="analysis-parameters">
                            <div className="parameter-control">
                                <label htmlFor="maxFacilities">
                                    Max Facilities:
                                </label>
                                <input
                                    type="number"
                                    id="maxFacilities"
                                    value={maxFacilities}
                                    onChange={(e) =>
                                        setMaxFacilities(Number(e.target.value))
                                    }
                                    min="1"
                                    max="10"
                                />
                            </div>
                            <div className="parameter-control">
                                <label htmlFor="travelTime">
                                    Travel Time (min):
                                </label>
                                <input
                                    type="number"
                                    id="travelTime"
                                    value={travelTime}
                                    onChange={(e) =>
                                        setTravelTime(Number(e.target.value))
                                    }
                                    min="1"
                                    max="120"
                                />
                            </div>
                            {/* Add more parameter controls here as needed */}
                            <div className="parameter-control">
                                <label htmlFor="avoidHighways">
                                    Avoid Highways:
                                </label>
                                <input
                                    type="checkbox"
                                    id="avoidHighways"
                                    checked={avoidHighways}
                                    onChange={(e) =>
                                        setAvoidHighways(e.target.checked)
                                    }
                                />
                            </div>
                            <div className="parameter-control">
                                <label htmlFor="travelMode">Travel Mode:</label>
                                <select
                                    id="travelMode"
                                    value={travelMode}
                                    onChange={(e) =>
                                        setTravelMode(e.target.value)
                                    }
                                >
                                    <option value="Driving">
                                        Driving
                                    </option>
                                    <option value="Walking">
                                        Walking
                                    </option>
                                </select>
                            </div>
                            <div className="parameter-control">
                                <label htmlFor="impedanceAttribute">
                                    Optimize For:
                                </label>
                                <select
                                    id="impedanceAttribute"
                                    value={impedanceAttribute}
                                    onChange={(e) =>
                                        setImpedanceAttribute(e.target.value)
                                    }
                                >
                                    <option value="TravelTime">Time</option>
                                    <option value="Kilometers">
                                        Distance (Kilometers)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="sort-buttons-container">
                        <button
                            className="sort-buttons"
                            onClick={() => setSortBy("damage")}
                        >
                            Sort by Damage Level
                        </button>
                        <button
                            className="sort-buttons"
                            onClick={() => setSortBy("population")}
                        >
                            Sort by Population
                        </button>
                    </div>
                    <ClearRouteButton clearRoute={clearRoute} />
                    <ul>
                        {sortedFeatures.map((item, index) => {
                            const populationInfo = populationData.find(
                                (p) =>
                                    p.feature.feature.OBJECTID ===
                                    item.feature.OBJECTID
                            );
                            const analysisResult =
                                analysisResults[item.feature.OBJECTID];
                            return (
                                <li key={index}>
                                    <strong>
                                        {item.feature.FACILITY ||
                                            item.feature.NAME || 
                                            item.feature.STNID || 
                                            item.feature.school_name
                                        }
                                    </strong>
                                    <br />
                                    Damage Level: {item.damage || "N/A"}
                                    <br />
                                    Address: {item.feature.ADDRESS || 
                                                item.feature.address || 
                                                item.feature.SCHOOL_STREET_ADDRESS || 
                                                "N/A"
                                            }
                                    <br />
                                    Population With In the Block:{" "}
                                    {populationInfo
                                        ? populationInfo.population.toLocaleString()
                                        : "Loading..."}
                                    <br />
                                    <div className="find-closest-infrastructure-container">
                                        <button
                                            className="find-closest-infrastructure-button"
                                            onClick={() =>
                                                handleClosestFacilityAnalysis(
                                                    item
                                                )
                                            }
                                        >
                                            Find Closest{" "}
                                            {infrastructureLayers[targetInfra]
                                                ?.name || "Facilities"}
                                        </button>
                                        <button
                                            className="zoom-to-feature-button"
                                            onClick={() =>
                                                onZoomToFeature(
                                                    item.geometry.x,
                                                    item.geometry.y,
                                                    item.geometry
                                                        .spatialReference
                                                )
                                            }
                                        >
                                            Zoom to Feature
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AnalysisComponent;
