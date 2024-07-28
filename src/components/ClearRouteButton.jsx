import React from "react";
import './DashboardComponent.css';

const ClearRouteButton = ({ clearRoute }) => {
    console.log("ClearRouteButton rendered");
    return (
        <button
            className="clear-route-button"
            onClick={() => {
                console.log("Clear Route button clicked");
                clearRoute();
            }}
        >
            Clear Route
        </button>
    );
};

export default ClearRouteButton;
