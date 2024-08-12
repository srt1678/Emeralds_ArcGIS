import Graphic from "@arcgis/core/Graphic";

let currentHighlights = new Set();

export const highlightFeature = (view, feature) => {
    if (!feature || !feature.geometry) {
        console.error("Invalid feature or feature geometry");
        return null;
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
    currentHighlights.add(highlightGraphic);
    return highlightGraphic;
};

export const highlightArea = (view, area) => {
    if (!area || !area.geometry) {
        console.error("Invalid area or area geometry");
        return null;
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
    currentHighlights.add(highlightGraphic);
    return highlightGraphic;
};

export const clearCurrentHighlights = (view) => {
    if (view && view.graphics) {
        currentHighlights.forEach(graphic => {
            view.graphics.remove(graphic);
        });
        currentHighlights.clear();
    }
};
