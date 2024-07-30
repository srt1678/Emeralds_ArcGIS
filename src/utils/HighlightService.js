import Graphic from "@arcgis/core/Graphic";
import { project } from "@arcgis/core/geometry/projection";
import Point from "@arcgis/core/geometry/Point";

// Function to highlight a given feature
export const highlightFeature = (view, feature) => {
    // console.log('Highlighting feature:',JSON.stringify(feature, null, 2));
    if (!feature || !feature.geometry) {
        console.error("Invalid feature or feature geometry");
        return;
    }

    const highlightGraphic = new Graphic({
        geometry: feature.geometry,
        symbol: {
            type: "simple-marker",
            color: [255, 0, 0, 0.5],
            outline: {
                color: [255, 255, 0], // Yellow outline
                width: 2,
            },
        },
    });

    view.graphics.add(highlightGraphic);
};

// Function to highlight a given area (polygon)
export const highlightArea = (view, area) => {
    if (!area || !area.geometry) {
        console.error("Invalid area or area geometry");
        return;
    }

    const highlightGraphic = new Graphic({
        geometry: area.geometry,
        symbol: {
            type: "simple-line",
            color: [0, 0, 0], // Black color
            width: 2,
            style: "solid", // Line style ( "dash", "dot")
        },
    });

    view.graphics.add(highlightGraphic);
};

// Function to clear all highlights
export const clearHighlights = (view) => {
    if (view && view.graphics) {
        // console.log('Clearing highlights. Current graphics count:', view.graphics.length);
        view.graphics.removeAll();
        // console.log('Graphics cleared. New graphics count:', view.graphics.length);
    }
};
