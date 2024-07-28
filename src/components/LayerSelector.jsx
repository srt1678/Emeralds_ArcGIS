import React, { useState } from "react";
import "./LayerSelector.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { LayerItem, FilterEarthquakeDamage } from "./ComponentsIndex";

const LayerSelector = ({
	layers,
	toggleLayerVisibility,
	selectEarthquakeDamage,
	setSelectEarthquakeDamage,
	onFilterChange,
}) => {
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
								setSelectEarthquakeDamage={setSelectEarthquakeDamage}
							/>
						</div>
					))}
					{selectEarthquakeDamage && (
						<div>
							<div
								className="section-title-container"
								style={{ paddingTop: "10px" }}
							>
								Filter Earthquake Damage
							</div>
							<div className="section-divider"></div>
							<FilterEarthquakeDamage
								selectedDamageValues={selectedDamageValues}
								handleDamageChange={handleDamageChange}
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default LayerSelector;
