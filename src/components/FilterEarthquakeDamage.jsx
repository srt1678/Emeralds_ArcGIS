import React from "react";

const FilterEarthquakeDamage = ({
	selectedDamageValues,
	handleDamageChange,
}) => {
	return (
		<div className="filter-container">
			{[
				{ id: "0", label: "<10% Not Damaged" },
				{ id: "1", label: ">10% Light Damage" },
				{ id: "2", label: "10-50% Major Non-structural Damage" },
				{ id: "2.5", label: "50%+ Major Non-structural Damage" },
				{ id: "3", label: "10-50% Structural Damage" },
				{ id: "3.5", label: "50%+ Structural Damage" },
			].map((item) => (
				<div
					key={item.id}
					className={`filter-item ${
						selectedDamageValues.includes(item.id) ? "selected" : ""
					}`}
					onClick={() => handleDamageChange(item.id)}
				>
					{item.label}
				</div>
			))}
		</div>
	);
};

export default FilterEarthquakeDamage;
