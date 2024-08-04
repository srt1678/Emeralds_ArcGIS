import React, { useState, useEffect } from "react";
import Select from "react-select";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import neighborhoods from "../config/neighborhoodsConfig";
import { neighborhoodLayer } from "../layers";
import "./Menu.css";

// const fetchNeighborhoods = async () => {
//     try {
//         const queryResult = await neighborhoodLayer.queryFeatures({
//             where: "1=1",
//             outFields: ["GEN_ALIAS", "CRA_NO"],
//             returnGeometry: false,
//         });
//         const neighborhoods = queryResult.features.map((f) => ({
//             name: f.attributes.GEN_ALIAS,
//             id: f.attributes.CRA_NO,
//         }));
//         console.log("Neighborhoods:", JSON.stringify(neighborhoods));
//     } catch (error) {
//         console.error("Error fetching neighborhoods:", error);
//     }
// };

const fetchNeighborhoods = async () => {
    const craNumbers = [3.2]; // The specific CRA_NO values you want to query
    const craNoString = craNumbers.map(num => `'${num}'`).join(", ");
    
    try {
        const queryResult = await neighborhoodLayer.queryFeatures({
            where: `CRA_NO IN (${craNoString})`,
            outFields: ["GEN_ALIAS", "CRA_NO"],
            returnGeometry: false,
        });
        const neighborhoods = queryResult.features.map((f) => ({
            name: f.attributes.GEN_ALIAS,
            id: f.attributes.CRA_NO,
        }));
        console.log("Neighborhoods:", JSON.stringify(neighborhoods));
    } catch (error) {
        console.error("Error fetching neighborhoods:", error);
    }
};

// const Menu = ({
//     onOptionSelect,
//     onSourceInfraSelect,
//     onTargetInfraSelect,
//     onNeighborhoodSelect,
//     infrastructureLayers,
//     isCustomScenario
// }) => {
//     const [sourceInfra, setSourceInfra] = useState("");
//     const [targetInfra, setTargetInfra] = useState("");
//     const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
    

//     useEffect(() => {
//         onSourceInfraSelect(sourceInfra);
//     }, [sourceInfra, onSourceInfraSelect]);

//     useEffect(() => {
//         onTargetInfraSelect(targetInfra);
//     }, [targetInfra, onTargetInfraSelect]);

//     useEffect(() => {
//         // fetchNeighborhoods()
//         onNeighborhoodSelect(selectedNeighborhoods);
//     }, [selectedNeighborhoods, onNeighborhoodSelect]);

//     const neighborhoodOptions = neighborhoods.map((neighborhood) => ({
//         value: neighborhood.id,
//         label: neighborhood.name,
//     }));


//     return (
//         <div className="menu">
//             <div className="menu-title">Routing</div>
//             <div className="section-divider"></div>
//             <div className="menu-item">
//                 <label htmlFor="sourceInfra">Source Infrastructure:</label>
//                 <select
//                     id="sourceInfra"
//                     value={sourceInfra}
//                     onChange={(e) => setSourceInfra(e.target.value)}
//                 >
//                     <option value="">Select Source Infrastructure</option>
//                     {Object.keys(infrastructureLayers).map((layerKey) => (
//                         <option key={layerKey} value={layerKey}>
//                             {infrastructureLayers[layerKey].name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="menu-item">
//                 <label htmlFor="targetInfra">Target Infrastructure:</label>
//                 <select
//                     id="targetInfra"
//                     value={targetInfra}
//                     onChange={(e) => setTargetInfra(e.target.value)}
//                 >
//                     <option value="">Select Target Infrastructure</option>
//                     {Object.keys(infrastructureLayers).map((layerKey) => (
//                         <option key={layerKey} value={layerKey}>
//                             {infrastructureLayers[layerKey].name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="menu-item">
//                 <label htmlFor="neighborhood">Select Neighborhood(s):</label>
//                 <Select
//                     isMulti
//                     name="neighborhoods"
//                     options={neighborhoodOptions}
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                     onChange={(selected) => setSelectedNeighborhoods(selected)}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Menu;

const Menu = ({
    onOptionSelect,
    onSourceInfraSelect,
    onTargetInfraSelect,
    onNeighborhoodSelect,
    infrastructureLayers,
    isCustomScenario,
    isCustomSketchComplete,
    applyFilter,
}) => {
    const [sourceInfra, setSourceInfra] = useState("");
    const [targetInfra, setTargetInfra] = useState("");
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
    

    useEffect(() => {
        onSourceInfraSelect(sourceInfra);
    }, [sourceInfra, onSourceInfraSelect]);

    useEffect(() => {
        onTargetInfraSelect(targetInfra);
    }, [targetInfra, onTargetInfraSelect]);

    useEffect(() => {
        // fetchNeighborhoods()
        onNeighborhoodSelect(selectedNeighborhoods);
    }, [selectedNeighborhoods, onNeighborhoodSelect]);

    const neighborhoodOptions = neighborhoods.map((neighborhood) => ({
        value: neighborhood.id,
        label: neighborhood.name,
    }));


    return (
        <div className="menu">
            <div className="menu-title">Routing</div>
            <div className="section-divider"></div>
            <div className="menu-item">
                <label htmlFor="sourceInfra">Source Infrastructure:</label>
                <select
                    id="sourceInfra"
                    value={sourceInfra}
                    onChange={(e) => setSourceInfra(e.target.value)}
                >
                    <option value="">Select Source Infrastructure</option>
                    {Object.keys(infrastructureLayers).map((layerKey) => (
                        <option key={layerKey} value={layerKey}>
                            {infrastructureLayers[layerKey].name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="menu-item">
                <label htmlFor="targetInfra">Target Infrastructure:</label>
                <select
                    id="targetInfra"
                    value={targetInfra}
                    onChange={(e) => setTargetInfra(e.target.value)}
                >
                    <option value="">Select Target Infrastructure</option>
                    {Object.keys(infrastructureLayers).map((layerKey) => (
                        <option key={layerKey} value={layerKey}>
                            {infrastructureLayers[layerKey].name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="menu-item">
                <label htmlFor="neighborhood">Select Neighborhood(s):</label>
                <Select
                    isMulti
                    name="neighborhoods"
                    options={neighborhoodOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selected) => setSelectedNeighborhoods(selected)}
                />
            </div>
            {isCustomScenario && (
                <div className="custom-scenario-container">
                    <h3>Custom Earthquake Scenario</h3>
                    {!isCustomSketchComplete ? (
                        <p>
                            Use the sketch tools to draw your custom earthquake
                            scenario areas.
                        </p>
                    ) : (
                        <>
                            <p>
                                Custom scenario area defined. You can now
                                perform analysis.
                            </p>
                            <button onClick={() => applyFilter([])}>
                                Query Features Under Custom Scenario
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
