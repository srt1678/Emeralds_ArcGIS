import React from "react";
import "../styles.css";
const ClearRouteButton = ({ clearRoute }) => {
	// console.log("ClearRouteButton rendered");
	return (
		<button
			onClick={() => {
				// console.log("Clear Route button clicked");
				clearRoute();
			}}
			className="clear-route-button"
		>
			Clear Route
		</button>
	);
};

export default ClearRouteButton;
