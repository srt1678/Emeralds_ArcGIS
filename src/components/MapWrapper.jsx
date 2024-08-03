import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import CustomLayerList from "./CustomLayerList";
import AnalysisComponent from "./AnalysisComponent";
import LayerSelector from "./LayerSelector";
import {
	clearHighlights,
	highlightFeature,
	highlightArea,
} from "../utils/HighlightService";
import "../styles.css";
import Graphic from "@arcgis/core/Graphic";
import { queryPopulation } from "../utils/PopulationService";
import { earthquakeScenarioModes } from "../config/earthquakeSenarioModes";
import { infrastructureLayers } from "../config/infrastructureLayers";
import Menu from "./Menu";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const MapWrapper = ({
	featuresUnderDamage,
	handleFilterChange,
	sourceInfra,
	targetInfra,
	neighborhoodGeometries,
	handleOptionSelect,
	setSourceInfra,
	setTargetInfra,
	setSelectedNeighborhoods,
	infrastructureLayers,
}) => {
	const [view, setView] = useState(null);
	const [populationData, setPopulationData] = useState([]);
	const [activeLayer, setActiveLayer] = useState(null);
	const [showAdvanceSelection, setShowAdvanceSelection] = useState(false);

	useEffect(() => {
		if (view && featuresUnderDamage && featuresUnderDamage.length > 0) {
			// clearHighlights(view);
			featuresUnderDamage.forEach((feature, index) => {
				highlightFeature(view, feature);
			});
			const fetchPopulationData = async () => {
				const data = await queryPopulation(featuresUnderDamage);
				setPopulationData(data);
				// console.log(
				//     "Final population results:",
				//     JSON.stringify(data, null, 2)
				// );
			};
			fetchPopulationData();

			// Zoom to the features
			// const geometries = featuresUnderDamage.map(feature => feature.geometry);
			// view.goTo(geometries);
		}
	}, [featuresUnderDamage, view]);

	useEffect(() => {
		if (view) {
			clearHighlights(view);
			if (neighborhoodGeometries && neighborhoodGeometries.length > 0) {
				neighborhoodGeometries.forEach((neighborhood) => {
					highlightArea(view, neighborhood);
				});
			}
		}
	}, [neighborhoodGeometries, view]);

	// Get analysis title
	const getTitle = () => {
		if (sourceInfra && infrastructureLayers[sourceInfra]) {
			return `${infrastructureLayers[sourceInfra].name} Under Damage`;
		}
		return "Infrastructure Under Damage";
	};

	const handleLayerSelect = (layer) => {
		setActiveLayer(layer);
		setShowAdvanceSelection(true);
	};

	// Apply the filter based on the selected damage values
	const applyFilter = (values) => {
		if (!activeLayer) return;

		if (values.length > 0) {
			activeLayer.definitionExpression = `damage IN (${values
				.map((v) => `'${v}'`)
				.join(", ")})`;
		} else {
			activeLayer.definitionExpression = null;
		}

		handleFilterChange(activeLayer, "damage", values);
	};

	return (
		<div className="map-wrapper">
			<div
				className="map-container"
				// style={{ flex: "1 1 auto", position: "relative" }}
			>
				<MapComponent view={view} setView={setView} />
				{view && (
					<CustomLayerList
						view={view}
						onLayerSelect={handleLayerSelect}
						earthquakeM6Layer={
							earthquakeScenarioModes.earthquakeM6ImpactMode.layer
						}
						earthquakeM7Layer={
							earthquakeScenarioModes.earthquakeM7ImpactMode.layer
						}
					/>
				)}

				{activeLayer && (
					<>
						<div className="advance-selection-container">
							<div
								className={
									showAdvanceSelection
										? "advance-selection-visible"
										: "advance-selection-nonvisible"
								}
							>
								<div className="advance-selection">
									<Menu
										onOptionSelect={handleOptionSelect}
										onSourceInfraSelect={setSourceInfra}
										onTargetInfraSelect={setTargetInfra}
										onNeighborhoodSelect={setSelectedNeighborhoods}
										infrastructureLayers={infrastructureLayers}
									/>
									<br></br>
									<LayerSelector
										layer={activeLayer}
										onFilterChange={applyFilter}
										isVisible={true}
									/>
								</div>
								<div
									className="advance-selection-toggle"
									onClick={() => setShowAdvanceSelection(!showAdvanceSelection)}
								>
									{showAdvanceSelection ? (
										<MdKeyboardDoubleArrowLeft />
									) : (
										<MdKeyboardDoubleArrowRight />
									)}
								</div>
								<AnalysisComponent
									view={view}
									featuresUnderDamage={featuresUnderDamage}
									title={getTitle()}
									populationData={populationData}
									targetInfra={targetInfra}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default MapWrapper;
