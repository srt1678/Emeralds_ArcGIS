import React, { useState, useMemo } from "react";
import "./AnalysisComponent.css";
import { findClosestFacilities } from "../utils/ClosestFacilityService";
import { fireStationLayer } from "../layers";
import { infrastructureLayers } from "../config/infrastructureLayers";

const AnalysisComponent = ({
    view,
    featuresUnderDamage,
    title,
    populationData,
    targetInfra,
}) => {
    const [sortBy, setSortBy] = useState("damage");
    const [analysisResults, setAnalysisResults] = useState({});

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
                view
            );
            setAnalysisResults((prev) => ({
                ...prev,
                [srcInfra.feature.OBJECTID]: results,
            }));
        } catch (error) {
            console.error("Error in closest facility analysis:", error);
            alert("An error occurred during the analysis. Please try again.");
        }
    };

    return (
        <div className="analysis">
            <h2>{title}</h2>
            <div className="sort-buttons">
                <button onClick={() => setSortBy("damage")}>
                    Sort by Damage Level
                </button>
                <button onClick={() => setSortBy("population")}>
                    Sort by Population
                </button>
            </div>
            {sortedFeatures.length === 0 ? (
                <p>No {title.toLowerCase()} under damage.</p>
            ) : (
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
                                    {item.feature.FACILITY || item.feature.NAME}
                                </strong>
                                <br />
                                Damage Level: {item.damage}
                                <br />
                                Address: {item.feature.ADDRESS || "N/A"}
                                <br />
                                Population With In the Block:{" "}
                                {populationInfo
                                    ? populationInfo.population.toLocaleString()
                                    : "Loading..."}
                                <br />
                                <button
                                    onClick={() =>
                                        handleClosestFacilityAnalysis(item)
                                    }
                                >
                                    Find Closest{" "}
                                    {infrastructureLayers[targetInfra]?.name ||
                                        "Facilities"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default AnalysisComponent;
