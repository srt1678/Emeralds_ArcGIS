import React from "react";
import { findClosestFireStations } from "../utils/ClosestFacilityService";
import "./DashboardComponent.css";
import ClearRouteButton from "./ClearRouteButton";

const DashboardComponent = ({ hospitalsUnderDamage, view, clearRoute }) => {
	console.log("DashboardComponent hospitalsUnderDamage:", hospitalsUnderDamage); // Debugging line
	console.log("DashboardComponent view:", view);

	const handleFindClosestFireStation = async (hospital) => {
		try {
			await findClosestFireStations(hospital, view); // Pass the view reference
		} catch (error) {
			console.error("Error finding closest fire station:", error);
		}
	};

	return (
		<div className="dashboard-container">
			<h2 className="dashboard-title">Hospitals Under Damaged Areas</h2>
			{hospitalsUnderDamage.length === 0 ? (
				<div className="no-hospitals-text">
					No hospitals found in damaged areas.
				</div>
			) : (
				<>
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
								<div className="dashboard-search-button-container">
									<button
										className="dashboard-search-button"
										onClick={() => handleFindClosestFireStation(item)}
									>
										Find Closest Fire Station
									</button>
								</div>
							</li>
						))}
					</ul>
					<ClearRouteButton clearRoute={clearRoute} />
				</>
			)}
		</div>
	);
};

export default DashboardComponent;
