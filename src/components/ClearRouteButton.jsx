import React from "react";

import "../styles.css";
const ClearRouteButton = ({ clearRoute, noMargin = false } ) => {
	const buttonClass = noMargin ? "clear-route-button-no-margin" : "clear-route-button";
	return (
		<button
			onClick={() => {
				console.log("Clear Route button clicked");
				clearRoute();
			}}
			className={buttonClass}
		>
			Clear Route
		</button>
	);
};

export default ClearRouteButton;
