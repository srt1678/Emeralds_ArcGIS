import React from "react";

const DashboardComponent = ({ hospitalsUnderDamage }) => {
    return (
        <div style={{ padding: "1em", background: "#f4f4f4", height: "100%", overflowY: "auto" }}>
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
                            <strong>Address:</strong> {item.hospital.ADDRESS}, {item.hospital.CITY}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardComponent;
