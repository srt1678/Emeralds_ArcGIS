import React from "react";
import "./LegendComponent.css";
import { FaListUl } from "react-icons/fa6";

const LegendComponent = ({ toggleLegend }) => {
	return (
		<>
			<button className="legend-toggle-button" onClick={toggleLegend}>
				<FaListUl className="legend-toggle-icon" />
			</button>
		</>
	);
};

export default LegendComponent;
