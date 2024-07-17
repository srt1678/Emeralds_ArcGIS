import React, { useState } from "react";
import "./LayerSelector.css";

const LayerSelector = ({ layers, toggleLayerVisibility, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDamageValues, setSelectedDamageValues] = useState([]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleDamageChange = (value) => {
        const newSelectedValues = selectedDamageValues.includes(value)
            ? selectedDamageValues.filter((v) => v !== value)
            : [...selectedDamageValues, value];

        setSelectedDamageValues(newSelectedValues);
        onFilterChange(newSelectedValues);
    };

    return (
        <div className="layer-selector">
            <button onClick={toggleOpen} className="toggle-button">
                {isOpen ? "Hide Layers" : "Show Layers"}
            </button>
            {isOpen && (
                <div className="layer-content">
                    <h3>Layers</h3>
                    {layers.map((layer) => (
                        <div key={layer.id} className="layer-item">
                            <input
                                type="checkbox"
                                checked={layer.visible}
                                onChange={() => toggleLayerVisibility(layer.id)}
                                className="layer-checkbox"
                            />
                            <label className="layer-label">{layer.title}</label>
                        </div>
                    ))}
                    <h3>Filter Earthquake Damage</h3>
                    <div className="filter-container">
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-0"
                                value="0"
                                checked={selectedDamageValues.includes("0")}
                                onChange={() => handleDamageChange("0")}
                                className="filter-checkbox"
                            />
                            <label htmlFor="damage-0" className="filter-label">
                                &lt;10% not damaged
                            </label>
                        </div>
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-1"
                                value="1"
                                checked={selectedDamageValues.includes("1")}
                                onChange={() => handleDamageChange("1")}
                                className="filter-checkbox"
                            />
                            <label htmlFor="damage-1" className="filter-label">
                                &gt;10% light damage
                            </label>
                        </div>
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-2"
                                value="2"
                                checked={selectedDamageValues.includes("2")}
                                onChange={() => handleDamageChange("2")}
                                className="filter-checkbox"
                            />
                            <label htmlFor="damage-2" className="filter-label">
                                10-50% major non-structural damage
                            </label>
                        </div>
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-2.5"
                                value="2.5"
                                checked={selectedDamageValues.includes("2.5")}
                                onChange={() => handleDamageChange("2.5")}
                                className="filter-checkbox"
                            />
                            <label
                                htmlFor="damage-2.5"
                                className="filter-label"
                            >
                                50%+ major non-structural damage
                            </label>
                        </div>
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-3"
                                value="3"
                                checked={selectedDamageValues.includes("3")}
                                onChange={() => handleDamageChange("3")}
                                className="filter-checkbox"
                            />
                            <label htmlFor="damage-3" className="filter-label">
                                10-50% structural damage
                            </label>
                        </div>
                        <div className="filter-item">
                            <input
                                type="checkbox"
                                id="damage-3.5"
                                value="3.5"
                                checked={selectedDamageValues.includes("3.5")}
                                onChange={() => handleDamageChange("3.5")}
                                className="filter-checkbox"
                            />
                            <label
                                htmlFor="damage-3.5"
                                className="filter-label"
                            >
                                50%+ structural damage
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayerSelector;
