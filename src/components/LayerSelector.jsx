import React, { useState } from "react";
import "./LayerSelector.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import LayerItem from "./LayerItem";

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
		<>
			<button className="search-button">
				<IoSearch className="search-icon-button" />
			</button>
			<button onClick={toggleOpen} className="toggle-button">
				{isOpen ? (
					<RxCross2 className="toggle-icon-button" />
				) : (
					<GiHamburgerMenu className="toggle-icon-button" />
				)}
			</button>
			{isOpen && (
				<div className="layer-selector">
					<div className="section-title-container">Layers</div>
					<div className="section-divider"></div>
					{layers.map((layer) => (
						<div key={layer.id} className="layer-item">
							<LayerItem
								key={layer.id}
								layer={layer}
								toggleLayerVisibility={toggleLayerVisibility}
							/>
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
							<label htmlFor="damage-2.5" className="filter-label">
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
							<label htmlFor="damage-3.5" className="filter-label">
								50%+ structural damage
							</label>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default LayerSelector;
