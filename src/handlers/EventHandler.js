import LayerList from "@arcgis/core/widgets/LayerList.js";
import { addGraphic, getRoute } from "./RouteHandler.js";
import hospitalLayer from "../layers/HospitalLayer.js";
import fireStationLayer from "../layers/FireStationLayer.js";

function setupLayerList(view) {
    const layerList = new LayerList({
        view: view,
    });

    view.ui.add(layerList, {
        position: "top-right",
        index: 1
    });
}

function handleViewClick(view, response, type) {
    if (type) {
        addGraphic(view, type, response);
    } else {
        const results = response.results;
        if (results.length > 0) {
            const graphic = results.filter((result) => {
                return (
                    result.graphic.layer === hospitalLayer ||
                    result.graphic.layer === fireStationLayer
                );
            })[0];
            if (graphic) {
                if (view.graphics.length === 0) {
                    addGraphic(view, "start", graphic.graphic.geometry);
                } else if (view.graphics.length === 1) {
                    addGraphic(view, "finish", graphic.graphic.geometry);
                    getRoute(view);
                } else {
                    view.graphics.removeAll();
                    view.ui.empty("top-right");
                    addGraphic(view, "start", graphic.graphic.geometry);
                }
            }
        }
    }
}

export { handleViewClick, setupLayerList };
