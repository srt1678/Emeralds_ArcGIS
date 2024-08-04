import React, { useEffect, useRef } from "react";
import Expand from "@arcgis/core/widgets/Expand";
import LayerList from "@arcgis/core/widgets/LayerList";
import "./CustomLayerList.css";

const CustomLayerList = ({
    view,
    onLayerSelect,
    earthquakeM6Layer,
    earthquakeM7Layer,
    earthquakeCustomScenarioLayer,
}) => {
    const expandRef = useRef(null);
    const layerListRef = useRef(null);

    useEffect(() => {
        if (!view) return;

        let layerList, expand;

        // Function to create and add widgets
        const createAndAddWidgets = () => {
            if (!view || !view.ready) return;

            // Create LayerList if it doesn't exist
            if (!layerList) {
                layerList = new LayerList({
                    view: view,
                });
                layerListRef.current = layerList;
            }
            // Create Expand if it doesn't exist
            if (!expand) {
                expand = new Expand({
                    view: view,
                    content: layerList,
                    expandIconClass: "esri-icon-layer-list",
                    group: "bottom-right",
                    placement: "bottom",
                    collapseIcon: "chevrons-up",
                    autoCollapse: false,
                });
                expandRef.current = expand;
            }

            // Add the Expand widget to the view's UI
            if (view.ui && !view.ui.find((widget) => widget === expand)) {
                view.ui.add(expand, "top-right");
            }

            const handleLayerVisibilityChange = (layer) => {
                if (layer.visible) {
                    onLayerSelect(layer);
                } else if (
                    (!earthquakeM6Layer || !earthquakeM6Layer.visible) &&
                    (!earthquakeM7Layer || !earthquakeM7Layer.visible) &&
                    (!earthquakeCustomScenarioLayer ||
                        !earthquakeCustomScenarioLayer.visible)
                ) {
                    onLayerSelect(null);
                }
            };

            if (earthquakeM6Layer) {
                earthquakeM6Layer.watch("visible", () =>
                    handleLayerVisibilityChange(earthquakeM6Layer)
                );
            }
            if (earthquakeM7Layer) {
                earthquakeM7Layer.watch("visible", () =>
                    handleLayerVisibilityChange(earthquakeM7Layer)
                );
            }
            if (earthquakeCustomScenarioLayer) {
                earthquakeCustomScenarioLayer.watch("visible", () =>
                    handleLayerVisibilityChange(earthquakeCustomScenarioLayer)
                );
            }
        };

        // Watch for changes in view.ready
        if (view.ready) {
            createAndAddWidgets();
        } else {
            const watchHandle = view.watch("ready", (isReady) => {
                if (isReady) {
                    createAndAddWidgets();
                    watchHandle.remove();
                }
            });
        }

        // Cleanup function
        return () => {
            if (view && !view.destroyed) {
                view.ui.remove(expandRef.current);
            }
            if (expandRef.current) {
                expandRef.current.destroy();
            }
            if (layerListRef.current) {
                layerListRef.current.destroy();
            }
        };
    }, [
        view,
        onLayerSelect,
        earthquakeM6Layer,
        earthquakeM7Layer,
        earthquakeCustomScenarioLayer,
    ]);

    return null;
};

export default CustomLayerList;
