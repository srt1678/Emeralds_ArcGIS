import React, { useState, useEffect } from "react";
import "./LayerSelector.css";
// import { earthquakeM6Layer } from "../layers";

// List of damage values for the earthquake filter
const damageValues = [
    { damage: "0", label: "<10% not damaged" },
    { damage: "1", label: ">10% light damage" },
    { damage: "2", label: "10-50% major non-structural damage" },
    { damage: "2.5", label: "50%+ major non-structural damage" },
    { damage: "3", label: "10-50% structural damage" },
    { damage: "3.5", label: "50%+ structural damage" },
];

const LayerSelector = ({ layer, filterField, onFilterChange }) => {
    // console.log(filterField)
    const [isOpen, setIsOpen] = useState(false); // State to manage the visibility of the selector
    const [selectedDamageValues, setSelectedDamageValues] = useState([]); // Initialize with an empty array for no checkboxes selected by default

    // Toggle the visibility of the selector
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // Handle changes in the selected damage values
    const handleDamageChange = (value) => {
        const newSelectedValues = selectedDamageValues.includes(value)
            ? selectedDamageValues.filter((v) => v !== value)
            : [...selectedDamageValues, value];
        setSelectedDamageValues(newSelectedValues);
        applyFilter(newSelectedValues);
    };

    // Apply the filter based on the selected damage values
    const applyFilter = (values) => {
        const filterExpression =
            values.length > 0
                ? `${filterField} IN (${values
                      .map((v) => `'${v}'`)
                      .join(", ")})`
                : "";
        layer.definitionExpression = filterExpression;
        onFilterChange(values);
    };

    // Apply the default filter when the component mounts
    useEffect(() => {
        applyFilter(selectedDamageValues);
    }, []);

    return (
        <div className="layer-selector">
            <button onClick={toggleOpen} className="toggle-button">
                {isOpen ? "Hide Filters" : "Show Filters"}
            </button>
            {isOpen && (
                <div className="layer-content">
                    <h3>Earthquake Damage</h3>
                    <div className="filter-container">
                        {damageValues.map((value) => (
                            <div key={value.damage} className="filter-item">
                                <input
                                    type="checkbox"
                                    id={`damage-${value.damage}`}
                                    value={value.damage}
                                    checked={selectedDamageValues.includes(
                                        value.damage
                                    )}
                                    onChange={() =>
                                        handleDamageChange(value.damage)
                                    }
                                    className="filter-checkbox"
                                />
                                <label
                                    htmlFor={`damage-${value.damage}`}
                                    className="filter-label"
                                >
                                    {value.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayerSelector;
