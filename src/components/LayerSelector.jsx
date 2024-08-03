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

const LayerSelector = ({ layer, onFilterChange }) => {
	// Initialize with an empty array for no checkboxes selected by default
	const [selectedDamageValues, setSelectedDamageValues] = useState([]);

	// Handle changes in the selected damage values
	const handleDamageChange = (value) => {
		const newSelectedValues = selectedDamageValues.includes(value)
			? selectedDamageValues.filter((v) => v !== value)
			: [...selectedDamageValues, value];
		setSelectedDamageValues(newSelectedValues);
		onFilterChange(newSelectedValues);
	};

	return (
		<div className="layer-selector">
			<div className="layer-content">
				<div className="filter-title-container">Earthquake Damage</div>
				<div className="section-divider"></div>
				<div className="filter-container">
					{damageValues.map((value) => (
						<div
							key={value.damage}
							className={`filter-item ${
								selectedDamageValues.includes(value.damage) ? "selected" : ""
							}`}
							onClick={() => handleDamageChange(value.damage)}
						>
							{value.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default LayerSelector;
