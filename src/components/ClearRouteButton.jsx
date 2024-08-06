import React from "react";

const ClearRouteButton = ({ view }) => {
	// console.log("ClearRouteButton rendered");
	return (
		<button
			onClick={() => {
				console.log("Clear Route button clicked");
				view.graphics.removeAll();
			}}
			className="clear-route-button"
		>
			Clear Route
		</button>
	);
};

export default ClearRouteButton;
