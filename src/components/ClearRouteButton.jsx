import React from "react";

const ClearRouteButton = ({ clearRoute }) => {
    console.log("ClearRouteButton rendered");
    return (
        <button
            onClick={() => {
                console.log("Clear Route button clicked");
                clearRoute();
            }}
            style={{
                position: "absolute",
                top: "10px",
                left: "10px", // Change this from right to left
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                zIndex: 1000,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "yellow", // Temporary background color for debugging
                border: "2px solid red" // Temporary border for debugging
            }}
        >
            Clear Route
        </button>
    );
};

export default ClearRouteButton;
