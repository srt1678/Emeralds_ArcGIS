import React from "react";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

const LayerItem = ({ layer, toggleLayerVisibility }) => {
	return (
		<>
			{layer.visible ? (
				<LiaEyeSolid
					onClick={() => toggleLayerVisibility(layer.id)}
					className="layer-checkbox eye-open-icon"
				/>
			) : (
				<LiaEyeSlashSolid
					onClick={() => toggleLayerVisibility(layer.id)}
					className="layer-checkbox eye-close-icon"
				/>
			)}
			<label className="layer-label">{layer.title}</label>
		</>
	);
};

export default LayerItem;
