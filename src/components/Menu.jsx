import React, { useState, useEffect } from "react";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import "./Menu.css";

const Menu = ({
    onOptionSelect,
    onSourceInfraSelect,
    onTargetInfraSelect,
    infrastructureLayers,
}) => {
    const [sourceInfra, setSourceInfra] = useState("");
    const [targetInfra, setTargetInfra] = useState("");

    useEffect(() => {
        onSourceInfraSelect(sourceInfra);
    }, [sourceInfra, onSourceInfraSelect]);

    useEffect(() => {
        onTargetInfraSelect(targetInfra);
    }, [targetInfra, onTargetInfraSelect]);

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
