import React from "react";
import { findClosestFireStations } from "../utils/ClosestFacilityService";

const DashboardComponent = ({ hospitalsUnderDamage, view }) => {
    console.log(
        "DashboardComponent hospitalsUnderDamage:",
        hospitalsUnderDamage
    ); // Debugging line
    console.log("DashboardComponent view:", view);

    const handleFindClosestFireStation = async (hospital) => {
        try {
            await findClosestFireStations(hospital, view); // Pass the view reference
        } catch (error) {
            console.error("Error finding closest fire station:", error);
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardComponent;
