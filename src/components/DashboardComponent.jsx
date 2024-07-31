import React, { useState } from "react";
// import { findClosestFireStations } from "../utils/ClosestFacilityService";
import { checkPowerLineConnection } from "../utils/UtilityConnectionService";
import Point from "@arcgis/core/geometry/Point";
import { cityLightLineLayer } from "../layers";
import { findClosestFacilities } from "../utils/ClosestFacilityService";
import { fireStationLayer } from "../layers";

const DashboardComponent = ({
    hospitalsUnderDamage,
    view,
    selectedDamageValues,
}) => {
    // Debugging line
    // console.log(
    //     "DashboardComponent hospitalsUnderDamage:",
    //     hospitalsUnderDamage
    // );
    // console.log("DashboardComponent view:", view);
    // console.log("Dashboard selected damaged values", selectedDamageValues);
    const handleFindClosestFireStation = async (hospital) => {
        try {
            // Pass the view reference and damaged area
            await findClosestFacilities(
                hospital,
                fireStationLayer,
                selectedDamageValues,
                view,
                
            );
        } catch (error) {
            console.error("Error finding closest fire station:", error);
        }
    };

    const handleCheckPowerConnection = async (hospital) => {
        try {
            const results = await findClosestFacilities(
                hospital,
                fireStationLayer,
                selectedDamageValues,
                view,
                
            );
            if (
                results &&
                results.facilities &&
                results.facilities.length > 0
            ) {
                const closestFireStation = results.facilities[0];
                // console.log(
                //     "Closest Fire Station:",
                //     JSON.stringify(closestFireStation, null, 2)
                // );

                const hospitalPoint = new Point({
                    x: hospital.geometry.x,
                    y: hospital.geometry.y,
                    spatialReference: hospital.geometry.spatialReference,
                });

                const fireStationPoint = new Point({
                    x: closestFireStation.geometry.x,
                    y: closestFireStation.geometry.y,
                    spatialReference:
                        closestFireStation.geometry.spatialReference,
                });

                const isConnected = await checkPowerLineConnection(
                    hospitalPoint,
                    fireStationPoint,
                    cityLightLineLayer,
                    view
                );

                if (isConnected) {
                    alert(
                        "The hospital and the closest fire station are CONNECTED via power lines."
                    );
                } else {
                    alert(
                        "The hospital and the closest fire station are NOT connected via power lines."
                    );
                }
            } else {
                alert("No fire stations found to check power connection.");
            }
        } catch (error) {
            console.error("Error checking power connection:", error);
            alert("Error checking power connection. Please try again.");
        }
    };

    return (
        <div
            style={{
                padding: "1em",
                background: "#f4f4f4",
                height: "100%",
                overflowY: "auto",
            }}
        >
            <h2>Hospitals Under Damaged Areas</h2>
            {hospitalsUnderDamage.length === 0 ? (
                <p>No hospitals found in damaged areas.</p>
            ) : (
                <ul>
                    {hospitalsUnderDamage.map((item, index) => (
                        <li key={index}>
                            <strong>Damage Level:</strong> {item.damage}
                            <br />
                            <strong>Hospital:</strong> {item.hospital.FACILITY}
                            <br />
                            <strong>Address:</strong> {item.hospital.ADDRESS},{" "}
                            {item.hospital.CITY}
                            <br />
                            <button
                                onClick={() =>
                                    handleFindClosestFireStation(item)
                                }
                            >
                                Find Closest Fire Station
                            </button>
                            <button
                                onClick={() => handleCheckPowerConnection(item)}
                            >
                                Check Power Connection
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardComponent;
