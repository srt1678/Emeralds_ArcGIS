import React, { useState, useEffect } from "react";
import Select from "react-select";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import neighborhoods from "../config/neighborhoodsConfig";
import { neighborhoodLayer } from "../layers";
import "./Menu.css";

// const fetchNeighborhoods = async () => {
//     try {
//         const queryResult = await neighborhoodLayer.queryFeatures({
//             where: "1=1",
//             outFields: ["GEN_ALIAS", "CRA_NO"],
//             returnGeometry: false,
//         });
//         const neighborhoods = queryResult.features.map((f) => ({
//             name: f.attributes.GEN_ALIAS,
//             id: f.attributes.CRA_NO,
//         }));
//         console.log("Neighborhoods:", JSON.stringify(neighborhoods));
//     } catch (error) {
//         console.error("Error fetching neighborhoods:", error);
//     }
// };

const fetchNeighborhoods = async () => {
    const craNumbers = [3.2]; // The specific CRA_NO values you want to query
    const craNoString = craNumbers.map(num => `'${num}'`).join(", ");
    
    try {
        const queryResult = await neighborhoodLayer.queryFeatures({
            where: `CRA_NO IN (${craNoString})`,
            outFields: ["GEN_ALIAS", "CRA_NO"],
            returnGeometry: false,
        });
        const neighborhoods = queryResult.features.map((f) => ({
            name: f.attributes.GEN_ALIAS,
            id: f.attributes.CRA_NO,
        }));
        console.log("Neighborhoods:", JSON.stringify(neighborhoods));
    } catch (error) {
        console.error("Error fetching neighborhoods:", error);
    }
};

const Menu = ({
    onOptionSelect,
    onSourceInfraSelect,
    onTargetInfraSelect,
    onNeighborhoodSelect,
    infrastructureLayers,
}) => {
    const [sourceInfra, setSourceInfra] = useState("");
    const [targetInfra, setTargetInfra] = useState("");
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
    

    useEffect(() => {
        onSourceInfraSelect(sourceInfra);
    }, [sourceInfra, onSourceInfraSelect]);

    useEffect(() => {
        onTargetInfraSelect(targetInfra);
    }, [targetInfra, onTargetInfraSelect]);

    useEffect(() => {
        // fetchNeighborhoods()
        onNeighborhoodSelect(selectedNeighborhoods);
    }, [selectedNeighborhoods, onNeighborhoodSelect]);

    const neighborhoodOptions = neighborhoods.map((neighborhood) => ({
        value: neighborhood.id,
        label: neighborhood.name,
    }));


    return (
        <div className="menu">
            <h2>Menu</h2>
            <div className="menu-item">
                <label htmlFor="sourceInfra">Source Infrastructure:</label>
                <select
                    id="sourceInfra"
                    value={sourceInfra}
                    onChange={(e) => setSourceInfra(e.target.value)}
                >
                    <option value="">Select Source Infrastructure</option>
                    {Object.keys(infrastructureLayers).map((layerKey) => (
                        <option key={layerKey} value={layerKey}>
                            {infrastructureLayers[layerKey].name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="menu-item">
                <label htmlFor="targetInfra">Target Infrastructure:</label>
                <select
                    id="targetInfra"
                    value={targetInfra}
                    onChange={(e) => setTargetInfra(e.target.value)}
                >
                    <option value="">Select Target Infrastructure</option>
                    {Object.keys(infrastructureLayers).map((layerKey) => (
                        <option key={layerKey} value={layerKey}>
                            {infrastructureLayers[layerKey].name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="menu-item">
                <label htmlFor="neighborhood">Select Neighborhood(s):</label>
                <Select
                    isMulti
                    name="neighborhoods"
                    options={neighborhoodOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selected) => setSelectedNeighborhoods(selected)}
                />
            </div>
            <hr className="menu-separator" />
            <ul>
                <h2>Earthquake Scenarios</h2>
                {Object.keys(earthquakeScenarioModes).map((mode) => (
                    <li key={mode} className="menu-item-inline">
                        <input
                            type="checkbox"
                            id={mode}
                            onChange={(e) =>
                                onOptionSelect(e.target.checked ? mode : null)
                            }
                        />
                        <label htmlFor={mode}>
                            {earthquakeScenarioModes[mode].name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;
