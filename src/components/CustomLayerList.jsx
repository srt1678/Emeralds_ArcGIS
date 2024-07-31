
import React, { useEffect, useRef } from "react";
import Expand from "@arcgis/core/widgets/Expand";
import LayerList from "@arcgis/core/widgets/LayerList";

const CustomLayerList = ({ view }) => {
    const expandRef = useRef(null);

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
                    listItemCreatedFunction: (event) => {
                        const item = event.item;
                        if (item.layer.renderer) {
                            item.panel = {
                                content: "legend",
                                open: false,
                            };
                        }
                    },
                });
            }

            // Create Expand if it doesn't exist
            if (!expand) {
                expand = new Expand({
                    view: view,
                    content: layerList,
                    expandIconClass: "esri-icon-layer-list",
                    group: "top-right",
                });
                expandRef.current = expand;
            }

            // Add the Expand widget to the view's UI
            if (view.ui && !view.ui.find((widget) => widget === expand)) {
                view.ui.add(expand, "top-right");
            }
        };

        // Watch for changes in view.ready
        const watchHandle = view.watch('ready', (isReady) => {
            if (isReady) {
                createAndAddWidgets();
            }
        });

        // Initial check in case view is already ready
        if (view.ready) {
            createAndAddWidgets();
        }

        // Cleanup function
        return () => {
            watchHandle.remove();
            if (view && !view.destroyed) {
                view.ui.remove(expandRef.current);
            }
            if (expandRef.current) {
                expandRef.current.destroy();
            }
            if (layerList) {
                layerList.destroy();
            }
        };
    }, [view]);

    return null;
};

export default CustomLayerList;
