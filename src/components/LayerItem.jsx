import React from "react";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import { earthquakeM6Layer } from "../layers";

const LayerItem = ({
	layer,
	toggleLayerVisibility,
	setSelectEarthquakeDamage,
}) => {
	return (
		<>
			{layer.visible ? (
				<LiaEyeSolid
					onClick={() => {
						toggleLayerVisibility(layer.id);
						if (layer.id === earthquakeM6Layer.id) {
							setSelectEarthquakeDamage(false);
						}
					}}
					className="layer-checkbox eye-open-icon"
				/>
			) : (
				<LiaEyeSlashSolid
					onClick={() => {
						toggleLayerVisibility(layer.id);
						if (layer.id === earthquakeM6Layer.id) {
							setSelectEarthquakeDamage(true);
						}
					}}
					className="layer-checkbox eye-close-icon"
				/>
			)}
			<label className="layer-label">{layer.title}</label>
		</>
	);
};

export default LayerItem;
